import Image from 'next/image'
import styles from './styles.module.css'
import DownArrow from '@/assets/svg/DownArrow.svg'
import React, { useEffect, useRef, useState } from 'react'
import useOutsideClick from '@/hooks/useOutsideClick'
import { ArrowDropDown } from '@mui/icons-material'

type Props = {
  options: any
  iconOptions?: any
  onOptionClick?: any
  value?: any
  valueIndex?: number
  search?: boolean
  optionsPosition?: 'top' | 'bottom'
  dropdownIcon?: boolean
  dropdownHeaderClass?: string
  positionClass?: string
}

const DropdownMenu: React.FC<Props> = ({
  options,
  iconOptions,
  onOptionClick,
  value,
  valueIndex,
  search,
  optionsPosition,
  dropdownIcon,
  dropdownHeaderClass,
  positionClass,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionWrapperRef = useRef<HTMLDivElement>(null)
  const optionRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [refPostion,setRefPosition] = useState<{top:undefined|number,bottom:undefined|number}>({top:undefined,bottom:undefined})
  const [optionIndex, setOptionIndex] = useState(-1)
  const [inputValue, setInputValue] = useState('')
  const [displayOptions, setDisplayOptions] = useState(
    iconOptions
      ? options.map((option: any, idx: number) => {
          return { title: option, img: iconOptions[idx] || null }
        })
      : options.map((option: any, idx: number) => {
          return { title: option, img: null }
        }),
  )

  const handleShowDropdown = () => {
    setShowDropdown((prevValue) => !prevValue)
  }

  useOutsideClick(dropdownRef, () => {
    setShowDropdown(false)
  })

  useEffect(() => {
    if (optionsPosition === 'top') {
      if (refPostion.top === undefined) {
        if (optionWrapperRef.current) {
          const rect = optionWrapperRef.current.getBoundingClientRect()
          if (rect.top > 0) {
            let newTopValue: any
            if (dropdownRef.current?.getBoundingClientRect) {
              newTopValue =
                rect.top -
                rect.height -
                dropdownRef.current?.getBoundingClientRect()?.height -
                5
            }
            if (!isNaN(Number(newTopValue))) {
              setRefPosition((prev) => ({ ...prev, top: newTopValue }))
            }
            optionWrapperRef.current.style.top = `${newTopValue}px`
          }
        }
      }
    } else if (optionsPosition === 'bottom') {
      if (refPostion.bottom === undefined) {
        if (optionWrapperRef.current) {
          const rect = optionWrapperRef.current.getBoundingClientRect()
          if (rect.top > 0) {
            let newTopValue: any
            if (dropdownRef.current?.getBoundingClientRect) {
              newTopValue = rect.top + 5
            }
            if (!isNaN(Number(newTopValue))) {
              setRefPosition((prev) => ({ ...prev, bottom: newTopValue }))
            }
            optionWrapperRef.current.style.top = `${newTopValue}px`
          }
        }
      }
    }
  }, [showDropdown, optionsPosition])

  useEffect(() => {
    const filteredOptions = options
      .filter((option: string) =>
        option.toLowerCase().includes(inputValue.toLowerCase()),
      )
      .map((option: string) => ({
        title: option,
        img: iconOptions ? iconOptions[options.indexOf(option)] || null : null,
      }))

    setDisplayOptions(filteredOptions)
  }, [iconOptions, inputValue, options])

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
      <div
        tabIndex={0}
        className={`${dropdownHeaderClass ? dropdownHeaderClass : ''} ${
          styles['dropdown-select']
        }`}
        onClick={handleShowDropdown}
      >
        <p>{value}</p>
        {dropdownIcon && (
          <ArrowDropDown
            color="action"
            className={showDropdown ? styles['rotate-180'] : ''}
          />
        )}
      </div>
      <div
        className={`${positionClass??""} ${styles['dropdown-options-wrapper']}${
          showDropdown ? '' : ' ' + styles['display-none']
        }`}
        ref={optionWrapperRef}
      >
        {search === true && (
          <>
            <input type="text" placeholder="Search..." value={inputValue} />
            <hr className={styles['modal-hr']} />
          </>
        )}
        <div className={styles['dropdown-options-container']}>
          {displayOptions.map((item: any, idx: number) => {
            return (
              <div
                key={idx}
                id={`${options.findIndex(
                  (option: string, index: number) => item.title === option,
                )}`}
                className={`${styles['dropdown-option']}${
                  valueIndex ===
                  options.findIndex(
                    (option: string, index: number) => item.title === option,
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
                {item?.img !== undefined && item?.img !== null && (
                  <Image src={item.img} width={17} height={17} alt="" />
                )}
                {item.title}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DropdownMenu
