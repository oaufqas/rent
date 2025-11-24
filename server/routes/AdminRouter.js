import { Router } from "express";
import AdminController from "../controllers/AdminController.js";
import checkRole from '../middleware/checkRole-middleware.js'
const router = new Router()

router.get('/orders', checkRole('admin'), AdminController.getAllOrders)
router.get('/orders/pending', checkRole('admin'), AdminController.getPendingOrders),
router.put('/orders/:id/approve', checkRole('admin'), AdminController.approveRequest)
router.put('/orders/:id/reject', checkRole('admin'), AdminController.rejectRequest)
router.put('/orders/:id/verifyuser', checkRole('admin'), AdminController.verifyUser)
router.put('/orders/:id/complete', checkRole('admin'), AdminController.completeOrder)
router.put('/orders/:id/extend', checkRole('admin'), AdminController.extendOrder)

router.get('/reviews', checkRole('admin'), AdminController.getReqReviews)
router.put('/reviews/:id/approve', checkRole('admin'), AdminController.approveReview)
router.put('/reviews/:id/reject', checkRole('admin'), AdminController.rejectReview)

router.get('/payment-methods', checkRole('admin'), AdminController.getAllPayMethod)
router.post('/payment-methods', checkRole('admin'), AdminController.createPayMethod)
router.put('/payment-methods/:id', checkRole('admin'), AdminController.changePayMethod)
router.delete('/payment-methods/:id', checkRole('admin'), AdminController.deletePayMethod)

router.get('/deposit-requests', checkRole('admin'), AdminController.getAllDepRequests)
router.get('/deposit-requests/pending', checkRole('admin'), AdminController.getPendingDepRequests),
router.put('/deposit-requests/:id/approve', checkRole('admin'), AdminController.approveDepRequest)
router.put('/deposit-requests/:id/reject', checkRole('admin'), AdminController.rejectDepRequest)

router.post('/accounts', checkRole('admin'), AdminController.createAcc)
router.put('/accounts/:id', checkRole('admin'), AdminController.changeAcc)
router.delete('/accounts/:id', checkRole('admin'), AdminController.deleteAcc)
router.put('/accounts/:id/status', checkRole('admin'), AdminController.changeStatusAcc)

router.get('/users', checkRole('admin'), AdminController.getAllUsers)
router.put('/users/:id/status', checkRole('admin'), AdminController.changeStatusUser)

router.get('/checks/:filename', checkRole('admin'), AdminController.uploadCheck);

router.get('/stats', checkRole('admin'), AdminController.stats);


export default router