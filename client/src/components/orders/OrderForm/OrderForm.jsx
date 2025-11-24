import { useState } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { store } from '../../../stores/store'
import { orderStore } from '../../../stores/orderStore'
import Button from '../../ui/Button/Button'
import Input from '../../ui/Input/Input'
import PriceCalculator from '../../ui/PriceCalculator/PriceCalculator'
import PaymentMethods from '../PaymentMethods/PaymentMethods'
import styles from './OrderForm.module.css'

const OrderForm = observer(({ account, hours, onSuccess }) => {
  const [formData, setFormData] = useState({
    contact: '',
    paymentMethod: 'balance',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.contact.trim()) {
      setError('Пожалуйста, укажите контакт для связи')
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderData = {
        accountId: account.id,
        hours: hours,
        contact: formData.contact,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      }

      await orderStore.createOrder(orderData)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания заказа')
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = account ? account.basePrice * hours : 0

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={styles.orderForm}
    >
      <h3 className={styles.title}>Оформление заказа</h3>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Контактная информация</h4>
        <Input
          label="Контакт для связи (Discord/Telegram)"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Ваш Discord или Telegram"
          required
        />
        
        <Input
          label="Дополнительные пожелания (необязательно)"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Особые требования или пожелания"
          multiline
          rows={3}
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Способ оплаты</h4>
        <PaymentMethods
          selectedMethod={formData.paymentMethod}
          onMethodChange={(method) => setFormData(prev => ({ ...prev, paymentMethod: method }))}
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Сводка заказа</h4>
        <div className={styles.orderSummary}>
          <div className={styles.summaryItem}>
            <span>Аккаунт:</span>
            <span>{account.name} #{account.number}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Время аренды:</span>
            <span>{hours} часов</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Цена за час:</span>
            <span>{account.basePrice} ₽</span>
          </div>
          <div className={styles.summaryItem}>
            <PriceCalculator
              basePrice={account.basePrice}
              hours={hours}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={loading}
        className={styles.submitButton}
      >
        Подтвердить заказ
      </Button>
    </motion.form>
  )
})

export default OrderForm