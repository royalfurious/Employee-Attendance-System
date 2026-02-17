require("dotenv").config();
const dayjs = require("dayjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

const seed = async () => {
  try {
    await connectDB();

    await Attendance.deleteMany({});
    await User.deleteMany({});

    const users = await User.create([
      {
        name: "Rahul Manager",
        email: "manager@example.com",
        password: "password123",
        role: "manager",
        employeeId: "MGR001",
        department: "Management",
      },
      {
        name: "Amit Sharma",
        email: "amit@example.com",
        password: "password123",
        role: "employee",
        employeeId: "EMP001",
        department: "Engineering",
      },
      {
        name: "Priya Verma",
        email: "priya@example.com",
        password: "password123",
        role: "employee",
        employeeId: "EMP002",
        department: "HR",
      },
      {
        name: "Sneha Singh",
        email: "sneha@example.com",
        password: "password123",
        role: "employee",
        employeeId: "EMP003",
        department: "Engineering",
      },
    ]);

    const employees = users.filter((u) => u.role === "employee");
    const attendanceDocs = [];

    employees.forEach((employee, employeeIndex) => {
      for (let dayOffset = 1; dayOffset <= 20; dayOffset += 1) {
        const date = dayjs().subtract(dayOffset, "day").startOf("day");
        const day = date.day();
        if (day === 0 || day === 6) {
          continue;
        }

        const isLate = dayOffset % (3 + employeeIndex) === 0;
        const isHalfDay = dayOffset % (7 + employeeIndex) === 0;

        const checkIn = isLate
          ? date.hour(10).minute(5).toDate()
          : date.hour(9).minute(15).toDate();

        const checkOut = isHalfDay
          ? date.hour(13).minute(0).toDate()
          : date.hour(18).minute(0).toDate();

        const totalHours = isHalfDay ? 3.75 : isLate ? 7.9 : 8.75;
        const status = isHalfDay ? "half-day" : isLate ? "late" : "present";

        attendanceDocs.push({
          userId: employee._id,
          date: date.toDate(),
          checkInTime: checkIn,
          checkOutTime: checkOut,
          status,
          totalHours,
        });
      }
    });

    await Attendance.insertMany(attendanceDocs);

    console.log("Seed completed");
    console.log("Manager: manager@example.com / password123");
    console.log("Employee: amit@example.com / password123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
