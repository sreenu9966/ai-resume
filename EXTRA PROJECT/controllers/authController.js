import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* SIGNUP */
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hash });

  await user.save();
  res.json({ message: "Signup successful" });
};

/* LOGIN */
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  res.json({ message: "Login success", user });
};

/* FORGOT USERNAME */
export const forgotUser = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account found" });

  res.json({ username: user.username });
};
