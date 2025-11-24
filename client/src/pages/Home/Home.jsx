import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { accountStore } from '../../stores/accountStore'
import HeroSection from './HeroSection/HeroSection'
import AccountsPreview from './AccountPreview/AccountPreview'
import RentalInfo from './RentalInfo/RentalInfo'
import ReviewsSection from './ReviewsSection/ReviewsSection'
import styles from './Home.module.css'

const Home = observer(() => {
  const { fetchAccounts } = accountStore

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.home}
    >
      <HeroSection />
      
      <div className={styles.container}>
        <AccountsPreview />
        <RentalInfo />
        <ReviewsSection />
      </div>
    </motion.div>
  )
})

export default Home