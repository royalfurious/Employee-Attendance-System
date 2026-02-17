const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "employee", employeeId, department } = req.body;

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ message: "name, email, password and employeeId are required" });
    }

    if (role === "manager") {
      return res.status(403).json({ message: "Manager registration is restricted" });
    }

    const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (exists) {
      return res.status(409).json({ message: "Email or employeeId already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      employeeId,
      department,
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  me,
};
