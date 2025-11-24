import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { balanceStore } from '../../../stores/balanceStore'
import TransactionCard from '../TransactionCard/TransactionCard'
import Loader from '../../../components/ui/Loader/Loader'
import styles from './TransactionHistory.module.css'

const TransactionHistory = observer(() => {
  const { transactions, loading, fetchTransactions } = balanceStore

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  if (loading && transactions.length === 0) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.transactionHistory}>
      <div className={styles.header}>
        <h2>История транзакций</h2>
        <p>Все операции по вашему балансу</p>
      </div>

      {transactions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.transactionsList}
        >
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TransactionCard transaction={transaction} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>Транзакций пока нет</h3>
            <p className={styles.emptyText}>
              Здесь будут отображаться все операции по пополнению баланса и оплате заказов
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
})

export default TransactionHistory