import { motion } from 'framer-motion'
import { Mail, RefreshCw } from 'lucide-react'
import Button from '../../ui/Button/Button'
import styles from './ActivationNotice.module.css'

const ActivationNotice = ({ email, onResend }) => {
  const handleResend = () => {
    onResend?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.activationNotice}
    >
      <div className={styles.icon}>
        <Mail size={48} />
      </div>
      
      <h2 className={styles.title}>Подтвердите ваш email</h2>
      
      <p className={styles.description}>
        Мы отправили письмо с ссылкой для активации на адрес:
      </p>
      
      <p className={styles.email}>{email}</p>
      
      <p className={styles.instructions}>
        Перейдите по ссылке в письме, чтобы активировать ваш аккаунт и начать пользоваться сервисом.
      </p>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={handleResend}
          className={styles.resendBtn}
        >
          <RefreshCw size={16} />
          Отправить письмо повторно
        </Button>
        
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Я подтвердил email
        </Button>
      </div>

      <div className={styles.tips}>
        <h4>Не получили письмо?</h4>
        <ul>
          <li>Проверьте папку "Спам"</li>
          <li>Убедитесь, что email указан правильно</li>
          <li>Подождите несколько минут</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default ActivationNotice