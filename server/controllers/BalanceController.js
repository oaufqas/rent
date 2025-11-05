import ApiError from "../apiErrors/api-error.js"
import balanceService from "../services/balance-service.js"
import paymentService from "../services/payment-service.js"


class BalanceController {

    async getBalance(req, res, next) {
        try {
            const id = req.user.id
            const balanceData = await balanceService.getBalanceUser(id)
            return res.json(balanceData)
        } catch (e) {
            next(e)
        }
    }



    async historyBalance(req, res, next) {
        try {
            const id = req.user.id
            const balanceHistory = await balanceService.getTransactionHistory(id)
            return res.json(balanceHistory)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async createRequest(req, res, next) {
        try {
            const id = req.user.id
            const {amount, method} = req.body
            const {check} = req.files
            const createData = await balanceService.createDepositRequest(id, amount, method, check)
            return res.json(createData)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async cancelRequest(req, res, next) {
        try {
            const usId = req.user.id
            const id = req.params.id
            const cancelData = await balanceService.cancelDepositRequest(usId, id)
            return res.json(cancelData)
        } catch (e) {
            next(e)
        }
    }



    async getPayMethods(req, res, next) {
        try {
            const paymentData = await paymentService.getPaymentMethods()
            return res.json(paymentData)
        } catch (e) {
            next(e)
        }
    }
}

export default new BalanceController()