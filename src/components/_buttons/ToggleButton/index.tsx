import React from 'react'
import styles from './ToggleButton.module.css'

interface FilledButtonProps {
  children?: React.ReactNode
  handleToggle?: (data?: object) => void
  type?: 'button' | 'submit' | 'reset'
  isOn?: boolean
  data?: object
  loading?: boolean
  disable?: boolean
  inviteBtnRef?: React.RefObject<HTMLButtonElement>
}

const ToggleButton: React.FC<FilledButtonProps> = ({
  isOn = false, // Default to false
  handleToggle = () => {}, // Default to no-op
  data,
  disable = false,
}) => {
  return (
    <label className={styles.switch}>
      <input
        disabled={disable}
        type="checkbox"
        checked={isOn}
        onChange={() => handleToggle(data)}
      />
      <span className={styles.slider}></span>
    </label>
  )
}

export default ToggleButton
