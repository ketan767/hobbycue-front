import React, { useState, useRef } from 'react'
import styles from './dropdown.module.css'
import { MenuItem } from '@mui/material'
import ChevronDown from '@/assets/svg/chevron-up.svg'
import Image from 'next/image'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'

type Props = {
  type: String
  value: String
  currentValue: String
  display: String
  options: any
  onChange: any
}

export const DropdownOption: React.FC<Props> = (props) => {
  const { value, type, display, options, onChange, currentValue } = props
  const [active, setActive] = useState(true)

  const toggle = () => setActive(!active)

  if (type === 'text') {
    return (
      <div className={styles['value-container']} >
        <p
          className={`${styles['dropdown-value']} ${
            currentValue === value ? styles['dropdown-value-active'] : ''
          }`}
          onClick={() => onChange(value)}
        >
          {display}
        </p>
      </div>
    )
  }
  return (
    <div className={styles['dropdown-container']}>
      <div className={styles['heading']} onClick={toggle}>
        <p>{display}</p>
        <Image
          src={ChevronDown}
          alt="arrow-down"
          className={`${styles['icon']} ${
            active ? styles['icon-active'] : ''
          } `}
        />
      </div>
      <div
        className={`${styles['dropdown-options']} ${
          active ? styles['active'] : ''
        } `}
      >
        {options?.map((option: any, idx: any) => {
          return (
            <p key={idx}
              className={`${styles['dropdown-value']} ${
                currentValue === option.value ? styles['option-active'] : ''
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.display}
            </p>
          )
        })}
      </div>
    </div>
  )
}
