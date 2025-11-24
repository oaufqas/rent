import { motion } from 'framer-motion'
import { Check, X, Eye } from 'lucide-react'
import Button from '../../../components/ui/Button/Button'
import { formatCurrency } from '../../../utils/formatters'
import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './TransactionModal.module.css'

const TransactionModal = ({ 
  transaction, 
  onClose, 
  onApprove, 
  onReject,
  onDownloadCheck,
  onViewCheck,
  loading = false 
}) => {
  if (!transaction) return null

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      completed: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Ожидание',
      completed: 'Завершено',
      cancelled: 'Отменено'
    }
    return texts[status] || status
  }

  const getTypeText = (type) => {
    return type === 'deposit' ? 'Пополнение баланса' : 'Оплата аренды'
  }

  const getMethodText = (method) => {
    const methods = {
      balance: 'Баланс',
      bank_transfer: 'Банковский перевод',
      crypto: 'Криптовалюта',
    }
    return methods[method] || method
  }

  return (
    <div className={styles.transactionDetails}>
      <div className={styles.detailsGrid}>
        <div className={styles.column}>
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Основная информация</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>ID транзакции:</span>
              <span className={styles.detailValue}>#{transaction.id}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Тип операции:</span>
              <span className={styles.detailValue}>
                {getTypeText(transaction.type)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Сумма:</span>
              <span className={styles.detailValue}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Статус:</span>
              <span className={`${styles.statusBadge} ${styles[getStatusColor(transaction.status)]}`}>
                {getStatusText(transaction.status)}
              </span>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Детали операции</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Метод оплаты:</span>
              <span className={styles.detailValue}>{getMethodText(transaction.method)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>ID заказа:</span>
              <span className={styles.detailValue}>
                {transaction.orderId ? `#${transaction.orderId}` : '—'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Описание:</span>
              <span className={styles.detailValue}>{transaction.description}</span>
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Временные метки</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Создано:</span>
              <span className={styles.detailValue}>{formatToMoscowTime(transaction.createdAt)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Обновлено:</span>
              <span className={styles.detailValue}>
                {transaction.updatedAt ? formatToMoscowTime(transaction.updatedAt) : '—'}
              </span>
            </div>
          </div>

          {transaction.type === 'deposit' && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Чек об оплате</h3>
              {transaction.check ? (
                <div className={styles.checkSection}>
                  <div className={styles.checkInfo}>
                    <div className={styles.checkDetails}>
                      <span className={styles.checkName}>{transaction.check}</span>
                      <span className={styles.checkHint}>Файл подтверждения оплаты</span>
                    </div>
                  </div>
                  <div className={styles.checkActions}>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onViewCheck(transaction.check)}
                    >
                      <Eye size={16} />
                      Скачать чек
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={styles.noCheck}>
                  <div className={styles.noCheckText}>
                    <span className={styles.noCheckTitle}>Чек не предоставлен</span>
                    <span className={styles.noCheckHint}>Пользователь не прикрепил чек об оплате</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {transaction.status === 'pending' && transaction.type === 'deposit' && (
        <div className={styles.actionSection}>
          <div className={styles.actionHeader}>
            <h3 className={styles.sectionTitle}>Подтверждение операции</h3>
            <p className={styles.actionSubtitle}>
              Проверьте чек и подтвердите или отклоните пополнение баланса
            </p>
          </div>
          <div className={styles.modalActions}>
            <Button
              variant="success"
              onClick={() => onApprove(transaction.id)}
              className={styles.approveBtn}
              loading={loading}
            >
              <Check size={16} />
              Подтвердить пополнение
            </Button>
            <Button
              variant="error"
              onClick={() => onReject(transaction.id)}
              className={styles.rejectBtn}
              loading={loading}
            >
              <X size={16} />
              Отклонить
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionModal