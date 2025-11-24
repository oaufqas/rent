import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import ActivationNotice from '../../../components/auth/ActivationNotice/ActivationNotice'
import styles from './ActivationRequired.module.css'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { Context } from '../../../main'
import { ROUTES } from '../../../utils/constants'

const ActivationRequired = observer(() => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    if (store.user?.isActivated) {
      navigate(ROUTES.HOME, { replace: true })
    }
  }, [store.user?.isActivated, navigate])

  const handleResend = async () => {
    try {
      console.log('Activation email resent to:', store.user?.email)
    } catch (error) {
      console.error('Failed to resend activation:', error)
    }
  }

  if (store.user?.isActivated) {
    return null
  }

  return (
    <div className={styles.activationRequired}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.container}
      >
        <ActivationNotice 
          email={store.user?.email}
          onResend={handleResend}
        />
      </motion.div>
    </div>
  )
})

export default ActivationRequired