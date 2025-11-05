import ApiError from "../apiErrors/api-error.js"
import userService from "../services/user-service.js"
import { validationResult } from "express-validator"






import db from '../config/models.js'

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('authorization error', errors.array()))
            }

            const {email, password} = req.body
            const userData = await userService.registration(email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }



    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('authorization error', errors.array()))
            }
            
            const {email, password} = req.body
            const userData = await userService.login(email, password)

            return res.json(userData)

        } catch (e) {
            next(e)            
        }
    }



    async verifyLogin(req, res, next) {
        try {
            const errors = validationResult(req)
            
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('two-stap authorization error', errors.array()))
            }
            
            const {userId, code} = req.body

            const userData = await userService.verifyLogin(userId, code)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (e) {
            next(e)            
        }
    }



    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)

        } catch (e) {
            next(e)            
        }
    }



    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }



    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }



    async getMyInfo(req, res, next) {
        try {
            const id = req.user.id

            const userData = await userService.getMyInfo(id)
            
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }



    async changeProfile(req, res, next) {
        try {
            const id = req.user.id
            const {username} = req.body
            console.log(username)

            const userData = await userService.changeProfile(id, username)

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }



    async changePassword(req, res, next) {
        try {
            const {email} = req.body
            const changeData = await userService.changePassword(email)

            return res.json(changeData)
        } catch (e) {
            next(e)
        }
    }



    async verifyChangePassword(req, res, next) {
        try {
            const {userId, password, code} = req.body
            const changeData = await userService.verifChangePassword(userId, password, code)

            return res.json(changeData)
        } catch (e) {
            next(e)
        }
    }
}

export default new AuthController()