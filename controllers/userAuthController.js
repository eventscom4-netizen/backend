import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signUserToken(userId) {
  return jwt.sign({ id: userId, type: "user" }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

export async function registerUser(req, res) {
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

  const user = await User.create({ name, email: normalizedEmail, password });
  return res.status(201).json({
    token: signUserToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({
    token: signUserToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
}

