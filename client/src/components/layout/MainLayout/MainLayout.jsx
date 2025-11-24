import { motion } from 'framer-motion'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import styles from './MainLayout.module.css'

const mainVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
}

const MainLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <motion.main
        variants={mainVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={{ duration: 0.5 }}
        className={styles.main}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  )
}

export default MainLayout