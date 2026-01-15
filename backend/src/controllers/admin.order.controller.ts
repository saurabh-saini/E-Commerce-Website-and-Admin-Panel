import { Request, Response } from "express";
import Order from "../models/Order";

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const allowedStatus = ["placed", "shipped", "delivered", "cancelled"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = status;
  await order.save();

  res.json({
    message: "Order status updated",
    order,
  });
};
