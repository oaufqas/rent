import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Блокируем скролл body
      document.body.style.overflow = 'hidden'
      
      // Прокручиваем непосредственно к модальному окну
      modalRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'relative' }}>
          {/* Невидимый якорь для прокрутки */}
          <div 
            id="modal-anchor" 
            style={{ 
              position: 'absolute', 
              top: '50vh', 
              left: 0,
              height: '1px',
              width: '1px'
            }} 
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={onClose}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${styles.modal} ${styles[size]}`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className={styles.header}>
                {title && <h2 className={styles.title}>{title}</h2>}
                <button 
                  onClick={onClose} 
                  className={styles.closeBtn}
                  aria-label="Закрыть модальное окно"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.content}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal