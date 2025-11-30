import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import TransactionDetail from '../../../components/admin/TransactionDetail/TransactionDetail'
import styles from './AdminTransactionDetail.module.css'

const AdminTransactionDetail = observer(() => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchFindTransaction, findTransaction } = adminStore

  useEffect(() => {
    if (id) {
      fetchFindTransaction(id)
    }
  }, [id, fetchFindTransaction])

  const [actionLoading, setActionLoading] = useState(false)

  const handleAction = async (action) => {
    setActionLoading(true)
    try {
      await action(id)
      await fetchFindTransaction(id)
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

  if (!findTransaction) {
    return (
      <div className={styles.errorContainer}>
        <h2>Транзакция не найдена</h2>
        <p>Транзакция с ID #{id} не найдена в текущем списке</p>
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
      className={styles.transactionDetailPage}
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
          <h1 className={styles.title}>Транзакция #{findTransaction.id}</h1>
          <p className={styles.subtitle}>Детальная информация о транзакции</p>
        </div>
      </div>

      <TransactionDetail
        transaction={findTransaction}
        onApprove={() => handleAction(adminStore.approveTransaction)}
        onReject={() => handleAction(adminStore.rejectTransaction)}
        onDownloadCheck={handleDownloadCheck}
        loading={actionLoading}
      />
    </motion.div>
  )
})

export default AdminTransactionDetail