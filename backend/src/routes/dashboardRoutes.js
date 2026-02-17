const express = require("express");
const authMiddleware = require("../middlewares/auth");
const roleMiddleware = require("../middlewares/role");
const { getEmployeeDashboard, getManagerDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.use(authMiddleware);

router.get("/employee", roleMiddleware("employee"), getEmployeeDashboard);
router.get("/manager", roleMiddleware("manager"), getManagerDashboard);

module.exports = router;
