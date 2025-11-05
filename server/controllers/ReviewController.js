import reviewService from "../services/review-service.js"

class ReviewController {
    
    async createReview(req, res, next) {
        try {
            const id = req.user.id
            const {ratingValue, comment, orderId} = req.body
            const createReviewData = await reviewService.createReview(id, ratingValue, comment, orderId)
            return res.json(createReviewData)
        } catch (e) {
            next(e)
        }
    }



    async getAllReviews(req, res, next) {
        try {
            const reviewData = await reviewService.getReviews()
            return res.json(reviewData)
        } catch (e) {
            next(e)
        }
    }



    async getMyReviews(req, res, next) {
        try {
            const id = req.user.id
            const reviewData = await reviewService.getMyReview(id)
            return res.json(reviewData)
        } catch (e) {
            next(e)
        }
    }
}

export default new ReviewController()