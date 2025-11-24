import { usePriceCalculation } from '../../../hooks/usePriceCalculations.js'
import styles from './PriceCalculator.module.css'

const PriceCalculator = ({ basePrice, hours, showDiscount = true }) => {
  const { calculatePrice, calculateDiscount } = usePriceCalculation(basePrice)
  const finalPrice = calculatePrice(hours)
  const discount = calculateDiscount(hours)

  return (
    <div className={styles.calculator}>
      <div className={styles.priceRow}>
        <span className={styles.label}>Стоимость:</span>
        <span className={styles.price}>{finalPrice} ₽</span>
      </div>
      
      {showDiscount && discount > 0 && (
        <div className={styles.discountRow}>
          <span className={styles.discountLabel}>Скидка:</span>
          <span className={styles.discountValue}>-{discount}%</span>
        </div>
      )}
      
      {hours > 1 && (
        <div className={styles.hourlyRow}>
          <span className={styles.hourlyLabel}>
            {hours} ч × {basePrice} ₽/ч
          </span>
        </div>
      )}
    </div>
  )
}

export default PriceCalculator