import React, { KeyboardEventHandler } from 'react'
import styles from './OutlinedButton.module.css'

interface OutlinedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  onKeyDown?:KeyboardEventHandler<HTMLButtonElement>
}

const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  onKeyDown
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`${styles.button} ${className}`}
    >
      {children}
    </button>
  )
}

export default OutlinedButton
