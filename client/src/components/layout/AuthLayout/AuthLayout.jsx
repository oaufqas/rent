import { motion } from 'framer-motion'
import styles from './AuthLayout.module.css'
import {ROUTES} from '../../../utils/constants.js'

const authVariants = {
  initial: { 
    opacity: 0,
    scale: 0.9,
    rotateX: 10
  },
  in: { 
    opacity: 1,
    scale: 1,
    rotateX: 0
  },
  out: { 
    opacity: 0,
    scale: 0.9,
    rotateX: -10
  }
}

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>

        
      <motion.div
        variants={authVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className={styles.container}
      >
        <div className={styles.card}>
          <div className={styles.header}>
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={styles.title}
            >
              KYCAKA RENT
            </motion.h1>
          </div>
          <div className={styles.content}>
          <nav className={styles.breadcrumbs}>
            <a href={ROUTES.HOME}>Главная</a>
            <span>/</span>
            <span>Авторизация</span>
          </nav>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthLayout