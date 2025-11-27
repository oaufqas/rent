import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from '../../ui/Input/Input'
import styles from './CustomTimeInput.module.css'

const CustomTimeInput = ({ onHoursChange, initialHours = 24 }) => {
  const [hours, setHours] = useState(initialHours)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hours >= 1 && hours <= 720) { // максимум 30 дней
        onHoursChange(Number(hours))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [hours, onHoursChange])

  const handleChange = (e) => {
    const value = e.target.value
    if (value === '' || (Number(value) >= 1 && Number(value) <= 720)) {
      setHours(value)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={styles.customInput}
    >
      <Input
        type="number"
        label="Введите количество часов"
        value={hours}
        onChange={handleChange}
        min="1"
        max="720"
        placeholder="24"
      />
      <p className={styles.note}>
        При аренде более 24 часов действует скидка 55%!
      </p>
    </motion.div>
  )
}

export default CustomTimeInput