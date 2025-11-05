import db from '../config/models.js'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import mailService from './email-service.js'
import tokenService from './token-service.js'
import UserDto from '../dtos/user-dto.js'
import ApiError from '../apiErrors/api-error.js'
import { Op } from 'sequelize'

class UserService {

    async registration(email, password) {

        const candidate = await db.User.findOne({where: {email}})

        if (candidate) {
            throw ApiError.BadRequest('There is already a user with this email')
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = randomUUID()

        const user = await db.User.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)

        let userDto = new UserDto(user) // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }


    
    async activate(activationLink) {

        const user = await db.User.findOne({where: {activationLink}})
        if (!user) {
            throw ApiError.BadRequest('Incorrect url activation')
        }
        
        user.isActivated = true
        await user.save()
    }





    async login(email, password) {

        const user = await db.User.findOne({where: {email}})
    
        if (!user) {
            throw ApiError.BadRequest('Email not found')
        }
        
        const isPassEquals = await bcrypt.compare(password, user.password)        
        
        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password')
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000);
        
        await db.User.update({
            twoFactorCode: code,
            twoFactorExpires: expiresAt
        }, {
            where: {id: user.id}
        })
        
        mailService.sendActivationCode(user.email, code)

        return {userId: user.id, message: 'the code has been sent to your email'}
    }





    async verifyLogin(userId, code) {

        const user = await db.User.findOne({where: 
            {
                id: userId, 
                twoFactorCode: code, 
                twoFactorExpires: {[Op.gt]: new Date()}
            }})
    
        if (!user) {
            throw ApiError.BadRequest('Incorrect or expired code')
        }

        await db.User.update({
            twoFactorCode: null,
            twoFactorExpires: null
        }, {where: {id: userId}})

        let userDto = new UserDto(user) // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto})
        
        await tokenService.saveToken(userDto.id, tokens.refreshToken)


        return {...tokens, user: userDto}
    }


    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }


    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError('User is not authorized')
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError('User is not authorized')
        }

        const user = await db.User.findByPk(userData.id)
        let userDto = new UserDto(user) // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto})
        
        await tokenService.saveToken(userDto.id, tokens.refreshToken)


        return {...tokens, user: userDto}
    }


    async getMyInfo(id) {
        try {
            const userData = await db.User.findByPk(id)

            if (!userData) {
                throw ApiError.UnauthorizedError('User not found')
            }

            return userData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async changeProfile(id, userName) {
        try {
            const userData = await db.User.findByPk(id)

            if (!userData) {
                throw ApiError.UnauthorizedError('User not found')
            }
            const updateUser = await userData.update({userName})

            return updateUser
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async changePassword(email) {
        try {
            const user = await db.User.findOne({where: {email}})
        
            if (!user) {
                throw ApiError.BadRequest('Email not found')
            }

            const code = Math.floor(100000 + Math.random() * 900000);
            const expiresAt = new Date(Date.now() + 20 * 60 * 1000);
            
            await db.User.update({
                twoFactorCode: code,
                twoFactorExpires: expiresAt
            }, {
                where: {id: user.id}
            })
            
            mailService.sendCodeToChangePassword(user.email, code)

            return {userId: user.id, message: 'the code has been sent to your email'}
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async verifChangePassword(userId, password, code) {
        try {
            const user = await db.User.findOne({where: 
                {
                    id: userId, 
                    twoFactorCode: code, 
                    twoFactorExpires: {[Op.gt]: new Date()}
                }})
        
            if (!user) {
                throw ApiError.BadRequest('Incorrect or expired code')
            }

            await user.update({twoFactorCode: null, twoFactorExpires: null})
            const hashPassword = await bcrypt.hash(password, 5)

            const updateUser = await user.update({password: hashPassword})

            return updateUser
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async getAllUsers() {
        try {
            const userData = await db.User.findAll()

            return userData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async changeStatus(id) {
        try {
            const user = await db.User.findByPk(id)
            let userData

            if (!user) {
                throw ApiError.UnauthorizedError('User not found')
            }

            if (user.status === "unblocked") {
                userData = await user.update({status: 'blocked'})
            } else {
                userData = await user.update({status: 'unblocked'})
            }

            return userData
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
}

export default new UserService()