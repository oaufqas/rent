import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { reviewStore } from '../../stores'
import { orderStore } from '../../stores'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Loader from '../../components/ui/Loader/Loader'
import { ROUTES } from '../../utils/constants'
import { Star } from 'lucide-react'
import styles from './CreateReview.module.css'

const CreateReview = observer(() => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { createReview, loading } = reviewStore
  const { orders, fetchMyOrders } = orderStore
  
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const { id } = useParams()
  const order = orders.find(o => o.id === parseInt(id))

  useEffect(() => {
    if (!order) {
      fetchMyOrders()
    }
  }, [order, fetchMyOrders])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!comment.trim()) {
      setError('Пожалуйста, напишите отзыв')
      return
    }

    if (!order) {
      setError('Заказ не найден')
      return
    }

    try {
      const reviewData = {
        orderId: order.id,
        accountId: order.accountId,
        ratingValue: rating,
        comment: comment.trim()
      }

      await createReview(reviewData)
      navigate(`${ROUTES.ORDERS}/${order.id}`)
      window.location.reload()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Ошибка при создании отзыва')
    }
  }

  const handleStarClick = (starRating) => {
    setRating(starRating)
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className={`${styles.star} ${index < rating ? styles.filled : ''}`}
        onClick={() => handleStarClick(index + 1)}
      >
        <Star 
          size={32} 
          fill={index < rating ? 'currentColor' : 'none'}
        />
      </button>
    ))
  }

  if (!order) {
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
      className={styles.createReview}
    >
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Оставить отзыв</h1>
          <p className={styles.subtitle}>Поделитесь вашим опытом аренды</p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.orderInfo}
          >
            <div className={styles.orderCard}>
              <img src={import.meta.env.VITE_API_URL + '/img/' + order.account?.img} alt={order.account?.title} />
              <div className={styles.orderDetails}>
                <h3>{order.account?.title}</h3>
                <p>Заказ #{order.id}</p>
                <p>Время аренды: {order.rentPeriod} часов</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className={styles.reviewForm}
          >
            <h2 className={styles.formTitle}>Ваш отзыв</h2>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.ratingSection}>
              <label className={styles.ratingLabel}>Оценка</label>
              <div className={styles.stars}>
                {renderStars()}
              </div>
              <p className={styles.ratingHint}>
                {rating === 5 ? 'Отлично' : 
                 rating === 4 ? 'Хорошо' : 
                 rating === 3 ? 'Нормально' : 
                 rating === 2 ? 'Плохо' : 'Ужасно'}
              </p>
            </div>

            <Input
              label="Комментарий *"
              type="textarea"
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите о вашем опыте аренды..."
              required
            />

            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`${ROUTES.ORDERS}/${order.id}`)}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!comment.trim()}
              >
                Опубликовать отзыв
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  )
})

export default CreateReview