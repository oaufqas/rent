// utils/formatters.js

/**
 * Форматирование денежных значений
 */
export const formatCurrency = (amount, currency = '₽') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ` ${currency}`;
};

/**
 * Форматирование чисел (отзывы, количество)
 */
export const formatNumber = (number) => {
  if (typeof number !== 'number') {
    number = parseInt(number) || 0;
  }
  
  return new Intl.NumberFormat('ru-RU').format(number);
};

/**
 * Сокращение больших чисел
 */
export const formatCompactNumber = (number) => {
  if (number < 1000) {
    return number.toString();
  }
  
  if (number < 1000000) {
    return (number / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  
  return (number / 1000000).toFixed(1).replace('.0', '') + 'M';
};

/**
 * Форматирование рейтинга (звезды)
 */
export const formatRating = (rating, maxRating = 5) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
    numeric: rating.toFixed(1)
  };
};

/**
 * Форматирование статусов
 */
export const formatStatus = (status, type = 'order') => {
  const statusConfigs = {
    order: {
      pending: { text: 'Ожидает оплаты', color: 'warning', icon: '⏳' },
      paid: { text: 'Оплачено', color: 'info', icon: '✅' },
      verified: { text: 'Проверено', color: 'success', icon: '🔒' },
      active: { text: 'Активно', color: 'success', icon: '🎮' },
      completed: { text: 'Завершено', color: 'neutral', icon: '🏁' },
      cancelled: { text: 'Отменено', color: 'error', icon: '❌' }
    },
    transaction: {
      pending: { text: 'Ожидает', color: 'warning', icon: '⏳' },
      completed: { text: 'Завершено', color: 'success', icon: '✅' },
      cancelled: { text: 'Отменено', color: 'error', icon: '❌' },
      rejected: { text: 'Отклонено', color: 'error', icon: '🚫' }
    },
    account: {
      free: { text: 'Свободен', color: 'success', icon: '🟢' },
      rented: { text: 'Арендован', color: 'warning', icon: '🔴' },
      unavailable: { text: 'Недоступен', color: 'error', icon: '⚫' }
    }
  };
  
  const config = statusConfigs[type]?.[status] || { 
    text: status, 
    color: 'neutral', 
    icon: '❓' 
  };
  
  return config;
};

/**
 * Форматирование текста (обрезка, капитализация)
 */
export const TextFormatter = {
  // Обрезка текста с многоточием
  truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },
  
  // Первая буква заглавная
  capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
  
  // Все слова с заглавной буквы
  capitalizeWords(text) {
    if (!text) return '';
    return text.replace(/\b\w/g, char => char.toUpperCase());
  },
  
  // Форматирование имени файла
  formatFileName(name, maxLength = 30) {
    if (!name) return '';
    
    if (name.length <= maxLength) return name;
    
    const parts = name.split('.');
    const extension = parts.pop();
    const fileName = parts.join('.');
    
    const maxNameLength = maxLength - extension.length - 1; // -1 для точки
    const truncatedName = fileName.substring(0, maxNameLength).trim() + '...';
    
    return `${truncatedName}.${extension}`;
  }
};

/**
 * Форматирование размера файла
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Маскирование конфиденциальных данных
 */
export const maskSensitiveData = {
  email(email) {
    if (!email) return '';
    const [local, domain] = email.split('@');
    const maskedLocal = local.substring(0, 2) + '*'.repeat(Math.max(0, local.length - 2));
    return `${maskedLocal}@${domain}`;
  },
  
  cardNumber(number) {
    if (!number) return '';
    const cleaned = number.replace(/\s/g, '');
    return '**** **** **** ' + cleaned.slice(-4);
  }
};