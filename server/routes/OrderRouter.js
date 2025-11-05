import { Router } from "express";
const router = new Router()
import OrderController from "../controllers/OrderController.js";
import authMiddleware from "../middleware/auth-middleware.js";

router.get('/my', authMiddleware, OrderController.myOrders)
router.post('/', authMiddleware, OrderController.createOrder)
router.put('/:id/cancel', authMiddleware, OrderController.cancelOrder)

export default router