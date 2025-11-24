import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { accountStore } from '../../../stores/accountStore'
import { balanceStore } from '../../../stores/balanceStore'
import { orderStore } from '../../../stores/orderStore'
import { generatePath, ROUTES } from '../../../utils/constants'
import StatusBadge from '../../../components/ui/StatusBadge/StatusBadge'
import Button from '../../../components/ui/Button/Button'
import Input from '../../../components/ui/Input/Input'
import PriceCalculator from '../../../components/ui/PriceCalculator/PriceCalculator'
import OrderTimeline from '../../../components/orders/OrderTimeline/OrderTimeline'
import Loader from '../../../components/ui/Loader/Loader'
import styles from './CreateOrder.module.css'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import { Context } from '../../../main'


const CreateOrder = observer(() => {
  const { store } = useContext(Context)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { fetchAccount } = accountStore
  const { createOrder, loading } = orderStore
  const { fetchBalance, balance, fetchPayMethods, payMethods } = balanceStore
  
  const [account, setAccount] = useState(null)
  const [formData, setFormData] = useState({
    verificationPlatform: '',
    userNameInPlatform: '',
    paymentMethod: 'balance',
    selectedPayMethod: '',
    check: null
  })
  
  const [error, setError] = useState('')
  
  const accountId = searchParams.get('account')
  const hours = parseInt(searchParams.get('hours')) || 3
  const totalPrice = account ? account.price * hours : 0
  const hasEnoughBalance = balance >= totalPrice
  const isFormValid = formData.verificationPlatform && 
    formData.userNameInPlatform && 
    formData.paymentMethod &&
    (formData.paymentMethod === 'balance' ? hasEnoughBalance : 
    (formData.selectedPayMethod && formData.check))
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  useEffect(() => {
    if (!store.isAuth) {
      navigate(ROUTES.LOGIN)
      return
    }

    const loadData = async () => {
      try {
        const accountData = await fetchAccount(accountId)
        setAccount(accountData)
        await fetchBalance()
        await fetchPayMethods()
      } catch (error) {
        console.error('Error loading account:', error)
        navigate(ROUTES.ACCOUNTS)
      }
    }

    if (accountId) {
      loadData()
    } else {
      navigate(ROUTES.ACCOUNTS)
    }
  }, [accountId, store, navigate, fetchAccount, fetchPayMethods, fetchBalance])

  const handlePaymentMethodChange = (e) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: e.target.value,
      selectedPayMethod: '', // сбрасываем выбор метода при смене типа оплаты
      check: null // сбрасываем чек
    }))
    setError('')
  }

  const handlePayMethodChange = (e) => {
    setFormData(prev => ({
      ...prev,
      selectedPayMethod: e.target.value
    }))
    setError('')
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleFileChange = (file) => {
    setFormData(prev => ({
      ...prev,
      check: file
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) {
      setError('Пожалуйста, укажите контакт для связи')
      return
    }

    try {
      const orderData = new FormData()
      orderData.append('accountId', account.id)
      orderData.append('rentPeriod', hours)
      orderData.append('verificationPlatform', formData.verificationPlatform)
      orderData.append('userNameInPlatform', formData.userNameInPlatform)
      orderData.append('paymentMethod', formData.paymentMethod)
      orderData.append('amount', totalPrice)

      if (formData.paymentMethod !== 'balance') {
        orderData.append('selectedPayMethod', formData.selectedPayMethod)
      }
      if (formData.check) {
        orderData.append('check', formData.check)
      }

    await createOrder(orderData)
      navigate(ROUTES.ORDERS)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Ошибка создания заказа')
    }
  }


  if (!account) {
    return (
      <div className={styles.loading}>
        <Loader fullScreen />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.createOrder}
    >
      <div className={styles.container}>

        <nav className={styles.breadcrumbs}>
          <a href={ROUTES.HOME}>Главная</a>
          <span>/</span>
          <a href={generatePath.accountDetail(accountId)}>Аккаунт #{account.id}</a>
          <span>/</span>
          <span>Создание заказа</span>
        </nav>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Оформление заказа</h1>
          <OrderTimeline status="pending" currentStep={0} />
        </motion.div>

        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.orderInfo}
          >
            <div className={styles.accountCard}>
              <img src={import.meta.env.VITE_API_URL + '/img/' + account.img} alt={account.title} />
              <div className={styles.accountDetails}>
                <div className={styles.accountHeader}>
                  <h3>{account.title}</h3>
                  <StatusBadge status={account.status} />
                </div>
                <p className={styles.accountNumber}>#{account.account_number}</p>
              </div>
            </div>

            <div className={styles.orderDetails}>
              <h4>Детали заказа</h4>
              <div className={styles.detailsList}>
                <div className={styles.detail}>
                  <span>Время аренды:</span>
                  <span>{hours} часов</span>
                </div>
                <div className={styles.detail}>
                  <span>Цена за час:</span>
                  <span>{account.price} ₽</span>
                </div>
                <div className={styles.detail}>
                  <span>Итого:</span>
                  <span className={styles.totalPrice}>{totalPrice} ₽</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className={styles.orderForm}
          >
            <h3 className={styles.formTitle}>Данные для заказа</h3>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <Input
              label="Платформа для проверки *"
              name="verificationPlatform"
              value={formData.verificationPlatform}
              onChange={handleInputChange}
              placeholder="Например Discord или Telegram"
              required
            />

            <Input
              label="Ваш username на этой платформе *"
              name="userNameInPlatform"
              value={formData.userNameInPlatform}
              onChange={handleInputChange}
              placeholder="Ваш @юзернейм"
              required
            />

            <div className={styles.paymentSection}>
              <h4>Способ оплаты *</h4>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="balance"
                    checked={formData.paymentMethod === 'balance'}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>Баланс аккаунта</span>
                </label>
                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>Банковский перевод</span>
                </label>
                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="crypto"
                    checked={formData.paymentMethod === 'crypto'}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>Криптовалюта</span>
                </label>
              </div>
            </div>

            <AnimatePresence>
              {formData.paymentMethod === 'balance' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.balanceInfo}
                >
                  <div className={styles.balanceHeader}>
                    <span>Ваш баланс:</span>
                    <span className={styles.balanceAmount}>{balance} ₽</span>
                  </div>
                  <div className={styles.balanceComparison}>
                    <span>Стоимость заказа:</span>
                    <span className={styles.orderAmount}>{totalPrice} ₽</span>
                  </div>
                  {!hasEnoughBalance && (
                    <div className={styles.balanceWarning}>
                      Недостаточно средств на балансе
                    </div>
                  )}
                  {hasEnoughBalance && (
                    <div className={styles.balanceSuccess}>
                      Достаточно средств для заказа
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {formData.paymentMethod !== 'balance' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.paymentDetails}
              >
                <h5>Выберите способ оплаты:</h5>
                <div className={styles.payMethods}>
                  {payMethods
                    .filter(method => method.type === formData.paymentMethod)
                    .map(method => 
                        <label 
                          key={method.id} 
                          className={`${styles.payMethod} ${formData.selectedPayMethod == method.id ? styles.selected : ''}`}
                        >
                          <input
                            type="radio"
                            name="selectedPayMethod"
                            value={method.id}
                            onChange={handlePayMethodChange}
                          />
                          <div className={styles.payMethodInfo}>
                            <span className={styles.payMethodName}>{method.name}</span>
                            <span className={styles.payMethodDetails}>{method.details}</span>
                          </div>
                        </label>
                    )
                  }
                </div>
                {formData.selectedPayMethod && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
              </motion.div>
              )}
            </AnimatePresence>

            <PriceCalculator
              basePrice={account.price}
              hours={hours}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
              disabled={!isFormValid}
              className={styles.submitButton}
            >
              Подтвердить заказ
            </Button>
          </motion.form>
        </div>
      </div>
    </motion.div>
  )
})

export default CreateOrder