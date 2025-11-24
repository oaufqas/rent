import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './StatusBadge.module.css'

const StatusBadge = ({ status, className = '', account }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'free':
        return {
          label: 'Свободен',
          variant: 'success'
        }
      case 'rented':
        return {
          label: `Занят до ${formatToMoscowTime(account.rentExpiresAt)}`, 
          variant: 'warning'
        }
      case 'unavailable':
        return {
          label: 'Недоступен',
          variant: 'error'
        }
      case 'pending':
        return {
          label: 'Ожидание подтверждения',
          variant: 'warning'
        }
      case 'paid':
        return {
          label: 'Оплачен, ожидайте проверки',
          variant: 'warning'
        }
      case 'verified':
        return {
          label: 'Проверка',
          variant: 'warning'
        }
      case 'active':
        return {
          label: 'Аренда активна',
          variant: 'success'
        }
      case 'completed':
        return {
          label: 'Завершён',
          variant: 'success'
        }
      case 'cancelled':
        return {
          label: 'Отменён',
          variant: 'error'
        }
      default:
        return {
          label: 'Неизвестно',
          variant: 'default'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`${styles.badge} ${styles[config.variant]} ${className}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge