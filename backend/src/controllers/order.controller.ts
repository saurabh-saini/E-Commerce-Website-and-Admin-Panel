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
