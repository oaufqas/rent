import { motion } from 'framer-motion'
import { Bell, Search, User, LogOut, Menu, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ROUTES } from '../../../utils/constants'
import styles from './AdminNavbar.module.css'

const AdminNavbar = observer(({ onMenuToggle }) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={styles.navbar}
    >
      <div className={styles.navbarContent}>

        <div className={styles.left}>
          <button className={styles.menuToggle} onClick={onMenuToggle}>
            <Menu size={20} />
          </button>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>A</div>
            <span className={styles.logoText}>Admin Panel</span>
          </div>
        </div>


        <div className={styles.center}>
          <div className={styles.search}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск..."
              className={styles.searchInput}
            />
          </div>
        </div>


        <div className={styles.right}>
          <Link to={ROUTES.HOME} className={styles.homeBtn} title="На сайт">
            <Home size={20} />
          </Link>
        </div>
      </div>
    </motion.nav>
  )
})

export default AdminNavbar