import React, { useState, useRef } from 'react'
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
  className
}) => {
  const [active, setActive] = useState(false)
  const toggle = () => setActive(!active)
  const dropdownRef = useRef(null)

  useOutsideAlerter(dropdownRef, () => setActive(false))

  return (
    <div className={`${styles.container} ${className ? className : ''}`}>
      <header className={styles.header} onClick={toggle}>
        <p>{value ? value : 'Select...'}</p>
        <Image src={ChevronDown} alt="arrow" />
      </header>
      <div ref={dropdownRef} className={`${styles['options-container']} ${active ? styles['active'] : ''} `}>{children}</div>
    </div>
  )
}

export default InputSelect
