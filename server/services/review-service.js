import ApiError from '../apiErrors/api-error.js'
import db from '../config/models.js'
import emailService from './email-service.js'


class ReviewService {
    async createReview(userId, ratingValue, comment, orderId) {
        try{
            const checkOrder = await db.Review.findOne({where: {orderId}})
            const order = await db.Order.findByPk(orderId)

            if (userId != order.userId) {
                throw ApiError.BadRequest('You cannot leave a review for an order that is not yours')
            }
            
            if (order.canReview && !order.hasReview) {
                throw ApiError.BadRequest('The order already has a review')
            }

            if (order.status != 'completed') {
                throw ApiError.BadRequest('Reviews can only be left for completed orders.')
            }

            if (checkOrder) {
                throw ApiError.BadRequest('There is already a review for this order or it is under review.')
            }

            const createReview = await db.Review.create({
                ratingValue,
                comment,
                orderId,
                userId,
                accountId: order.accountId
            })

            await emailService.sendNewReviewMail(process.env.ADMIN_EMAIL, createReview)
            return createReview
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async getReviews() {
        try{
            const reviewsData = await db.Review.findAll({where: {status: 'approved'}})
    
            return reviewsData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async getMyReview(userId) {
        try{
            const checkUser = await db.User.findByPk(userId)

            if(!checkUser) {
                throw ApiError.BadRequest('User not found')
            }
            const reviewsData = await db.Review.findAll({where: {userId}})
    
            return reviewsData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }




    async getAllReviews() {
        try{
            const reviewsData = await db.Review.findAll({where: {status: 'pending'}})
    
            return reviewsData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async approveReview(id) {
        try{
            const review = await db.Review.findByPk(id)
            if (!review) {
                throw ApiError.BadRequest('Review not found')
            }

            if (review.status != 'pending') {
                throw ApiError.BadRequest('Only reviews with a pending status can be approved')
            }
            
            const order = await db.Order.findByPk(review.orderId)
            if (!order) {
                throw ApiError.BadRequest('Order not found')
            }
            
            await review.update({status: 'approved'})
            await order.update({canReview: false, hasReview: true})
            
            return review
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
    
    
    async rejectReview(id) {
        try{
            const review = await db.Review.findByPk(id)
            if (!review) {
                throw ApiError.BadRequest('Review not found')
            }
            
            if (review.status != 'pending') {
                throw ApiError.BadRequest('Only reviews with a pending status can be rejected')
            }
            
            const order = await db.Order.findByPk(review.orderId)
            if (!order) {
                throw ApiError.BadRequest('Order not found')
            }
        
            await review.update({status: 'rejected'})
            await order.update({canReview: false, hasReview: true})

    
            return review
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
}

export default new ReviewService()