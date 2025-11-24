import { motion } from 'framer-motion'
import { Star, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react'
import styles from './ReviewCard.module.css'

const ReviewCard = ({ review }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: 'warning',
        label: 'На модерации'
      },
      approved: {
        icon: CheckCircle,
        color: 'success',
        label: 'Опубликован'
      },
      rejected: {
        icon: XCircle,
        color: 'error',
        label: 'Отклонен'
      }
    }
    return configs[status] || configs.pending
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? styles.filledStar : styles.emptyStar}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  const statusConfig = getStatusConfig(review.status)
  const StatusIcon = statusConfig.icon

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
      <div className={styles.header}>
        <div className={styles.accountInfo}>
          <h4 className={styles.accountTitle}>
            Аккаунт #{review.accountId}
          </h4>
          <div className={styles.rating}>
            {renderStars(review.ratingValue)}
          </div>
        </div>
        
        <div className={`${styles.status} ${styles[statusConfig.color]}`}>
          <StatusIcon size={14} />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {review.comment && (
        <div className={styles.comment}>
          <MessageCircle size={16} className={styles.commentIcon} />
          <p className={styles.commentText}>{review.comment}</p>
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.date}>
          {formatDate(review.createdAt)}
        </span>
        
        {review.orderId && (
          <span className={styles.orderRef}>
            Заказ #{review.orderId}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default ReviewCard