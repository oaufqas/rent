import {makeAutoObservable} from 'mobx'
import {accountService, authService} from '../services/index.js'
import axios from 'axios'
import { adminService } from '../services/AdminService.js'

class AdminStore {
    
  dashboardStats = null
  loading = false

  accounts = []

  paymentMethods = [];

  orders = []

  reviews = []

  transactions = []

  users = []

  findOrder = {}
  
  findTransaction = {}
    
    constructor() {
        makeAutoObservable(this)
    }

    setAccounts(accounts) {
        this.accounts = accounts
    }

    setAccounts(accounts) {
        this.accounts = accounts
    }
    
    setOrders(orders) {
        this.orders = orders
    }

    setPaymentMethods(payMethods) {
        this.paymentMethods = payMethods
    }

    setReviews(reviews) {
        this.reviews = reviews
    }

    setTransactions(transactions) {
        this.transactions = transactions
    }

    setFindTransaction(transaction) {
        this.findTransaction = transaction
    }

    setFindOrder(order) {
        this.findOrder = order
    }

    setUsers(users) {
        this.users = users
    }

    setDashboard(data) {
        this.dashboardStats = data
    }

    setLoading(bool) {
        this.isLoading = bool
    }


    fetchDashboardStats = async () => {
        this.setLoading(true)
        try {
            const response = await adminService.getDashboardStats();
            this.setDashboard(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            this.setLoading(false)
        }
    }
    

    fetchAccounts = async () => {
        this.setLoading(true)
        try {
            const response = await accountService.getAccounts()
            this.setAccounts(response.data?.rows)
        } catch (error) {
            console.error('Error fetching accounts:', error)
        } finally {
            this.setLoading(false)
        }
    }


    createAccount = async (accountData) => {
        this.setLoading(true)
        try {
            const response = await adminService.createAccount(accountData)
            this.setAccounts([response.data, ...this.accounts])
            return response.data
        } catch (e) {
            console.error(e)
        } finally {
            this.setLoading(false)
        }
    }


    updateAccount = async (id, accountData) => {
        this.setLoading(true)
        try {
            const response = await adminService.updateAccount(id, accountData);
            const updatedAccount = response.data;
            this.setAccounts([response.data, ...this.accounts])
            return updatedAccount;
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    deleteAccount = async (id) => {
        this.setLoading(true)
        try {
            await adminService.deleteAccount(id);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    updateAccountStatus = async (id, status, rentHours) => {
        this.setLoading(true)
        try {
            await adminService.updateAccountStatus(id, status, rentHours);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }


  


    

    fetchPendingOrders = async () => {
        try {
            return await adminService.getPendingOrders();
        } catch (error) {
            throw error;
        }
    }


    fetchOrders = async (params = {}) => {
        this.setLoading(true)
        try {
            const response = await adminService.getOrders(params);
            this.setOrders(response.data);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }


    fetchFindOrder = async (id) => {
        this.setLoading(true)
        try {
            const response = await adminService.getFindOrder(id);
            this.setFindOrder(response.data);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    approveOrder = async (id) => {
        this.setLoading(true)
        try {
            await adminService.approveOrder(id);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    rejectOrder = async (id, reason) => {
        this.setLoading(true)
        try {
            await adminService.rejectOrder(id, reason);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    verifyUser = async (id) => {
        this.setLoading(true)
        try {
            await adminService.verifyUser(id);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    completeOrder = async (id) => {
        this.setLoading(true)
        try {
            await adminService.completeOrder(id);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }





    fetchReviews = async (params = {}) => {
        this.setLoading(true)
        try {
            const response = await adminService.getReviews(params);
            this.setReviews(response.data);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }
  

    approveReview = async (id) => {
        this.setLoading(true)
        try {
            await adminService.approveReview(id);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    rejectReview = async (id, reason) => {
        this.setLoading(true)
        try {
            await adminService.rejectReview(id, reason);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }




    fetchPendingTransactions = async () => {
        try {
            return await adminService.getPendingTransactions()
        } catch (error) {
            throw error;
        }
    }


    fetchTransactions = async (params = {}) => {
        this.setLoading(true)
        try {
            const response = await adminService.getTransactions(params);
            this.setTransactions(response.data);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }


    fetchFindTransaction = async (id) => {
        this.setLoading(true)
        try {
            const response = await adminService.getFindTransaction(id);
            this.setFindTransaction(response.data);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    approveTransaction = async (id) => {
        this.setLoading(true)
        try {
            await adminService.approveTransaction(id);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    rejectTransaction = async (id, reason) => {
        this.setLoading(true)
        try {
            await adminService.rejectTransaction(id, reason);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }



  

    fetchUsers = async (params = {}) => {
        this.setLoading(true)
        try {
            const response = await adminService.getUsers(params);
            this.setUsers(response.data);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }
  

    updateUserStatus = async (id, status) => {
        this.setLoading(true)
        try {
            await adminService.updateUserStatus(id, status);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

  
    updateUserRole = async (id, role) => {
        this.setLoading(true)
        try {
            await adminService.updateUserRole(id, role);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false)
        }
    }

    

  
    getAllPaymentMethods  = async () => {
        this.setLoading(true);
        try {
            const response = await adminService.getAllPaymentMethods();
            this.setPaymentMethods(response.data);
        } catch (error) {
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
  
    createPaymentMethod = async (name, details, type) => {
        try {
            await adminService.createPaymentMethod(name, details, type);
        } catch (error) {
            throw error;
        }
    }
  
    changePaymentMethods = async (id, name, details, type, isActive) => {
        try {
            await adminService.changePaymentMethods(id, name, details, type, isActive);
        } catch (error) {
            throw error;
        }
    }
  
    deletePaymentMethods = async (id) => {
        try {
            await adminService.deletePaymentMethods(id);
        } catch (error) {
            throw error;
        }
    }
}

export const adminStore = new AdminStore()