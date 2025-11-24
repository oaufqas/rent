import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { store } from '../../../stores/store'
import Button from '../../ui/Button/Button'
import Loader from '../../ui/Loader/Loader'
import styles from './VerificationCode.module.css'

const VerificationCode = observer(({ userId, onSuccess }) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const inputsRef = useRef([])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const focusInput = (index) => {
    if (inputsRef.current[index]) {
      inputsRef.current[index].focus()
    }
  }

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      focusInput(index + 1)
    }

    // Auto-submit when all digits are filled
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleSubmit(newCode.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      focusInput(index - 1)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')
    
    if (digits.length === 6) {
      const newCode = [...code]
      digits.forEach((digit, index) => {
        newCode[index] = digit
      })
      setCode(newCode)
      handleSubmit(newCode.join(''))
    }
  }

  const handleSubmit = async (verificationCode = code.join('')) => {
    if (verificationCode.length !== 6) {
      setError('Введите все 6 цифр кода')
      return
    }

    setLoading(true)
    setError('')

    try {
      await store.verifyLogin(userId, verificationCode)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный код подтверждения')
      // Clear code on error
      setCode(['', '', '', '', '', ''])
      focusInput(0)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = () => {
    // Здесь будет логика повторной отправки кода
    setTimeLeft(60)
    setError('')
    setCode(['', '', '', '', '', ''])
    focusInput(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.verification}
    >
      <h2 className={styles.title}>Подтверждение входа</h2>
      
      <p className={styles.description}>
        Мы отправили код подтверждения на вашу почту.
        Введите 6-значный код для завершения входа.
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.error}
        >
          {error}
        </motion.div>
      )}

      <div className={styles.codeInputs}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => inputsRef.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={styles.codeInput}
            disabled={loading}
          />
        ))}
      </div>

      <div className={styles.timer}>
        {timeLeft > 0 ? (
          <span>Отправить код повторно через {timeLeft} сек</span>
        ) : (
          <button
            onClick={handleResendCode}
            className={styles.resendBtn}
            disabled={loading}
          >
            Отправить код повторно
          </button>
        )}
      </div>

      <Button
        variant="primary"
        size="large"
        loading={loading}
        onClick={() => handleSubmit()}
        className={styles.submitBtn}
      >
        Подтвердить
      </Button>

      {loading && (
        <div className={styles.loadingOverlay}>
          <Loader />
        </div>
      )}
    </motion.div>
  )
})

export default VerificationCode