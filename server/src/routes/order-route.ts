import { Router } from "express";
import { getOrders, createOrder } from "../controllers/order-controller";

const router = Router();

router.get("/:id", getOrders);
router.post("/create", createOrder);

export default router;
