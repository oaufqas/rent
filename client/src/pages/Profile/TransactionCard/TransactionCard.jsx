import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react'
import styles from './TransactionCard.module.css'

const TransactionCard = ({ transaction }) => {
  const getTransactionConfig = (type, status) => {
    const configs = {
      deposit: {
        icon: ArrowDownLeft,
        color: 'success',
        label: 'Пополнение'
      },
      payment: {
        icon: ArrowUpRight,
        color: 'error', 
        label: 'Оплата заказа'
      }
    }

    const statusConfigs = {
      pending: {
        icon: Clock,
        color: 'warning',
        label: 'Ожидание'
      },
      completed: {
        icon: CheckCircle,
        color: 'success',
        label: 'Завершено'
      },
      cancelled: {
        icon: XCircle,
        color: 'error',
        label: 'Отменен'
      }
    }

    return {
      ...configs[type],
      status: statusConfigs[status]
    }
  }

  const config = getTransactionConfig(transaction.type, transaction.status)
  const Icon = config.icon
  const StatusIcon = config.status.icon

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={styles.card}
    >
      <div className={styles.icon}>
        <Icon size={20} className={styles[config.color]} />
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <h4 className={styles.title}>{config.label}</h4>
          <p className={styles.description}>
            {transaction.description || 'Описание транзакции'}
          </p>
          <span className={styles.date}>
            {formatDate(transaction.createdAt)}
          </span>
        </div>

        <div className={styles.amountInfo}>
          <span className={`${styles.amount} ${styles[config.color]}`}>
            {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} ₽
          </span>
          <div className={`${styles.status} ${styles[config.status.color]}`}>
            <StatusIcon size={14} />
            <span>{config.status.label}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionCard