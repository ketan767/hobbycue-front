import React from 'react'
import styles from './Dropdown.module.css'

const DropdownOption = ({
  selected,
  display,
  onChange,
  isHovered
}: {
  selected: boolean
  display: string
  onChange: () => void
  isHovered:boolean
}) => {
  return (
    <div className={styles['value-container']}>
      <p
        className={`${styles['dropdown-value']} ${
          selected ? styles['dropdown-value-active'] : ''
        } ${isHovered ? styles['hovered-single-option'] : ''}`}
        onClick={() => onChange()}
      >
        {display}
      </p>
    </div>
  )
}

export default DropdownOption
