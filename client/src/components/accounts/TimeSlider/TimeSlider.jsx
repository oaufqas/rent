import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from './TimeSlider.module.css'

const TimeSlider = ({ selectedHours, onHoursChange, onCustomToggle, disabled = false }) => {
  const timeOptions = [3, 6, 12, 24, 'custom']
  const [isMobile, setIsMobile] = useState(false)

  // Определяем мобильное устройство при монтировании
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleOptionClick = (option) => {
    if (disabled) return
    
    if (option === 'custom') {
      onCustomToggle(true)
      onHoursChange(24) 
    } else {
      onHoursChange(option)
      onCustomToggle(false)
    }
  }

  return (
    <div className={styles.timeSlider}>
      <div className={styles.options}>
        {timeOptions.map(option => (
          <motion.button
            key={option}
            className={`${styles.option} ${
              selectedHours === option ? styles.active : ''
            } ${option === 'custom' ? styles.custom : ''} ${
              disabled ? styles.disabled : ''
            }`}
            onClick={() => handleOptionClick(option)}
            whileHover={!disabled && !isMobile ? { scale: 1.05 } : {}} // Отключаем hover на мобильных
            whileTap={!disabled ? { scale: 0.95 } : {}}
            disabled={disabled}
          >
            {option === 'custom' ? 'Другое' : `${option}ч`}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default TimeSlider