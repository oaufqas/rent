import { motion } from 'framer-motion'
import styles from './Loader.module.css'

const Loader = ({ fullScreen = false }) => {
  const loaderContent = (
    <div className={styles.loader}>
      <motion.div
        className={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className={styles.text}>Загрузка...</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        {loaderContent}
      </div>
    )
  }

  return loaderContent
}

export default Loader