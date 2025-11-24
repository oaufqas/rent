
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email обязателен' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Неверный формат email' };
  }
  
  return { isValid: true, message: '' };
};


export const validatePassword = (password, confirmPassword = null) => {
  if (!password || password.trim() === '') {
    return { isValid: false, message: 'Пароль обязателен' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Пароль должен быть не менее 6 символов' };
  }
  
  if (confirmPassword !== null && password !== confirmPassword) {
    return { isValid: false, message: 'Пароли не совпадают' };
  }
  
  return { isValid: true, message: '' };
};


export const validateAmount = (amount, min = 1, max = 100000) => {
  const numericAmount = Number(amount);
  
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return { isValid: false, message: 'Сумма должна быть положительным числом' };
  }
  
  if (numericAmount < min) {
    return { isValid: false, message: `Минимальная сумма: ${min}₽` };
  }
  
  if (numericAmount > max) {
    return { isValid: false, message: `Максимальная сумма: ${max}₽` };
  }
  
  return { isValid: true, message: '' };
};


export const validateRentalTime = (hours, maxHours = 720) => { // 30 дней
  const numericHours = Number(hours);
  
  if (isNaN(numericHours) || numericHours <= 0) {
    return { isValid: false, message: 'Время должно быть положительным числом' };
  }
  
  if (numericHours < 1) {
    return { isValid: false, message: 'Минимальное время: 1 час' };
  }
  
  if (numericHours > maxHours) {
    return { isValid: false, message: `Максимальное время: ${maxHours} часов` };
  }
  
  if (!Number.isInteger(numericHours)) {
    return { isValid: false, message: 'Время должно быть целым числом' };
  }
  
  return { isValid: true, message: '' };
};


export const validateVerificationData = (platform, username) => {
  const validPlatforms = ['discord', 'telegram', 'vk', 'other'];
  
  if (!platform || platform.trim() === '') {
    return { isValid: false, message: 'Платформа обязательна' };
  }
  
  if (!validPlatforms.includes(platform.toLowerCase())) {
    return { isValid: false, message: 'Неверная платформа' };
  }
  
  if (!username || username.trim() === '') {
    return { isValid: false, message: 'Имя пользователя обязательно' };
  }
  
  if (username.length < 2) {
    return { isValid: false, message: 'Имя пользователя слишком короткое' };
  }
  
  if (username.length > 50) {
    return { isValid: false, message: 'Имя пользователя слишком длинное' };
  }
  
  return { isValid: true, message: '' };
};


export const validateReview = (rating, comment = '') => {
  const numericRating = Number(rating);
  
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return { isValid: false, message: 'Рейтинг должен быть от 1 до 5' };
  }
  
  if (comment && comment.length > 1000) {
    return { isValid: false, message: 'Комментарий не должен превышать 1000 символов' };
  }
  
  return { isValid: true, message: '' };
};


export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    maxFiles = 1
  } = options;
  
  if (!file) {
    return { isValid: false, message: 'Файл обязателен' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, message: `Файл слишком большой. Максимум: ${maxSize / 1024 / 1024}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Неверный формат файла. Разрешены: JPEG, PNG, PDF' };
  }
  
  return { isValid: true, message: '' };
};


export const validateAccountData = (accountData) => {
  const errors = [];
  
  if (!accountData.title || accountData.title.trim() === '') {
    errors.push('Название аккаунта обязательно');
  }
  
  if (!accountData.description || accountData.description.trim() === '') {
    errors.push('Описание аккаунта обязательно');
  }
  
  if (!accountData.account_number || isNaN(accountData.account_number)) {
    errors.push('Номер аккаунта должен быть числом');
  }
  

  try {
    const characters = typeof accountData.characters === 'string' 
      ? JSON.parse(accountData.characters) 
      : accountData.characters;
    
    if (typeof characters !== 'object' || characters === null) {
      errors.push('Неверный формат характеристик');
    }
  } catch (e) {
    errors.push('Ошибка парсинга характеристик');
  }
  

  try {
    const price = typeof accountData.price === 'string' 
      ? JSON.parse(accountData.price) 
      : accountData.price;
    
    if (typeof price !== 'object' || price === null) {
      errors.push('Неверный формат цен');
    }
  } catch (e) {
    errors.push('Ошибка парсинга цен');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};


export const createValidator = (validations) => {
  return (data) => {
    const errors = {};
    let isValid = true;
    
    for (const [field, validation] of Object.entries(validations)) {
      const value = data[field];
      const result = validation(value, data);
      
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
    
    return { isValid, errors };
  };
};


export const orderValidations = {
  hours: (value) => validateRentalTime(value),
  platform: (value, data) => validateVerificationData(value, data.username),
  username: (value, data) => validateVerificationData(data.platform, value)
};

export const validateOrder = createValidator(orderValidations);