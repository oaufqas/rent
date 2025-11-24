// components/animations/SlideUp/SlideUp.jsx
import { useEffect, useRef, useState } from 'react';
import styles from './SlideUp.module.css';

const SlideUp = ({ 
  children, 
  delay = 0, 
  duration = 800, 
  distance = 50,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
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
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '-50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, triggerOnce]);

  return (
    <div
      ref={elementRef}
      className={`${styles.slideUp} ${isVisible ? styles.visible : ''} ${className}`}
      style={{
        '--delay': `${delay}ms`,
        '--duration': `${duration}ms`,
        '--distance': `${distance}px`,
        '--easing': easing
      }}
    >
      {children}
    </div>
  );
};

export default SlideUp;