const dayjs = require("dayjs");
const { Parser } = require("json2csv");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const {
  getTodayBounds,
  getMonthBounds,
  roundHours,
  determineStatusOnCheckIn,
  determineStatusOnCheckout,
  getWorkingDaysUntilDate,
} = require("../utils/attendance");

const checkIn = async (req, res, next) => {
  try {
    const { start, end } = getTodayBounds();
    const now = new Date();

    const existing = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    if (existing && existing.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const status = determineStatusOnCheckIn(now);

    const attendance = existing
      ? await Attendance.findByIdAndUpdate(
          existing._id,
          {
            checkInTime: now,
            status,
            date: start,
          },
          { new: true }
        )
      : await Attendance.create({
          userId: req.user._id,
          date: start,
          checkInTime: now,
          status,
        });

    return res.status(200).json({ message: "Checked in successfully", attendance });
  } catch (error) {
    return next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const { start, end } = getTodayBounds();
    const now = new Date();

    const existing = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    if (!existing || !existing.checkInTime) {
      return res.status(400).json({ message: "Please check in first" });
    }

    if (existing.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const totalHours = roundHours(now.getTime() - new Date(existing.checkInTime).getTime());
    const finalStatus = determineStatusOnCheckout(existing.status, totalHours);

    existing.checkOutTime = now;
    existing.totalHours = totalHours;
    existing.status = finalStatus;

    await existing.save();

    return res.status(200).json({ message: "Checked out successfully", attendance: existing });
  } catch (error) {
    return next(error);
  }
};

const getMyHistory = async (req, res, next) => {
  try {
    const { month, year, status } = req.query;
    const filter = { userId: req.user._id };

    if (month || year) {
      const { start, end } = getMonthBounds(month, year);
      filter.date = { $gte: start, $lte: end };
    }

    if (status) {
      filter.status = status;
    }

    const data = await Attendance.find(filter).sort({ date: -1 });
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const getMySummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const { start, end, endDayjs } = getMonthBounds(month, year);

    const records = await Attendance.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      "half-day": 0,
      totalHours: 0,
    };

    records.forEach((item) => {
      summary[item.status] = (summary[item.status] || 0) + 1;
      summary.totalHours += item.totalHours || 0;
    });

    const workingDays = getWorkingDaysUntilDate(endDayjs);
    const attendedDays = records.length;
    summary.absent = Math.max(workingDays - attendedDays, 0);
    summary.totalHours = Math.round(summary.totalHours * 100) / 100;

    return res.status(200).json({ summary, workingDays, attendedDays });
  } catch (error) {
    return next(error);
  }
};

const getToday = async (req, res, next) => {
  try {
    const { start, end } = getTodayBounds();
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    return res.status(200).json({ attendance: attendance || null });
  } catch (error) {
    return next(error);
  }
};

const getAllAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const selected = dayjs(date);
      filter.date = {
        $gte: selected.startOf("day").toDate(),
        $lte: selected.endOf("day").toDate(),
      };
    }

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      filter.userId = user ? user._id : null;
    }

    const data = await Attendance.find(filter)
      .populate("userId", "name email employeeId department role")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const getEmployeeAttendance = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = await Attendance.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const getTeamSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const { start, end } = getMonthBounds(month, year);

    const pipeline = [
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.department",
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
          late: {
            $sum: {
              $cond: [{ $eq: ["$status", "late"] }, 1, 0],
            },
          },
          halfDay: {
            $sum: {
              $cond: [{ $eq: ["$status", "half-day"] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const summary = await Attendance.aggregate(pipeline);
    return res.status(200).json({ summary });
  } catch (error) {
    return next(error);
  }
};

const exportAttendanceCsv = async (req, res, next) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: dayjs(startDate).startOf("day").toDate(),
        $lte: dayjs(endDate).endOf("day").toDate(),
      };
    }

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      filter.userId = user ? user._id : null;
    }

    const rows = await Attendance.find(filter)
      .populate("userId", "name employeeId department")
      .sort({ date: -1 });

    const csvRows = rows.map((row) => ({
      employeeId: row.userId?.employeeId || "",
      name: row.userId?.name || "",
      department: row.userId?.department || "",
      date: dayjs(row.date).format("YYYY-MM-DD"),
      checkInTime: row.checkInTime ? dayjs(row.checkInTime).format("HH:mm:ss") : "",
      checkOutTime: row.checkOutTime ? dayjs(row.checkOutTime).format("HH:mm:ss") : "",
      status: row.status,
      totalHours: row.totalHours,
    }));

    const parser = new Parser({
      fields: ["employeeId", "name", "department", "date", "checkInTime", "checkOutTime", "status", "totalHours"],
    });
    const csv = parser.parse(csvRows);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance-report.csv");
    return res.send(csv);
  } catch (error) {
    return next(error);
  }
};

const getTodayStatus = async (req, res, next) => {
  try {
    const { start, end } = getTodayBounds();

    const todayData = await Attendance.find({
      date: { $gte: start, $lte: end },
    }).populate("userId", "name employeeId department");

    const presentUsers = todayData.filter((item) => ["present", "late", "half-day"].includes(item.status));

    return res.status(200).json({
      totalChecked: todayData.length,
      presentCount: presentUsers.length,
      data: todayData,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getToday,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendanceCsv,
  getTodayStatus,
};
