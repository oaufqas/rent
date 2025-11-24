import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ROUTES } from '../../../utils/constants'
import styles from './Navbar.module.css'
import { useContext, useState, useEffect } from 'react'
import { Context } from '../../../main'
import { Menu, X, Wallet } from 'lucide-react'
import { balanceStore } from '../../../stores/balanceStore'


const Navbar = observer(() => {
  const { store } = useContext(Context)
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuth, user, logout } = store
  const {fetchBalance, balance} = balanceStore

  const navigate = useNavigate()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  useEffect(() => {
    if (isAuth) {
      fetchBalance()
    }
  }, [])

  const handleNavClick = (sectionId) => {
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME)
    }
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })

    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={styles.navbar}
    >
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <div className={styles.logoIcon}>
            <img 
              src="/image2.png"
              className={styles.logoIconImg}
            />
          </div>
          <span className={styles.logoText}>KYCAKA RENT</span>
        </Link>


        <div className={styles.navLinks}>
          <button 
            onClick={() => handleNavClick('main')}
            className={styles.navLink}
          >
            Главная
          </button>
          <button 
            onClick={() => handleNavClick('accounts')}
            className={styles.navLink}
          >
            Аккаунты
          </button>
          <button 
            onClick={() => handleNavClick('info')}
            className={styles.navLink}
          >
            О нас
          </button>
          <button 
            onClick={() => handleNavClick('reviews')}
            className={styles.navLink}
          >
            Отзывы
          </button>
        </div>


        <div className={styles.navActions}>
          {isAuth ? (
            <>
              <Link to={ROUTES.ORDERS} className={styles.profileLink}>
                Заказы
              </Link>
              <Link to={ROUTES.PROFILE} className={styles.profileLink}>
                Профиль
              </Link>
              <div className={styles.balance}>
                <Wallet size={16} className={styles.balanceIcon} />
                <span className={styles.balanceAmount}>{balance || 0} ₽</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Выйти
              </button>

              {user.role === 'admin' && (
                <button 
                    variant="outline-warning" 
                    size="sm"
                    className={styles.adminButton}
                    onClick={() => navigate(ROUTES.ADMIN)}
                >
                    Админ
                </button>
              )}

            </>
          ) : (
            <Link to={ROUTES.LOGIN} className={styles.loginBtn}>
              Войти
            </Link>
          )}
        </div>

        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuContent}>

          <div className={styles.mobileNavLinks}>
            <button 
              onClick={() => handleNavClick('main')}
              className={styles.mobileNavLink}
              >
              Главная
            </button>
            <button 
              onClick={() => handleNavClick('accounts')}
              className={styles.mobileNavLink}
              >
              Аккаунты
            </button>
            <button 
              onClick={() => handleNavClick('info')}
              className={styles.mobileNavLink}
              >
              О нас
            </button>
            <button 
              onClick={() => handleNavClick('reviews')}
              className={styles.mobileNavLink}
              >
              Отзывы
            </button>
          </div>

          {isAuth ? (
            <div className={styles.mobileAuthSection}>
              <Link to={ROUTES.ORDERS} className={styles.mobileProfileLink}>
                Мои заказы
              </Link>
              <Link to={ROUTES.PROFILE} className={styles.mobileProfileLink}>
                Мой профиль
              </Link>
              <div className={styles.mobileBalance}>
                <Wallet size={20} />
                <span>Баланс: {balance || 0} ₽</span>
              </div>
              <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                Выйти
              </button>

              {user.role === 'admin' && (
                <button 
                    variant="outline-warning" 
                    size="sm"
                    className={styles.adminButton}
                    onClick={() => navigate(ROUTES.ADMIN)}
                >
                    Админ
                </button>
              )}
              
            </div>
          ) : (
            <div className={styles.mobileAuthSection}>
              <Link to={ROUTES.LOGIN} className={styles.mobileLoginBtn}>
                Войти в аккаунт
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </motion.nav>
  )
})

export default Navbar