import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import Button from '../../../components/ui/Button/Button'
import Input from '../../../components/ui/Input/Input'
import styles from './Registration.module.css'
import { Context } from '../../../main'

const Register = observer(() => {
  const { store } = useContext(Context)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)
    setError('')

    try {
      await store.registration(formData.email, formData.password)
      navigate(ROUTES.ACTIVATION_REQUIRED, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.register}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.container}
      >
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <h2 className={styles.title}>Создать аккаунт</h2>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.error}
            >
              {error}
            </motion.div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />

          <Input
            label="Пароль"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Минимум 6 символов"
          />

          <Input
            label="Подтвердите пароль"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Повторите пароль"
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            className={styles.submitBtn}
          >
            Зарегистрироваться
          </Button>

          <p className={styles.loginLink}>
            Уже есть аккаунт? <Link to={ROUTES.LOGIN}>Войти</Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  )
})

export default Register