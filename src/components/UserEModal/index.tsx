import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from './UserEModal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: (() => void) | React.Dispatch<React.SetStateAction<any>>
  children: React.ReactNode
}

const ModalWrapper: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      setTimeout(() => setIsAnimating(false), 300) // Match animation duration
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  return ReactDOM.createPortal(
    <div
      className={`${styles.modalOverlay} ${isOpen ? styles.showOverlay : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modalContent} ${
          isOpen ? styles.slideIn : styles.slideOut
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement,
  )
}

export default ModalWrapper
