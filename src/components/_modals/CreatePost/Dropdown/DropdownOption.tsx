import React, { useState, useRef } from 'react'
import styles from './dropdown.module.css'
import { MenuItem } from '@mui/material'
import ChevronDown from '@/assets/svg/chevron-up.svg'
import Image from 'next/image'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import { useSelector } from 'react-redux'

type Props = {
  type: String
  value: String
  currentValue?: String
  selected?:boolean
  display: String
  options: any
  onChange: any
  _id: any
  item?:any
  className?:string
}

export const DropdownOption: React.FC<Props> = (props) => {
  const { value, type, display, options, onChange, currentValue, _id, selected, item, className } = props
  const { activeProfile, user } = useSelector((state: any) => state.user)

  const [active, setActive] = useState(
    user?.primary_address?._id === _id ? true : false,
  )

  const toggle = (e: any) => {
    e.stopPropagation()
    setActive(!active)
  }

  if(type==='hobby'){
    return (
      <div className={styles['value-container']+" "+styles['no-border']}>
        <p
          className={`${styles['dropdown-value']} ${
            selected ? styles['dropdown-value-active'] : ''
          }`}
          onClick={() => onChange(item)}
        >
          {display}
        </p>
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className={styles['value-container']+` ${className}`}>
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
    <div data-column="2" className={styles['dropdown-container']+` ${className}`}>
      <aside
        className={`
    ${styles['heading']} 
    ${currentValue === display?.split(' ')[0] ? styles['city-select'] : ''} 
    ${active ? styles['active'] : ''}
  `}
        onClick={() => onChange(display.split(' ')[0])}
      >
        <p>{display}</p>
      </aside>
      <aside className={styles['drop-down']} onClick={toggle}>
        <Image
          src={ChevronDown}
          alt="arrow-down"
          className={`${styles['icon']} ${
            !active ? styles['icon-active'] : ''
          } `}
        />
      </aside>

      <div
        className={`${styles['dropdown-options']} ${
          active ? styles['active'] : ''
        } `}
      >
        {options?.map((option: any, idx: any) => {
          return (
            <p
              key={idx}
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
