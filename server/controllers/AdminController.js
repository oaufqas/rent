import ApiError from "../apiErrors/api-error.js"
import accountService from "../services/account-service.js"
import balanceService from "../services/balance-service.js"
import orderService from "../services/order-service.js"
import paymentService from "../services/payment-service.js"
import reviewService from "../services/review-service.js"
import userService from "../services/user-service.js"
import { validationResult } from "express-validator"


class AdminController {

                        // Accounts

    async createAcc(req, res, next) {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Create acc error', errors.array()))
            }

            const {account_number, title, description, characters, price} = req.body
            const {img, video} = req.files
            
            const accData = await accountService.createAccount(account_number, title, description, characters, price, img, video)
            
            return res.json(accData)
            
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async changeAcc(req, res, next) {
        try {
            const {account_number, title, description, characters, price} = req.body || {}
            const {img, video} = req.files || {}
            const {id} = req.params
            
            const changeData = await accountService.changeAccount(id, account_number, title, description, characters, price, img, video)

            return res.json(changeData)
        } catch (e) {
            next(e)
        }
    }



    async changeStatusAcc(req, res, next) {
        try {
            const {status, rentHours} = req.body
            const {id} = req.params

            const changeStatData = await accountService.changeStatusAccount(id, status, rentHours)

            return res.json(changeStatData)
            
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async deleteAcc(req, res, next) {
        try {
            const {id} = req.params
            
            const deleteData = await accountService.deleteAccount(id)
            
            return res.json(deleteData)

        } catch (e) {
            next(e)
        }
    }


                        // Orders


    async getAllOrders(req, res, next) {
        try {
            const {status, userId, accountId} = req.query

            const sortedData = await orderService.getAllOrders(status, userId, accountId)

            return res.json(sortedData)
        } catch (e) {
            next(e)
        }
    }


    
    async approveRequest(req, res, next) {
        try {
            const id = req.params.id

            const approveData = await orderService.approveOrder(id)
            
            return res.json(approveData)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async rejectRequest(req, res, next) {
        try {
            const id = req.params.id

            const rejectData = await orderService.rejectOrder(id)
            
            return res.json(rejectData)
        } catch (e) {
            next(e)
        }
    }
    


    async verifyUser(req, res, next) {
        try {
            const id = req.params.id

            const verifyData = await orderService.verifyOrder(id)
            
            return res.json(verifyData)
        } catch (e) {
            next(e)
        }
    }



    async completeOrder(req, res, next) {
        try {
            const id = req.params.id

            const completeData = await orderService.completeOrder(id)
            
            return res.json(completeData)
        } catch (e) {
            next(e)
        }
    }



    async extendOrder(req, res, next) {
        try {
            const id = req.params.id
            const {extraHours} = req.body

            const extendData = await orderService.extendOrder(id, extraHours)
            
            return res.json(extendData)
        } catch (e) {
            next(e)
        }
    }


                        // Reviews


    async getReqReviews(req, res, next) {
        try {
            const reviewData = await reviewService.getAllReviews()
            return res.json(reviewData)
        } catch (e) {
            next(e)
        }
    }



    async approveReview(req, res, next) {
        try {
            const id = req.params.id
            const approveData = await reviewService.approveReview(id)
            return res.json(approveData)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async rejectReview(req, res, next) {
        try {
            const id = req.params.id
            const rejectData = await reviewService.rejectReview(id)
            return res.json(rejectData)
        } catch (e) {
            next(e)
        }
    }


                        // Payment-methods


    async getAllPayMethod(req, res, next) {
        try {
            const paymentData = await paymentService.getAllPaymentMethods()

            return res.json(paymentData)
        } catch (e) {
            next(e)
        }
    }



    async createPayMethod(req, res, next) {
        try {
            const {name, details} = req.body

            const paymentData = await paymentService.addPaymentMethods(name, details)

            return res.json(paymentData)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async changePayMethod(req, res, next) {
        try {
            const id = req.params.id
            const {name, details, isActive} = req.body
        
            const paymentData = await paymentService.changePaymentMethods(id, name, details, isActive)
        
            return res.json(paymentData)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async deletePayMethod(req, res, next) {
        try {
            const id = req.params.id
        
            const paymentData = await paymentService.deletePaymentMethods(id)
        
            return res.json(paymentData)
        } catch (e) {
            next(e)
        }
    }


                        // Deposit-requests


    async getAllDepRequests(req, res, next) {
        try {
            const requestsData = await balanceService.getAllDepositRequests()

            return res.json(requestsData)
        } catch (e) {
            next(e)
        }
    }



    async approveDepRequest(req, res, next) {
        try {
            const id = req.params.id
            const approveData = await balanceService.approveDeposit(id)
            return res.json(approveData)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async rejectDepRequest(req, res, next) {
        try {
            const id = req.params.id
            const rejectData = await balanceService.rejectDeposit(id)
            return res.json(rejectData)
        } catch (e) {
            next(e)
        }
    }


                        // Users


    async getAllUsers(req, res, next) {
        try {
            const userData = await userService.getAllUsers()

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }



    async changeStatusUser(req, res, next) {
        try {
            const id = req.params.id
            
            const userData = await userService.changeStatus(id)

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}

export default new AdminController()