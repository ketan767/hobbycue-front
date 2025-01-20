import React, { useState, useRef, useEffect } from 'react'
import styles from './dropdown.module.css'
import { MenuItem } from '@mui/material'
import ChevronDown from '@/assets/svg/chevron-up.svg'
import Image from 'next/image'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setIsPinCode } from '@/redux/slices/post'
import Link from 'next/link'

type Props = {
  type: String
  value: String
  currentValue?: String
  selected?: boolean
  display: String
  image?: string
  options: any
  onChange: any
  _id: any
  item?: any
  className?: string
  setOpenOptionsTracker?: React.Dispatch<React.SetStateAction<number>>
}

export const DropdownOption: React.FC<Props> = (props) => {
  const {
    value,
    type,
    display,
    image,
    options,
    onChange,
    currentValue,
    _id,
    selected,
    item,
    className,
    setOpenOptionsTracker = () => {},
  } = props
  const { activeProfile, user } = useSelector((state: any) => state.user)
  const { activeModal } = useSelector((state: RootState) => state.modal)
  const [active, setActive] = useState(
    user?.primary_address?._id === _id ? true : false,
  )

  const dispatch = useDispatch()

  const toggle = (e: any) => {
    e.stopPropagation()
    setOpenOptionsTracker((prev: number) => {
      return active ? prev - 1 : prev + 1
    })
    setActive(!active)
  }

  if (type === 'hobby') {
    return (
      <div className={styles['value-container'] + ' ' + styles['no-border']}>
        <p
          className={`${styles['dropdown-value']} ${
            selected ? styles['dropdown-value-active'] : ''
          }`}
          onClick={() => onChange(item)}
        >
          {image && (
            <Image
              src={image}
              width={100}
              height={100}
              alt=""
              className={styles['dropdown-image']}
            />
          )}
          {display}
        </p>
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className={styles['value-container'] + ` ${className}`}>
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
    <>
      <div
        data-column="2"
        className={styles['dropdown-container'] + ` ${className}`}
      >
        <aside
          className={`
    ${styles['heading']} ${
            activeModal === 'create-post'
              ? styles['create-post-width']
              : styles['community-dropdown-width']
          }
    ${currentValue === display?.split(' ')[0] ? styles['city-select'] : ''} 
    ${active ? styles['active'] : ''}
  `}
          onClick={() => {
            if (display?.includes('PIN Code')) dispatch(setIsPinCode(true))
            else dispatch(setIsPinCode(false))

            onChange(display.split(' ')[0])
          }}
        >
          <p>{display}</p>
        </aside>
        <aside
          className={`${styles['drop-down']} ${
            activeModal === 'create-post' && styles['drop-down-createpost']
          }`}
          onClick={toggle}
        >
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
                onClick={() => {
                  if (option?.display?.includes('PIN Code'))
                    dispatch(setIsPinCode(true))
                  else dispatch(setIsPinCode(false))

                  onChange(option.value)
                }}
              >
                {option.display}
              </p>
            )
          })}
        </div>
      </div>
    </>
  )
}
