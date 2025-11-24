import { useState } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { store } from '../../../stores/store'
import Button from '../../../components/ui/Button/Button'
import Input from '../../../components/ui/Input/Input'
import styles from './SecuritySettings.module.css'

const SecuritySettings = observer(() => {
  const { user } = store
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setSuccess('')
  }

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    return requirements
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.currentPassword) {
      setError('Введите текущий пароль')
      return
    }

    if (!formData.newPassword) {
      setError('Введите новый пароль')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Новые пароли не совпадают')
      return
    }

    const requirements = validatePassword(formData.newPassword)
    if (!Object.values(requirements).every(Boolean)) {
      setError('Новый пароль не соответствует требованиям безопасности')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Здесь будет вызов API для смены пароля
      // await authService.changePassword(formData)
      
      // Временно симулируем успешное обновление
      setTimeout(() => {
        setSuccess('Пароль успешно изменен')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setLoading(false)
      }, 1000)
      
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка смены пароля')
      setLoading(false)
    }
  }

  const passwordRequirements = validatePassword(formData.newPassword)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.securitySettings}
    >
      <h2 className={styles.title}>Настройки безопасности</h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.error}
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.success}
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Смена пароля</h3>
          
          <Input
            label="Текущий пароль"
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            icon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className={styles.passwordToggle}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Input
            label="Новый пароль"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            icon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={styles.passwordToggle}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {/* Требования к паролю */}
          {formData.newPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={styles.passwordRequirements}
            >
              <h4>Требования к паролю:</h4>
              <div className={styles.requirementsList}>
                <div className={styles.requirement}>
                  {passwordRequirements.length ? <CheckCircle size={14} className={styles.valid} /> : <XCircle size={14} className={styles.invalid} />}
                  <span>Минимум 8 символов</span>
                </div>
                <div className={styles.requirement}>
                  {passwordRequirements.uppercase ? <CheckCircle size={14} className={styles.valid} /> : <XCircle size={14} className={styles.invalid} />}
                  <span>Заглавные буквы (A-Z)</span>
                </div>
                <div className={styles.requirement}>
                  {passwordRequirements.lowercase ? <CheckCircle size={14} className={styles.valid} /> : <XCircle size={14} className={styles.invalid} />}
                  <span>Строчные буквы (a-z)</span>
                </div>
                <div className={styles.requirement}>
                  {passwordRequirements.number ? <CheckCircle size={14} className={styles.valid} /> : <XCircle size={14} className={styles.invalid} />}
                  <span>Цифры (0-9)</span>
                </div>
                <div className={styles.requirement}>
                  {passwordRequirements.special ? <CheckCircle size={14} className={styles.valid} /> : <XCircle size={14} className={styles.invalid} />}
                  <span>Специальные символы</span>
                </div>
              </div>
            </motion.div>
          )}

          <Input
            label="Подтвердите новый пароль"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.passwordToggle}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className={styles.submitBtn}
          >
            Сменить пароль
          </Button>
        </div>
      </form>

      <div className={styles.securityInfo}>
        <h3 className={styles.sectionTitle}>Безопасность аккаунта</h3>
        <div className={styles.securityStatus}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Двухфакторная аутентификация</span>
            <span className={styles.statusValue}>Не подключена</span>
            <Button variant="secondary" size="small">
              Подключить
            </Button>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Активные сессии</span>
            <span className={styles.statusValue}>1 устройство</span>
            <Button variant="secondary" size="small">
              Просмотреть
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default SecuritySettings