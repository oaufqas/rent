import api from './Api';

export const adminService = {

  getDashboardStats: () => api.get('/admin/stats'),
  
  getAccounts: (params = {}) => api.get('/admin/accounts', { params }),
  createAccount: (data) => api.post('/admin/accounts', data),
  updateAccount: (id, data) => api.put(`/admin/accounts/${id}`, data),
  deleteAccount: (id) => api.delete(`/admin/accounts/${id}`),
  updateAccountStatus: (id, status, rentHours) => api.put(`/admin/accounts/${id}/status`, { status, rentHours }),
  
  
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  getFindOrder: (id) => api.get(`/admin/order/${id}`),
  getPendingOrders: () => api.get('/admin/orders/pending'),
  updateOrderStatus: (id, status, reason = '') => api.put(`/admin/orders/${id}/status`, { status, reason }),
  approveOrder: (id) => api.put(`/admin/orders/${id}/approve`),
  rejectOrder: (id, reason) => api.put(`/admin/orders/${id}/reject`),
  verifyUser: (id) => api.put(`/admin/orders/${id}/verifyuser`),
  completeOrder: (id) => api.put(`/admin/orders/${id}/complete`),
  extendOrder: (id, extraHours) => api.put(`/admin/orders/${id}/extend`, {extraHours}),
  

  getReviews: (params = {}) => api.get('/admin/reviews', { params }),
  approveReview: (id) => api.put(`/admin/reviews/${id}/approve`),
  rejectReview: (id, reason) => api.put(`/admin/reviews/${id}/reject`),
  

  getTransactions: (params = {}) => api.get('/admin/deposit-requests', { params }),
  getFindTransaction: (id) => api.get(`/admin/deposit-request/${id}`),
  getPendingTransactions: () => api.get('/admin/deposit-requests/pending'),
  approveTransaction: (id) => api.put(`/admin/deposit-requests/${id}/approve`),
  rejectTransaction: (id, reason) => api.put(`/admin/deposit-requests/${id}/reject`),
  

  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),

  
  getAllPaymentMethods: () => api.get(`/admin/payment-methods`),
  createPaymentMethod: (name, details, type) => api.post(`/admin/payment-methods`, {name, details, type}), //isActive = true default
  changePaymentMethods: (id, name, details, type, isActive) => api.put(`/admin/payment-methods/${id}`, {name, details, type, isActive}),
  deletePaymentMethods: (id) => api.delete(`/admin/payment-methods/${id}`),
};