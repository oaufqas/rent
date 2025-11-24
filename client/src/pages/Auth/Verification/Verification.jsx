import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { store } from '../../../stores/store'
import { ROUTES } from '../../../utils/constants'
import VerificationCode from '../../../components/auth/VerificationCode/VerificationCode'
import styles from './Verification.module.css'

const Verification = observer(() => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = store

  const handleSuccess = () => {
    navigate(ROUTES.HOME, { replace: true })
  }

  // Если пользователь попал сюда без userId, перенаправляем на логин
  if (!location.state?.userId) {
    navigate(ROUTES.LOGIN)
    return null
  }

  return (
    <div className={styles.verificationPage}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.container}
      >
        <VerificationCode 
          userId={location.state.userId}
          onSuccess={handleSuccess}
        />
      </motion.div>
    </div>
  )
})

export default Verification