import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ROUTES } from '../../../utils/constants'
import Button from '../../../components/ui/Button/Button'
import Modal from '../../../components/ui/Modal/Modal'
import EditProfile from '../EditProfile/EditProfile'
import TransactionHistory from '../TransactionHistory/TransactionHistory'
import MyReviews from '../MyReviews/MyReviews'
import styles from './UserProfile.module.css'
import { reviewStore } from '../../../stores/reviewStore'
import { orderStore } from '../../../stores/orderStore'
import { store } from '../../../stores/store'

const UserProfile = observer(() => {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [activeTab, setActiveTab] = useState('profile')
  const [showEditModal, setShowEditModal] = useState(false)
  const { fetchMyReviews } = reviewStore
  const { fetchMyOrders,} = orderStore

  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalReviews: 0
  })

  useEffect(() => {
    const loadUserData = async () => {
      const ordersData = await fetchMyOrders()
      const activeOrdersData = await ordersData.filter(order => ['pending', 'paid', 'verified', 'active'].includes(order.status))
      const reviewsData = await fetchMyReviews()
      
      setStats({totalOrders: ordersData.length, activeOrders: activeOrdersData.length, totalReviews: reviewsData.length})
    } 
    
    const getUsr = async() => {
      setUser(await store.getOneUser())
    }


    getUsr()
    loadUserData()
    window.scrollTo(0, 0)
  
  }, [fetchMyReviews, fetchMyOrders])


  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.userProfile}
    >
      <div className={styles.container}>

        <nav className={styles.breadcrumbs}>
          <a href={ROUTES.HOME}>Главная</a>
          <span>/</span>
          <span>Профиль</span>
        </nav>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Профиль</h1>
        </motion.div>

        <div className={styles.content}>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.sidebar}
          >
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {user?.userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.username}>
                  {user?.userName || 'Пользователь'}
                  {user?.userName === 'user' && (
                    <span className={styles.defaultBadge}>можно сменить</span>
                  )}
                </h3>
                <p className={styles.email}>{user?.email}</p>
                <p className={styles.joinDate}>
                  Участник с {formatDate(user?.createdAt || new Date())}
                </p>
              </div>
            </div>

            <nav className={styles.nav}>
              <button
                className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Профиль
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'transactions' ? styles.active : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                Транзакции
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'reviews' ? styles.active : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Мои отзывы
              </button>
              <button
                className={styles.navItem}
                onClick={() => navigate(ROUTES.ORDERS)}
              >
                Мои заказы
              </button>
            </nav>

            <div className={styles.actions}>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setShowEditModal(true)}
              >
                Редактировать профиль
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.mainContent}
          >
            {activeTab === 'profile' && (
              <div className={styles.tabContent}>
                <h2>Общая информация</h2>
                

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.balanceSection}
                >
                  <div className={styles.balanceHeader}>
                    <h3 className={styles.balanceTitle}>Баланс</h3>
                    <div className={styles.balanceAmount}>
                      {user?.balance || 0} ₽
                    </div>
                  </div>
                  <p className={styles.balanceDescription}>
                    Доступные средства для аренды аккаунтов
                  </p>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => navigate(ROUTES.BALANCE)}
                    className={styles.topUpButton}
                  >
                    Пополнить баланс
                  </Button>
                </motion.div>
                
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.totalOrders}</span>
                    <span className={styles.statLabel}>Всего заказов</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.activeOrders}</span>
                    <span className={styles.statLabel}>Активные заказы</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.totalReviews}</span>
                    <span className={styles.statLabel}>Отзывов</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className={styles.tabContent}>
                <TransactionHistory />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.tabContent}>
                  <MyReviews/>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Редактирование профиля"
      >
        <EditProfile onClose={() => setShowEditModal(false)} />
      </Modal>
    </motion.div>
  )
})

export default UserProfile