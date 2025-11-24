// components/animations/PageTransition/PageTransition.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

const PageTransition = ({ children, duration = 300 }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [location.pathname, children, duration]);

  return (
    <div className={styles.pageTransition}>
      <div 
        className={`${styles.transitionContainer} ${isTransitioning ? styles.transitioning : ''}`}
        style={{ '--duration': `${duration}ms` }}
      >
        {displayChildren}
      </div>
    </div>
  );
};

export default PageTransition;