import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateOTP } from "../utils/generateOtp";
import { sendEmail } from "../utils/sendEmail";
import { generateResetToken } from "../utils/generateResetToken";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true, // ✅ DIRECT VERIFIED
  });

  res.status(201).json({
    message: "Registration successful",
  });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
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

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = generateOTP();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  await sendEmail(
    email,
    "Password Reset OTP",
    `<h3>Your OTP is: ${otp}</h3><p>Valid for 10 minutes</p>`
  );

  res.json({ message: "OTP sent to email" });
};

// VERYFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.otp || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  // OTP verified → allow reset password
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "OTP verified. Proceed to reset password." });
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = await hashPassword(password);
  await user.save();

  res.json({ message: "Password reset successful. Please login." });
};
