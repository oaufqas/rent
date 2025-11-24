// utils/priceCalculations.js

/**
 * Расчет цены аренды на основе времени
 */
export const calculateRentalPrice = (basePrices, hours, customPricePerHour = null) => {
  // Если передана кастомная цена за час
  if (customPricePerHour !== null) {
    return Math.round(customPricePerHour * hours * 100) / 100;
  }
  
  // Стандартные интервалы
  const standardIntervals = {
    3: basePrices['3'] || 0,
    6: basePrices['6'] || 0,
    12: basePrices['12'] || 0,
    24: basePrices['24'] || 0
  };
  
  // Проверяем стандартные интервалы
  if (standardIntervals[hours]) {
    return standardIntervals[hours];
  }
  
  // Расчет для кастомного времени
  const basePricePerHour = basePrices['else'] || 100; // Цена за час по умолчанию
  let totalPrice = basePricePerHour * hours;
  
  // Применяем скидки за объем
  if (hours >= 24) {
    // Скидка 10% за аренду от 24 часов
    totalPrice *= 0.9;
  } else if (hours >= 12) {
    // Скидка 5% за аренду от 12 часов
    totalPrice *= 0.95;
  }
  
  return Math.round(totalPrice * 100) / 100;
};

/**
 * Расчет цены за ночной период
 */
export const calculateNightPrice = (basePrices, hours) => {
  const nightPrice = basePrices['night'] || 0;
  if (nightPrice === 0) {
    return calculateRentalPrice(basePrices, hours);
  }
  
  return nightPrice;
};

/**
 * Расчет скидки в процентах
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return 0;
  }
  
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Расчет экономии при долгосрочной аренде
 */
export const calculateSavings = (basePrices, hours) => {
  const basePricePerHour = basePrices['else'] || 100;
  const originalPrice = basePricePerHour * hours;
  const discountedPrice = calculateRentalPrice(basePrices, hours);
  
  return {
    savings: Math.round((originalPrice - discountedPrice) * 100) / 100,
    discountPercent: calculateDiscount(originalPrice, discountedPrice),
    originalPrice: Math.round(originalPrice * 100) / 100,
    finalPrice: discountedPrice
  };
};

/**
 * Валидация ценовых данных
 */
export const validatePriceData = (priceData) => {
  const requiredFields = ['3', '6', '12', '24', 'else'];
  const errors = [];
  
  // Проверяем обязательные поля
  for (const field of requiredFields) {
    if (priceData[field] === undefined || priceData[field] === null) {
      errors.push(`Отсутствует цена для интервала ${field} часов`);
    } else if (typeof priceData[field] !== 'number' || priceData[field] < 0) {
      errors.push(`Неверная цена для интервала ${field} часов`);
    }
  }
  
  // Проверяем логику цен (24 часа должно быть выгоднее чем 12 и т.д.)
  if (priceData['24'] >= priceData['12'] && priceData['12'] > 0) {
    errors.push('Цена за 24 часа должна быть меньше чем за 12 часов');
  }
  
  if (priceData['12'] >= priceData['6'] && priceData['6'] > 0) {
    errors.push('Цена за 12 часов должна быть меньше чем за 6 часов');
  }
  
  if (priceData['6'] >= priceData['3'] && priceData['3'] > 0) {
    errors.push('Цена за 6 часов должна быть меньше чем за 3 часа');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Генерация ценового диапазона для отображения
 */
export const generatePriceRange = (basePrices) => {
  const intervals = [3, 6, 12, 24];
  const prices = intervals.map(hours => ({
    hours,
    price: basePrices[hours] || 0,
    pricePerHour: Math.round((basePrices[hours] || 0) / hours * 100) / 100
  }));
  
  // Добавляем кастомную цену за час
  const customPricePerHour = basePrices['else'] || 100;
  
  return {
    standard: prices,
    custom: {
      pricePerHour: customPricePerHour,
      description: `Любое время (${customPricePerHour}₽/час)`
    },
    night: basePrices['night'] ? {
      price: basePrices['night'],
      description: 'Ночной тариф'
    } : null
  };
};

/**
 * Утилиты для работы с балансом
 */
export const BalanceUtils = {
  // Проверка достаточности баланса
  hasSufficientBalance(balance, amount) {
    return Number(balance) >= Number(amount);
  },
  
  // Расчет доступного остатка
  calculateRemainingBalance(balance, amount) {
    return Math.round((Number(balance) - Number(amount)) * 100) / 100;
  },
  
  // Форматирование баланса с подсветкой
  formatBalanceWithStatus(balance, requiredAmount = null) {
    const numericBalance = Number(balance);
    const numericRequired = Number(requiredAmount);
    
    if (requiredAmount !== null && numericBalance < numericRequired) {
      return {
        text: formatCurrency(balance),
        status: 'insufficient',
        difference: formatCurrency(numericRequired - numericBalance)
      };
    }
    
    return {
      text: formatCurrency(balance),
      status: 'sufficient',
      difference: null
    };
  }
};