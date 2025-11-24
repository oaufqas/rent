// components/animations/FadeIn/FadeIn.jsx
import { useEffect, useRef, useState } from 'react';
import styles from './FadeIn.module.css';

const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 600, 
  direction = 'up', 
  distance = 30,
  triggerOnce = true,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [triggerOnce]);

  return (
    <div
      ref={elementRef}
      className={`${styles.fadeIn} ${isVisible ? styles.visible : ''} ${className}`}
      style={{
        '--delay': `${delay}ms`,
        '--duration': `${duration}ms`,
        '--distance': `${distance}px`,
        '--direction': direction
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;