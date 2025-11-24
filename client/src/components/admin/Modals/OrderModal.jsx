import { motion } from 'framer-motion'
import { Check, X, UserCheck, Eye } from 'lucide-react'
import Button from '../../../components/ui/Button/Button'
import { formatCurrency } from '../../../utils/formatters'
import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './OrderModal.module.css'

const OrderModal = ({ 
  order, 
  onApprove, 
  onReject, 
  onVerifyUser, 
  onComplete,
  onDownloadCheck,
  loading = false 
}) => {
  if (!order) return null

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'info', 
      verified: 'info',
      active: 'success',
      completed: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Ожидание',
      paid: 'Оплачен',
      active: 'Активен',
      verified: 'Проверка пользователя',
      completed: 'Завершен',
      cancelled: 'Отменен'
    }
    return texts[status] || status
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      'balance': 'Баланс',
      'bank_transfer': 'Банковский перевод',
      'crypto': 'Криптовалюта'
    };
    return methods[method] || method;
  };

  const getActionDescription = (status) => {
    const descriptions = {
      'pending': 'Заказ ожидает подтверждения администратором',
      'paid': 'Заказ оплачен, требуется проверка пользователя',
      'verified': 'Пользователь проверен, можно выдавать аккаунт',
      'active': 'Аренда активна, можно принудительно завершить',
      'completed': 'Заказ завершен',
      'cancelled': 'Заказ отменен'
    };
    return descriptions[status] || 'Управление заказом';
  };

  const calculateTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expireDate = new Date(expiresAt);
    const diffMs = expireDate - now;
    
    if (diffMs <= 0) return 'Время истекло';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}ч ${minutes}м`;
  };

  const getActions = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <>
            <Button
              className={styles.approveBtn}
              size="small"
              onClick={() => onApprove(order.id)}
              loading={loading}
            >
              <Check size={14} />
              Принять
            </Button>
            <Button
              className={styles.rejectBtn}
              size="small"
              onClick={() => onReject(order.id)}
              loading={loading}
            >
              <X size={14} />
              Отклонить
            </Button>
          </>
        )
      case 'paid':
        return (
          <Button
            className={styles.verifyBtn}
            size="small"
            onClick={() => onVerifyUser(order.id)}
            loading={loading}
          >
            <UserCheck size={14} />
            Проверить пользователя
          </Button>
        )
      case 'verified':
        return (
          <>
            <Button
              className={styles.completeBtn}
              size="small"
              onClick={() => onComplete(order.id)}
              loading={loading}
            >
              <Check size={14} />
              Выдать аккаунт
            </Button>
          
            <Button
              className={styles.rejectBtn}
              size="small"
              onClick={() => onReject(order.id)}
              loading={loading}
            >
              <X size={14} />
              Отклонить
            </Button>
          </>
        )
      case 'active':
        return (
          <Button
            className={styles.rejectBtn}
            size="small"
            onClick={() => onReject(order.id)}
            loading={loading}
          >
            Принудительно завершить аренду
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.orderDetails}>
      <div className={styles.detailsGrid}>
        <div className={styles.column}>
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Основная информация</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>ID заказа:</span>
              <span className={styles.detailValue}>#{order.id}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Статус:</span>
              <span className={`${styles.statusBadge} ${styles[getStatusColor(order.status)]}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Стоимость:</span>
              <span className={`${styles.detailValue} ${styles.amount}`}>
                {formatCurrency(order.amount)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Период аренды:</span>
              <span className={styles.detailValue}>{order.rentPeriod} часов</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Номер аккаунта:</span>
              <span className={styles.detailValue}>
                {order.accountId ? `#${order.account?.account_number}` : 'Не назначен'}
              </span>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Информация о пользователе</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Пользователь:</span>
              <span className={styles.detailValue}>{order.user?.email || 'Неизвестно'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>ID пользователя:</span>
              <span className={styles.detailValue}>#{order.userId}</span>
            </div>
            {order.userNameInPlatform && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Имя в платформе:</span>
                <span className={styles.detailValue}>{order.userNameInPlatform}</span>
              </div>
            )}
            {order.verificationPlatform && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Платформа верификации:</span>
                <span className={styles.detailValue}>
                  {order.verificationPlatform}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Временные метки</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Создан:</span>
              <span className={styles.detailValue}>{formatToMoscowTime(order.createdAt)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Обновлен:</span>
              <span className={styles.detailValue}>
                {order.updatedAt ? formatToMoscowTime(order.updatedAt) : '—'}
              </span>
            </div>
            {order.startsAt && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Начало аренды:</span>
                <span className={styles.detailValue}>{formatToMoscowTime(order.startsAt)}</span>
              </div>
            )}
            {order.expiresAt && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Окончание аренды:</span>
                <span className={styles.detailValue}>{formatToMoscowTime(order.expiresAt)}</span>
              </div>
            )}
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Платежная информация</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Метод оплаты:</span>
              <span className={styles.detailValue}>
                {getPaymentMethodText(order.paymentMethod)}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>ID транзакции:</span>
              <span className={styles.detailValue}>
                {order.transactionId ? `#${order.transactionId}` : '—'}
              </span>
            </div>
          </div>

          {order.check && (
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Чек об оплате</h3>
            {order.check ? (
              <div className={styles.checkSection}>
                <div className={styles.checkInfo}>
                  <div className={styles.checkDetails}>
                    <span className={styles.checkName}>{order.check}</span>
                    <span className={styles.checkHint}>Файл подтверждения оплаты</span>
                  </div>
                </div>
                <div className={styles.checkActions}>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => onDownloadCheck(order.check)}
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

      <div className={styles.actionSection}>
        <div className={styles.actionHeader}>
          <h3 className={styles.sectionTitle}>Управление заказом</h3>
          <p className={styles.actionSubtitle}>
            {getActionDescription(order.status)}
          </p>
        </div>
        
        <div className={styles.modalActions}>
          {getActions(order)}
        </div>
      </div>

      {order.status === 'active' && order.expiresAt && (
        <div className={styles.infoSection}>
          <div className={styles.infoHeader}>
            <h3 className={styles.sectionTitle}>Текущая аренда</h3>
          </div>
          <div className={styles.rentalInfo}>
            <div className={styles.rentalItem}>
              <span className={styles.rentalLabel}>Осталось времени:</span>
              <span className={styles.rentalValue}>
                {calculateTimeRemaining(order.expiresAt)}
              </span>
            </div>
            <div className={styles.rentalItem}>
              <span className={styles.rentalLabel}>Автоматическое завершение:</span>
              <span className={styles.rentalValue}>
                {formatToMoscowTime(order.expiresAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderModal