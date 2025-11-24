import { motion } from 'framer-motion'
import { 
  Plus, 
  Users, 
  ShoppingCart, 
  CreditCard,
  Star,
  Settings
} from 'lucide-react'
import styles from './QuickActions.module.css'

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      icon: Plus,
      label: 'Добавить аккаунт',
      description: 'Создать новый игровой аккаунт',
      action: 'add-account',
      color: 'primary'
    },
    {
      icon: Users,
      label: 'Управление пользователями',
      description: 'Просмотр и редактирование пользователей',
      action: 'manage-users',
      color: 'success'
    },
    {
      icon: ShoppingCart,
      label: 'Обработка заказов',
      description: 'Просмотр и подтверждение заказов',
      action: 'process-orders',
      color: 'warning'
    },
    {
      icon: CreditCard,
      label: 'Транзакции',
      description: 'Управление финансовыми операциями',
      action: 'transactions',
      color: 'info'
    },
    {
      icon: Star,
      label: 'Модерация отзывов',
      description: 'Проверка и публикация отзывов',
      action: 'moderate-reviews',
      color: 'secondary'
    },
    {
      icon: Settings,
      label: 'Настройки системы',
      description: 'Общие настройки платформы',
      action: 'system-settings',
      color: 'error'
    }
  ]

  const handleActionClick = (action) => {
    onAction?.(action)
  }

  return (
    <div className={styles.quickActions}>
      <h3 className={styles.title}>Быстрые действия</h3>
      <div className={styles.grid}>
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleActionClick(action.action)}
              className={`${styles.action} ${styles[action.color]}`}
            >
              <div className={styles.icon}>
                <Icon size={24} />
              </div>
              <div className={styles.content}>
                <span className={styles.label}>{action.label}</span>
                <span className={styles.description}>{action.description}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions