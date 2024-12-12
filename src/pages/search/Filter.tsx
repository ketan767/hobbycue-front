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
import PostField from './FilterComponents/PostField'

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
        <PostField
          currPostedBy={currPostedBy}
          setCurrPostedBy={setCurrPostedBy}
          selectedLocation={selectedLocation}
          selectedHobby={selectedHobby}
        />
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
        <div className={`${styles.relative} ${styles['mt-4px']}`}>

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
              handleUserProfileSearch(
                currUserName,
                selectedHobby,
                selectedLocation,
              )
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
