import React, { useEffect, useState } from 'react'
import styles from './../../styles.module.css'
import { useDispatch } from 'react-redux'
import { setPostedBy, setUserName } from '@/redux/slices/search'

type PostedByDropdownProps = {
  inputRef: React.RefObject<HTMLDivElement> | null
  postedByDropdownList: string[]
  postedByRef: React.RefObject<HTMLDivElement>
  focusedPostedByIdx: number
  setCurrPostedBy: (name: string) => void
}
const PostedByDropdown: React.FC<PostedByDropdownProps> = ({
  inputRef,
  postedByDropdownList,
  postedByRef,
  focusedPostedByIdx,
  setCurrPostedBy,
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
      ref={postedByRef}
    >
      {postedByDropdownList?.map((name: string, index: number) => {
        return (
          <p
            key={index}
            onClick={() => {
              dispatch(setPostedBy(name))
              setCurrPostedBy(name)
            }}
            className={
              index === focusedPostedByIdx
                ? styles['dropdown-option-focus']
                : ''
            }
          >
            {name}
          </p>
        )
      })}
    </div>
  )
}

export default PostedByDropdown
