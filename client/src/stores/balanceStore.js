import { makeAutoObservable } from 'mobx'
import { balanceService } from '../services/index.js'

class BalanceStore {
    balance = 0
    transactions = []
    payMethods = []
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    setBalance(balance) {
        this.balance = balance
    }

    setPayMethods(payMethods) {
        this.payMethods = payMethods
    }

    setTransactions(transactions) {
        this.transactions = transactions
    }

    setLoading(loading) {
        this.loading = loading
    }

    fetchBalance = async () => {
        this.setLoading(true)
        try {
            const response = await balanceService.getMyBalance()
            this.setBalance(response.data.balance || response.data)
        } catch (error) {
            console.error('Error fetching balance:', error)
        } finally {
            this.setLoading(false)
        }
    }

    fetchTransactions = async() => {
        this.setLoading(true)
        try {
            const response = await balanceService.getMyTransactions()
            this.setTransactions(response.data.transactions || response.data)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        } finally {
            this.setLoading(false)
        }
    }


    createDeposit = async (depositData, checkFile = null) => {
        this.setLoading(true)
        try {
            const formData = new FormData()
            
            Object.keys(depositData).forEach(key => {
                formData.append(key, depositData[key])
            })

            if (checkFile) {
                formData.append('check', checkFile)
            }
            
            const response = await balanceService.createDepositRequest(formData)
            
            return response.data
        } catch (error) {
            console.error('Error creating deposit:', error)
            throw error
        } finally {
            this.setLoading(false)
        }
    }

    fetchPayMethods = async () => {
        this.setLoading(true)
        try {
            const response = await balanceService.getPaymentMethods()
            this.setPayMethods(response.data)
            return response
        } catch (e) {
            console.error(e)
        } finally {
            this.setLoading(false)
        }
    }
}

export const balanceStore = new BalanceStore()