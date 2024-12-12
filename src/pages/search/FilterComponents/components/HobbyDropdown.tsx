"use client"
import React, { useEffect, useState } from 'react'
import styles from './../../styles.module.css'
type DropdownListItem = {
  _id: string
  display: string
  sub_category?: { _id: string; display: string }
}
type ExtendedDropdownListItem = DropdownListItem & {
  category?: { _id: string; display: string }
}
type HobbyDropdownProps = {
  inputRef: React.RefObject<HTMLDivElement> | null
  hobbyDropdownList: ExtendedDropdownListItem[]
  searchHobbyRef: React.RefObject<HTMLDivElement>
  focusedHobbyIndex: number
  setSelectedHobby: (hobby: string) => void
}
const HobbyDropdown: React.FC<HobbyDropdownProps> = ({
  inputRef,
  hobbyDropdownList,
  searchHobbyRef,
  focusedHobbyIndex,
  setSelectedHobby,
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
  }, [inputRef])

  if (!hobbyDropdownList || hobbyDropdownList.length === 0) return null

  return (
    <div
      className={`${styles.dropdownHobby}
       ${openAbove ? styles['dropdownHobby-below-70vh'] : ''} `}
      ref={searchHobbyRef}
    >
      {hobbyDropdownList.map((hobby: any, index: number) => {
        return (
          <p
            key={hobby._id}
            onClick={() => {
              // dispatch(setHobby(hobby.display))
              setSelectedHobby(hobby.display)
            }}
            className={`${
              index === focusedHobbyIndex ? styles['dropdown-option-focus'] : ''
            } `}
          >
            {hobby.display}
          </p>
        )
      })}
    </div>
  )
}

export default HobbyDropdown
