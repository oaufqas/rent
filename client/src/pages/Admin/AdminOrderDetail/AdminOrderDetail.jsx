import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { adminStore } from '../../../stores/adminStore'
import OrderDetail from '../../../components/admin/OrderDetail/OrderDetail'
import styles from './AdminOrderDetail.module.css'
import { useEffect, useState } from 'react'

const AdminOrderDetail = observer(() => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchFindOrder, findOrder } = adminStore

  useEffect(() => {
    fetchFindOrder(id)
  }, [fetchFindOrder])

  const [actionLoading, setActionLoading] = useState(false)

  const handleAction = async (action) => {
    setActionLoading(true)
    try {
      await action(id)
      await fetchFindOrder(id)
    } catch (error) {
      alert('Произошла ошибка')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownloadCheck = async (checkFilename) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/checks/${checkFilename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = checkFilename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Ошибка при скачивании чека');
      }
    } catch (error) {
      console.error('Error downloading check:', error);
      alert('Ошибка при скачивании чека');
    }
  }

  if (!findOrder) {
    return (
      <div className={styles.errorContainer}>
        <h2>Заказ не найден</h2>
        <p>Заказ с ID #{id} не найден в текущем списке</p>
        <button 
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          Вернуться
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.orderDetailPage}
    >
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
          disabled={actionLoading}
        >
          <ArrowLeft size={20} />
          Назад
        </button>
        
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Заказ #{findOrder.id}</h1>
          <p className={styles.subtitle}>Детальная информация о заказе</p>
        </div>
      </div>

      <OrderDetail
        order={findOrder}
        onApprove={() => handleAction(adminStore.approveOrder)}
        onReject={() => handleAction(adminStore.rejectOrder)}
        onVerifyUser={() => handleAction(adminStore.verifyUser)}
        onComplete={() => handleAction(adminStore.completeOrder)}
        onDownloadCheck={handleDownloadCheck}
        loading={actionLoading}
      />
    </motion.div>
  )
})

export default AdminOrderDetail