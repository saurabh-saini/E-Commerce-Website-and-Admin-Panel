import mongoose from "mongoose";

import { Request, Response } from "express";
import Order from "../models/Order";

/* ================================
   CREATE ORDER (already done ✅)
================================ */
export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { items, shippingAddress, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      user: req.user!.id, // ✅ FIXED
      items,
      shippingAddress,
      totalAmount,
      paymentStatus: "pending",
    });

    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch {
    res.status(500).json({ message: "Failed to create order" });
  }
};

/* ================================
   GET LOGGED-IN USER ORDERS 🔥
================================ */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================================
   GET SINGLE ORDER BY ID
================================ */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    // 🔥 ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔒 Security: user sirf apna order dekh sake
    if (order.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

/* ===============================
   PAY ORDER (Payment Success)
================================ */
export const payOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Security: only owner can pay
    if (order.user.toString() !== req.user!.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    order.paymentStatus = "paid";
    order.paidAt = new Date();

    await order.save();

    res.json({
      message: "Payment successful",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment update failed" });
  }
};
