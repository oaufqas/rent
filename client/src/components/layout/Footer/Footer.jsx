import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import styles from './Footer.module.css'

const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (sectionId) => {
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME, { 
        state: { scrollTo: sectionId }
      })
      return
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }

  const handleHelpClick = () => {
    alert('При возникновении каких либо ошибок или багов, тг - @praemanager')
  }

  const handleLinkClick = (e, path) => {
    e.preventDefault()
    navigate(path)
  }

  const handleTelegramClick = () => {
    window.open('https://t.me/praetoriane', '_blank')
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>

          <div className={styles.brandColumn}>
            <div className={styles.brand}>
              <div className={styles.logo}>KYCAKA RENT</div>
              <p className={styles.description}>
                Аренда премиальных игровых аккаунтов
              </p>
            </div>
          </div>

          <div className={styles.linksColumn}>
            <div className={styles.linksGrid}>

              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Навигация</h4>
                <button 
                  className={styles.navLink}
                  onClick={() => handleNavClick('main')}
                >
                  Главная
                </button>
                <button 
                  className={styles.navLink}
                  onClick={() => handleNavClick('accounts')}
                >
                  Аккаунты
                </button>
                <button 
                  className={styles.navLink}
                  onClick={() => handleNavClick('reviews')}
                >
                  Отзывы
                </button>
              </div>

              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Информация</h4>
                <Link 
                  to={ROUTES.RULES} 
                  className={styles.link}
                  onClick={(e) => handleLinkClick(e, ROUTES.RULES)}
                >
                  Правила аренды
                </Link>
                <button 
                  className={styles.navLink}
                  onClick={handleHelpClick}
                >
                  Помощь
                </button>
              </div>

              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Поддержка</h4>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Telegram:</span>
                  <span className={styles.contactValue}>@praemanager</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email:</span>
                  <span className={styles.contactValue}>noreply@kycaka.com</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Время работы:</span>
                  <span className={styles.contactValue}>10:00-00:00</span>
                </div>
              </div>

              <div className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>Мы в соцсетях</h4>
                <button 
                  className={styles.navLink}
                  onClick={handleTelegramClick}
                >
                  Telegram канал
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} KYCAKA RENT. Все права защищены.
          </div>
          <div className={styles.legal}>
            <span>Используя наш сервис, вы соглашаетесь с нашими </span>
            <Link 
              to={ROUTES.RULES} 
              className={styles.legalLink}
              onClick={(e) => handleLinkClick(e, ROUTES.RULES)}
            >
              условиями использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer