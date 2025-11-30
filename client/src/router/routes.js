import { lazy } from 'react'
import { ROUTES, USER_ROLES } from '../utils/constants'

// Lazy loading для всех страниц
const Home = lazy(() => import('../pages/Home/Home'))
const Login = lazy(() => import('../pages/Auth/Login/Login'))
const Register = lazy(() => import('../pages/Auth/Registration/Registration'))
const Verification = lazy(() => import('../pages/Auth/Verification/Verification'))
const ActivationRequired = lazy(() => import('../pages/Auth/ActivationRequired/ActivationRequired'))
const AccountDetail = lazy(() => import('../pages/Account/AccountDetail/AccountDetail'))
const CreateOrder = lazy(() => import('../pages/Orders/CreateOrder/CreateOrder'))
const OrderHistory = lazy(() => import('../pages/Orders/OrderHistory/OrderHistory'))
const UserProfile = lazy(() => import('../pages/Profile/UserProfile/UserProfile'))
const TransactionHistory = lazy(() => import('../pages/Profile/TransactionHistory/TransactionHistory'))
const BalancePage = lazy(() => import('../pages/Balance/BalancePage/BalancePage'))
const OrderDetail = lazy(() => import('../pages/Orders/OrderDetail/OrderDetail'))
const SecuritySettings = lazy(() => import('../pages/Profile/SecuritySettings/SecuritySettings'))
const ReviewManagement = lazy(() => import('../pages/Admin/ReviewManagement/ReviewManagement'))
const RulesPage = lazy(() => import('../pages/Rules/RulesPage'))
const CreateReview = lazy(() => import('../pages/Review/CreateReview'))

// Admin pages
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard/Dashboard'))
const AdminOrders = lazy(() => import('../pages/Admin/OrderManagement/OrderManagement'))
const AdminUsers = lazy(() => import('../pages/Admin/UserManagement/UserManagement'))
const AdminAccounts = lazy(() => import('../pages/Admin/AccountManagement/AccountManagement'))
const AdminPayMethods = lazy(() => import('../pages/Admin/PaymentMethodsManagement/PaymentMethodsManagement'))
const AdminTransactions = lazy(() => import('../pages/Admin/TransactionManagement/TransactionManagement'))
const AccountForm = lazy(() => import('../pages/Admin/AccountForm/AccountFrom'))
const adminOrderDetail = lazy(() => import('../pages/Admin/AdminOrderDetail/AdminOrderDetail'))
const adminTransactionDetail = lazy(() => import('../pages/Admin/AdminTransactionDetail/AdminTransactionDetai'))

export const routes = [
  {
    path: ROUTES.HOME,
    element: Home,
    layout: 'main',
    public: true
  },
  {
    path: ROUTES.RULES,
    element: RulesPage,
    layout: 'main',
    public: true
  },
  {
    path: ROUTES.ACCOUNT_DETAIL,
    element: AccountDetail,
    layout: 'main',
    public: true
  },
  {
    path: ROUTES.LOGIN,
    element: Login,
    layout: 'auth',
    authRedirect: true
  },
  {
    path: ROUTES.REGISTER,
    element: Register,
    layout: 'auth',
    authRedirect: true
  },
  {
    path: ROUTES.VERIFICATION,
    element: Verification,
    layout: 'auth',
    authRedirect: true
  },
  {
    path: ROUTES.ACTIVATION_REQUIRED,
    element: ActivationRequired,
    layout: 'auth',
    public: true
  },
  {
    path: ROUTES.PROFILE,
    element: UserProfile,
    layout: 'main',
    requiresAuth: true
  },
  {
    path: ROUTES.BALANCE,
    element: BalancePage,
    layout: 'main',
    requiresAuth: true
  },
  {
  path: ROUTES.CREATE_REVIEW,
  element: CreateReview,
  layout: 'main',
  requiresAuth: true
  },
  {
    path: ROUTES.TRANSACTION_HISTORY,
    element: TransactionHistory,
    layout: 'main',
    requiresAuth: true
  },
  {
    path: ROUTES.ORDERS,
    element: OrderHistory,
    layout: 'main',
    requiresAuth: true
  },
  {
    path: ROUTES.ORDER_CREATE,
    element: CreateOrder,
    layout: 'main',
    requiresAuth: true
  },
  {
    path: ROUTES.ORDER_DETAIL,
    element: OrderDetail,
    layout: 'main',
    requiresAuth: true
  },
  {
    path: '/profile/security',
    element: SecuritySettings,
    layout: 'main',
    requiresAuth: true
  },
  {
    path: ROUTES.ADMIN_REVIEWS,
    element: ReviewManagement,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN,
    element: AdminDashboard,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_ORDERS,
    element: AdminOrders,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_USERS,
    element: AdminUsers,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_ACCOUNTS,
    element: AdminAccounts,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_CREATE_ACCOUNT,
    element: AccountForm,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_EDIT_ACCOUNT,
    element: AccountForm,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_PAYMETHODS,
    element: AdminPayMethods,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_TRANSACTIONS,
    element: AdminTransactions,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_ORDERS_DETAIL,
    element: adminOrderDetail,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  },
  {
    path: ROUTES.ADMIN_TRANSACTIONS_DETAIL,
    element: adminTransactionDetail,
    layout: 'admin',
    requiresAuth: true,
    requiredRole: USER_ROLES.ADMIN
  }
]