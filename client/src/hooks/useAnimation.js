export const useAnimation = () => {
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" }
  }

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }

  const hoverGlow = {
    initial: { boxShadow: '0 0 0px rgba(220, 38, 38, 0)' },
    hover: { 
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
      scale: 1.02 
    }
  }

  return {
    pageTransition,
    staggerContainer,
    fadeInUp,
    scaleIn,
    hoverGlow
  }
}