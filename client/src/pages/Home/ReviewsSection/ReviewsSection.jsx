import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { reviewStore } from '../../../stores/reviewStore'
import ReviewGrid from '../../../components/reviews/ReviewGrid/ReviewGrid'
import styles from './ReviewsSection.module.css'

const ReviewsSection = observer(() => {
  const { fetchReviews } = reviewStore

  useEffect(() => {
    fetchReviews(true)
  }, [fetchReviews])

  return (
    <section id='reviews'>
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={styles.section}
    >
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <h2 className={styles.title}>
            Отзывы <span className={styles.accent}>клиентов</span>
          </h2>
          <p className={styles.subtitle}>
            Что говорят наши пользователи о сервисе
          </p>
        </motion.div>

        <ReviewGrid showLoadMore={false} />
      </div>
    </motion.section>
    </section>
  )
})

export default ReviewsSection