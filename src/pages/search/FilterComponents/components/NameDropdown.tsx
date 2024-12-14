import React, { useEffect, useState } from 'react'
import styles from './../../styles.module.css'
import { useDispatch } from 'react-redux'
import { setUserName } from '@/redux/slices/search'

type NameDropdownProps = {
  inputRef: React.RefObject<HTMLDivElement> | null
  nameDropdownList: string[]
  searchNameRef: React.RefObject<HTMLDivElement>
  focusedNameIdx: number
  setCurrUserName: (name: string) => void
}
const NameDropdown: React.FC<NameDropdownProps> = ({
  inputRef,
  nameDropdownList,
  searchNameRef,
  focusedNameIdx,
  setCurrUserName,
}) => {
  const [openAbove, setOpenAbove] = useState(false)
  const dispatch = useDispatch()
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

  return (
    <div
      className={`${styles.dropdownHobby}
       ${openAbove ? styles['dropdownHobby-below-70vh'] : ''} `}
      ref={searchNameRef}
    >
      {nameDropdownList?.map((name: string, index: number) => {
        return (
          <p
            key={index}
            onClick={() => {
              dispatch(setUserName(name))
              setCurrUserName(name)
            }}
            className={
              index === focusedNameIdx ? styles['dropdown-option-focus'] : ''
            }
          >
            {name}
          </p>
        )
      })}
    </div>
  )
}

export default NameDropdown
