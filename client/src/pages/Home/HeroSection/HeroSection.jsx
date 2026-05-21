import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import Button from '../../../components/ui/Button/Button'
import styles from './HeroSection.module.css'

const HeroSection = () => {
    const navigate = useNavigate()
  return (
    <section id='main' className={styles.hero}>
      <div className={styles.background} />
      
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.content}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.title}
          >
            Аренда <span className={styles.accent}>игровых аккаунтов</span>
            <br />с гарантией безопасности
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.subtitle}
          >
            Получите доступ к одним из лучших игровых аккаунтов. 
            Быстрая аренда, полная безопасность и круглосуточная поддержка.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={styles.actions}
          >
            <>
              <Button variant="primary" size="large"
              onClick={() => {
                const element = document.getElementById('accounts');
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              >
                Смотреть аккаунты
              </Button>
            </>
            
            <Button variant="secondary" size="large"
            onClick={() => navigate(ROUTES.RULES)}
            >
              Правила аренды
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className={styles.visual}
        >
          <div className={styles.placeholder}>
              <img 
                src="/image1.png" 
                alt="..."
                className={styles.placeholderImage}
              />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection