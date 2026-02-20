import $api from './Api'

export const balanceService = {
  getMyBalance: () => $api.get('/balance'),

  getMyTransactions: () => $api.get('/balance/history'),
  
  createDepositRequest: (requestData) => $api.post('/balance/deposit-request', requestData),

  cancelDepositRequest: (id) => $api.put(`/balance/deposit-request/${id}/cancel`),

  getPaymentMethods: () => $api.get(`/balance/payment-methods`),
}

export default balanceService