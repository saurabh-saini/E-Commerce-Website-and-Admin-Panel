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

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { token, hashedToken } = generateResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendEmail(
    email,
    "Reset your password",
    `
  <h2>Password Reset</h2>
  <a href="${resetLink}">${resetLink}</a>
  <p>This link expires in 15 minutes</p>
  `
  );

  res.json({ message: "Password reset link sent to email" });
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};
