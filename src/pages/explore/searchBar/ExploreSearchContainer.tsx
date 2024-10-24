import React, { useRef, useState } from 'react'
import styles from './ExploreSearchContainer.module.css'

import { IconButton, InputAdornment, MenuItem, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '@/redux/store'
import Image from 'next/image'
// import SearchIcon from '@/assets/svg/search-small.svg'
import SearchIcon from '@/assets/svg/search.svg'

import FilterIcon from '@/assets/svg/exploreSearch/Filter.svg'
import Dropdown from '@/assets/svg/exploreSearch/Down.svg'
import ToggleOn from '@/assets/svg/exploreSearch/Toggle=on.svg'
import ToggleOff from '@/assets/svg/exploreSearch/Toggle=off.svg'
import People from '@/assets/svg/People.svg'
import Place from '@/assets/svg/Place.svg'
import Program from '@/assets/svg/Program.svg'
import Product from '@/assets/svg/Search/Product.svg'
import AccordionMenu from '../nestedDropdown/AccordionMenu'
import { isEmptyField } from '@/utils'
import { getAllHobbies } from '@/services/hobby.service'
import {
  getAutocompleteAddressFromGoogle,
  getLatLongFromPlaceID,
} from '@/services/auth.service'
import { setHasChanges } from '@/redux/slices/modal'

type SearchInput = {
  search: InputData<string>
  hobby: InputData<string>
  location: InputData<string>
}
type DropdownListItem = {
  _id: string
  display: string
  sub_category?: { _id: string; display: string }
}
type AddressObj = {
  street_number?: string
  subpremise?: string
  primise2?: string
  premise?: string
  locality?: string
  neighbour?: string
  route?: string
  administrative_area_level_1?: string
  country?: string
  pin_code?: string
  post_code?: string
  sublocality_level_1?: string
  sublocality_level_2?: string
  sublocality_level_3?: string
}
type DropdownListItem2 = {
  address: string
  place_id: string
  formatted_address: string
  addressObj: AddressObj
}
type ExtendedDropdownListItem = DropdownListItem & {
  category?: { _id: string; display: string }
}

type LocationProps = {
  locationDropdownRef: React.RefObject<HTMLDivElement>
  ShowAutoAddress: boolean
  setShowAutoAddress: (show: boolean) => void
  showHobbyDropdown: boolean
  setShowHobbyDropdown: (show: boolean) => void
}

const ExploreSearchContainer: React.FC<LocationProps> = ({
  locationDropdownRef,
  ShowAutoAddress,
  setShowAutoAddress,
  showHobbyDropdown,
  setShowHobbyDropdown,
}) => {
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchHobbyRef = useRef<HTMLInputElement>(null)
  const searchPageRef = useRef<HTMLInputElement>(null)
  // const locationDropdownRef = useRef<HTMLDivElement>(null)
  const [isWriting, setIsWriting] = useState(false)
  const [isChanged, setIsChanged] = useState(false)

  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    ExtendedDropdownListItem[]
  >([])
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  // const [ShowAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<
    { description: string; place_id: string }[]
  >([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [focusedLocationIdx, setFocusedLocationIdx] = useState<number>(-1)

  const [Addressdata, setAddressData] = useState<ProfileAddressPayload>({
    street: '',
    society: '',
    locality: '',
    city: '',
    pin_code: '',
    post_code: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    set_as_primary: true,
  })
  const dispatch = useDispatch()

  const handleHobbyInputChange = async (e: any) => {
    setHobbyInputValue(e.target.value)
    if (e.target.value === '') {
      setFilterData((prev) => ({ ...prev, hobby: '' }))
    }
    if (isEmptyField(e.target.value)) return setHobbyDropdownList([])

    const query = `fields=display,genre&level=5&level=3&level=2&search=${e.target.value}`
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
    // setData((prev) => {
    //   return { ...prev, hobby: null }
    // })
    setHobbyDropdownList(sortedHobbies)
  }

  const [currentCategory, setCurrentCategory] = useState({
    value: 'All',
    error: null,
  })
  const [subCategory, setSubCategory] = useState({
    value: '',
    error: null,
  })
  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
    hobby: { value: '', error: null },
    location: { value: '', error: null },
  })
  const [filterData, setFilterData] = useState({
    category: '',
    subCategory: '',
    hobby: '',
  })
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: { value, error: null } }))
  }

  const handleInputChangeAddress = async (event: any) => {
    setFocusedLocationIdx(-1)
    const { name, value } = event.target
    setAddressData((prev) => ({ ...prev, [name]: value }))
    if (Addressdata.street?.length > 1) {
      setShowAutoAddress(true)
      try {
        const { res, err } = await getAutocompleteAddressFromGoogle(value)
        const data = res.data

        if (data.predictions) {
          console.warn('suggestionsssss', data)
          setSuggestions(
            data.predictions.map((prediction: any) => ({
              description: prediction.description,
              place_id: prediction.place_id,
            })),
          )
        } else {
          console.error('Error fetching suggestions:', data.error)
        }
      } catch (error) {
        console.error('Network error:', error)
      }
    } else {
      setSuggestions([])
    }
  }
  const handleSelectAddressTwo = async (
    suggestion: string,
    placeid: string,
  ) => {
    const details: any = {}
    const { res, err } = await getLatLongFromPlaceID(placeid)
    const latlongObj = res?.data
    console.warn('suggestionssssss', suggestion)

    const terms = suggestion.split(',').map((term) => term.trim())

    if (terms.length >= 1) details.country = terms[terms.length - 1]
    if (terms.length >= 2) details.state = terms[terms.length - 2]
    if (terms.length >= 3) details.city = terms[terms.length - 3]
    if (terms.length >= 4) details.locality = terms[terms.length - 4]
    if (terms.length >= 5) details.society = terms[terms.length - 5]
    if (terms.length >= 6)
      details.street = terms.slice(0, terms.length - 5).join(', ')

    const formattedStreet = details.street?.trim() || ''
    const formattedSociety = details.society?.trim() || ''
    const formattedLocality = details.locality?.trim() || ''

    setAddressData((prev) => ({
      ...prev,
      street: `${formattedStreet ? formattedStreet + ',' : ''} ${
        formattedSociety ? formattedSociety + ',' : ''
      } ${formattedLocality ? formattedLocality + ',' : ''} ${
        details.city ? details.city + ',' : ''
      } ${details.state ? details.state + ',' : ''} ${details.country}`,
      locality: formattedLocality || '',
      city: details.city || '',
      state: details.state || '',
      country: details.country || '',
      society: formattedSociety || '',
      latitude: latlongObj?.lat || '',
      longitude: latlongObj?.lng || '',
      pin_code: latlongObj.zipcode || '',
      post_code: latlongObj.zipcode || '',
    }))
    setShowAutoAddress(false)
  }
  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedLocationIdx((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex,
        )
        break
      case 'ArrowUp':
        setFocusedLocationIdx((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        )
        break
      case 'Enter':
        if (Addressdata.street.trim().length !== 0 && !ShowAutoAddress) {
        } else if (focusedLocationIdx !== -1 && ShowAutoAddress) {
          handleSelectAddressTwo(
            suggestions[focusedLocationIdx]?.description,
            suggestions[focusedLocationIdx]?.place_id,
          )
          setSelectedAddress(suggestions[focusedLocationIdx]?.description)
        } else if (
          focusedLocationIdx === -1 &&
          Addressdata.street.trim().length !== 0
        ) {
          setShowAutoAddress(false)
        }
        break
      default:
        break
    }

    // Scroll into view logic
    const container = locationDropdownRef.current
    const selectedItem = container?.children[focusedLocationIdx] as HTMLElement

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

  const searchResult = (
    category?: string,
    hobby?: string,
    sub_category?: string,
  ) => {
    const keyword = data.search.value.trim()
    // const hobby = hobby.value.trim()
    let cate = currentCategory.value
    if (category) {
      cate = category
    }
    let subCate = subCategory.value
    if (sub_category) {
      subCate = sub_category
    }

    let hobb = hobbyInputValue
    if (hobby) {
      hobb = hobby
    }
    let query = {}
    if (keyword) {
      query = { ...query, keyword: keyword }
    }
    if (hobb) {
      query = { ...query, hobby: hobb }
    }

    if (Addressdata.street) {
      query = { ...query, location: Addressdata.street.trim() }
    }
    if (subCate && subCate !== '') {
      // alert('sub.....'+subCate)

      query = { ...query, sub_category: subCate }
    } else if (cate && cate !== 'All') {
      // alert('all.....')
      query = { ...query, category: cate }
    }

    if (keyword || hobby || cate || subCate) {
      {
        // alert('Searching.....')

        router.push({ pathname: '/explore', query: query })
      }
    }
  }
  return (
    <div className={`${styles.searchContainer}`}>
      <div className={`${styles.innerContainer}`}>
        <div className={styles.filterContainer}>
          <div className={styles.textIcon}>
            <Image src={FilterIcon} width={16} height={16} alt="FilterIcon" />
            <p className={styles.text}>Filter</p>
          </div>
          <div className={styles.textIcon}>
            <p className={styles.text}>Sort By</p>
            <Image src={Dropdown} width={16} height={16} alt="Dropdown" />
          </div>
        </div>
        <div className={styles.inputsContainer}>
          <TextField
            autoComplete="off"
            inputRef={searchInputRef}
            variant="standard"
            placeholder="Keywords"
            size="small"
            name="search"
            className={styles.keywords}
            onFocus={() => {
              setIsWriting(true)
            }}
            onChange={handleInputChange}
            value={data.search.value}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchResult()
              }
            }}
            // style={{ width: '220px' }}
            InputLabelProps={{ shrink: false }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image
                    src={SearchIcon}
                    width={16}
                    height={16}
                    alt="SearchIcon"
                  />
                </InputAdornment>
              ),
            }}
          />

          <div className={styles.flexRow}>
            <div className={styles.hobbySuggestion}>
              <TextField
                autoComplete="off"
                inputRef={searchHobbyRef}
                variant="standard"
                placeholder="Hobby"
                size="small"
                name="hobby"
                className={styles.hobbySearch}
                onFocus={() => {
                  setIsWriting(true)
                  setShowHobbyDropdown(true)
                }}
                // onChange={handleInputChange}
                // value={data.hobby.value}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowHobbyDropdown(false)
                    searchResult()
                  }
                }}
                value={hobbyInputValue}
                onBlur={() =>
                  setTimeout(() => {
                    setShowHobbyDropdown(false)
                  }, 300)
                }
                onChange={handleHobbyInputChange}
                style={{ width: '160px' }}
                InputLabelProps={{ shrink: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image
                        src={SearchIcon}
                        width={16}
                        height={16}
                        alt="SearchIcon"
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& label': {
                    fontSize: '16px',
                  },
                  '& label.Mui-focused': {
                    fontSize: '12px',
                  },
                  '& .MuiInputLabel-shrink': {
                    fontSize: '12px',
                  },
                }}
              />
              {showHobbyDropdown && hobbyDropdownList.length !== 0 && (
                <div className={styles.dropdownHobby}>
                  {hobbyDropdownList.map((hobby) => {
                    return (
                      <p
                        key={hobby._id}
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            hobby: { value: hobby.display, error: null },
                          }))

                          console.warn({ hobby })
                          setHobbyInputValue(hobby.display)
                          setFilterData((prev) => ({
                            category: hobby.category?._id ?? prev.category,
                            subCategory:
                              hobby.sub_category?._id ?? prev.subCategory,
                            hobby: hobby._id,
                          }))
                          searchResult(undefined, hobby.display)
                        }}
                      >
                        {hobby.display}
                      </p>
                    )
                  })}
                </div>
              )}
            </div>

            <div className={styles.locationHiddenMobile}>
              <AccordionMenu
                value={currentCategory.value}
                setValue={setCurrentCategory}
                subCategory={subCategory.value}
                setSubCategory={setSubCategory}
                searchResult={searchResult}
              />
            </div>
            <div className={styles.hobbySuggestion}>
              <TextField
                label="Location"
                autoComplete="off"
                inputRef={locationDropdownRef}
                variant="standard"
                name="street"
                size="small"
                className={styles.locationSearch}
                onFocus={() => {
                  setIsWriting(true)
                }}
                onChange={handleInputChangeAddress}
                value={Addressdata.street.trim()}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  handleLocationKeyDown(e)
                  if (e.key === 'Enter') {
                    setShowAutoAddress(false)
                    searchResult()
                  }
                }}
                sx={{
                  '& label': {
                    fontSize: '16px', // Default label size
                  },
                  '& label.Mui-focused': {
                    fontSize: '12px', // Shrunk label size when focused
                  },
                  '& .MuiInputLabel-shrink': {
                    fontSize: '12px', // Shrunk label size when not focused but has value
                  },
                  // '& .MuiInputBase-root': {
                  //   height: 24, // Set custom height here
                  // },
                }}
              />
              {ShowAutoAddress && (
                <div className={styles['dropdown']} ref={locationDropdownRef}>
                  {suggestions.map((suggestion, index) => (
                    <p
                      onClick={() => {
                        handleSelectAddressTwo(
                          suggestion.description,
                          suggestion.place_id,
                        )
                        setSelectedAddress(suggestion.description)
                      }}
                      key={index}
                      className={
                        index === focusedLocationIdx
                          ? styles['dropdown-option-focus']
                          : ''
                      }
                    >
                      {suggestion.description}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.searchFlex}>
            <div className={styles.locationMobile}>
              <AccordionMenu
                value={currentCategory.value}
                setValue={setCurrentCategory}
                subCategory={subCategory.value}
                setSubCategory={setSubCategory}
                searchResult={searchResult}
              />
            </div>

            <button
              onClick={() => searchResult()}
              className={styles.searchButton}
            >
              Search
            </button>
          </div>
        </div>
        <div className={styles.mapContainer}>
          <p className={styles.mapText}>Map</p>
          <Image
            src={ToggleOff}
            width={38}
            height={20}
            alt="ToggleOn-OffIcon"
          />
        </div>
      </div>
    </div>
  )
}

export default ExploreSearchContainer
