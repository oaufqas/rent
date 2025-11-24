import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { orderStore } from '../../../stores/orderStore'
import StatusBadge from '../../../components/ui/StatusBadge/StatusBadge'
import OrderTimeline from '../../../components/orders/OrderTimeline/OrderTimeline'
import Button from '../../../components/ui/Button/Button'
import Loader from '../../../components/ui/Loader/Loader'
import styles from './OrderDetail.module.css'
import { useEffect, useState } from 'react'
import {generatePath} from '../../../utils/constants.js'

const OrderDetail = observer(() => {
  const { id } = useParams()
  const { orders, loading, fetchMyOrders } = orderStore
  const navigate = useNavigate()
  const [isCreatingReview, setIsCreatingReview] = useState(false)

  const order = orders.find(o => o.id === parseInt(id))

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!order) {
      fetchMyOrders()
    }
  }, [id, order, fetchMyOrders])

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader fullScreen />
      </div>
    )
  }

  if (!order) {
    return (
      <div className={styles.notFound}>
        <h2>Заказ не найден</h2>
        <p>Запрошенный заказ не существует</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCurrentStep = (status) => {
    const steps = ['pending', 'paid', 'verified', 'active', 'completed', 'cancelled']
    return steps.indexOf(status)
  }

  const handleCreateReview = () => {
    navigate(generatePath.createReview(order.id))
  }
  
  const canReview = order.status === 'completed' && order.canReview && !order.hasReview
  const hasReview = order.hasReview

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.orderDetail}
    >
      <div className={styles.container}>

        <nav className={styles.breadcrumbs}>
          <a href="/">Главная</a>
          <span>/</span>
          <a href="/orders">Мои заказы</a>
          <span>/</span>
          <span>Заказ #{order.id}</span>
        </nav>

        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Заказ #{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className={styles.date}>Создан: {formatDate(order.createdAt)}</p>
        </div>

        <div className={styles.timelineSection}>
          <OrderTimeline 
            status={order.status} 
            currentStep={getCurrentStep(order.status)}
          />
        </div>

        <div className={styles.content}>

          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Информация о заказе</h2>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3>Аккаунт</h3>
                <div className={styles.accountInfo}>
                  <img src={import.meta.env.VITE_API_URL + '/img/' + order.account?.img} alt={order.account?.title} />
                  <div>
                    <div className={styles.accountName}>{order.account?.title}</div>
                    <div className={styles.accountNumber}>#{order.account?.account_number}</div>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>Детали аренды</h3>
                <div className={styles.details}>
                  <div className={styles.detail}>
                    <span>Время аренды:</span>
                    <span>{order.rentPeriod} часов</span>
                  </div>
                  <div className={styles.detail}>
                    <span>Цена за час:</span>
                    <span>{order.account?.price} ₽</span>
                  </div>
                  <div className={styles.detail}>
                    <span>Общая стоимость:</span>
                    <span className={styles.totalPrice}>{order.amount} ₽</span>
                  </div>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>Контактная информация</h3>
                <div className={styles.contact}>
                  <span>Контакт для связи:</span>
                  <strong>{order.userNameInPlatform}</strong>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>Способ оплаты</h3>
                <div className={styles.payment}>
                  <span>{order.paymentMethod === 'balance' ? 'Баланс аккаунта' : 'Перевод'}</span>
                </div>
              </div>
            </div>
          </div>

          
          <div className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>Действия</h2>

                <div className={styles.infoCard}>
                  <h3>Отзыв</h3>
                  <div className={styles.reviewStatus}>
                    {hasReview ? (
                      <div className={styles.reviewExists}>
                        <span className={styles.reviewStatusText}>Отзыв уже оставлен</span>
                      </div>
                    ) : canReview ? (
                      <div className={styles.canReview}>
                        <span className={styles.reviewStatusText}>Вы можете оставить отзыв</span>
                        <Button 
                          variant="primary" 
                          size="large"
                          onClick={handleCreateReview}
                          loading={isCreatingReview}
                        >
                          Оставить отзыв
                        </Button>
                      </div>
                    ) : (
                      <div className={styles.cannotReview}>
                        <span className={styles.reviewStatusText}>Отзыв можно оставить после успешного завершения аренды</span>
                      </div>
                    )}

                  </div>
                </div>

            <div className={styles.actions}>
              {(order.status === 'pending' || order.status === 'paid') && (
                <Button variant="primary" size="large">
                  Отменить заказ
                </Button>
              )}
              
              {order.status === 'active' && (
                <Button variant="secondary" size="large">
                  Запросить продление
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default OrderDetail