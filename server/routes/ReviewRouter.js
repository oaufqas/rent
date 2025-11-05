import { Router } from "express";
const router = new Router()
import ReviewController from "../controllers/ReviewController.js";
import authMiddleware from "../middleware/auth-middleware.js";

router.post('/', authMiddleware, ReviewController.createReview)
router.get('/', ReviewController.getAllReviews)
router.get('/my', authMiddleware, ReviewController.getMyReviews)


export default router