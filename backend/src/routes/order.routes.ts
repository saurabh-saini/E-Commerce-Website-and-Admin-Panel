import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

/* Create Order */
router.post("/", authMiddleware, createOrder);

/* Get My Orders */
router.get("/my", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

export default router;
