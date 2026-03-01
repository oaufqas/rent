import { useMemo } from 'react'

export const usePriceCalculation = (basePricePerHour) => {
  const calculatePrice = (hours) => {
    let price = basePricePerHour * hours

    if (hours >= 24) {
      price *= 0.35
    } else if (hours >= 12) {
      price *= 0.55 
    } else if (hours >= 6) {
      price *= 0.80
    }
    
    return Math.round(price)
  }

  const calculateDiscount = (hours) => {
    if (hours >= 24) return 65
    if (hours >= 12) return 45
    if (hours >= 6) return 20
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