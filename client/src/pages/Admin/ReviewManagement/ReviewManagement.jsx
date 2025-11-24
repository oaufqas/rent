import { motion } from 'framer-motion'
import { Search, Filter, Check, X, Eye } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import Button from '../../../components/ui/Button/Button'
import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './ReviewManagement.module.css'

const ReviewManagement = observer(() => {
  const { 
    reviews, 
    loading, 
    fetchReviews, 
    approveReview, 
    rejectReview 
  } = adminStore

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])
  
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    return matchesStatus && matchesSearch
  })

  const handleApprove = async (reviewId) => {
    try {
      await approveReview(reviewId)
      window.location.reload()
    } catch (error) {
      alert('Ошибка при одобрении отзыва')
    }
  }

  const handleReject = async (reviewId) => {
    // const reason = prompt('Причина отклонения:')
    // if (reason) {
    try {
      await rejectReview(reviewId)
      window.location.reload()
    } catch (error) {
      alert('Ошибка при отклонении отзыва')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error'
    }
    return colors[status] || 'secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'На модерации',
      approved: 'Одобрен',
      rejected: 'Отклонен'
    }
    return texts[status] || status
  }
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.reviewManagement}
    >
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Модерация отзывов</h1>
          <p className={styles.subtitle}>Проверка и публикация отзывов пользователей</p>
        </div>
      </div>


      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Поиск отзывов..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="pending">На модерации</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклоненные</option>
            <option value="all">Все</option>
          </select>
        </div>
      </div>

      <div className={styles.reviewsList}>
        {loading ? (
          <div className={styles.loading}>Загрузка отзывов...</div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.reviewCard}
            >
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {review.user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className={styles.username}>{review.user?.email || 'Пользователь'}</div>
                    <div className={styles.account}>{`Аккаунт #${review.accountId}` || 'Аккаунт удален'}</div>
                  </div>
                </div>
                <div className={styles.rating}>
                  {'★'.repeat(review.ratingValue)}{'☆'.repeat(5 - review.ratingValue)}
                </div>
              </div>

              <div className={styles.reviewContent}>
                <p className={styles.reviewText}>{review.comment || 'Без комментария'}</p>
              </div>

              <div className={styles.reviewFooter}>
                <div className={styles.reviewMeta}>
                  <span className={`${styles.status} ${styles[getStatusColor(review.status)]}`}>
                    {getStatusText(review.status)}
                  </span>
                  <span className={styles.date}>{formatToMoscowTime(review.createdAt)}</span>
                </div>

                <div className={styles.actions}>
                  {review.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => handleApprove(review.id)}
                      >
                        <Check size={16} />
                        Одобрить
                      </Button>
                      <Button
                        variant="error"
                        size="small"
                        onClick={() => handleReject(review.id)}
                      >
                        <X size={16} />
                        Отклонить
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {filteredReviews.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <span className={styles.emptyIcon}>⭐</span>
            <h3 className={styles.emptyTitle}>
              {searchTerm || statusFilter !== 'pending' ? 'Отзывы не найдены' : 'Нет отзывов для модерации'}
            </h3>
            <p className={styles.emptyText}>
              {searchTerm || statusFilter !== 'pending' 
                ? 'Попробуйте изменить параметры поиска' 
                : 'Все новые отзывы будут появляться здесь'
              }
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default ReviewManagement