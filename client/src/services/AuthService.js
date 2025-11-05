import $api from "../http";

export default class AuthService {

    static async login(email, password) {
        return $api.post('/auth/login', {email, password})
    }

    static async verify(userId, code) {
        return $api.post('/auth/verify', {userId, code})
    }
    
    static async registration(email, password) {
        return $api.post('/auth/register', {email, password})
    }
    
    static async logout() {
        return $api.post('/auth/logout')
    }

    static async gtUsers() {
        return $api.get('/auth/users')
    }

}