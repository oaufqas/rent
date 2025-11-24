import { makeAutoObservable } from 'mobx'
import { orderService } from '../services/index.js'

class OrderStore {
    orders = []
    currentOrder = null
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    setOrders(orders) {
        this.orders = orders
    }

    setCurrentOrder(order) {
        this.currentOrder = order
    }

    setLoading(loading) {
        this.loading = loading
    }

    fetchMyOrders = async () => {
        this.setLoading(true)
        try {
            const response = await orderService.getMyOrders()
            this.setOrders(response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            this.setLoading(false)
        }
    }

    createOrder = async (orderData) => {
        this.setLoading(true)
        try {
            const response = await orderService.createOrder(orderData)
            return response.data
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        } finally {
            this.setLoading(false)
        }
    }

    cancelOrder = async (id) => {
        try {
            const response = await orderService.cancelOrder(id)

            this.orders = this.orders.map(order => 
                order.id === id ? response.data : order
            )
            return response.data
        } catch (error) {
            console.error('Error canceling order:', error)
            throw error
        }
    }
}

export const orderStore = new OrderStore()