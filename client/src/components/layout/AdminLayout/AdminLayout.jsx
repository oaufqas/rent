import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import AdminSidebar from '../../admin/AdminSidebar/AdminSidebar'
import AdminNavbar from '../../admin/AdminNavbar/AdminNavbar'
import styles from './AdminLayout.module.css'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Определяем мобильное устройство при загрузке и изменении размера
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024
      setIsMobile(mobile)
      if (!mobile) {
        setSidebarOpen(false) // Закрываем сайдбар на десктопе
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} isMobile={isMobile} />
      <div className={`${styles.main} ${sidebarOpen && isMobile ? styles.sidebarOpen : ''}`}>
        <AdminNavbar onMenuToggle={toggleSidebar} />
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.content}
          onClick={() => {
            // Закрываем сайдбар при клике на контент на мобильных устройствах
            if (sidebarOpen && isMobile) {
              closeSidebar()
            }
          }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

export default AdminLayout