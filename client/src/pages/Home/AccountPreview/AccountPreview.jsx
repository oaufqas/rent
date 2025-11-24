import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import AccountFilters from '../../../components/accounts/AccountFilters/AccountFilters'
import AccountGrid from '../../../components/accounts/AccountGrid/AccountGrid'
import styles from './AccountPreview.module.css'

const AccountsPreview = observer(() => {

  return (
    <section id='accounts'>
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={styles.section}
    >
      <div className={styles.header}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.title}
        >
          Наши <span className={styles.accent}>аккаунты</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={styles.subtitle}
        >
          Выберите подходящий аккаунт из нашей коллекции
        </motion.p>
      </div>

      <AccountFilters />
      <AccountGrid />
    </motion.section>
    </section>
  )
})

export default AccountsPreview