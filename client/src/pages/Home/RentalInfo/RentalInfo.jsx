import { motion } from 'framer-motion'
import { Shield, Clock, Headphones, Star } from 'lucide-react'
import styles from './RentalInfo.module.css'

const RentalInfo = () => {
  const features = [
    {
      icon: Clock,
      title: 'Скорость',
      description: 'Получение аккаунта почти сразу после оплаты.'
    },
    {
      icon: Headphones,
      title: 'Работаем каждый день',
      description: 'Всегда готовы вам помочь.'
    },
    {
      icon: Star,
      title: 'Премиум качество',
      description: 'Одни из самых дорогих аккаунтов в снг'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id='info'>
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={styles.section}
    >
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <h2 className={styles.title}>Почему выбирают нас?</h2>
          <p className={styles.subtitle}>
            Мы предоставляем лучший сервис аренды игровых аккаунтов
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className={styles.features}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={styles.feature}
            >
              <div className={styles.icon}>
                <feature.icon size={32} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
    </section>
  )
}

export default RentalInfo