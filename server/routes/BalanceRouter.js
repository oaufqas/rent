import { Router } from "express";
const router = new Router()
import BalanceController from "../controllers/BalanceController.js";
import authMiddleware from "../middleware/auth-middleware.js";

router.get('/', authMiddleware, BalanceController.getBalance)
router.get('/history', authMiddleware, BalanceController.historyBalance)
router.post('/deposit-request', authMiddleware, BalanceController.createRequest)
router.put('/deposit-request/:id/cancel', authMiddleware, BalanceController.cancelRequest)
router.get('/payment-methods', BalanceController.getPayMethods)


export default router