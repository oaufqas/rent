import $api from './api'

export const orderService = {
  getMyOrders: () => $api.get('/orders/my'),
  
  createOrder: (orderData) => $api.post('/orders', orderData),
  
  cancelOrder: (id) => $api.put(`/orders/${id}/cancel`),

}

export default orderService