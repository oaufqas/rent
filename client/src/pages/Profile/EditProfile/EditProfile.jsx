import { useState } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { store } from '../../../stores/store'
import Button from '../../../components/ui/Button/Button'
import Input from '../../../components/ui/Input/Input'
import styles from './EditProfile.module.css'

const EditProfile = observer(({ onClose }) => {
  const { user, changeUserName, getOneUser } = store
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: null
  })
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim()) {
      setError('Имя пользователя не может быть пустым')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await changeUserName(formData.username)
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка обновления профиля')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={styles.editForm}
    >
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}

      <div className={styles.disabledContainer}>
        <div className={styles.disabledContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              <div className={styles.avatar}>
                {formData.avatar ? (
                  <img 
                    src={URL.createObjectURL(formData.avatar)} 
                    alt="Avatar preview" 
                  />
                ) : (
                  user?.username?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
            </div>
          

            <div className={styles.avatarUpload}>
              <label className={styles.uploadLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.uploadInput}
                />
                Выбрать изображение
              </label>
              <p className={styles.uploadHint}>
                Рекомендуемый размер: 200x200px
              </p>
            </div>
          </div>
        </div>
        <div className={styles.disabledMessage}>Пока недоступно</div>
      </div>

      <Input
        label="Имя пользователя"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Введите новое имя пользователя"
      />

      <div className={styles.disabledContainer}>
        <div className={styles.disabledContent}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            disabled
          />
        </div>
        <div className={styles.disabledMessage}>Пока недоступно</div>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          Сохранить изменения
        </Button>
      </div>
    </motion.form>
  )
})

export default EditProfile