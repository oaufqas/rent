// utils/dateUtils.js

/**
 * Форматирование даты в московское время
 */
export const formatToMoscowTime = (dateString, options = {}) => {
  const date = new Date(dateString);
  
  const defaultOptions = {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  return date.toLocaleString('ru-RU', { ...defaultOptions, ...options });
};

/**
 * Форматирование относительного времени
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  
  return formatToMoscowTime(dateString, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Расчет оставшегося времени аренды
 */
export const getRentalTimeLeft = (expiresAt) => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires - now;
  
  if (diffMs <= 0) {
    return { expired: true, text: 'Время истекло' };
  }
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return { 
      expired: false, 
      text: `${diffDays} дн. ${diffHours % 24} ч.`,
      critical: diffDays <= 1
    };
  }
  
  if (diffHours > 0) {
    return { 
      expired: false, 
      text: `${diffHours} ч. ${diffMins % 60} мин.`,
      critical: diffHours <= 6
    };
  }
  
  return { 
    expired: false, 
    text: `${diffMins} мин.`,
    critical: true
  };
};

/**
 * Проверка истекает ли аренда скоро (для уведомлений)
 */
export const isRentalExpiringSoon = (expiresAt, thresholdMinutes = 5) => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires - now;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  return diffMins > 0 && diffMins <= thresholdMinutes;
};

/**
 * Форматирование длительности аренды
 */
export const formatRentalDuration = (hours) => {
  if (hours < 24) {
    return `${hours} ч.`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return `${days} дн.`;
  }
  
  return `${days} дн. ${remainingHours} ч.`;
};

/**
 * Валидация даты (не в прошлом)
 */
export const isValidFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

/**
 * Утилиты для работы с временными интервалами
 */
export const TimeUtils = {
  // Добавление времени к текущей дате
  addHours(hours) {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  },
  
  addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  },
  
  // Разница между датами в часах
  diffInHours(startDate, endDate) {
    const diffMs = new Date(endDate) - new Date(startDate);
    return Math.floor(diffMs / (1000 * 60 * 60));
  },
  
  // Проверка на сегодняшнюю дату
  isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },
  
  // Получение начала дня
  startOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },
  
  // Получение конца дня
  endOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
};