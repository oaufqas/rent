import {makeAutoObservable} from 'mobx'
import {authService} from '../services/index.js'
import axios from 'axios'

export default class Store {
    
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
            const data = await authService.login(email, password)
            this.setUserId(data.data.userId)
            return data
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    async verifyLogin(userId, code) {
        try {
            const response = await authService.verify(userId, code)

            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
            return response.data
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    async registration(email, password) {
        try {
            const response = await authService.register(email, password)
            
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
            return response.data
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    async changeUserName(username) {
        try {
            const response = await authService.updateProfile(username)
            
            return response.data
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    getOneUser = async () => {
        this.setLoading(true)
        try {
            const oneUsrData = await authService.getMe()
            this.setUser(oneUsrData)
            return oneUsrData.data
        } catch (e) {
            console.error(e)
        } finally {
            this.setLoading(false)
        }
    }

    logout = async() => {
        try {
            const response = await authService.logout()

            localStorage.removeItem('token')
            this.setAuth(false)
            this.setAuth({})
            location.reload(true);
        } catch (e) {
            console.error(e)
        }
    }
    
    checkAuth = async () => {
        this.setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, {withCredentials: true})
            
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {

        } finally {
            this.setLoading(false)
        }
    }
}

export const store = new Store()