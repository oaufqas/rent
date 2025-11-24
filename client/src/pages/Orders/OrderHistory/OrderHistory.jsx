import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { orderStore } from '../../../stores/orderStore'
import OrderCard from '../../../components/orders/OrderCard/OrderCard'
import Loader from '../../../components/ui/Loader/Loader'
import styles from './OrderHistory.module.css'
import { useNavigate } from 'react-router-dom'
import { generatePath, ROUTES } from '../../../utils/constants'

const OrderHistory = observer(() => {
  const navigate = useNavigate()
  const { orders, loading, fetchMyOrders, cancelOrder } = orderStore
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchMyOrders()
  }, [fetchMyOrders])

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return ['pending', 'paid', 'verified', 'active'].includes(order.status)
    if (activeTab === 'completed') return ['completed'].includes(order.status)
    if (activeTab === 'cancelled') return ['cancelled'].includes(order.status)
    return true
  })

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Вы уверены, что хотите отменить заказ?')) {
      try {
        await cancelOrder(orderId)
      } catch (error) {
        console.error('Error cancelling order:', error)
      }
    }
  }

  const handleViewDetails = (orderId) => {
    navigate(generatePath.orderDetail(orderId))
  }

  if (loading && orders.length === 0) {
    return (
      <div className={styles.loading}>
        <Loader fullScreen />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.orderHistory}
    >
      <div className={styles.container}>

        <nav className={styles.breadcrumbs}>
          <a href={ROUTES.HOME}>Главная</a>
          <span>/</span>
          <span>Мои заказы</span>
        </nav>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Мои заказы</h1>
          <p className={styles.subtitle}>
            История всех ваших заказов и их текущий статус
          </p>
        </motion.div>

        {/* Табы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={styles.tabs}
        >
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Все заказы
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Активные
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Завершенные
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'cancelled' ? styles.active : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Отмененные
          </button>
        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.ordersList}
        >
          {filteredOrders.length > 0 ? (
            <div className={styles.ordersGrid}>
              {filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancelOrder}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.emptyState}
            >
              <div className={styles.emptyContent}>
                <h3 className={styles.emptyTitle}>
                  {activeTab === 'all' ? 'Заказов пока нет' : 
                   activeTab === 'active' ? 'Нет активных заказов' :
                   activeTab === 'completed' ? 'Нет завершенных заказов' :
                   'Нет отмененных заказов'}
                </h3>
                <p className={styles.emptyText}>
                  {activeTab === 'all' ? 
                    'Здесь будут отображаться все ваши заказы на аренду аккаунтов' :
                    'Заказы по этому фильтру не найдены'}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
})

export default OrderHistory