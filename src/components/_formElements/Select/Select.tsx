import React, { useState, useRef, useEffect } from 'react'
import styles from './select.module.css'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import Image from 'next/image'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import { toggleButtonClasses } from '@mui/material'
import DefaultPageImage from '@/assets/svg/default-images/default-people-listing-icon.svg'

type Props = {
  options?: any
  onChange?: any
  value: any
  children: any
  className?: any
  selectText?: string
  optionsContainerClass?: string
  optionsContainerUnactiveClass?: string
  type?: 'page'
  img?: string
  openDropdown?: boolean
  setOpenDropdown?: (val: boolean) => void
}

const InputSelect: React.FC<Props> = ({
  options,
  onChange,
  value,
  children,
  className,
  selectText,
  optionsContainerClass,
  optionsContainerUnactiveClass,
  type,
  img,
  openDropdown,
  setOpenDropdown,
}) => {
  const [active, setactive] = useState(false)
  const toggle = () => {
    if (openDropdown && setOpenDropdown) {
      setOpenDropdown(!openDropdown)
    }
    setactive(!active)
  }
  const dropdownRef = useRef(null)

  useEffect(() => {
    const closeDropdown = () => {
      setactive(false)
      if (setOpenDropdown) setOpenDropdown(false)
    }

    if (active) {
      document.addEventListener('click', closeDropdown)
    } else {
      document.removeEventListener('click', closeDropdown)
    }

    return () => {
      document.removeEventListener('click', closeDropdown)
    }
  }, [active])

  useEffect(() => {
    if (openDropdown) {
      setactive(true)
    }
  }, [openDropdown])

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    toggle()
  }

  const handleChildClick = () => {
    setactive(false)
    if (openDropdown && setOpenDropdown) {
      setOpenDropdown(false)
    }
  }

  const notSelected =
    value == 'All Locations' &&
    value == 'Select...' &&
    value == null &&
    value == undefined &&
    value == 'All Hobbies'

  return (
    <div
      style={{ backgroundColor: `${notSelected && '#8064a2'}` }}
      className={`${styles.container} ${className ? className : ''}`}
    >
      <header className={styles.header} onClick={handleHeaderClick}>
        {type && type === 'page' ? (
          <div className={styles['page-type']}>
            {value && <img src={img ?? DefaultPageImage.src} alt="" />}
            <p>{value ? value : selectText ?? 'Select...'}</p>
          </div>
        ) : (
          <p>{value ? value : selectText ?? 'Select...'}</p>
        )}
        {/* <Image src={ChevronDown} alt="arrow" /> */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ rotate: active ? '180deg' : '0deg' }}
        >
          <g id="expand_more_black_24dp 1" clip-path="url(#clip0_173_70421)">
            <path
              id="Vector"
              d="M10.5867 6.195L7.99999 8.78167L5.41332 6.195C5.15332 5.935 4.73332 5.935 4.47332 6.195C4.21332 6.455 4.21332 6.875 4.47332 7.135L7.53332 10.195C7.79332 10.455 8.21332 10.455 8.47332 10.195L11.5333 7.135C11.7933 6.875 11.7933 6.455 11.5333 6.195C11.2733 5.94167 10.8467 5.935 10.5867 6.195Z"
              fill="#6D747A"
            />
          </g>
          <defs>
            <clipPath id="clip0_173_70421">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </header>
      <div
        ref={dropdownRef}
        className={`${styles['options-container']} ${
          active? styles['active'] : ''
        }
        ${optionsContainerUnactiveClass ?? ''}
        ${active? optionsContainerClass ?? '' : ''} 
        ${className ? className : ''} 
        `}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onClick: handleChildClick }),
        )}
      </div>
    </div>
  )
}

export default InputSelect
