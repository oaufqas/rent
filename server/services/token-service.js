import jwt from 'jsonwebtoken'
import db from '../config/models.js'


class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn:'30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn:'40d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        let tokenData = await db.UserToken.findOne({where: {userId}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await db.UserToken.create({userId, refreshToken})
        return token
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY)
            return userData

        } catch (e) {
            return null
        }
    }
    
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY)
            return userData

        } catch (e) {
            return null
        }
    }

    async removeToken(refreshToken) {
        const tokenData = await db.UserToken.destroy({where: {refreshToken}})
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await db.UserToken.findOne({where: {refreshToken}})
        return tokenData
    }
}

export default new TokenService()