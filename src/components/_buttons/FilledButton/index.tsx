import React from 'react'
import styles from './FilledButton.module.css'

interface FilledButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  loading?: boolean
  inviteBtnRef?:React.RefObject<HTMLButtonElement>
}

const FilledButton: React.FC<FilledButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  loading = false,
  inviteBtnRef
}) => {
  return (
    <button
      ref={inviteBtnRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${className}`}
      // style={{ width: '100%' }}
    >
      {children}
    </button>
  )
}

export default FilledButton
