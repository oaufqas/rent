import { useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ROUTES, generatePath, ACCOUNT_STATUS } from '../../../utils/constants'
import { usePriceCalculation } from '../../../hooks/usePriceCalculations.js'
import StatusBadge from '../../ui/StatusBadge/StatusBadge'
import Button from '../../ui/Button/Button'
import TimeSlider from '../TimeSlider/TimeSlider'
import styles from './AccountCard.module.css'
import CustomTimeInput from '../CustomTimeInput/CustomTimeInput.jsx'
import { Context } from '../../../main.jsx'

const AccountCard = observer(({ account }) => {
  const { store } = useContext(Context)
  const [selectedHours, setSelectedHours] = useState(3)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const navigate = useNavigate()
  const { calculatePrice } = usePriceCalculation(account.price)
  
  const price = calculatePrice(selectedHours)
  const isAvailable = account.status === ACCOUNT_STATUS.AVAILABLE

  const handleCardClick = () => {
    navigate(generatePath.accountDetail(account.id))
  }

  const handleRent = (e) => {
    e.stopPropagation()
    if (!store.isAuth) {
      navigate(ROUTES.LOGIN)
      return
    }
      navigate(`${ROUTES.ORDER_CREATE}?account=${account.id}&hours=${selectedHours}`)
  }

  const handleTimeChange = (hours, e) => {
    if (e) e.stopPropagation()
    setSelectedHours(hours)
    if (hours === 'custom') {
      setShowCustomInput(true)
    }
  }

  return (
    <motion.div 
      className={styles.card}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.preview}>
        <img src={import.meta.env.VITE_API_URL + '/img/' + account.img} alt={account.title} />
        <StatusBadge status={account.status} className={styles.status} account={account} />
        <span className={styles.number}>#{account.account_number}</span>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{account.title}</h3>
        
        <div className={styles.rentalControls}
        onClick={(e) => e.stopPropagation()}
        >
          <TimeSlider
            selectedHours={selectedHours}
            onHoursChange={handleTimeChange}
            onCustomToggle={setShowCustomInput}
            disabled={!isAvailable}
          />

          <AnimatePresence>
            {showCustomInput && (
              <CustomTimeInput
                onHoursChange={setSelectedHours}
                initialHours={25}
              />
            )}
          </AnimatePresence>
          
          <div className={styles.priceSection}>
            <span className={styles.price}>{price} ₽</span>
            {selectedHours > 24 && (
              <span className={styles.discount}>Выгода!</span>
            )}
          </div>
        </div>
        
        <Button 
          variant="primary"
          size="large"
          disabled={!isAvailable}
          onClick={handleRent}
          className={styles.rentBtn}
        >
          {isAvailable ? 'Арендовать' : 'Недоступно'}
        </Button>
      </div>
    </motion.div>
  )
})

export default AccountCard