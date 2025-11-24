import { motion } from 'framer-motion'
import { Check, Clock, X } from 'lucide-react'
import styles from './OrderTimeline.module.css'

const OrderTimeline = ({ status, currentStep }) => {
  const steps = [
    { key: 'pending', label: 'Ожидание оплаты', icon: Clock },
    { key: 'paid', label: 'Оплачено', icon: Check },
    { key: 'verified', label: 'Проверка', icon: Check },
    { key: 'active', label: 'Активен', icon: Check },
    { key: 'completed', label: 'Завершён', icon: Check },
    { key: 'cancelled', label: 'Отменён', icon: X },
  ]

  const getStepIndex = (status) => {
    return steps.findIndex(step => step.key === status)
  }

  const currentStepIndex = getStepIndex(status)
  const isCancelled = status === 'cancelled'

  return (
    <div className={styles.timeline}>
      {steps.map((step, index) => {
        const StepIcon = step.icon
        const isCancelledStep = step.key === 'cancelled'
        
        const isCompleted = !isCancelled && index <= currentStepIndex
        const isCurrent = index === currentStepIndex
        const isActive = isCancelled ? isCancelledStep : (isCompleted || isCurrent)

        return (
          <motion.div
            key={step.key}
            className={styles.step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.stepContent}>
              <div className={`${styles.stepIcon} ${
                isActive ? styles.completed : ''
              } ${isCurrent ? styles.current : ''} ${
                isCancelledStep && isCancelled ? styles.cancelled : ''
              }`}>
                <StepIcon size={16} />
              </div>
              
              <div className={styles.stepInfo}>
                <span className={`${styles.stepLabel} ${
                  isActive ? styles.completed : ''
                } ${isCurrent ? styles.current : ''} ${
                  isCancelledStep && isCancelled ? styles.cancelled : ''
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`${styles.connector} ${

                !isCancelled && index < currentStepIndex ? styles.completed : ''
              }`} />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default OrderTimeline