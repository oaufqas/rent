import { useMemo } from 'react'

export const usePriceCalculation = (basePricePerHour) => {
  const calculatePrice = (hours) => {
    let price = basePricePerHour * hours

    if (hours >= 24) {
      price *= 0.85 // 15% скидка
    } else if (hours >= 12) {
      price *= 0.90 // 10% скидка
    } else if (hours >= 6) {
      price *= 0.95 // 5% скидка
    }
    
    return Math.round(price)
  }

  const calculateDiscount = (hours) => {
    if (hours >= 24) return 15
    if (hours >= 12) return 10
    if (hours >= 6) return 5
    return 0
  }

  const calculateHourlyPrice = (hours) => {
    const total = calculatePrice(hours)
    return Math.round(total / hours)
  }

  return {
    calculatePrice,
    calculateDiscount,
    calculateHourlyPrice
  }
}