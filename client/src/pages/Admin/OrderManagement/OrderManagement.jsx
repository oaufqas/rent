import { motion } from 'framer-motion'
import { Search, Eye } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import Button from '../../../components/ui/Button/Button'
import { formatCurrency } from '../../../utils/formatters'
import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './OrderManagement.module.css'
import { generatePath } from '../../../utils/constants'
import { useNavigate } from 'react-router-dom'

const OrderManagement = observer(() => {
  const { 
    orders, 
    loading, 
    fetchOrders, 
  } = adminStore

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toString().includes(searchTerm) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (order) => {
    navigate(generatePath.adminOrderDetail(order.id))
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'warning', 
      verified: 'info',
      active: 'success',
      completed: 'secondary',
      cancelled: 'error'
    }
    return colors[status] || 'secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Ожидание',
      paid: 'Оплачен',
      active: 'Активен',
      verified: 'Проверка пользователя',
      completed: 'Завершен',
      cancelled: 'Отменен'
    }
    return texts[status] || status
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.orderManagement}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Управление заказами</h1>
          <p className={styles.subtitle}>Просмотр и управление всеми заказами</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Поиск по ID заказа или email пользователя..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидание</option>
            <option value="paid">Оплачено</option>
            <option value="verified">Проверка пользователя</option>
            <option value="active">Активно</option>
            <option value="completed">Завершено</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            Загрузка заказов...
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID заказа</th>
                <th>Пользователь</th>
                <th>Аккаунт</th>
                <th>Время</th>
                <th>Стоимость</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.tableRow}
                >
                  <td className={styles.orderId}>#{order.id}</td>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {order.user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className={styles.userEmail}>{order.user?.email || 'Неизвестно'}</span>
                    </div>
                  </td>
                  <td className={styles.accountTitle}>{order.accountId ? `#${order.account?.account_number}` : 'Аккаунт удален'}</td>
                  <td className={styles.rentPeriod}>{order.rentPeriod} ч</td>
                  <td className={styles.amount}>{formatCurrency(order.amount)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[getStatusColor(order.status)]}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className={styles.date}>{formatToMoscowTime(order.createdAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        onClick={() => handleViewDetails(order)}
                        className={styles.viewBtn}
                        title="Просмотр деталей"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.mobileOrders}>
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.mobileOrderCard}
          >
            <div className={styles.mobileOrderHeader}>
              <div className={styles.mobileOrderId}>#{order.id}</div>
              <span className={`${styles.mobileStatus} ${styles[getStatusColor(order.status)]}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className={styles.mobileUserInfo}>
              <div className={styles.mobileAvatar}>
                {order.user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className={styles.mobileUserEmail}>{order.user?.email || 'Неизвестно'}</span>
            </div>
            
            <div className={styles.mobileOrderInfo}>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Аккаунт:</span>
                <span className={styles.mobileInfoValue}>
                  {order.accountId ? `#${order.account?.account_number}` : 'Аккаунт удален'}
                </span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Время аренды:</span>
                <span className={styles.mobileInfoValue}>{order.rentPeriod} ч</span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Стоимость:</span>
                <span className={styles.mobileInfoValue}>{formatCurrency(order.amount)}</span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Дата:</span>
                <span className={styles.mobileInfoValue}>{formatToMoscowTime(order.createdAt)}</span>
              </div>
            </div>
            
            <div className={styles.mobileActions}>
              <Button
                onClick={() => handleViewDetails(order)}
                className={styles.viewBtn}
                title="Просмотр деталей"
              >
                <Eye size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>
              {searchTerm || statusFilter !== 'all' ? 'Заказы не найдены' : 'Заказов пока нет'}
            </h3>
            <p className={styles.emptyText}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Попробуйте изменить параметры поиска' 
                : 'Все новые заказы будут отображаться здесь'
              }
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default OrderManagement