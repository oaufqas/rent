// components/animations/AnimatedRoute/AnimatedRoute.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AnimatedRoute.module.css';

const AnimatedRoute = ({ 
  children, 
  animation = 'fade',
  duration = 400,
  className = '' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsAnimating(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [location.pathname, children, duration]);

  return (
    <div 
      className={`${styles.animatedRoute} ${styles[animation]} ${isAnimating ? styles.animating : ''} ${className}`}
      style={{ '--duration': `${duration}ms` }}
    >
      {displayChildren}
    </div>
  );
};

export default AnimatedRoute;