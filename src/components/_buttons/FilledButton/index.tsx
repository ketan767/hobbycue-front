import React from 'react'
import styles from './FilledButton.module.css'

interface FilledButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

const FilledButton: React.FC<FilledButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${className}`}
      style={{ width: '100%' }}
    >
      {children}
    </button>
  )
}

export default FilledButton
