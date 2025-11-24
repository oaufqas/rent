import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Gamepad2, 
  Star, 
  CreditCard,
  X,
  LucideArrowLeftRight
} from 'lucide-react'
import { ROUTES } from '../../../utils/constants'
import styles from './AdminSidebar.module.css'

const AdminSidebar = ({ isOpen = false, onClose, isMobile = false }) => {
  const location = useLocation()

  const menuItems = [
    {
      path: ROUTES.ADMIN,
      icon: LayoutDashboard,
      label: 'Дашборд'
    },
    {
      path: ROUTES.ADMIN_ORDERS,
      icon: ShoppingCart,
      label: 'Заказы'
    },
    {
      path: ROUTES.ADMIN_USERS,
      icon: Users,
      label: 'Пользователи'
    },
    {
      path: ROUTES.ADMIN_ACCOUNTS,
      icon: Gamepad2,
      label: 'Аккаунты'
    },
    {
      path: ROUTES.ADMIN_REVIEWS,
      icon: Star,
      label: 'Отзывы'
    },
    {
      path: ROUTES.ADMIN_TRANSACTIONS,
      icon: LucideArrowLeftRight,
      label: 'Транзакции'
    },
    {
      path: ROUTES.ADMIN_PAYMETHODS,
      icon: CreditCard,
      label: 'Способы оплаты'
    }
  ]

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ ПРОВЕРКИ АКТИВНОСТИ
  const isActive = (path) => {
    if (path === ROUTES.ADMIN) {
      // Для главной страницы админки проверяем точное совпадение
      return location.pathname === path
    }
    // Для остальных страниц проверяем начало пути
    return location.pathname.startsWith(path)
  }

  const handleLinkClick = () => {
    // Закрываем сайдбар при клике на ссылку на мобильных устройствах
    if (isMobile) {
      onClose()
    }
  }

  // На мобильных устройствах показываем сайдбар только когда isOpen = true
  if (isMobile && !isOpen) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={isMobile ? { x: -300 } : { x: 0 }}
        animate={{ x: 0 }}
        exit={isMobile ? { x: -300 } : { x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`${styles.sidebar} ${isMobile ? styles.mobile : ''} ${isOpen ? styles.open : ''}`}
      >
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          <span className={styles.logoText}>Admin Panel</span>
          {isMobile && (
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`${styles.navItem} ${active ? styles.active : ''}`}
                  onClick={handleLinkClick}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {active && (
                    <motion.div 
                      className={styles.activeIndicator}
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </motion.div>
    </>
  )
}

export default AdminSidebar