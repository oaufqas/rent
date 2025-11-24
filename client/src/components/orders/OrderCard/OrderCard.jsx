import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import StatusBadge from '../../ui/StatusBadge/StatusBadge'
import Button from '../../ui/Button/Button'
import styles from './OrderCard.module.css'

const OrderCard = observer(({ order, onCancel, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canCancel = order.status === 'pending'

  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.header}>
        <div className={styles.orderInfo}>
          <h3 className={styles.orderNumber}>Заказ #{order.id}</h3>
          <span className={styles.date}>{formatDate(order.createdAt)}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className={styles.content}>
        <div className={styles.accountInfo}>
          <img src={import.meta.env.VITE_API_URL + '/img/' + order.account?.img} alt={'err'} className={styles.accountImage} />
          <div className={styles.accountDetails}>
            <h4 className={styles.accountName}>{order.account?.title}</h4>
            <p className={styles.accountNumber}>#{order.account?.account_number}</p>
          </div>
        </div>

        <div className={styles.orderDetails}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Время аренды:</span>
            <span className={styles.detailValue}>{order.rentPeriod} ч</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Стоимость:</span>
            <span className={styles.detailPrice}>{order.amount} ₽</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="small"
          onClick={() => onViewDetails(order.id)}
        >
          Подробнее
        </Button>
        
        {canCancel && (
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              onCancel(order.id)
              window.location.reload()
            }}
          >
            Отменить
          </Button>
        )}
      </div>
    </motion.div>
  )
})

export default OrderCard