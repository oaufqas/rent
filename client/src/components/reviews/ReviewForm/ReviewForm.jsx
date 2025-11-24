import { useState } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { Star } from 'lucide-react'
import { reviewStore } from '../../../stores/reviewStore'
import Button from '../../ui/Button/Button'
import Input from '../../ui/Input/Input'
import styles from './ReviewForm.module.css'

const ReviewForm = observer(({ accountId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    rating: 0,
    accountId: accountId
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      setError('Пожалуйста, поставьте оценку')
      return
    }

    if (!formData.title.trim() || !formData.text.trim()) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    setLoading(true)
    setError('')

    try {
      await reviewStore.createReview(formData)
      onSuccess?.()
      setFormData({
        title: '',
        text: '',
        rating: 0,
        accountId: accountId
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отправке отзыва')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const ratingValue = index + 1
      const isFilled = ratingValue <= (hoverRating || formData.rating)
      
      return (
        <motion.button
          key={ratingValue}
          type="button"
          className={`${styles.star} ${isFilled ? styles.filled : ''}`}
          onClick={() => handleRatingClick(ratingValue)}
          onMouseEnter={() => setHoverRating(ratingValue)}
          onMouseLeave={() => setHoverRating(0)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star size={28} fill={isFilled ? "currentColor" : "none"} />
        </motion.button>
      )
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <h3 className={styles.title}>Оставить отзыв</h3>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.error}
        >
          {error}
        </motion.div>
      )}

      <div className={styles.ratingSection}>
        <label className={styles.ratingLabel}>Ваша оценка:</label>
        <div className={styles.stars}>
          {renderStars()}
        </div>
        <span className={styles.ratingValue}>
          {formData.rating > 0 ? `${formData.rating} из 5` : 'Выберите оценку'}
        </span>
      </div>

      <Input
        label="Заголовок отзыва"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Кратко опишите ваше впечатление"
        required
      />

      <div className={styles.textareaGroup}>
        <label className={styles.label}>
          Текст отзыва
          <span className={styles.required}>*</span>
        </label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="Подробно расскажите о вашем опыте использования аккаунта..."
          className={styles.textarea}
          rows={5}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={loading}
        className={styles.submitBtn}
      >
        Отправить отзыв
      </Button>
    </motion.form>
  )
})

export default ReviewForm