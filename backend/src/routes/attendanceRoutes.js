const express = require("express");
const authMiddleware = require("../middlewares/auth");
const roleMiddleware = require("../middlewares/role");
const {
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
} = require("../controllers/attendanceController");

const router = express.Router();

router.use(authMiddleware);

router.post("/checkin", roleMiddleware("employee"), checkIn);
router.post("/checkout", roleMiddleware("employee"), checkOut);
router.get("/my-history", roleMiddleware("employee"), getMyHistory);
router.get("/my-summary", roleMiddleware("employee"), getMySummary);
router.get("/today", roleMiddleware("employee"), getToday);

router.get("/all", roleMiddleware("manager"), getAllAttendance);
router.get("/employee/:id", roleMiddleware("manager"), getEmployeeAttendance);
router.get("/summary", roleMiddleware("manager"), getTeamSummary);
router.get("/export", roleMiddleware("manager"), exportAttendanceCsv);
router.get("/today-status", roleMiddleware("manager"), getTodayStatus);

module.exports = router;
