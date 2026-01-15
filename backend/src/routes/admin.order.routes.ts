import { Router } from "express";
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin.order.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

export default router;
