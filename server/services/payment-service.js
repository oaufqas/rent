import ApiError from '../apiErrors/api-error.js'
import db from '../config/models.js'


class PaymentService {
    async getPaymentMethods() {
        try{
            const check = await db.PaymentMethod.findAll({where: {isActive: true}})
    
            if (!check) {
                throw ApiError.BadRequest('There are no payment methods yet')
            }
    
            return check
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async getAllPaymentMethods() {
        try{
            const check = await db.PaymentMethod.findAll()
    
            if (!check) {
                throw ApiError.BadRequest('There are no payment methods yet')
            }
    
            return check
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    async addPaymentMethods(name, details) {
        try{
            const check = await db.PaymentMethod.findOne({where: {name}})

            if (check) {
                throw ApiError.BadRequest('Payment method with this name already exists')
            }
            
            const payData = await db.PaymentMethod.create({name, details, isActive: true})
            return payData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
    
    
    
    async changePaymentMethods(id, name, details, status) {
        try{
            const check = await db.PaymentMethod.findByPk(id)
            let checkName
            if (name) {
                checkName = await db.PaymentMethod.findOne({where: {name}})
            }
            
            if (!check) {
                throw ApiError.BadRequest('Payment method not found')
            }

            if (checkName) {
                throw ApiError.BadRequest('Payment method with this name already exists')
            }

            const isActive = status === 'true'
            const changeData = {}

            if (name !== undefined) changeData.name = name
            if (details !== undefined) changeData.details = details
            if (isActive !== undefined) changeData.isActive = isActive

            await check.update(changeData)

            return check
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
    


    async deletePaymentMethods(id) {
        try{
            const check = await db.PaymentMethod.findByPk(id)
    
            if (!check) {
                throw ApiError.BadRequest('Payment method not found')
            }
    
            const payData = await db.PaymentMethod.destroy({where: {id}})
            return payData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
}

export default new PaymentService()