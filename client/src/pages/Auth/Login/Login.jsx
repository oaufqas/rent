import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../../utils/constants'
import LoginForm from '../../../components/auth/LoginForm/LoginForm'
import VerificationCode from '../../../components/auth/VerificationCode/VerificationCode'
import styles from './Login.module.css'
import { Context } from '../../../main'


const Login = observer(() => {
  const { store } = useContext(Context)
  const [step, setStep] = useState(1) // 1: login, 2: verification
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || ROUTES.HOME

  const handleLoginSuccess = (data) => {
    setUserId(data?.data?.userId)
    setStep(2)

  }

  const handleVerificationSuccess = () => {
    store.setAuth(true)
    store.setUser(store.user)
    navigate(from, { replace: true })
    window.location.reload()
  }

  return (
    
    <div className={styles.login}>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.container}
      >
        {step === 1 && (
          <LoginForm onSuccess={handleLoginSuccess} />
        )}
        
        {step === 2 && (
          <VerificationCode 
            userId={userId}
            onSuccess={handleVerificationSuccess}
          />
        )}
      </motion.div>
    </div>
  )
})

export default Login