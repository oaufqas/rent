import db from '../config/models.js'
import ApiError from '../apiErrors/api-error.js';
import uploadService from './upload-service.js';
import emailService from './email-service.js';

class OrderService {

    async getOrdersFromUser(userId) {
        try {
            const ordersData = await db.Order.findAll({where: {userId}})
            
            return ordersData
        } catch(e) {
            throw ApiError.ElseError(e)
        }
    }

    
    async createOrder(id, amount, rentPeriod, check, accountId, verificationPlatform, userNameInPlatform, paymentMethod) {
        try {
            const searchOrdersData = await db.Order.findAll({where: {userId: id}})
            const checkPending = searchOrdersData.filter(order => order.status === 'pending')
            let pathToCheck = null
            let transactionStatus = 'pending'

            if (checkPending[0]) {
                throw ApiError.BadRequest('You already have an order with the pending status.')
            }
            
            if (paymentMethod === 'balance') {
                const user = await db.User.findByPk(id)
                if (Number(user.balance) < Number(amount)) {
                    transactionStatus = 'cancelled'
                    throw ApiError.BadRequest('There are insufficient funds on the balance')
                }

                await user.update({balance: Number(user.balance) - Number(amount)})
                transactionStatus = 'completed'
            } else {
                pathToCheck = await uploadService.uploadCheck(check, id)
            }

            const createTransaction = await db.Transaction.create({
                userId: id, 
                type: 'payment', 
                amount, 
                method: paymentMethod,
                status: transactionStatus,
                metadata: JSON.stringify({
                    createdAt: new Date().toISOString(),
                    paymentMethod: paymentMethod,
                    rentPeriod: rentPeriod
                })
            })

            const orderData = await db.Order.create({
                amount, 
                status: 'pending', 
                rentPeriod, 
                check: pathToCheck, 
                userId: id, 
                accountId, 
                verificationPlatform, 
                userNameInPlatform, 
                paymentMethod,
                transactionId: createTransaction.id
            })

            await createTransaction.update({
                description: `Оплата заказа #${orderData.id}`, 
                orderId: orderData.id,
            })

            await emailService.sendNewOrderMail(process.env.ADMIN_EMAIL, orderData)
            return(orderData)

        } catch (e) {
            // if (createTransaction) {
            //     await createTransaction.update({ status: 'cancelled' })
            // }
            throw ApiError.ElseError(e)
        }
    }


    async revokeOrder(userId, id) {
        try {
            const searchOrder = await db.Order.findOne({where: {id, userId}})
            const searchTransaction = await db.Transaction.findOne({where: {orderId: searchOrder.id}})

            if (!searchOrder) {
                throw ApiError.BadRequest('Order not found')
            }

            if (searchOrder.status != 'pending') {
                throw ApiError.BadRequest('The order cannot be canceled')
            }
            
            const updateData = await searchOrder.update({status: 'cancelled'})
            await searchTransaction.update({status: 'cancelled'})

            return updateData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async getAllOrders(status, userId, accountId) {
        try {
            const searchData = {}

            if (status !== undefined) searchData.status = status;
            if (userId !== undefined) searchData.userId = userId;
            if (accountId !== undefined) searchData.accountId = accountId;

            const ordersData = await db.Order.findAll({where: searchData})
            
            return ordersData
            
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async approveOrder(id) {
        try {
            const searchOrder = await db.Order.findByPk(id)

            if (!searchOrder) {
                throw ApiError.BadRequest('Order not found')
            }
            
            const updateData = await searchOrder.update({status: 'paid'})

            return updateData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async rejectOrder(id) {
        try {
            const searchOrder = await db.Order.findByPk(id)
            const searchTransaction = await db.Transaction.findOne({where: {orderId: searchOrder.id}})

            if (!searchOrder) {
                throw ApiError.BadRequest('Order not found')
            }
            
            const updateData = await searchOrder.update({status: 'cancelled'})
            await searchTransaction.update({status: 'cancelled'})

            return updateData            
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
    
    
    async verifyOrder(id) {
        try {
            const searchOrder = await db.Order.findByPk(id)
            
            if (!searchOrder) {
                throw ApiError.BadRequest('Order not found')
            }
            
            const updateData = await searchOrder.update({status: 'verified'})
            
            return {"Платформа для проверки": updateData.verificationPlatform, "Юзернейм пользователя": updateData.userNameInPlatform}
            
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async completeOrder(id) {
        try {
            const searchOrder = await db.Order.findByPk(id, {include: [{model: db.Account}]})
            const searchTransaction = await db.Transaction.findOne({where: {orderId: searchOrder.id}})
            
            const startsAt = new Date(Date.now())
            const expiresAt = new Date(Date.now() + searchOrder.rentPeriod * 60 * 60 * 1000)
            
            if (searchOrder.account.status != 'free') {
                throw ApiError.BadRequest('The account is rented or unavailable')
            }
            
            await db.Account.update({status: 'rented', rentExpiresAt: expiresAt}, {where: { id: searchOrder.accountId }});
            await searchOrder.update({status:'active', startsAt, expiresAt})
            await searchTransaction.update({status: 'completed'})
            
            const updateOrder = await db.Order.findByPk(id, {include: [{model: db.Account}, {model: db.Transaction}]})
            const user = await db.User.findByPk(updateOrder.userId)

            await emailService.sendRentSuccessMail(user.email, updateOrder)
            return updateOrder
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async extendOrder(id, extraHours) {
        try {
            const extendData = await db.Order.findByPk(id)

            if (!extendData) {
                throw ApiError.BadRequest('Order not found')
            }
            
            const currentTime = extendData.expiresAt
            const expiresAt = new Date(currentTime.getTime() + extraHours * 60 * 60 * 1000)

            const changeTime = await extendData.update({expiresAt})
            const changeTimeInAcc = await db.Account.update({rentExpiresAt:expiresAt}, {where: { id: extendData.accountId }})

            return changeTime

        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }

}

export default new OrderService()