'use client'

import React, { useEffect, useState } from 'react'
import styles from '../AccordianMenu.module.css'
type DropdownListItem = {
  _id: string
  Description: string
  Show: string
  pageType: string
  listingCategory: string
}
type CategoryDropdownProps = {
  inputRef: React.RefObject<HTMLDivElement> | null
  searchCategoryRef: React.RefObject<HTMLDivElement>
  filteredDropdownList: DropdownListItem[]
  setSelectedCategory: (cat: string) => void
  setSelectedPageType: (pt: string) => void
  categoryIndex: number
}
const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  inputRef,
  searchCategoryRef,
  filteredDropdownList,
  setSelectedCategory,
  setSelectedPageType,
  categoryIndex,
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
  if (!filteredDropdownList || filteredDropdownList.length === 0) return null

  return (
    <div
      className={`${styles.dropdownCategory}
       ${openAbove ? styles['dropdownCategory-below-70vh'] : ''} `}
      ref={searchCategoryRef}
    >
      {filteredDropdownList.map((category, index: number) => {
        return (
          <p
            key={category._id}
            onClick={() => {
              setSelectedCategory(category.listingCategory)
              setSelectedPageType('')
            }}
            className={`${styles['text-left']} ${
              index === categoryIndex ? styles['dropdown-option-focus'] : ''
            }`}
          >
            {category.listingCategory}
          </p>
        )
      })}
    </div>
  )
}

export default CategoryDropdown
