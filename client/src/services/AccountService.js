import $api from './api'

export const accountService = {

  getAccounts: (params = {}) => {
    const queryParams = new URLSearchParams(params)
    return $api.get(`/accounts?${queryParams}`)
  },
  

  getAccount: (id) => {
    return $api.get(`/accounts/${id}`)
  }
}

export default accountService