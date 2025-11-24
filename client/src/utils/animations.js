// utils/animations.js

/**
 * Генерация CSS transition с задержками для stagger анимаций
 */
export const createStaggerAnimation = (count, baseDelay = 100, step = 100) => {
  const transitions = {};
  for (let i = 0; i < count; i++) {
    transitions[`&:nth-child(${i + 1})`] = {
      transitionDelay: `${baseDelay + i * step}ms`
    };
  }
  return transitions;
};

/**
 * Пресеты анимаций для разных элементов
 */
export const animationPresets = {
  // Для карточек аккаунтов
  accountCard: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  
  // Для модальных окон
  modal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  
  // Для уведомлений
  notification: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  
  // Для кнопок
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

/**
 * Генератор keyframes для CSS анимаций
 */
export const keyframes = {
  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `,
  
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `,
  
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(220, 38, 38, 0.3); }
      50% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.6); }
    }
  `,
  
  slideInFromBottom: `
    @keyframes slideInFromBottom {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `
};

/**
 * CSS классы для анимаций
 */
export const animationClasses = {
  shake: 'animate-shake',
  pulse: 'animate-pulse',
  glow: 'animate-glow',
  slideIn: 'animate-slide-in'
};

/**
 * Хелпер для управления анимациями
 */
export class AnimationManager {
  static async waitForAnimation(element, animationName) {
    return new Promise((resolve) => {
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      
      element.addEventListener('animationend', handleAnimationEnd);
      element.classList.add(animationName);
    });
  }
  
  static stagger(elements, baseDelay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, baseDelay * index);
    });
  }
}