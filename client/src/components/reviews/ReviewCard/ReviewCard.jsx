import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import styles from './ReviewCard.module.css'
import { toJS } from 'mobx'

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? styles.starFilled : styles.starEmpty}
        fill={index < rating ? "currentColor" : "none"}
      />
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {review.user?.userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={styles.userDetails}>
            <h4 className={styles.username}>{review.user?.userName || 'User'}</h4>
            <span className={styles.date}>{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <div className={styles.rating}>
          {renderStars(review.ratingValue)}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{review.comment}</h3>
      </div>

      {review.account && (
        <div className={styles.account}>
          <span className={styles.accountLabel}>Аккаунт:</span>
          <span className={styles.accountName}>#{review.account.account_number}</span>
        </div>
      )}
    </motion.div>
  )
}

export default ReviewCard