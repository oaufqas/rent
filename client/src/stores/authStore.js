import {makeAutoObservable} from 'mobx'
import AuthService from '../services/AuthService'
import axios from 'axios'

export default class authStore {
    
    user = {}
    userId = ''
    isAuth = false
    isLoading = false
    
    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this.isAuth = bool
    }

    setUser(user) {
        this.user = user
    }

    setUserId(userId) {
        this.userId = userId
    }

    setLoading(bool) {
        this.isLoading = bool
    }


    async login(email, password) {
        try {
            const data = await AuthService.login(email, password)
            this.setUserId(data.data.userId)
        } catch (e) {
            console.error(e)
        }
    }

    async verifyLogin(userId, code) {
        try {
            const response = await AuthService.verify(userId, code)

            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.error(e)
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password)
            
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.error(e)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()

            localStorage.removeItem('token')
            this.setAuth(false)
            this.setAuth({})
            location.reload(true);
        } catch (e) {
            console.error(e)
        }
    }
    
    async checkAuth() {
        this.setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, {withCredentials: true})
            
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.error(e) 
        } finally {
            this.setLoading(false)
        }
    }
}