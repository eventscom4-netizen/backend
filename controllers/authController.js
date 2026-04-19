import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

function signToken({ id, role }) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  // Try admin first (hidden from UI, but same form)
  const admin = await Admin.findOne({ email: normalizedEmail });
  if (admin) {
    const ok = await admin.matchPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    return res.json({
      token: signToken({ id: admin._id, role: "admin" }),
      user: { id: admin._id, email: admin.email, role: "admin" },
    });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({
    token: signToken({ id: user._id, role: user.role || "user" }),
    user: { id: user._id, name: user.name, email: user.email, role: user.role || "user" },
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await User.exists({ email: normalizedEmail });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const user = await User.create({ name, email: normalizedEmail, password, role: "user" });
  return res.status(201).json({
    token: signToken({ id: user._id, role: "user" }),
    user: { id: user._id, name: user.name, email: user.email, role: "user" },
  });
}

