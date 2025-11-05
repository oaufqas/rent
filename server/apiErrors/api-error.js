export default class ApiError extends Error {
    status
    errors

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError(m) {
        return new ApiError(401, m? m : 'User is not authorized')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }

    static ElseError(errors = []) {
        console.log(errors)
        return new ApiError(400, errors)
    }
}