import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { store } from '../../../stores/store'
import { ROUTES } from '../../../utils/constants'
import Button from '../../ui/Button/Button'
import Input from '../../ui/Input/Input'
import styles from './LoginForm.module.css'
import { Context } from '../../../main'

const LoginForm = observer(({ onSuccess }) => {
  const { store } = useContext(Context)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true)
    setError('')

    try {
      const data = await store.login(formData.email, formData.password)
      onSuccess?.(data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <h2 className={styles.title}>Вход в аккаунт</h2>
      
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
        placeholder="Введите пароль"
      />

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={loading}
        className={styles.submitBtn}
      >
        Войти
      </Button>

      <p className={styles.registerLink}>
        Нет аккаунта? <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
      </p>
    </motion.form>
  )
})

export default LoginForm