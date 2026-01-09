import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateOTP } from "../utils/generateOtp";
import { sendEmail } from "../utils/sendEmail";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    otp,
    isVerified: false,
  });

  await sendEmail(email, otp);

  res.status(201).json({
    message: "OTP sent to email. Please verify.",
    userId: user._id,
  });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "Please verify your email first" });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// VERYFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  res.json({ message: "Email verified successfully" });
};
