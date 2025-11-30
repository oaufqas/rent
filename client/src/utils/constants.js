export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',

  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFICATION: '/auth/verification',
  ACTIVATION_REQUIRED: '/auth/activation-required',
  
  ACCOUNT_DETAIL: '/accounts/:id',
  
  ORDERS: '/orders',
  ORDER_CREATE: '/orders/create',
  ORDER_DETAIL: '/orders/:id',

  BALANCE: '/balance',
  TRANSACTION_HISTORY: '/balance/history',

  CREATE_REVIEW: '/create-review/:id',

  ADMIN: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_ACCOUNTS: '/admin/accounts',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_PAYMETHODS: '/admin/paymethods',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_CREATE_ACCOUNT: '/admin/accounts/create',
  ADMIN_EDIT_ACCOUNT: '/admin/accounts/edit/:id',
  ADMIN_ORDERS_DETAIL: '/admin/orders/:id',
  ADMIN_TRANSACTIONS_DETAIL: '/admin/transactions/:id',

  RULES: '/rules'
}

export const generatePath = {
  accountDetail: (id) => `/accounts/${id}`,
  orderDetail: (id) => `/orders/${id}`,
  adminOrder: (id) => `/admin/orders/${id}`,
  createReview: (id) => `/create-review/${id}`,
  editAccount: (id) => `/admin/accounts/edit/${id}`,
  adminOrderDetail: (id) => `/admin/orders/${id}`,
  adminTransactionDetail: (id) => `/admin/transactions/${id}`
}

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

export const ACCOUNT_STATUS = {
  AVAILABLE: 'free',
  OCCUPIED: 'rented',
  UNAVAILABLE: 'unavailable'
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  VERIFIED: 'verified',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}