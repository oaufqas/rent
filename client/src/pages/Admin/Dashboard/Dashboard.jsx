import { motion } from 'framer-motion'
import { ShoppingCart, Users, Gamepad2, CreditCard, Eye } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import DashboardCard from '../../../components/admin/DashboardCard/DashboardCard'
import Modal from '../../../components/ui/Modal/Modal'
import TransactionModal from '../../../components/Admin/Modals/TransactionModal'
import OrderModal from '../../../components/Admin/Modals/OrderModal'
import Button from '../../../components/ui/Button/Button'
import { formatCurrency } from '../../../utils/formatters'
import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './Dashboard.module.css'

const Dashboard = observer(() => {
  const { dashboardStats, loading, fetchDashboardStats, fetchPendingOrders, fetchPendingTransactions } = adminStore
  const [pendingOrders, setPendingOrders] = useState([])
  const [pendingTransactions, setPendingTransactions] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    fetchDashboardStats()
    loadPendingItems()
  }, [fetchDashboardStats])

  const loadPendingItems = async () => {
    try {
      const [ordersResponse, transactionsResponse] = await Promise.all([
        fetchPendingOrders(),
        fetchPendingTransactions()
      ])
      setPendingOrders(ordersResponse.data || [])
      setPendingTransactions(transactionsResponse.data || [])
    } catch (error) {
      console.error('Error loading pending items:', error)
    }
  }

  // Обработчики для заказов
  const handleApproveOrder = async (orderId) => {
    setModalLoading(true)
    try {
      await adminStore.approveOrder(orderId)
      await loadPendingItems()
      setShowOrderModal(false)
    } catch (error) {
      alert('Ошибка при подтверждении заказа')
    } finally {
      setModalLoading(false)
    }
  }

  const handleRejectOrder = async (orderId) => {
    setModalLoading(true)
    try {
      await adminStore.rejectOrder(orderId)
      await loadPendingItems()
      setShowOrderModal(false)
    } catch (error) {
      alert('Ошибка при отклонении заказа')
    } finally {
      setModalLoading(false)
    }
  }

  const handleVerifyUser = async (orderId) => {
    setModalLoading(true)
    try {
      await adminStore.verifyUser(orderId)
      await loadPendingItems()
      setShowOrderModal(false)
    } catch (error) {
      alert('Ошибка при верификации пользователя')
    } finally {
      setModalLoading(false)
    }
  }

  const handleCompleteOrder = async (orderId) => {
    setModalLoading(true)
    try {
      await adminStore.completeOrder(orderId)
      await loadPendingItems()
      setShowOrderModal(false)
    } catch (error) {
      alert('Ошибка при завершении заказа')
    } finally {
      setModalLoading(false)
    }
  }

  // Обработчики для транзакций
  const handleApproveTransaction = async (transactionId) => {
    setModalLoading(true)
    try {
      await adminStore.approveTransaction(transactionId)
      await loadPendingItems()
      setShowTransactionModal(false)
    } catch (error) {
      alert('Ошибка при подтверждении транзакции')
    } finally {
      setModalLoading(false)
    }
  }

  const handleRejectTransaction = async (transactionId) => {
    setModalLoading(true)
    try {
      await adminStore.rejectTransaction(transactionId)
      await loadPendingItems()
      setShowTransactionModal(false)
    } catch (error) {
      alert('Ошибка при отклонении транзакции')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDownloadCheck = async (checkFilename) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/checks/${checkFilename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = checkFilename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Ошибка при скачивании чека');
      }
    } catch (error) {
      console.error('Error downloading check:', error);
      alert('Ошибка при скачивании чека');
    }
  };

  const handleViewCheck = (checkFilename) => {
    const checkUrl = `${import.meta.env.VITE_API_URL}/admin/checks/${checkFilename}`;
    window.open(checkUrl, '_blank');
  };

  // Функции открытия модалок
  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleOpenTransactionModal = (transaction) => {
    setSelectedTransaction(transaction)
    setShowTransactionModal(true)
  }

  const getOrderStatusText = (status) => {
    const statuses = {
      'pending': 'Ожидает подтверждения',
      'paid': 'Оплачен, проверка пользователя',
      'verified': 'Пользователь проверен'
    }
    return statuses[status] || status
  }

  const getTransactionMethodText = (method) => {
    const methods = {
      'bank_transfer': 'Банковский перевод',
      'crypto': 'Криптовалюта'
    }
    return methods[method] || method
  }

  const stats = [
    {
      title: 'Новые заказы',
      value: dashboardStats?.newOrders || 0,
      change: dashboardStats?.orderChange || 0,
      icon: ShoppingCart,
      color: 'primary'
    },
    {
      title: 'Новые пользователи',
      value: dashboardStats?.newUsers || 0,
      change: dashboardStats?.userChange || 0,
      icon: Users,
      color: 'success'
    },
    {
      title: 'Активные аренды',
      value: dashboardStats?.activeRentals || 0,
      change: dashboardStats?.rentalChange || 0,
      icon: Gamepad2,
      color: 'warning'
    },
    {
      title: 'Общий доход',
      value: `${dashboardStats?.totalRevenue?.toLocaleString() || 0} ₽`,
      change: dashboardStats?.revenueChange || 0,
      icon: CreditCard,
      color: 'info'
    }
  ]

  const hasPendingItems = pendingOrders.length > 0 || pendingTransactions.length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.dashboard}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Дашборд</h1>
        <p className={styles.subtitle}>Обзор статистики и активности</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.statsGrid}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DashboardCard {...stat} loading={loading} />
          </motion.div>
        ))}
      </motion.div>

      {/* Блок заказов и заявок на полную ширину */}
      {hasPendingItems && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.pendingSection}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Требуют внимания</h2>
            <p className={styles.sectionSubtitle}>
              Заказы и заявки на пополнение, ожидающие проверки
            </p>
          </div>

          <div className={styles.pendingGrid}>
            {/* Заказы */}
            {pendingOrders.length > 0 && (
              <div className={styles.pendingColumn}>
                <h3 className={styles.columnTitle}>
                  <ShoppingCart size={20} />
                  Заказы в ожидании ({pendingOrders.length})
                </h3>
                <div className={styles.pendingList}>
                  {pendingOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={styles.pendingItem}
                    >
                      <div className={styles.itemHeader}>
                        <span className={styles.itemId}>Заказ #{order.id}</span>
                        <span className={styles.itemStatus}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                      <div className={styles.itemDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Пользователь:</span>
                          <span className={styles.detailValue}>{order.user?.email}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Сумма:</span>
                          <span className={styles.detailValue}>{formatCurrency(order.amount)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Период:</span>
                          <span className={styles.detailValue}>{order.rentPeriod} ч</span>
                        </div>
                      </div>
                      <div className={styles.itemFooter}>
                        <span className={styles.itemTime}>
                          {formatToMoscowTime(order.createdAt)}
                        </span>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleOpenOrderModal(order)}
                          className={styles.viewButton}
                        >
                          <Eye size={14} />
                          Подробнее
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Заявки на пополнение */}
            {pendingTransactions.length > 0 && (
              <div className={styles.pendingColumn}>
                <h3 className={styles.columnTitle}>
                  <CreditCard size={20} />
                  Заявки на пополнение ({pendingTransactions.length})
                </h3>
                <div className={styles.pendingList}>
                  {pendingTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={styles.pendingItem}
                    >
                      <div className={styles.itemHeader}>
                        <span className={styles.itemId}>Транзакция #{transaction.id}</span>
                        <span className={styles.itemStatus}>Ожидает подтверждения</span>
                      </div>
                      <div className={styles.itemDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Пользователь:</span>
                          <span className={styles.detailValue}>{transaction.user?.email}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Сумма:</span>
                          <span className={`${styles.detailValue} ${styles.amountPositive}`}>
                            +{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Метод:</span>
                          <span className={styles.detailValue}>
                            {getTransactionMethodText(transaction.method)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.itemFooter}>
                        <span className={styles.itemTime}>
                          {formatToMoscowTime(transaction.createdAt)}
                        </span>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleOpenTransactionModal(transaction)}
                          className={styles.viewButton}
                        >
                          <Eye size={14} />
                          Подробнее
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Быстрые действия */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={styles.quickActionsSection}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Быстрые действия</h2>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.quickAction} onClick={() => window.location.href = '/admin/accounts'}>
            <Gamepad2 size={24} />
            <span>Управление аккаунтами</span>
          </button>
          <button className={styles.quickAction} onClick={() => window.location.href = '/admin/users'}>
            <Users size={24} />
            <span>Управление пользователями</span>
          </button>
          <button className={styles.quickAction} onClick={() => window.location.href = '/admin/transactions'}>
            <CreditCard size={24} />
            <span>Просмотр транзакций</span>
          </button>
          <button className={styles.quickAction} onClick={() => window.location.href = '/admin/orders'}>
            <ShoppingCart size={24} />
            <span>Обработка заказов</span>
          </button>
          <button className={styles.quickAction} onClick={() => window.location.href = '/admin/payment-methods'}>
            <CreditCard size={24} />
            <span>Методы оплаты</span>
          </button>
        </div>
      </motion.div>

      {/* Модальное окно заказа */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`Заказ #${selectedOrder?.id}`}
        size="large"
      >
        <OrderModal
          order={selectedOrder}
          onApprove={handleApproveOrder}
          onReject={handleRejectOrder}
          onVerifyUser={handleVerifyUser}
          onComplete={handleCompleteOrder}
          onDownloadCheck={handleDownloadCheck}
          loading={modalLoading}
        />
      </Modal>

      {/* Модальное окно транзакции */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title={`Транзакция #${selectedTransaction?.id}`}
        size="large"
      >
        <TransactionModal
          transaction={selectedTransaction}
          onApprove={handleApproveTransaction}
          onReject={handleRejectTransaction}
          onDownloadCheck={handleDownloadCheck}
          onViewCheck={handleViewCheck}
          loading={modalLoading}
        />
      </Modal>

      {/* Если нет pending items */}
      {!hasPendingItems && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.noPending}
        >
          <div className={styles.noPendingContent}>
            <h3 className={styles.noPendingTitle}>Все задачи выполнены!</h3>
            <p className={styles.noPendingText}>
              Нет заказов или заявок на пополнение, требующих вашего внимания
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default Dashboard