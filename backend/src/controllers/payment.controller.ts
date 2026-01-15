import { Request, Response } from "express";
import crypto from "crypto";

import razorpayInstance from "../config/razorpay";
import Order from "../models/Order";
import Payment from "../models/payment.model";

const PAYMENT_MODE = process.env.PAYMENT_MODE || "mock";

/* ================================
   CREATE PAYMENT ORDER
================================ */

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

    /* =========================
        MOCK PAYMENT MODE
    ========================== */

    if (PAYMENT_MODE === "mock") {
      const fakeOrderId = "mock_order_" + Date.now();

      const payment = await Payment.create({
        orderId: order._id,
        razorpayOrderId: fakeOrderId,
        amount: order.totalAmount,
        status: "created",
      });

      order.paymentId = payment._id;
      await order.save();

      return res.status(200).json({
        success: true,
        razorpayOrderId: fakeOrderId,
        amount: order.totalAmount * 100,
        currency: "INR",
        key: "mock_key",
      });
    }

    /* =========================
        REAL RAZORPAY MODE
    ========================== */

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: orderId,
    });

    const payment = await Payment.create({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      status: "created",
    });

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
      message: "Payment order failed",
    });
  }
};

/* ================================
   VERIFY PAYMENT
================================ */

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      method,
    } = req.body;

    /* =========================
        MOCK PAYMENT MODE
    ========================== */

    if (PAYMENT_MODE === "mock") {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: "mock_payment_" + Date.now(),
          status: "success",
          method: "mock",
        }
      );

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        paidAt: new Date(),
      });

      return res.json({
        success: true,
        message: "Mock payment successful",
      });
    }

    /* =========================
        REAL RAZORPAY MODE
    ========================== */

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
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

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "success",
        method,
      }
    );

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

/* ================================
   PAYMENT FAILED / CANCEL
================================ */

export const paymentFailed = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "failed",
    orderStatus: "cancelled",
  });

  res.json({ success: true });
};
