import React, { useState, useRef, useEffect } from 'react'
import styles from './select.module.css'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import Image from 'next/image'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'

type Props = {
  options?: any
  onChange: any
  value: any
  children: any
  className?: any
}

const InputSelect: React.FC<Props> = ({
  options,
  onChange,
  value,
  children,
  className,
}) => {
  const [active, setActive] = useState(false)
  const toggle = () => setActive(!active)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const closeDropdown = () => {
      setActive(false)
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

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation() // Prevent the click event from propagating to the document
    toggle()
  }

  const handleChildClick = () => {
    setActive(false)
  }

  return (
    <div className={`${styles.container} ${className ? className : ''}`}>
      <header className={styles.header} onClick={handleHeaderClick}>
        <p>{value ? value : 'Select...'}</p>
        <Image src={ChevronDown} alt="arrow" />
      </header>
      <div
        ref={dropdownRef}
        className={`${styles['options-container']} ${
          active ? styles['active'] : ''
        }`}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onClick: handleChildClick }),
        )}
      </div>
    </div>
  )
}

export default InputSelect
