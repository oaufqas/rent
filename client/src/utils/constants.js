export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',

  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFICATION: '/auth/verification',
  ACTIVATION_REQUIRED: '/auth/activation-required',
  

  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: '/accounts/:id',
  
  ORDERS: '/orders',
  ORDER_CREATE: '/orders/create',
  ORDER_DETAIL: '/orders/:id',

  BALANCE: '/balance',
  TRANSACTION_HISTORY: '/balance/history',

  ADMIN: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_ACCOUNTS: '/admin/accounts',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_TRANSACTIONS: '/admin/transactions'
}

export const generatePath = {
  accountDetail: (id) => `/accounts/${id}`,
  orderDetail: (id) => `/orders/${id}`,
  adminOrder: (id) => `/admin/orders/${id}`
}

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

export const ACCOUNT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
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