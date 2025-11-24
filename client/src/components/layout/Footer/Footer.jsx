import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import styles from './Footer.module.css'

const Footer = () => {
  const navigate = useNavigate()

  const handleNavClick = (sectionId) => {
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME)
    }

    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHelpClick = () => {
    alert('При возникновении каких либо ошибок или багов, тг - @praemanager')
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.logo}>KYCAKA RENT</div>
            <p className={styles.description}>
              Аренда премиальных игровых аккаунтов
            </p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4>Навигация</h4>
              <Link onClick={() => handleNavClick('main')}>Главная</Link>
              <Link onClick={() => handleNavClick('accounts')}>Аккаунты</Link>
              <Link onClick={() => handleNavClick('reviews')}>Отзывы</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <Link to={ROUTES.RULES}>Правила</Link>
              <a onClick={handleHelpClick} style={{cursor: 'pointer'}}>Помощь</a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
        </div>
      </div>
    </footer>
  )
}

export default Footer