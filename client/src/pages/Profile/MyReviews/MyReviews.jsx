import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { reviewStore } from '../../../stores/reviewStore'
import ReviewCard from '../ReviewCard/ReviewCard'
import Loader from '../../../components/ui/Loader/Loader'
import styles from './MyReviews.module.css'

const MyReviews = observer(() => {
  const { myReviews, loading, fetchMyReviews } = reviewStore

  useEffect(() => {
    fetchMyReviews()
  }, [fetchMyReviews])

  if (loading && myReviews.length === 0) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.myReviews}>
      <div className={styles.header}>
        <h2>Мои отзывы</h2>
        <p>Отзыв можно оставить на странице заказа, после его успешного завершения</p>
      </div>
      {myReviews.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.reviewsList}
        >
          {myReviews.map((review, index) => (
              <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>Отзывов пока нет</h3>
            <p className={styles.emptyText}>
              Здесь будут отображаться все оставленные вами отзывы об аренде аккаунтов
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
})

export default MyReviews