import { useState, useRef, useEffect } from 'react'
import styles from './CustomSelect.module.css'

interface CustomSelectProps {
  options: string[]
  onChange?: (selected: string) => void
  value?: string
  disabled?: boolean
}

export default function CustomSelect({
  options,
  onChange,
  value,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string>(value || options[0])
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev)
  }
  const handleOptionClick = (option: string) => {
    if (disabled) return
    setSelected(option)
    setIsOpen(false)
    if (onChange) onChange(option)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={disabled ? styles.customSelectDisabled : styles.customSelect}
      ref={dropdownRef}
    >
      <div
        className={styles.selectBox}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        onClick={toggleDropdown}
      >
        <span className={disabled ? styles.optionDisabled : styles.selected}>
          {selected}
        </span>
      </div>
      {isOpen && !disabled && (
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <div
              key={index}
              className={`${styles.option} ${
                disabled ? styles.disabledOption : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
