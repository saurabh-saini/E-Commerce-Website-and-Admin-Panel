import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
} from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

/* Create Order */
router.post("/", authMiddleware, createOrder);

/* Get My Orders */
router.get("/my", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

router.post("/:id/pay", authMiddleware, payOrder);

router.put("/:id/cancel", authMiddleware, cancelOrder);

export default router;
