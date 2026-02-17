const dayjs = require("dayjs");

const getTodayBounds = () => {
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();
  return { start, end };
};

const getMonthBounds = (month, year) => {
  const now = dayjs();
  const targetMonth = Number.isFinite(Number(month)) ? Number(month) - 1 : now.month();
  const targetYear = Number.isFinite(Number(year)) ? Number(year) : now.year();

  const start = dayjs().year(targetYear).month(targetMonth).startOf("month");
  const end = start.endOf("month");
  return { start: start.toDate(), end: end.toDate(), startDayjs: start, endDayjs: end };
};

const roundHours = (msDiff) => {
  const hours = msDiff / (1000 * 60 * 60);
  return Math.round(hours * 100) / 100;
};

const determineStatusOnCheckIn = (checkInTime) => {
  const startHour = Number(process.env.OFFICE_START_HOUR || 9);
  const startMinute = Number(process.env.OFFICE_START_MINUTE || 30);
  const cutOff = dayjs(checkInTime).hour(startHour).minute(startMinute).second(0);

  return dayjs(checkInTime).isAfter(cutOff) ? "late" : "present";
};

const determineStatusOnCheckout = (existingStatus, totalHours) => {
  if (totalHours > 0 && totalHours < 4) {
    return "half-day";
  }
  if (existingStatus === "late") {
    return "late";
  }
  return "present";
};

const getWorkingDaysUntilDate = (targetDayjs) => {
  let cursor = targetDayjs.startOf("month");
  const end = dayjs().isBefore(targetDayjs.endOf("day")) ? dayjs().endOf("day") : targetDayjs.endOf("day");
  let days = 0;

  while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
    const day = cursor.day();
    if (day !== 0 && day !== 6) {
      days += 1;
    }
    cursor = cursor.add(1, "day");
  }

  return days;
};

module.exports = {
  getTodayBounds,
  getMonthBounds,
  roundHours,
  determineStatusOnCheckIn,
  determineStatusOnCheckout,
  getWorkingDaysUntilDate,
};
