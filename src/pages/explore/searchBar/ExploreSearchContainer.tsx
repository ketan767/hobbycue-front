import React, { useEffect, useRef, useState } from 'react'
import styles from './ExploreSearchContainer.module.css'

import { TextField } from '@mui/material'
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
import {
  setCategory,
  setHobby,
  setKeyword,
  setLocation,
  setSearching,
  setPageType,
} from '@/redux/slices/explore'
import { ParsedUrlQueryInput } from 'querystring'

// type SearchInput = {
//   search: InputData<string>
//   hobby: InputData<string>
//   location: InputData<string>
// }
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
  defaultCategory?: string
  locationDropdownRef: React.RefObject<HTMLDivElement>
  ShowAutoAddress: boolean
  setShowAutoAddress: (show: boolean) => void
  showHobbyDropdown: boolean
  setShowHobbyDropdown: (show: boolean) => void
}
type DropdownListItemHobby = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
  genreId?: any
}

const ExploreSearchContainer: React.FC<LocationProps> = ({
  defaultCategory,
  locationDropdownRef,
  ShowAutoAddress,
  setShowAutoAddress,
  showHobbyDropdown,
  setShowHobbyDropdown,
}) => {
  const router = useRouter()
  const { query } = router
  const { keyword } = query
  const { hobby } = query
  const { category } = query
  const { location } = query
  const { page_type } = query
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchHobbyRef = useRef<HTMLInputElement>(null)
  const [isHobbySelected, setIsHobbySelected] = useState<boolean>(false)
  // const searchPageRef = useRef<HTMLInputElement>(null)
  // const locationDropdownArrowRef = useRef<HTMLDivElement>(null)
  // const [isWriting, setIsWriting] = useState(false)
  const dispatch = useDispatch()
  const {
    name: currName,
    keyword: currKeyword,
    hobby: currHobby,
    category: currCategory,
    page_type: currPageType,
    location: currLocation,
  } = useSelector((state: RootState) => state.explore)

  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    ExtendedDropdownListItem[]
  >([])
  // const [hobbyInputValue, setHobbyInputValue] = useState(
  //   hobby ? hobby.toString() : '',
  // )
  // const [ShowAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<
    { description: string[]; place_id: string }[]
  >([])
  // const [selectedAddress, setSelectedAddress] = useState('')
  const [focusedLocationIdx, setFocusedLocationIdx] = useState<number>(-1)
  const [focusedHobbyIndex, setFocusedHobbyIndex] = useState<number>(-1)
  const [selectedHobbies, setselectedHobbies] = useState<
    DropdownListItemHobby[]
  >([])
  const [Addressdata, setAddressData] = useState<ProfileAddressPayload>({
    street: location ? location.toString() : '',
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

  const handleHobbyInputChange = async (e: any) => {
    // setHobbyInputValue(e.target.value)
    dispatch(setHobby(e.target.value))
    setFocusedHobbyIndex(-1)
    if (e.target.value === '') {
      setFilterData((prev) => ({ ...prev, hobby: '' }))
    }
    setIsHobbySelected(false)

    if (isEmptyField(e.target.value)) return setHobbyDropdownList([])

    // const query = `fields=display,genre&level=5&level=4&level=3&level=2&level=1&level=0&show=true&search=${e.target.value}`
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

  // ----commented out start--------- 8/11/24
  // const [currentCategory, setCurrentCategory] = useState({
  //   value: defaultCategory ? (category ? category.toString() : '') : 'All',
  //   error: null,
  // })
  // const [subCategory, setSubCategory] = useState({
  //   value: page_type ? page_type.toString() : '',
  //   error: null,
  // })
  // const [categoryValue, setCategoryValue] = useState(
  //   page_type ? page_type.toString() : category ? category.toString() : '',
  // )
  // ----commented out start--------- 8/11/24

  // const [data, setData] = useState<SearchInput>({
  //   search: { value: '', error: null },
  //   hobby: { value: '', error: null },
  //   location: { value: '', error: null },
  // })
  const [filterData, setFilterData] = useState({
    category: '',
    subCategory: '',
    hobby: '',
  })
  // const { isLoggedIn, isAuthenticated, user } = useSelector(
  //   (state: RootState) => state.user,
  // )
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target
  //   setData((prev) => ({ ...prev, [name]: { value, error: null } }))
  // }

  const handleInputChangeAddress = async (event: any) => {
    setFocusedLocationIdx(-1)
    const { name, value } = event.target
    setAddressData((prev) => ({ ...prev, [name]: value }))
    dispatch(setLocation(value))
    if (Addressdata.street?.length > 1) {
      setShowAutoAddress(true)
      try {
        const { res, err } = await getAutocompleteAddressFromGoogle(value)
        const data = res.data

        if (data.predictions) {
          console.log('suggestionsssss', data)
          setSuggestions(
            data.predictions.map(({ structured_formatting, place_id }: any) => {
              const { main_text, secondary_text } = structured_formatting
              const arr = [main_text, secondary_text]
              return {
                description: arr,
                place_id: place_id,
              }
            }),
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
            suggestions[focusedLocationIdx]?.description?.join(', '),
            suggestions[focusedLocationIdx]?.place_id,
          )
          dispatch(setLocation(suggestions[focusedLocationIdx]?.description[0]))
          // console.log('Enter is pressed in location')
          // setSelectedAddress(
          //   suggestions[focusedLocationIdx]?.description.toString(),
          // )
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
        if (currHobby.length !== 0 && focusedHobbyIndex === -1) {
          //AddButtonRef.current?.click()
        } else if (focusedHobbyIndex !== -1) {
          setShowHobbyDropdown(false)
          if (showHobbyDropdown) {
            const val =
              hobbyDropdownList[focusedHobbyIndex]?.display || currHobby
            if (val) {
              dispatch(setHobby(val))
            }
          }

          // searchResult(undefined, val, undefined)
          if (isHobbySelected) {
            searchResult()
          }
          // alert('Enter')

          setIsHobbySelected(true)
          console.log('hobbyDropdownList', hobbyDropdownList)
        } else if (focusedHobbyIndex === -1 && currHobby.length == 0) {
          setShowHobbyDropdown(false)
          // handleGenreInputFocus();
          searchResult()
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
  const searchResult = () => {
    dispatch(setSearching(true))
    if (
      !currKeyword &&
      !currHobby &&
      !currLocation &&
      !currCategory &&
      !currPageType
    ) {
      redirect('')
      return
    }
    // alert(currLocation)
    let query = {}
    if (currKeyword) {
      query = { ...query, keyword: currKeyword }
    }
    if (currHobby) {
      query = { ...query, hobby: currHobby }
    }

    if (currLocation) {
      query = {
        ...query,
        location:
          suggestions[focusedLocationIdx]?.description[0] || currLocation,
      }
    }
    if (currCategory) {
      // alert('category....'+cate)
      query = {
        ...query,
        category: currCategory,
      }
    } else if (currPageType) {
      query = { ...query, ['page-type']: currPageType }
    }
    redirect(query)
  }
  const redirect = (query: string | ParsedUrlQueryInput | null | undefined) => {
    if (defaultCategory && defaultCategory !== 'People') {
      router.push({
        pathname: `/explore/${defaultCategory?.toLowerCase() + 's'}`,
        query: query,
      })
    } else {
      router.push({
        pathname: `/explore/${defaultCategory?.toLowerCase()}`,
        query: query,
      })
    }
  }

  useEffect(() => {
    if (keyword) {
      dispatch(setKeyword(keyword.toString()))
    }
    if (hobby) {
      dispatch(setHobby(hobby.toString()))
    }
    if (category) {
      dispatch(setCategory(category.toString()))
    } else if (page_type) {
      dispatch(setPageType(page_type.toString()))
    }
    if (location) {
      dispatch(setLocation(location.toString()))
    }
  }, [])

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
          <div className={styles.searchBox}>
            <Image
              src={SearchIcon}
              width={16}
              height={16}
              alt="SearchIcon"
              className={styles.searchIconKeyword}
            />
            <TextField
              autoComplete="off"
              inputRef={searchInputRef}
              variant="standard"
              label="Keywords"
              size="small"
              name="search"
              className={styles.keywords}
              // onFocus={() => {
              //   setIsWriting(true)
              // }}
              onChange={(e) => dispatch(setKeyword(e.target.value))}
              value={currKeyword}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchResult()
                }
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

          <div className={styles.flexRow}>
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
                  // setIsWriting(true)
                  setShowHobbyDropdown(true)
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key !== 'Enter') {
                    setShowHobbyDropdown(true)
                    setIsHobbySelected(false)
                  }
                  handleHobbyKeyDown(e)
                  // if (e.key === 'Enter') {
                  //   setShowHobbyDropdown(false)
                  //   searchResult()
                  // }
                }}
                value={currHobby}
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
                          dispatch(setHobby(hobby.display))
                          setFilterData((prev) => ({
                            category: hobby.category?._id ?? prev.category,
                            subCategory:
                              hobby.sub_category?._id ?? prev.subCategory,
                            hobby: hobby._id,
                          }))
                          // searchResult()
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

            <div className={styles.locationHiddenMobile}>
              <AccordionMenu
                // setValue={setCurrentCategory}
                // setSubCategory={setSubCategory}
                searchResult={searchResult}
              />
            </div>
            <div className={styles.hobbySuggestion}>
              <Image
                src={SearchIcon}
                width={16}
                height={16}
                alt="SearchIcon"
                className={styles.searchIcon}
              />
              <TextField
                label="Location"
                autoComplete="off"
                inputRef={locationDropdownRef}
                variant="standard"
                name="street"
                size="small"
                className={styles.locationSearch}
                // onFocus={() => {
                //   setIsWriting(true)
                // }}
                onChange={handleInputChangeAddress}
                value={currLocation}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  handleLocationKeyDown(e)
                  if (e.key === 'Enter') {
                    setShowAutoAddress(false)
                    searchResult()
                  }
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

              {ShowAutoAddress && (
                <div className={styles['dropdown']} ref={locationDropdownRef}>
                  {suggestions.map((suggestion, index) => (
                    <p
                      onClick={() => {
                        handleSelectAddressTwo(
                          suggestion.description.join(', '),
                          suggestion.place_id,
                        )
                        dispatch(setLocation(suggestion.description[0]))
                        // setSelectedAddress(suggestion.description.toString())
                      }}
                      key={index}
                      className={
                        index === focusedLocationIdx
                          ? styles['dropdown-option-focus']
                          : ''
                      }
                    >
                      {suggestion.description.join(', ')}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.searchFlex}>
            <div className={styles.locationMobile}>
              <AccordionMenu
                // setValue={setCurrentCategory}
                // setSubCategory={setSubCategory}
                searchResult={searchResult}
              />
            </div>
            <div>
              <button
                onClick={() => searchResult()}
                className={styles.searchButton}
              >
                Search
              </button>
            </div>
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
