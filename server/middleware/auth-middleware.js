import ApiError from "../apiErrors/api-error.js";
import tokenService from "../services/token-service.js";

export default function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken){
            return next(ApiError.UnauthorizedError())     
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData){
            return next(ApiError.UnauthorizedError())     
        }

        if (!userData.isActivated) {
            return next(ApiError.UnauthorizedError('Activate your account!'))
        }

        if (userData.status === 'blocked') {
            return next(ApiError.UnauthorizedError('You have been blocked'))
        }


        req.user = userData
        next()
        
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}