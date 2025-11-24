import { motion } from 'framer-motion'
import { CreditCard, Wallet, Banknote } from 'lucide-react'
import styles from './PaymentMethods.module.css'

const PaymentMethods = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    {
      id: 'balance',
      name: 'Баланс аккаунта',
      description: 'Оплата с баланса вашего аккаунта',
      icon: Wallet,
      available: true
    },
    {
      id: 'card',
      name: 'Банковская карта',
      description: 'Оплата картой Visa/Mastercard',
      icon: CreditCard,
      available: true
    },
    {
      id: 'crypto',
      name: 'Криптовалюта',
      description: 'Bitcoin, Ethereum, USDT',
      icon: Banknote,
      available: false
    }
  ]

  return (
    <div className={styles.paymentMethods}>
      {paymentMethods.map((method, index) => {
        const Icon = method.icon
        return (
          <motion.label
            key={method.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${styles.method} ${
              selectedMethod === method.id ? styles.selected : ''
            } ${!method.available ? styles.disabled : ''}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => method.available && onMethodChange(method.id)}
              disabled={!method.available}
              className={styles.radio}
            />
            
            <div className={styles.methodContent}>
              <div className={styles.methodIcon}>
                <Icon size={24} />
              </div>
              
              <div className={styles.methodInfo}>
                <span className={styles.methodName}>{method.name}</span>
                <span className={styles.methodDescription}>{method.description}</span>
              </div>
            </div>

            {!method.available && (
              <span className={styles.comingSoon}>Скоро</span>
            )}
          </motion.label>
        )
      })}
    </div>
  )
}

export default PaymentMethods