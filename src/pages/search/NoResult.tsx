import { useRouter } from 'next/router'
import styles from './styles.module.css'
import img204 from '@/assets/image/_204.png'
import Link from 'next/link'
import { isEmptyField, isMobile } from '@/utils'
// import SearchIcon from '@/assets/icons/SearchIcon'
import SearchIcon from '@/assets/svg/search.svg'

import { useEffect, useRef, useState } from 'react'
import DownArrow from '@/assets/icons/DownArrow'
import Image from 'next/image'
import { TextField } from '@mui/material'
import { getAllHobbies } from '@/services/hobby.service'
import AccordianMenuNoResult from './accordian/AccordianMenuNoResult'
import {
  getAutocompleteAddressFromGoogle,
  getLatLongFromPlaceID,
} from '@/services/auth.service'
type DropdownListItem = {
  _id: string
  display: string
  sub_category?: { _id: string; display: string }
}
type ExtendedDropdownListItem = DropdownListItem & {
  category?: { _id: string; display: string }
}

const NoResult = () => {
  const router = useRouter()
  const { q = '', filter = '' } = router.query
  const filterMap: { [key: string]: string } = {
    hobby: 'Hobbies',
    users: 'User Profiles',
    people: 'People Pages',
    places: 'Places',
    programs: 'Programs',
    products: 'Products',
    blogs: 'Blogs',
  }
  const isMob = isMobile()
  const [hobby, setHobby] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [location, setLocation] = useState('')
  const searchHobbyRef = useRef<HTMLInputElement>(null)
  const locationDropdownRef = useRef<HTMLInputElement>(null)
  const [showHobbyDropdown, setShowHobbyDropdown] = useState(false)
  const [showAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const [focusedHobbyIndex, setFocusedHobbyIndex] = useState<number>(-1)
  const [focusedLocationIdx, setFocusedLocationIdx] = useState<number>(-1)

  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    ExtendedDropdownListItem[]
  >([])
  const [suggestions, setSuggestions] = useState<
    { description: string; place_id: string }[]
  >([])

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

  const handleHobbyInputChange = async (e: any) => {
    setHobby(e.target.value)
    setFocusedHobbyIndex(-1)

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
        if (hobby.length !== 0 && !showHobbyDropdown) {
          //AddButtonRef.current?.click()
        } else if (focusedHobbyIndex !== -1 && showHobbyDropdown) {
          setShowHobbyDropdown(false)
          const val = hobbyDropdownList[focusedHobbyIndex]?.display || hobby
          if (val) {
            setHobby(val)
          }

          // searchResult(undefined, val, undefined)
          console.log('hobbyDropdownList', hobbyDropdownList)
        } else if (focusedHobbyIndex === -1 && hobby.length !== 0) {
          setShowHobbyDropdown(false)
          // handleGenreInputFocus();
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
  const handleInputChangeAddress = async (event: any) => {
    setFocusedLocationIdx(-1)
    const { name, value } = event.target
    setAddressData((prev) => ({ ...prev, [name]: value }))
    setLocation(value)
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
        if (Addressdata.street.trim().length !== 0 && !showAutoAddress) {
        } else if (focusedLocationIdx !== -1 && showAutoAddress) {
          handleSelectAddressTwo(
            suggestions[focusedLocationIdx]?.description,
            suggestions[focusedLocationIdx]?.place_id,
          )
          setLocation(suggestions[focusedLocationIdx]?.description)
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
  const handleClickOutside = (event: MouseEvent) => {
    if (
      locationDropdownRef.current &&
      !locationDropdownRef.current.contains(event.target as Node)
    ) {
      setShowAutoAddress(false)
    }
  }

  useEffect(() => {
    if (showAutoAddress) {
      window.addEventListener('mousedown', handleClickOutside)
    } else {
      window.removeEventListener('mousedown', handleClickOutside)
    }

    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [showAutoAddress])

  const getLink = () => {
    let link = '/explore'
    if (category) {
      if (category === 'Place') {
        link += '/place?'
      } else if (category === 'People') {
        link += '/people?'
      } else if (category === 'Program') {
        link += '/program?'
      } else if (category === 'Product') {
        link += '/product?'
      }
      link += `category=${category}`
    } else if (subCategory) {
      link += `?sub_category=${subCategory}`
    }
    if (hobby) {
      if (category || subCategory) {
        link += '&'
      } else {
        link += '?'
      }
      link += `hobby=${hobby}`
    }

    if (location) {
      if (hobby || category || subCategory) {
        link += '&'
      } else {
        link += '?'
      }
      link += `location=${location}`
    }

    return link
  }

  function handleSubmit(keyboardSubmit = false) {
    if (
      keyboardSubmit &&
      (showHobbyDropdown || showAutoAddress || showCategoryDropdown)
    ) {
      return
    }
    router.push(`${getLink()}`)
  }

  return (
    <div className={styles['no-results-wrapper']}>
      {q !== '' && (
        <div className={styles.imageDiv}>
          <img src={img204.src} alt="No Result Found" />
        </div>
      )}

      <div className={styles.main}>
        {q !== '' ? (
          <h1>
            Mm-hmm... No results for "{q}"{' '}
            {filter ? `under ${filterMap[filter.toString()]}` : ``}
          </h1>
        ) : (
          <h1>
            {' '}
            Use the <strong> Search box</strong> at the top to look for anything
            on your hobbies.
          </h1>
        )}

        {q !== '' ? (
          <p>
            Please check for spelling errors or try a shorter search string.
            {!isMob ? <br /> : ' '}
            Alternately, you can Explore <span>Pages</span> using the below.
          </p>
        ) : (
          <p>Alternately, you can Explore Pages using the below.</p>
        )}
        <div className={styles.filterParent}>
          {/* <div className={styles.filter}> */}
          <div className={styles.inputsContainer}>
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
                  setShowHobbyDropdown(true)
                  handleHobbyKeyDown(e)
                  handleSubmit(true)
                }}
                value={hobby}
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
                          setHobby(hobby.display)
                          // searchResult(undefined, hobby.display)
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
              <AccordianMenuNoResult
                value={category}
                setValue={setCategory}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                handleSubmit={handleSubmit}
                setShowCategoryDropdown={setShowCategoryDropdown}
                showCategoryDropdown={showCategoryDropdown}
              />
            </div>
            <div className={styles.categorySuggestion}>
              <Image
                src={SearchIcon}
                width={16}
                height={16}
                alt="SearchIcon"
                className={styles.searchIconCategory}
              />
              <TextField
                label="Location"
                autoComplete="off"
                inputRef={locationDropdownRef}
                variant="standard"
                name="street"
                size="small"
                className={styles.locationSearch}
                onChange={handleInputChangeAddress}
                value={Addressdata.street.trim()}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  handleLocationKeyDown(e)
                  if (e.key === 'Enter') {
                    setShowAutoAddress(false)
                    // searchResult()
                    if (e.key === 'Enter') {
                      handleSubmit(true)
                    }
                  }
                }}
                sx={{
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#7F63A1 !important',
                  },
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
                }}
                InputProps={{
                  sx: {
                    paddingLeft: '24px',
                  },
                }}
              />

              {showAutoAddress && (
                <div className={styles['dropdown']} ref={locationDropdownRef}>
                  {suggestions.map((suggestion, index) => (
                    <p
                      onClick={() => {
                        handleSelectAddressTwo(
                          suggestion.description,
                          suggestion.place_id,
                        )
                        setLocation(suggestion.description)
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
            {/* </div> */}
          </div>
        </div>
      </div>

      <div className={styles.wrapperFooter}>
        <p>Do you feel we are missing a listing ?</p>
        <button>
          <Link href="/add-listing">Add New</Link>
        </button>
      </div>
    </div>
  )
}

export default NoResult

const FilterInput = ({
  placeholder = 'Hobby',
  //   value,
  // handleChange,
  // isFocused,
  // handleFocus,
  // showDropdown,
  // setShowDropdown,
}) => {
  return (
    <div className={styles.inputDiv}>
      <SearchIcon />
      <input
        autoComplete="new"
        type="text"
        placeholder={placeholder}
        // value={value} onChange={handleChange} onFocus={handleFocus}
      />
      {placeholder === 'Category' && <DownArrow />}
      {/* DROPDOWN DIV */}
    </div>
  )
}
