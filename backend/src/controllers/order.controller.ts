import { Request, Response } from "express";
import Order from "../models/Order";

export const createOrder = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
};
