import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { accountStore } from '../../../stores/accountStore'
import AccountCard from '../AccountCard/AccountCard'
import Loader from '../../ui/Loader/Loader'
import styles from './AccountGrid.module.css'

const AccountGrid = observer(() => {
  const accounts = toJS(accountStore.accounts)
  const loading = toJS(accountStore.loading)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.accountGridSection}>
      <div className={styles.resultsInfo}>
        <motion.p
          key={accounts.length}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.resultsCount}
        >
          Найдено аккаунтов: <span className={styles.count}>{accounts.length}</span>
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={styles.grid}
      >
        <AnimatePresence mode="popLayout">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <AccountCard account={account} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {accounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.noResults}
          >
            <div className={styles.noResultsContent}>
              <h3 className={styles.noResultsTitle}>Аккаунты не найдены</h3>
              <p className={styles.noResultsText}>
                Попробуйте изменить параметры фильтрации
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default AccountGrid