import { motion } from 'framer-motion'
import { Search, Filter, Download, Check, X, Eye } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import Button from '../../../components/ui/Button/Button'
import Modal from '../../../components/ui/Modal/Modal'
import TransactionModal from '../../../components/admin/Modals/TransactionModal'
import { formatCurrency } from '../../../utils/formatters'
import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './TransactionManagement.module.css'

const TransactionManagement = observer(() => {
  const { 
    transactions, 
    loading, 
    fetchTransactions, 
    approveTransaction, 
    rejectTransaction 
  } = adminStore
  
  const [typeFilter, setTypeFilter] = useState('deposit')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id?.toString().includes(searchTerm) ||
                         transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter

    return matchesType && matchesStatus && matchesSearch
  })

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      completed: 'success',
      cancelled: 'error',
      rejected: 'error'
    }
    return colors[status] || 'secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Ожидание',
      completed: 'Завершено',
      cancelled: 'Отменено',
      rejected: 'Отклонено'
    }
    return texts[status] || status
  }

  const getTypeText = (type) => {
    return type === 'deposit' ? 'Пополнение баланса' : 'Оплата аренды'
  }

  const getMethodText = (method) => {
    const methods = {
      balance: 'Баланс',
      bank_transfer: 'Банковский перевод',
      crypto: 'Криптовалюта',
    }
    return methods[method] || method
  }

  const handleApprove = async (transactionId) => {
    setModalLoading(true)
    try {
      await approveTransaction(transactionId)
      setShowDetailsModal(false)
      await fetchTransactions()
    } catch (error) {
      alert('Ошибка при подтверждении транзакции')
    } finally {
      setModalLoading(false)
    }
  }

  const handleReject = async (transactionId) => {
    const reason = prompt('Причина отклонения:')
    if (reason) {
      setModalLoading(true)
      try {
        await rejectTransaction(transactionId, reason)
        setShowDetailsModal(false)
        await fetchTransactions()
      } catch (error) {
        alert('Ошибка при отклонении транзакции')
      } finally {
        setModalLoading(false)
      }
    }
  }

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
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
  };

  const handleExport = () => {
    const headers = ['ID', 'Пользователь', 'Тип', 'Сумма', 'Статус', 'Метод', 'Дата']
    const csvData = filteredTransactions.map(t => [
      t.id,
      t.User?.email,
      getTypeText(t.type),
      t.amount,
      getStatusText(t.status),
      getMethodText(t.method),
      formatToMoscowTime(t.createdAt)
    ])
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = {
    totalVolume: filteredTransactions.reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : 0), 0),
    totalTransactions: filteredTransactions.length,
    pendingCount: filteredTransactions.filter(t => t.status === 'pending').length,
    successRate: filteredTransactions.length > 0 ? 
      (filteredTransactions.filter(t => t.status === 'completed').length / filteredTransactions.length * 100).toFixed(1) : 0
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.transactionManagement}
    >
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Управление балансом пользователей</h1>
          <p className={styles.subtitle}>Просмотр и управление финансовыми операциями</p>
        </div>
        <Button variant="primary" onClick={handleExport}>
          <Download size={16} />
          Экспорт
        </Button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatCurrency(stats.totalVolume)}</div>
          <div className={styles.statLabel}>Общий объем</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalTransactions}</div>
          <div className={styles.statLabel}>Всего транзакций</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.pendingCount}</div>
          <div className={styles.statLabel}>Ожидают проверки</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.successRate}%</div>
          <div className={styles.statLabel}>Успешных операций</div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Поиск транзакций..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <select 
              className={styles.filterSelect}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Все типы транзакций</option>
              <option value="deposit">Пополнение баланса</option>
              <option value="payment">Оплата аренды</option>
            </select>
            
            <select 
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидание</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Загрузка транзакций...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID транзакции</th>
                <th>Пользователь</th>
                <th>Тип</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.tableRow}
                >
                  <td className={styles.transactionId}>#{transaction.id}</td>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {transaction.user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span>{transaction.user?.email || 'Пользователь удален'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.type} ${styles.primary}`}>
                      {getTypeText(transaction.type)}
                    </span>
                  </td>
                  <td className={`${styles.amount} ${styles.primary}`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[getStatusColor(transaction.status)]}`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                  <td className={styles.date}>{formatToMoscowTime(transaction.createdAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className={styles.actionBtn}
                        title="Просмотр"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {transaction.status === 'pending' && transaction.type === 'deposit' && (
                        <>
                          <button
                            onClick={() => handleApprove(transaction.id)}
                            className={styles.actionBtn}
                            title="Подтвердить"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(transaction.id)}
                            className={`${styles.actionBtn} ${styles.reject}`}
                            title="Отклонить"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.mobileTransactions}>
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.mobileTransactionCard}
          >
            <div className={styles.mobileTransactionHeader}>
              <div className={styles.mobileTransactionId}>#{transaction.id}</div>
              <span className={`${styles.mobileStatus} ${styles[getStatusColor(transaction.status)]}`}>
                {getStatusText(transaction.status)}
              </span>
            </div>
            
            <div className={styles.mobileUserInfo}>
              <div className={styles.mobileAvatar}>
                {transaction.user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className={styles.mobileUserEmail}>{transaction.user?.email || 'Пользователь удален'}</span>
            </div>
            
            <div className={styles.mobileTransactionInfo}>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Тип:</span>
                <span className={`${styles.mobileType} ${styles.primary}`}>
                  {getTypeText(transaction.type)}
                </span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Сумма:</span>
                <span className={`${styles.mobileAmount} ${styles.primary}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Дата:</span>
                <span className={styles.mobileInfoValue}>{formatToMoscowTime(transaction.createdAt)}</span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Метод:</span>
                <span className={styles.mobileInfoValue}>{getMethodText(transaction.method)}</span>
              </div>
            </div>
            
            <div className={styles.mobileActions}>
              <button
                onClick={() => handleViewDetails(transaction)}
                className={styles.actionBtn}
                title="Просмотр"
              >
                <Eye size={16} />
                Детали
              </button>
              
              {transaction.status === 'pending' && transaction.type === 'deposit' && (
                <>
                  <button
                    onClick={() => handleApprove(transaction.id)}
                    className={styles.actionBtn}
                    title="Подтвердить"
                  >
                    <Check size={16} />
                    Подтвердить
                  </button>
                  <button
                    onClick={() => handleReject(transaction.id)}
                    className={`${styles.actionBtn} ${styles.reject}`}
                    title="Отклонить"
                  >
                    <X size={16} />
                    Отклонить
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>


      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Транзакция #${selectedTransaction?.id}`}
        size="large"
      >
        <TransactionModal
          transaction={selectedTransaction}
          onApprove={handleApprove}
          onReject={handleReject}
          onDownloadCheck={handleDownloadCheck}
          loading={modalLoading}
        />
      </Modal>

      {filteredTransactions.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>Транзакции не найдены</h3>
            <p className={styles.emptyText}>
              Попробуйте изменить параметры фильтрации
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default TransactionManagement