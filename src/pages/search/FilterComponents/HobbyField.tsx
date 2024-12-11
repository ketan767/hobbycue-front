import { TextField } from '@mui/material'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import styles from '../styles.module.css'
import SearchIcon from '@/assets/svg/search.svg'
import { setHobby } from '@/redux/slices/explore'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '@/redux/store'
import { isEmptyField } from '@/utils'
import { getAllHobbies } from '@/services/hobby.service'
import useHandleUserProfileSearch from '../utils/HandleUserProSearch'
import useHandlePostsSearch from '../utils/HandlePostsSearch'
import useHandleSubmit from '../utils/HandleSubmit'

type HobbyProps = {
  filterPage?: string
  currUserName?: string
  currPostedBy?: string
  selectedCategory?: string
  selectedPageType?: string
  selectedLocation: string
  selectedHobby: string
  setSelectedHobby: (hobby: string) => void
}
type DropdownListItem = {
  _id: string
  display: string
  sub_category?: { _id: string; display: string }
}
type ExtendedDropdownListItem = DropdownListItem & {
  category?: { _id: string; display: string }
}

const HobbyField: React.FC<HobbyProps> = ({
  filterPage = '',
  currUserName = '',
  currPostedBy = '',
  selectedCategory,
  selectedPageType,
  selectedLocation,
  selectedHobby,
  setSelectedHobby,
}) => {
  const searchHobbyRef = useRef<HTMLInputElement>(null)
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false)
  const [isHobbySelected, setIsHobbySelected] = useState<boolean>(false)
  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    ExtendedDropdownListItem[]
  >([])
  const [focusedHobbyIndex, setFocusedHobbyIndex] = useState<number>(-1)
  const dispatch = useDispatch()
  const [currHobby, setCurrHobby] = useState<string>('')
  const router = useRouter()
  const { q = '', filter = '' } = router.query

  const handleUserProfileSearch = useHandleUserProfileSearch()
  const handlePostsSearch = useHandlePostsSearch()
  const handleSubmit = useHandleSubmit()

  const handleHobbyInputChange = async (e: any) => {
    // setHobby(e.target.value)
    // dispatch(setHobby(e.target.value))
    setSelectedHobby(e.target.value)

    setFocusedHobbyIndex(-1)

    if (isEmptyField(e.target.value)) return setHobbyDropdownList([])

    // const query = `fields=display,genre&level=5&level=3&level=2&level=1&level=0&show=true&search=${e.target.value}`
    const query = `fields=display,genre&level=5&level=3&level=2&level=1&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)

    if (err) return console.log(err)
    // Modify the sorting logic to prioritize items where the search keyword appears at the beginning
    const sortedHobbies = res.data.hobbies.sort((a: any, b: any) => {
      const indexA = a.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())
      const indexB = b.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())

      if (indexA === 0 && indexB !== 0) {
        return -1
      } else if (indexB === 0 && indexA !== 0) {
        return 1
      }

      return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
    })
    setHobbyDropdownList(sortedHobbies)
  }
  const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedHobbyIndex((prevIndex) =>
          prevIndex < hobbyDropdownList.length - 1 ? prevIndex + 1 : prevIndex,
        )
        break
      case 'ArrowUp':
        setFocusedHobbyIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        )
        break

      case 'Enter':
        e.stopPropagation()
        if (selectedHobby.length !== 0 && focusedHobbyIndex === -1) {
          if (filter === 'users' || filter === 'posts') {
          } else {
            handleSubmit(
              selectedCategory!,
              selectedPageType!,
              selectedHobby!,
              selectedLocation!,
            )
          }
        } else if (focusedHobbyIndex !== -1) {
          setShowHobbyDropdown(false)
          if (showHobbyDropdown) {
            const val =
              hobbyDropdownList[focusedHobbyIndex]?.display || selectedHobby
            // dispatch(setHobby(val))
            setSelectedHobby(val)
          }

          if (isHobbySelected) {
            if (filter === 'users' || (filterPage && filterPage === 'User') ) {
              handleUserProfileSearch(
                currUserName,
                selectedHobby,
                selectedLocation,
              )
            } else if (filter === 'posts') {
              handlePostsSearch(currPostedBy, selectedHobby, selectedLocation)
            } else {
              handleSubmit(
                selectedCategory!,
                selectedPageType!,
                selectedHobby!,
                selectedLocation!,
              )
            }
          }
          setIsHobbySelected(true)
          console.log('hobbyDropdownList', hobbyDropdownList)
        } else if (focusedHobbyIndex === -1 && selectedHobby.length !== 0) {
          setShowHobbyDropdown(false)
        }
        break
      default:
        break
    }

    // Scroll into view logic
    const container = searchHobbyRef.current
    const selectedItem = container?.children[focusedHobbyIndex] as HTMLElement

    if (selectedItem && container) {
      const containerRect = container.getBoundingClientRect()
      const itemRect = selectedItem.getBoundingClientRect()

      // Check if the item is out of view and adjust the scroll position
      if (itemRect.bottom + selectedItem.offsetHeight >= containerRect.bottom) {
        container.scrollTop +=
          itemRect.bottom - containerRect.bottom + selectedItem.offsetHeight + 5
      } else if (
        itemRect.top <=
        containerRect.top + selectedItem.offsetHeight
      ) {
        container.scrollTop -=
          containerRect.top - itemRect.top + selectedItem.offsetHeight + 5
      }
    }
  }
  return (
    <div className={styles.hobbySuggestion}>
      <Image
        src={SearchIcon}
        width={16}
        height={16}
        alt="SearchIcon"
        className={styles.searchIcon}
      />
      <TextField
        autoComplete="off"
        inputRef={searchHobbyRef}
        variant="standard"
        label="Hobby"
        size="small"
        name="hobby"
        className={styles.hobbySearch}
        onFocus={() => {
          setShowHobbyDropdown(true)
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key !== 'Enter') {
            setShowHobbyDropdown(true)
            setIsHobbySelected(false)
          }
          handleHobbyKeyDown(e)
        }}
        value={selectedHobby}
        onBlur={() =>
          setTimeout(() => {
            setShowHobbyDropdown(false)
          }, 300)
        }
        onChange={handleHobbyInputChange}
        sx={{
          '& label': {
            fontSize: '16px',
            paddingLeft: '24px',
          },
          '& label.Mui-focused': {
            fontSize: '14px',
            marginLeft: '-16px',
          },
          '& .MuiInputLabel-shrink': {
            marginTop: '3px',
            fontSize: '14px',
            marginLeft: '-16px',
          },
          '& .MuiInput-underline:hover:before': {
            borderBottomColor: '#7F63A1 !important',
          },
        }}
        InputProps={{
          sx: {
            paddingLeft: '24px',
          },
        }}
      />
      {showHobbyDropdown && hobbyDropdownList.length !== 0 && (
        <div className={styles.dropdownHobby} ref={searchHobbyRef}>
          {hobbyDropdownList.map((hobby, index) => {
            return (
              <p
                key={hobby._id}
                onClick={() => {
                  // dispatch(setHobby(hobby.display))
                  setSelectedHobby(hobby.display)
                }}
                className={
                  index === focusedHobbyIndex
                    ? styles['dropdown-option-focus']
                    : ''
                }
              >
                {hobby.display}
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HobbyField
