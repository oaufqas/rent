import ApiError from '../apiErrors/api-error.js'
import db from '../config/models.js'
import emailService from './email-service.js'
import uploadService from './upload-service.js'


class BalanceService {

    async getBalanceUser(id) {
        try{
            const user = await db.User.findByPk(id)
            return user.balance
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async getTransactionHistory(id) {
        try{
            const historyData = await db.Transaction.findAll({where: {userId: id}, include: [{model: db.Order}]})
            return historyData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async createDepositRequest(userId, amount, method, check) {
        try{
            const user = await db.User.findByPk(userId)
            const checkPending = await db.Transaction.findOne({where: {userId, status: 'pending'}})

            if(checkPending) {
                throw ApiError.BadRequest('There is already a transaction with the pending status')
            }

            if (!user) {
                throw ApiError.BadRequest('User not found')
            }

            const pathToCheck = await uploadService.uploadCheck(check, userId)

            const createTransaction = await db.Transaction.create({
                userId, 
                type: 'deposit', 
                amount, 
                method,
                description: `Пополнение баланса аккаунта на ${amount}₽`,
                status: 'pending',
                check: pathToCheck,
                metadata: JSON.stringify({
                    createdAt: new Date().toISOString(),
                })
            })

            try {
                emailService.sendDepositMail(process.env.ADMIN_EMAIL, createTransaction)
            } catch (e) {
                throw e
            }

            return createTransaction
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async cancelDepositRequest(userId, id) {
        try{
            const cancelData = await db.Transaction.findOne({where: {userId, id}})
            if (!cancelData) {
                throw ApiError.BadRequest('Transaction not found')
            }
            const changeData = await cancelData.update({status: 'cancelled'})
            return changeData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async getAllDepositRequests() {
        try{
            const requestsData = await db.Transaction.findAll({include: [{model: db.User}]})

            return requestsData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async getPendingDepositRequests() {
        try{
            const requestsData = await db.Transaction.findAll({where: {status: 'pending', type: 'deposit'}, include: [{model: db.User}]})

            return requestsData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async approveDeposit(id) {
        try{
            const transaction = await db.Transaction.findByPk(id)
            if (!transaction) {
                throw ApiError.BadRequest('Transaction not found')
            }

            if (transaction.status !== 'pending') {
                throw ApiError.BadRequest('The application can only be accepted with the status "pending"') 
            }

            const user = await db.User.findByPk(transaction.userId)
            if (!user) {
                throw ApiError.BadRequest('User not found')
            }

            await transaction.update({status: 'completed'})
            await user.update({balance: Number(user.balance) + Number(transaction.amount)})

            try {
                emailService.sendBalanceReplenishedMail(user.email, transaction)
            } catch(e) {
                throw e
            }

            return user
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async rejectDeposit(id) {
        try{
            const transaction = await db.Transaction.findByPk(id)
            if (!transaction) {
                throw ApiError.BadRequest('Transaction not found')
            }

            if (transaction.status !== 'pending') {
                throw ApiError.BadRequest('The application can only be accepted with the status "pending"') 
            }

            await transaction.update({status: 'cancelled'})

            return transaction
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
}

export default new BalanceService()