import Image from 'next/image'
import styles from './styles.module.css'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import React, { useEffect, useRef, useState } from 'react'
import useOutsideClick from '@/hooks/useOutsideClick'

type Props = {
  options: any
  onOptionClick?: any
  value?: any
  valueIndex?: number
  search?: boolean
  optionsPosition?: 'top' | 'bottom'
}

const DropdownMenu: React.FC<Props> = ({
  options,
  onOptionClick,
  value,
  valueIndex,
  search,
  optionsPosition,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionWrapperRef = useRef<HTMLDivElement>(null)
  const optionRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [optionIndex, setOptionIndex] = useState(-1)
  const [inputValue, setInputValue] = useState('')
  const [displayOptions, setDisplayOptions] = useState(options)

  const handleShowDropdown = () => {
    setShowDropdown((prevValue) => !prevValue)
  }

  useOutsideClick(dropdownRef, () => {
    setShowDropdown(false)
  })

  useEffect(() => {
    if (optionsPosition === 'top') {
      if (optionWrapperRef.current) {
        const rect = optionWrapperRef.current.getBoundingClientRect()
        if (rect.top > 0) {
          let newTopValue
          if (dropdownRef.current?.getBoundingClientRect) {
            newTopValue =
              rect.top -
              rect.height -
              dropdownRef.current?.getBoundingClientRect()?.height -
              5
          }
          optionWrapperRef.current.style.top = `${newTopValue}px`
        }
      }
    } else if (optionsPosition === 'bottom') {
      if (optionWrapperRef.current) {
        const rect = optionWrapperRef.current.getBoundingClientRect()
        if (rect.top > 0) {
          let newTopValue
          if (dropdownRef.current?.getBoundingClientRect) {
            newTopValue = rect.top + 5
          }
          optionWrapperRef.current.style.top = `${newTopValue}px`
        }
      }
    }
  }, [showDropdown, optionsPosition])

  useEffect(() => {
    setDisplayOptions(
      options.filter((option: string, idx: number) => {
        if (option.toLowerCase().includes(inputValue.toLowerCase())) {
          return option
        }
      }),
    )
  }, [inputValue, options])

  useEffect(() => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      e.preventDefault()
      if (search) {
        if (/^[a-zA-Z]$/.test(e.key)) {
          setInputValue((prevValue) => prevValue + e.key)
          return
        }
        if (/^\d$/.test(e.key)) {
          setInputValue((prevValue) => prevValue + e.key)
          return
        }
      }
      switch (e.key) {
        case 'ArrowDown':
          if (optionIndex < options.length) {
            setOptionIndex((prevValue) => {
              return prevValue + 1
            })
          }
          break
        case 'ArrowUp':
          if (optionIndex > -1) {
            setOptionIndex((prevValue) => {
              return prevValue - 1
            })
          }
          break
        case 'Backspace':
          if (inputValue.length > 0) {
            setInputValue((prevValue) =>
              prevValue.slice(0, prevValue.length - 1),
            )
          }
          break
        case 'Enter':
          setOptionIndex((prevValue) => {
            return prevValue
          })
          if (optionIndex > -1 && optionIndex < options.length) {
            onOptionClick(optionRef.current)
            setOptionIndex(-1)
            setShowDropdown(false)
          }
          break
        default:
          break
      }
    }

    if (showDropdown) {
      window.addEventListener(
        'keydown',
        handleKeyDown as unknown as (e: KeyboardEvent) => void,
      )
    }
    if (showDropdown && optionRef.current) {
      optionRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
      })
    }
    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown as unknown as (e: KeyboardEvent) => void,
      )
    }
  }, [showDropdown, optionIndex, inputValue])

  return (
    <div className={styles['dropdown-wrapper']} ref={dropdownRef}>
      <div className={styles['dropdown-select']} onClick={handleShowDropdown}>
        <p>{value}-</p>
        {/* <Image src={ChevronDown} alt="arrow" width={20} height={20} /> */}
      </div>
      <div
        className={`${styles['dropdown-options-wrapper']}${
          showDropdown ? '' : ' ' + styles['display-none']
        }`}
        ref={optionWrapperRef}
      >
        {search === true && (
          <>
            <input type="text" placeholder="Search..." value={inputValue} />
            <hr />
          </>
        )}
        <div className={styles['dropdown-options-container']}>
          {displayOptions.map((item: any, idx: number) => {
            return (
              <div
                key={idx}
                id={`${options.findIndex(
                  (option: string, index: number) => item === option,
                )}`}
                className={`${styles['dropdown-option']}${
                  valueIndex ===
                  options.findIndex(
                    (option: string, index: number) => item === option,
                  )
                    ? ' ' + styles['selected-option']
                    : ''
                }${optionIndex === idx ? ' ' + styles['focused-option'] : ''}`}
                onClick={(e) => {
                  setOptionIndex(-1)
                  onOptionClick(e.target)
                  handleShowDropdown()
                }}
                ref={optionIndex === idx ? optionRef : null}
              >
                {item}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DropdownMenu
