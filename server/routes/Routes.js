import { Router } from "express";
import adminRouter from './AdminRouter.js'
import authRouter from './AuthRouter.js'
import accountRouter from './AccountRouter.js'
import orderRouter from './OrderRouter.js'
import reviewRouter from './ReviewRouter.js'
import balanceRouter from './BalanceRouter.js'
import checkRole from '../middleware/checkRole-middleware.js' // Потом включить!!!

const router = new Router()

router.use('/admin', adminRouter)
router.use('/auth', authRouter)
router.use('/accounts', accountRouter)
router.use('/orders', orderRouter)
router.use('/reviews', reviewRouter)
router.use('/balance', balanceRouter)


export default router