import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { accountStore } from '../../../stores/accountStore'
import { ROUTES } from '../../../utils/constants'
import StatusBadge from '../../../components/ui/StatusBadge/StatusBadge'
import Button from '../../../components/ui/Button/Button'
import PriceCalculator from '../../../components/ui/PriceCalculator/PriceCalculator'
import TimeSlider from '../../../components/accounts/TimeSlider/TimeSlider'
import CustomTimeInput from '../../../components/accounts/CustomTimeInput/CustomTimeInput'
import VideoPlayer from '../../../components/accounts/VideoPlayer/VideoPlayer'
import Loader from '../../../components/ui/Loader/Loader'
import styles from './AccountDetail.module.css'
import { Context } from '../../../main'

const AccountDetail = observer(() => {
  const {store} = useContext(Context)
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchAccount } = accountStore
  
  const [account, setAccount] = useState(null)
  const [selectedHours, setSelectedHours] = useState(3)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [showOrderButton, setShowOrderButton] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const accountData = await fetchAccount(id)
        setAccount(accountData)
      } catch (error) {
        console.error('Error loading account:', error)
      } finally {
        window.scrollTo(0, 0)
        setLoading(false)
      }
    }

    if (id) {
      loadAccount()
    }
  }, [id, fetchAccount])
  

  useEffect(() => {
    if (selectedHours > 0) {
      const timer = setTimeout(() => setShowOrderButton(true), 500)
      return () => clearTimeout(timer)
    }
  }, [selectedHours])


  const handleTimeChange = (hours) => {
    setSelectedHours(hours)
    if (hours !== 'custom') {
      setShowCustomInput(true)
    }
  }

  const handleRent = () => {
    if (!store.isAuth) {
      navigate(ROUTES.LOGIN)
      return
    }
    navigate(`${ROUTES.ORDER_CREATE}?account=${account.id}&hours=${selectedHours}`)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader fullScreen />
      </div>
    )
  }

  if (!account) {
    return (
      <div className={styles.notFound}>
        <h2>Аккаунт не найден</h2>
        <p>Запрошенный аккаунт не существует или был удален</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.accountDetail}
    >
      <div className={styles.container}>

        <nav className={styles.breadcrumbs}>
          <a href={ROUTES.HOME}>Главная</a>
          <span>/</span>
          <span>Аккаунт #{account.id}</span>
        </nav>

        <div className={styles.content}>

          <div className={styles.mediaSection}>
            <VideoPlayer src={import.meta.env.VITE_API_URL + '/video/' + account.video} autoPlay={true}/>
            {/* <div className={styles.imageGallery}>
              {account.images?.map((image, index) => (
                <img key={index} src={image} alt={`${account.name} ${index + 1}`} />
              ))}
            </div> */}
            <div className={styles.rentalControls}>
              <h3>Аренда аккаунта</h3>
              
              <TimeSlider
                selectedHours={selectedHours}
                onHoursChange={handleTimeChange}
                onCustomToggle={setShowCustomInput}
                disabled={account.status !== 'free'}
              />

              <AnimatePresence>
                {showCustomInput && (
                  <CustomTimeInput
                    onHoursChange={setSelectedHours}
                    initialHours={25}
                  />
                )}
              </AnimatePresence>

              <PriceCalculator
                basePrice={account.price}
                hours={selectedHours}
              />

              <AnimatePresence>
                {showOrderButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={styles.orderButton}
                  >
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleRent}
                      disabled={account.status !== 'free'}
                    >
                      {account.status === 'free' ? 'Арендовать' : 'Недоступно'}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{account.title}</h1>
                <StatusBadge status={account.status} account={account}/>
              </div>
              <span className={styles.accountNumber}>#{account.account_number}</span>
            </div>

            <div className={styles.description}>
              <h3>Полное описание</h3>
              <p>{account.description}</p>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default AccountDetail