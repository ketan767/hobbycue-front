import { TextField } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import styles from './styles.module.css'
import { getAllHobbies } from '@/services/hobby.service'
import {
  getAutocompleteAddressFromGoogle,
  getLatLongFromPlaceID,
} from '@/services/auth.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
  setCategory,
  setHobby,
  setKeyword,
  setLocation,
  setPageType,
} from '@/redux/slices/explore'
import AccordionMenu2 from '../explore/nestedDropdown/AccordionMenu2'
import SearchIcon from '@/assets/svg/search.svg'
import {
  setPostedBy,
  setUserHobby,
  setUserLocation,
  setUserName,
} from '@/redux/slices/search'
import { getUsersByName } from '@/services/user.service'
import { useEffect, useRef, useState } from 'react'
import { isEmptyField, isMobile } from '@/utils'
import { useRouter } from 'next/router'
import NameField from './FilterComponents/NameField'
import handleSubmit from './utils/HandleSubmit'
import handleUserProfileSearch from './utils/HandleUserProSearch'
import handlePostsSearch from './utils/HandlePostsSearch'
import HobbyField from './FilterComponents/HobbyField'
import useHandleUserProfileSearch from './utils/HandleUserProSearch'
import useHandlePostsSearch from './utils/HandlePostsSearch'
import useHandleSubmit from './utils/HandleSubmit'
import LocationField from './FilterComponents/LocationField'
import AccordionMenu3 from '../explore/nestedDropdown/AccordianMenu3'

const Filter = () => {
  const {
    keyword,
    hobby,
    category,
    page_type,
    location: currLocation,
  } = useSelector((state: RootState) => state.explore)
  const { userName, userHobby, userLocation } = useSelector(
    (state: RootState) => state.search,
  )
  const dispatch = useDispatch()
  const postedByRef = useRef<HTMLInputElement>(null)
  const [showPostedByDropdown, setShowPostedByDropdown] = useState(false)

  const [focusedPostedByIdx, setFocusedPostedByIdx] = useState<number>(-1)
  const [isPostedBySelected, setIsPostedBySelected] = useState<boolean>(false)

  const [currUserName, setCurrUserName] = useState<string>('')
  const [currPostedBy, setCurrPostedBy] = useState<string>('')
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPageType, setSelectedPageType] = useState('')
  const [postedByDropdownList, setPostedByDropdownList] = useState<string[]>([])

  const [categoryValue, setCategoryValue] = useState(
    page_type ? page_type.toString() : category ? category.toString() : '',
  )

  const router = useRouter()
  const { q = '', filter = '' } = router.query
  const isMob = isMobile()

  const handleUserProfileSearch = useHandleUserProfileSearch()
  const handlePostsSearch = useHandlePostsSearch()
  const handleSubmit = useHandleSubmit()

  useEffect(() => {
    dispatch(setKeyword(''))
    dispatch(setHobby(''))
    dispatch(setLocation(''))
    dispatch(setCategory(''))
    dispatch(setPageType(''))
  }, [])
  return (
    <div className={styles.inputsContainer}>
      {filter === 'users' && (
        <NameField
          currUserName={currUserName}
          setCurrUserName={setCurrUserName}
          selectedLocation={selectedLocation}
          selectedHobby={selectedHobby}
        />
      )}

      {filter === 'posts' && (
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
            inputRef={postedByRef}
            variant="standard"
            label="Posted by"
            size="small"
            name="postedBy"
            className={styles.hobbySearch}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                dispatch(setPostedBy(currPostedBy))
              }
              if (e.key === 'Enter') {
                let query = {}
                query = { ...query, filter: 'posts' }
                if (currPostedBy) {
                  query = { ...query, postedBy: currPostedBy }
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
              }
            }}
            value={currPostedBy}
            // onBlur={() =>
            //   setTimeout(() => {
            //     setShowHobbyDropdown(false)
            //   }, 300)
            // }
            onChange={(e) => {
              setCurrPostedBy(e.target.value)
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
        </div>
      )}

      <HobbyField
        currUserName={currUserName}
        currPostedBy={currPostedBy}
        selectedCategory={selectedCategory}
        selectedPageType={selectedPageType}
        selectedLocation={selectedLocation}
        selectedHobby={selectedHobby}
        setSelectedHobby={setSelectedHobby}
      />
      {filter !== 'users' && filter !== 'posts' && (
        <div className={styles.relative}>
          {/* <AccordionMenu2
            categoryValue={categoryValue}
            handleSubmit={handleSubmit}
          /> */}
          <AccordionMenu3
            defaultCategory={categoryValue}
            setDefaultCategory={setCategoryValue}
            selectedCategory={selectedCategory}
            selectedPageType={selectedPageType}
            setSelectedCategory={setSelectedCategory}
            setSelectedPageType={setSelectedPageType}
            selectedHobby={selectedHobby}
            selectedLocation={selectedLocation}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
      <LocationField
        currUserName={currUserName}
        currPostedBy={currPostedBy}
        selectedCategory={selectedCategory}
        selectedPageType={selectedPageType}
        selectedHobby={selectedHobby}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {filter !== 'users' && filter !== 'posts' ? (
        <button
          className="modal-footer-btn"
          style={{
            width: isMob ? '100%' : 71,
            height: 32,
            marginLeft: 'auto',
          }}
          onClick={() => handleSubmit()}
        >
          Explore
        </button>
      ) : (
        <button
          className="modal-footer-btn"
          style={{
            width: isMob ? '100%' : 71,
            height: 32,
            marginLeft: 'auto',
          }}
          onClick={() => {
            if (filter === 'users') {
              handleUserProfileSearch(currUserName, selectedHobby, selectedLocation)
            } else if (filter === 'posts') {
              handlePostsSearch(currPostedBy, selectedHobby, selectedLocation)
            }
          }}
        >
          Search
        </button>
      )}
    </div>
  )
}

export default Filter
