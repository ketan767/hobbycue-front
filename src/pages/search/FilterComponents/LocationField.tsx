import { TextField } from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles.module.css'
import SearchIcon from '@/assets/svg/search.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setLocation } from '@/redux/slices/explore'
import useHandleUserProfileSearch from '../utils/HandleUserProSearch'
import useHandleSubmit from '../utils/HandleSubmit'
import useHandlePostsSearch from '../utils/HandlePostsSearch'
import { useRouter } from 'next/router'
import {
  getAutocompleteAddressFromGoogle,
  getLatLongFromPlaceID,
} from '@/services/auth.service'
import LocationDropdown from './components/LocationDropdown'

type LocationProps = {
  filterPage?: string
  currUserName?: string
  currPostedBy?: string
  selectedCategory?: string
  selectedPageType?: string
  selectedHobby: string
  selectedLocation: string
  setSelectedLocation: (location: string) => void
}
const LocationField: React.FC<LocationProps> = ({
  filterPage = '',
  currUserName = '',
  currPostedBy = '',
  selectedCategory,
  selectedPageType,
  selectedHobby,
  selectedLocation,
  setSelectedLocation,
}) => {
  const [showAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [focusedLocationIdx, setFocusedLocationIdx] = useState<number>(-1)
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false)
  const locationDropdownRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState<
    { description: string[]; place_id: string }[]
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
  const dispatch = useDispatch()
  const handleUserProfileSearch = useHandleUserProfileSearch()

  const handlePostsSearch = useHandlePostsSearch()
  const handleSubmit = useHandleSubmit()
  const router = useRouter()
  const { q = '', filter = '' } = router.query
  const inputRef = useRef<HTMLDivElement | null>(null)

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        const downIndex =
          focusedLocationIdx < suggestions.length - 1
            ? focusedLocationIdx + 1
            : focusedLocationIdx
        setFocusedLocationIdx((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex,
        )
        // dispatch(setLocation(suggestions[downIndex]?.description[0]))
        setSelectedLocation(suggestions[downIndex]?.description[0])

        break
      case 'ArrowUp':
        const upIndex =
          focusedLocationIdx > 0 ? focusedLocationIdx - 1 : focusedLocationIdx
        setFocusedLocationIdx((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        )
        setSelectedLocation(suggestions[upIndex]?.description[0])
        // dispatch(setLocation(suggestions[upIndex]?.description[0]))
        break
      case 'Enter':
        if (
          Addressdata.street.trim().length !== 0 &&
          focusedLocationIdx === -1
        ) {
          if (filter === 'users' || (filterPage && filterPage === 'User')) {
            handleUserProfileSearch(
              currUserName,
              selectedHobby,
              selectedLocation,
            )
          } else if (filter === 'posts') {
            handlePostsSearch(currPostedBy, selectedHobby, selectedLocation)
          } else {
            console.log('selectedCategory', selectedCategory)
            console.log('selectedPageType', selectedPageType)
            console.log('selectedHobby', selectedHobby)
            console.log('selectedLocation', selectedLocation)
            handleSubmit(
              selectedCategory!,
              selectedPageType!,
              selectedHobby!,
              selectedLocation!,
            )
          }
        } else if (focusedLocationIdx !== -1) {
          setShowAutoAddress(false)
          if (showAutoAddress) {
            handleSelectAddressTwo(
              suggestions[focusedLocationIdx]?.description?.join(', '),
              suggestions[focusedLocationIdx]?.place_id,
            )
            console.log(
              'Changed location',
              suggestions[focusedLocationIdx]?.description[0],
            )
            dispatch(
              setLocation(suggestions[focusedLocationIdx]?.description[0]),
            )
          }

          if (isLocationSelected) {
            if (filter === 'users' || (filterPage && filterPage === 'User')) {
              handleUserProfileSearch(
                currUserName,
                selectedHobby,
                selectedLocation,
              )
            } else if (filter === 'posts') {
              handlePostsSearch(currPostedBy, selectedHobby, selectedLocation)
            } else {
              console.log('selectedCategory', selectedCategory)
              console.log('selectedPageType', selectedPageType)
              console.log('selectedHobby', selectedHobby)
              console.log('selectedLocation', selectedLocation)
              handleSubmit(
                selectedCategory!,
                selectedPageType!,
                selectedHobby!,
                selectedLocation!,
              )
            }
          }
          setIsLocationSelected(true)
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
  const handleInputChangeAddress = async (event: any) => {
    setFocusedLocationIdx(-1)
    const { name, value } = event.target
    setAddressData((prev) => ({ ...prev, [name]: value }))
    // alert(value)
    // dispatch(setLocation(value))
    setSelectedLocation(value)

    if (Addressdata.street?.length > 1) {
      setShowAutoAddress(true)
      try {
        const { res, err } = await getAutocompleteAddressFromGoogle(value)
        const data = res.data

        if (data.predictions) {
          console.warn('suggestionsssss', data)
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

  return (
    <div className={styles.categorySuggestion} ref={inputRef}>
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
        value={selectedLocation}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key !== 'Enter') {
            setShowAutoAddress(true)
            setIsLocationSelected(false)
          }
          handleLocationKeyDown(e)
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
        <LocationDropdown
          inputRef={inputRef}
          suggestions={suggestions}
          locationDropdownRef={locationDropdownRef}
          focusedLocationIdx={focusedLocationIdx}
          setLocation={setLocation}
          handleSelectAddressTwo={handleSelectAddressTwo}
        />
      )}
    </div>
  )
}
export default LocationField