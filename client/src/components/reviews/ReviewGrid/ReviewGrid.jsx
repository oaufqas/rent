import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { reviewStore } from '../../../stores/reviewStore'
import ReviewCard from '../ReviewCard/ReviewCard'
import Loader from '../../ui/Loader/Loader'
import Button from '../../ui/Button/Button'
import styles from './ReviewGrid.module.css'
import { toJS } from 'mobx'

const ReviewGrid = observer(({ showLoadMore = true }) => {
  const { reviews, loading, hasMore, loadMoreReviews } = reviewStore

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  if (loading && reviews.length === 0) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.reviewGrid}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={styles.grid}
      >
        <AnimatePresence>
          {toJS(reviews).map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              layout
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {showLoadMore && hasMore && (
        <div className={styles.loadMore}>
          <Button
            variant="secondary"
            onClick={loadMoreReviews}
            loading={loading}
          >
            Загрузить еще
          </Button>
        </div>
      )}

      {reviews.length === 0 && !loading && (
        <div className={styles.noReviews}>
          <span className={styles.noReviewsIcon}>💬</span>
          <h3>Отзывов пока нет</h3>
          <p>Будьте первым, кто оставит отзыв!</p>
        </div>
      )}
    </div>
  )
})

export default ReviewGrid