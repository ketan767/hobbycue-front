import React from 'react'
import styles from './Dropdown.module.css'

const DropdownOption = ({
  selected,
  display,
  onChange,
}: {
  selected: boolean
  display: string
  onChange: () => void
}) => {
  return (
    <div className={styles['value-container']}>
      <p
        className={`${styles['dropdown-value']} ${
          selected ? styles['dropdown-value-active'] : ''
        }`}
        onClick={() => onChange()}
      >
        {display}
      </p>
    </div>
  )
}

export default DropdownOption
