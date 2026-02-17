const dayjs = require("dayjs");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { getTodayBounds, getMonthBounds, getWorkingDaysUntilDate } = require("../utils/attendance");

const getEmployeeDashboard = async (req, res, next) => {
  try {
    const { start: todayStart, end: todayEnd } = getTodayBounds();
    const { start: monthStart, end: monthEnd, endDayjs } = getMonthBounds();

    const [today, monthData, recentData] = await Promise.all([
      Attendance.findOne({ userId: req.user._id, date: { $gte: todayStart, $lte: todayEnd } }),
      Attendance.find({ userId: req.user._id, date: { $gte: monthStart, $lte: monthEnd } }),
      Attendance.find({ userId: req.user._id }).sort({ date: -1 }).limit(7),
    ]);

    const monthStats = {
      present: 0,
      late: 0,
      absent: 0,
      "half-day": 0,
      totalHours: 0,
    };

    monthData.forEach((item) => {
      monthStats[item.status] = (monthStats[item.status] || 0) + 1;
      monthStats.totalHours += item.totalHours || 0;
    });

    const workingDays = getWorkingDaysUntilDate(endDayjs);
    monthStats.absent = Math.max(workingDays - monthData.length, 0);
    monthStats.totalHours = Math.round(monthStats.totalHours * 100) / 100;

    return res.status(200).json({
      todayStatus: today
        ? {
            checkedIn: Boolean(today.checkInTime),
            checkedOut: Boolean(today.checkOutTime),
            status: today.status,
            checkInTime: today.checkInTime,
            checkOutTime: today.checkOutTime,
          }
        : { checkedIn: false, checkedOut: false, status: "absent" },
      monthStats,
      recentAttendance: recentData,
    });
  } catch (error) {
    return next(error);
  }
};

const getManagerDashboard = async (req, res, next) => {
  try {
    const { start: todayStart, end: todayEnd } = getTodayBounds();
    const { start: weekStart } = {
      start: dayjs().startOf("week").toDate(),
    };

    const [employees, todayAttendance, weekTrend, deptWise, absentEmployees] = await Promise.all([
      User.countDocuments({ role: "employee" }),
      Attendance.find({ date: { $gte: todayStart, $lte: todayEnd } }).populate("userId", "name employeeId department"),
      Attendance.aggregate([
        { $match: { date: { $gte: weekStart, $lte: todayEnd } } },
        {
          $group: {
            _id: "$date",
            present: { $sum: { $cond: [{ $in: ["$status", ["present", "late", "half-day"]] }, 1, 0] } },
            absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Department-wise: total employees + today's present per department
      User.aggregate([
        { $match: { role: "employee" } },
        {
          $lookup: {
            from: "attendances",
            let: { uid: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", "$$uid"] },
                      { $gte: ["$date", todayStart] },
                      { $lte: ["$date", todayEnd] },
                    ],
                  },
                },
              },
            ],
            as: "todayRecord",
          },
        },
        {
          $group: {
            _id: "$department",
            total: { $sum: 1 },
            present: {
              $sum: {
                $cond: [
                  {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$todayRecord",
                            as: "r",
                            cond: { $in: ["$$r.status", ["present", "late", "half-day"]] },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        { $sort: { total: -1 } },
      ]),
      User.find({
        role: "employee",
        _id: {
          $nin: await Attendance.find({ date: { $gte: todayStart, $lte: todayEnd } }).distinct("userId"),
        },
      }).select("name employeeId department"),
    ]);

    const presentToday = todayAttendance.filter((item) => ["present", "late", "half-day"].includes(item.status)).length;
    const lateToday = todayAttendance.filter((item) => item.status === "late").length;
    const absentToday = Math.max(employees - todayAttendance.length, 0);

    return res.status(200).json({
      totalEmployees: employees,
      today: {
        present: presentToday,
        absent: absentToday,
        late: lateToday,
      },
      weeklyTrend: weekTrend.map((row) => ({
        date: dayjs(row._id).format("YYYY-MM-DD"),
        present: row.present,
        absent: row.absent,
      })),
      departmentWise: deptWise.map((row) => ({
        department: row._id || "Unknown",
        total: row.total,
        present: row.present,
        absent: row.total - row.present,
      })),
      absentEmployees,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getEmployeeDashboard,
  getManagerDashboard,
};
