import { Request, Response } from "express";
import crypto from "crypto";

import razorpayInstance from "../config/razorpay";
import Order from "../models/Order";
import Payment from "../models/payment.model";

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: orderId,
    });

    // ✅ CREATE PAYMENT ENTRY

    const payment = await Payment.create({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      status: "created",
    });

    // Save payment reference in order

    order.paymentId = payment._id;
    await order.save();

    return res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Razorpay order failed",
    });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      method,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ UPDATE PAYMENT

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "success",
        method,
      },
      { new: true }
    );

    // ✅ UPDATE ORDER

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      paidAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify Error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const paymentFailed = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "failed",
    orderStatus: "cancelled",
  });

  // TODO: stock restore logic here

  res.json({ success: true });
};
