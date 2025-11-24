// components/animations/HoverGlow/HoverGlow.jsx
import { useState } from 'react';
import styles from './HoverGlow.module.css';

const HoverGlow = ({ 
  children, 
  intensity = 'medium',
  color = 'accent',
  borderRadius = '8px',
  className = '',
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      className={`${styles.hoverGlow} ${styles[intensity]} ${styles[color]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
        '--border-radius': borderRadius
      }}
    >
      <div className={styles.glowEffect} data-hovered={isHovered} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default HoverGlow;