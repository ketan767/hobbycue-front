import React, { useEffect, useState } from 'react'
import styles from './../../styles.module.css'

type LocationDropdownProps = {
  inputRef: React.RefObject<HTMLDivElement> | null
  suggestions: any[]
  locationDropdownRef: React.RefObject<HTMLDivElement>
  focusedLocationIdx: number
  setLocation: (location: string) => void
  handleSelectAddressTwo: any
}
const LocationDropdown: React.FC<LocationDropdownProps> = ({
  inputRef,
  suggestions,
  locationDropdownRef,
  focusedLocationIdx,
  setLocation,
  handleSelectAddressTwo,
}) => {
  const [openAbove, setOpenAbove] = useState(false)

  useEffect(() => {
    const checkPosition = () => {
      if (inputRef && inputRef.current) {
        const seventyVh = window.innerHeight * 0.7
        const rect = inputRef.current.getBoundingClientRect()

        if (rect.top > seventyVh) {
          setOpenAbove(true)
        } else {
          setOpenAbove(false)
        }
      }
    }
    checkPosition()

    window.addEventListener('scroll', checkPosition)
    window.addEventListener('resize', checkPosition)

    return () => {
      window.removeEventListener('scroll', checkPosition)
      window.removeEventListener('resize', checkPosition)
    }
  }, [])
  return (
    <div
      className={`${styles.dropdown}
       ${openAbove ? styles['dropdownLocation-below-70vh'] : ''} 
       `}
      ref={locationDropdownRef}
    >
      {suggestions.map((suggestion, index) => (
        <p
          onClick={() => {
            handleSelectAddressTwo(
              suggestion.description.join(', '),
              suggestion.place_id,
            )
            setLocation(suggestion.description[0])
          }}
          key={index}
          className={
            index === focusedLocationIdx ? styles['dropdown-option-focus'] : ''
          }
        >
          {suggestion.description.join(', ')}
        </p>
      ))}
    </div>
  )
}

export default LocationDropdown
