import orderService from "../services/order-service.js"

class OrderController {
    
    async myOrders(req, res, next) {
        try {
            const usId = req.user.id
            const orderData = await orderService.getOrdersFromUser(usId)

            return res.json(orderData)
        } catch (e) {
            next(e)
        }
    }
    
    
    
    async createOrder(req, res, next) {
        try {
            const usId = req.user.id
            const {amount, rentPeriod, accountId, verificationPlatform, userNameInPlatform, paymentMethod} = req.body
            const {check} = req.files || {}
            
            const orderData = await orderService.createOrder(usId, amount, rentPeriod, check, accountId, verificationPlatform, userNameInPlatform, paymentMethod)
            
            return res.json(orderData)
        } catch (e) {
            next(e)
        }
    }

    

    async cancelOrder(req, res, next) {
        try {
            const usId = req.user.id
            const id = req.params.id

            const cancelData = await orderService.revokeOrder(usId, id)

            return res.json(cancelData)
        } catch (e) {
            next(e)
        }
    }
}

export default new OrderController()