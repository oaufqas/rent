import { Router } from "express";
import AdminController from "../controllers/AdminController.js";
const router = new Router()

router.get('/orders', AdminController.getAllOrders)
router.put('/orders/:id/approve', AdminController.approveRequest)
router.put('/orders/:id/reject', AdminController.rejectRequest)
router.put('/orders/:id/verifyuser', AdminController.verifyUser)
router.put('/orders/:id/complete', AdminController.completeOrder)
router.put('/orders/:id/extend', AdminController.extendOrder)

router.get('/reviews', AdminController.getReqReviews)
router.put('/reviews/:id/approve', AdminController.approveReview)
router.put('/reviews/:id/reject', AdminController.rejectReview)

router.get('/payment-methods', AdminController.getAllPayMethod)
router.post('/payment-methods', AdminController.createPayMethod)
router.put('/payment-methods/:id', AdminController.changePayMethod)
router.delete('/payment-methods/:id', AdminController.deletePayMethod)

router.get('/deposit-requests', AdminController.getAllDepRequests)
router.put('/deposit-requests/:id/approve', AdminController.approveDepRequest)
router.put('/deposit-requests/:id/reject', AdminController.rejectDepRequest)

router.post('/accounts', AdminController.createAcc)
router.put('/accounts/:id', AdminController.changeAcc)
router.delete('/accounts/:id', AdminController.deleteAcc)
router.put('/accounts/:id/status', AdminController.changeStatusAcc)

router.get('/users', AdminController.getAllUsers)
router.put('/users/:id/status', AdminController.changeStatusUser)


export default router