import express from "express";
import {
  createRazorpayOrder,
  paymentFailed,
  verifyRazorpayPayment,
} from "../controllers/payment.controller";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);
router.post("/payment-failed", paymentFailed);

export default router;
