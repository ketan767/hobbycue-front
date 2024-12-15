import React, { useRef, useState } from 'react'
import styles from '../styles.module.css'
import Image from 'next/image'
import { TextField } from '@mui/material'
import SearchIcon from '@/assets/svg/search.svg'
import { setUserName } from '@/redux/slices/search'
import { useDispatch, useSelector } from 'react-redux'
import { isEmptyField } from '@/utils'
import { getUsersByName } from '@/services/user.service'
import { useRouter } from 'next/router'
import { RootState } from '@/redux/store'
import NameDropdown from './components/NameDropdown'

type NameProps = {
  filterPage?: string
  currUserName: string
  selectedLocation?: string
  selectedHobby?: string
  setCurrUserName: (name: string) => void
}
const NameField: React.FC<NameProps> = ({
  filterPage,
  currUserName,
  setCurrUserName,
  selectedLocation,
  selectedHobby,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLDivElement | null>(null)
  const [showNameDropdown, setShowNameDropdown] = useState(false)
  const [isNameSelected, setIsNameSelected] = useState<boolean>(false)
  const [nameDropdownList, setNameDropdownList] = useState<string[]>([])
  const [focusedNameIdx, setFocusedNameIdx] = useState<number>(-1)
  const searchNameRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const router = useRouter()
  const { q = '', filter = '' } = router.query
  const { userName, userHobby, userLocation } = useSelector(
    (state: RootState) => state.search,
  )

  const handleNameInputChange = async (e: any) => {
    dispatch(setUserName(e.target.value))

    setFocusedNameIdx(-1)

    if (isEmptyField(e.target.value)) return setNameDropdownList([])

    const query = `name=${e.target.value}`
    const { err, res } = await getUsersByName(query)

    if (err) return console.log(err)
    const fetchedNames = res.data.data?.map((person: any) => person?.full_name)
    setNameDropdownList(fetchedNames)
  }
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedNameIdx((prevIndex) =>
          prevIndex < nameDropdownList.length - 1 ? prevIndex + 1 : prevIndex,
        )
        break
      case 'ArrowUp':
        setFocusedNameIdx((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        )
        break

      case 'Enter':
        e.stopPropagation()
        if (userName.length !== 0 && focusedNameIdx === -1) {
          //AddButtonRef.current?.click()
          if (filter === 'users') {
            let query = {}
            query = { ...query, filter: 'users' }
            if (currUserName) {
              query = { ...query, name: currUserName }
            }
            if (userHobby) {
              query = { ...query, hobby: userHobby }
            }
            if (userLocation) {
              query = { ...query, location: userLocation }
            }
            router.push({
              pathname: `/search`,
              query: query,
            })
          } else if (filterPage && filterPage === 'User') {
            let query = {}
            query = { ...query, filter: 'users' }
            if (currUserName) {
              query = { ...query, name: currUserName }
            }
            if (selectedHobby) {
              query = { ...query, hobby: selectedHobby }
            }
            if (selectedLocation) {
              query = { ...query, location: selectedLocation }
            }
            router.push({
              pathname: `/search`,
              query: query,
            })
          }
        } else if (focusedNameIdx !== -1) {
          setShowNameDropdown(false)
          if (showNameDropdown) {
            const val = nameDropdownList[focusedNameIdx] || userName
            dispatch(setUserName(val))
            setCurrUserName(val)
            console.log('name', val)
          }

          if (isNameSelected) {
            if (filter === 'users') {
              let query = {}
              query = { ...query, filter: 'users' }
              if (currUserName) {
                query = { ...query, name: currUserName }
              }
              if (userHobby) {
                query = { ...query, hobby: userHobby }
              }
              if (userLocation) {
                query = { ...query, location: userLocation }
              }
              router.push({
                pathname: `/search`,
                query: query,
              })
            } else if (filterPage && filterPage === 'User') {
              let query = {}
              query = { ...query, filter: 'users' }
              if (currUserName) {
                query = { ...query, name: currUserName }
              }
              if (selectedHobby) {
                query = { ...query, hobby: selectedHobby }
              }
              if (selectedLocation) {
                query = { ...query, location: selectedLocation }
              }
              router.push({
                pathname: `/search`,
                query: query,
              })
            }
          }
          setIsNameSelected(true)
        } else if (focusedNameIdx === -1 && userName.length !== 0) {
          setShowNameDropdown(false)
        }
        break
      default:
        break
    }

    // Scroll into view logic
    const container = searchNameRef.current
    const selectedItem = container?.children[focusedNameIdx] as HTMLElement

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
    <div className={styles.hobbySuggestion} ref={inputRef}>
      <Image
        src={SearchIcon}
        width={16}
        height={16}
        alt="SearchIcon"
        className={styles.searchIcon}
      />
      <TextField
        autoComplete="off"
        inputRef={nameInputRef}
        variant="standard"
        label="Name"
        size="small"
        name="name"
        className={styles.hobbySearch}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key !== 'Enter') {
            setShowNameDropdown(true)
            setIsNameSelected(false)
          }
          handleNameKeyDown(e)
        }}
        value={currUserName}
        onBlur={() =>
          setTimeout(() => {
            setShowNameDropdown(false)
          }, 300)
        }
        onChange={(e) => {
          setCurrUserName(e.target.value)
          handleNameInputChange(e)
        }}
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
      {showNameDropdown && nameDropdownList?.length !== 0 && (
        <NameDropdown
          inputRef={inputRef}
          nameDropdownList={nameDropdownList}
          searchNameRef={searchNameRef}
          focusedNameIdx={focusedNameIdx}
          setCurrUserName={setCurrUserName}
        />
      )}
    </div>
  )
}

export default NameField
