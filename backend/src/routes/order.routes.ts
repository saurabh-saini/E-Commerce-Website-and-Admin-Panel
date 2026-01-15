import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

/* Create Order */
router.post("/", authMiddleware, createOrder);

/* Get My Orders */
router.get("/my", authMiddleware, getMyOrders);

export default router;
