import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import styles from './DashboardCard.module.css'

const DashboardCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  const isPositive = change >= 0

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`${styles.card} ${styles[color]}`}
    >
      <div className={styles.header}>
        <div className={styles.icon}>
          <Icon size={24} />
        </div>
        <div className={styles.stats}>
          <span className={styles.value}>{value}</span>
          <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
      <h3 className={styles.title}>{title}</h3>
    </motion.div>
  )
}

export default DashboardCard