import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Plus, History, Download } from 'lucide-react'
import { balanceStore } from '../../../stores/balanceStore'
import Button from '../../../components/ui/Button/Button'
import Modal from '../../../components/ui/Modal/Modal'
import Loader from '../../../components/ui/Loader/Loader'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import styles from './BalancePage.module.css'
import TransactionCard from '../../Profile/TransactionCard/TransactionCard'
import {ROUTES} from '../../../utils/constants.js'

const BalancePage = observer(() => {
  const { balance, loading, fetchBalance, createDeposit, payMethods, fetchPayMethods, transactions, fetchTransactions } = balanceStore
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [check, setCheck] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBalance()
    fetchPayMethods()
    fetchTransactions()
  }, [fetchBalance, fetchPayMethods, fetchTransactions])

  const handleDeposit = async () => {
    setError('')

    if (!depositAmount || isNaN(depositAmount) || depositAmount < 100) {
      setError('Минимальная сумма пополнения - 100 ₽')
      return
    }

    if (!selectedMethod) {
      setError('Выберите способ оплаты')
      return
    }

    // Для банковского перевода и крипты нужен чек
    const selectedMethodData = payMethods.find(method => method.id === selectedMethod)
    if (selectedMethodData && selectedMethodData.type !== 'card' && !check) {
      setError('Необходимо загрузить чек об оплате')
      return
    }

    try {
      const depositData = {
        amount: parseInt(depositAmount),
        method: payMethods?.find(item => item.id == selectedMethod).type
      }

      await createDeposit(depositData, check)
      setShowDepositModal(false)
      setDepositAmount('')
      setSelectedMethod('')
      setCheck(null)
      fetchBalance()
      fetchTransactions()
      
    } catch (error) {
      console.error('Deposit error:', error)
      setError(error.response?.data?.message || 'Ошибка при создании заявки на пополнение')
    }
  }

  const handleFileChange = (file) => {
    setCheck(file)
    setError('')
  }

  const quickAmounts = [100, 500, 1000, 2000, 5000]

  const isFormValid = depositAmount && 
                     parseInt(depositAmount) >= 100 && 
                     selectedMethod &&
                     (payMethods.find(method => method.id === selectedMethod)?.type === 'card' ? true : check)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.balancePage}
    >
      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <a href={ROUTES.HOME}>Главная</a>
          <span>/</span>
          <a href={ROUTES.PROFILE}>Профиль</a>
          <span>/</span>
          <span>Пополнение баланса</span>
        </nav>

        <div className={styles.header}>
          <h1 className={styles.title}>Баланс</h1>
          <p className={styles.subtitle}>Управление вашими финансами</p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <Loader />
          </div>
        ) : (
          <>
            <div className={styles.balanceCard}>
              <div className={styles.balanceInfo}>
                <div className={styles.balanceAmount}>
                  <span className={styles.amount}>{balance} ₽</span>
                  <span className={styles.label}>Текущий баланс</span>
                </div>
                <div className={styles.balanceActions}>
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => setShowDepositModal(true)}
                  >
                    <Plus size={20} />
                    Пополнить
                  </Button>
                </div>
              </div>
            </div>

            {/* Быстрое пополнение */}
            <div className={styles.quickDeposit}>
              <h3 className={styles.sectionTitle}>Быстрое пополнение</h3>
              <div className={styles.quickAmounts}>
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    className={styles.quickAmount}
                    onClick={() => {
                      setDepositAmount(amount.toString())
                      setShowDepositModal(true)
                    }}
                  >
                    {amount} ₽
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.recentTransactions}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Последние операции</h3>
              </div>
                {transactions.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.transactionsList}
                  >
                    {transactions
                    .filter(tr => tr.type === 'deposit')
                    .map((transaction, index) => (
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
                        <div className={styles.transactionsList}>
                          <div className={styles.emptyTransactions}>
                            <h4>Операций пока нет</h4>
                            <p>Здесь будут отображаться ваши финансовые операции</p>
                          </div>
                        </div>
                  </motion.div>
                )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false)
          setDepositAmount('')
          setSelectedMethod('')
          setCheck(null)
          setError('')
        }}
        title="Пополнение баланса"
        size="medium"
      >
        <div className={styles.depositModal}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.amountSection}>
            <label className={styles.amountLabel}>Сумма пополнения</label>
            <div className={styles.amountInput}>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => {
                  setDepositAmount(e.target.value)
                  setError('')
                }}
                placeholder="Введите сумму"
                min="100"
                className={styles.input}
              />
              <span className={styles.currency}>₽</span>
            </div>
            <p className={styles.amountHint}>Минимальная сумма: 100 ₽</p>
          </div>

          <div className={styles.methodsSection}>
            <label className={styles.methodsLabel}>Способ оплаты</label>
            <div className={styles.paymentMethods}>
              {payMethods.map(method => (
                <label
                  key={method.id}
                  className={`${styles.method} ${
                    selectedMethod === method.id ? styles.selected : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => {
                      setSelectedMethod(method.id)
                      setError('')
                    }}
                    className={styles.radio}
                  />
                  <div className={styles.methodInfo}>
                    <span className={styles.methodName}>{method.name}</span>
                    <span className={styles.methodDescription}>{method.details}</span>
                  </div>
                  <span className={styles.methodType}>{method.type === 'bank_transfer' ? 'Банковский перевод' : 'Криптовалюта'}</span>
                </label>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedMethod && payMethods.find(method => method.id === selectedMethod)?.type !== 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.checkUpload}
              >
                <FileUpload
                  label="Чек об оплате *"
                  accept="image/*,.pdf"
                  onFileChange={handleFileChange}
                  required
                />
                <p className={styles.uploadHint}>
                  Загрузите скриншот или фото чека об оплате
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.depositSummary}>
            <div className={styles.summaryRow}>
              <span>Сумма:</span>
              <span>{depositAmount || 0} ₽</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Комиссия:</span>
              <span>0 ₽</span>
            </div>
            <div className={styles.summaryRow}>
              <span>К зачислению:</span>
              <span className={styles.finalAmount}>{depositAmount || 0} ₽</span>
            </div>
          </div>

          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDepositModal(false)
                setDepositAmount('')
                setSelectedMethod('')
                setCheck(null)
                setError('')
              }}
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleDeposit}
              disabled={!isFormValid}
            >
              Создать заявку
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
})

export default BalancePage