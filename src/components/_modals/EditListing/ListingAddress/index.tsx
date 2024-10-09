import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import { isEmpty, isEmptyField, validateUrl } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import {
  getListingAddress,
  updateListingAddress,
} from '@/services/listing.service'
import LocationIcon from '@/assets/svg/location-2.svg'
import Image from 'next/image'
import axios from 'axios'
import { listingTypes } from '@/constants/constant'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'

import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import InfoIcon from '@/assets/svg/infoIcon.svg'
import CustomizedTooltips2 from '@/components/Tooltip/Tooltip2'
import {
  getAutocompleteAddressFromGoogle,
  getLatLongFromPlaceID,
} from '@/services/auth.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  onBoarding?: boolean
}

type ListingAddressData = {
  street: InputData<string>
  society: InputData<string>
  locality: InputData<string>
  city: InputData<string>
  pin_code: InputData<string>
  post_code: InputData<string>
  state: InputData<string>
  country: InputData<string>
  latitude: InputData<string>
  longitude: InputData<string>
  virtual: InputData<boolean>
  url: InputData<string>
  description: InputData<string>
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

type DropdownListItem = {
  address: string
  place_id: string
  formatted_address: string
  addressObj: AddressObj
}

const ListingAddressEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  onBoarding,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [fetchLocation, setFetchLocation] = useState(false)
  const [suggestions, setSuggestions] = useState<
    { description: string; place_id: string }[]
  >([])
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const cityRef = useRef<HTMLInputElement>(null)
  const stateRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)
  const pincodeRef = useRef<HTMLInputElement>(null)
  const postcodeRef = useRef<HTMLInputElement>(null)
  const streetRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const localityRef = useRef<HTMLInputElement>(null)
  const societyRef = useRef<HTMLInputElement>(null)
  const [initialData, setInitialData] = useState({})
  const [ShowAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [isChanged, setIsChanged] = useState(false)
  const [ShowDropdown, setShowDropdown] = useState<boolean>(false)
  const [dropdownList, setShowDropdownList] = useState<DropdownListItem[]>([])

  const base_url = process.env.NEXT_PUBLIC_BASE_URL
  useEffect(() => {
    inputRef?.current?.focus()
  }, [])
  const [data, setData] = useState<ListingAddressData>({
    street: { value: '', error: null },
    society: { value: '', error: null },
    locality: { value: '', error: null },
    city: { value: '', error: null },
    pin_code: { value: '', error: null },
    post_code: { value: '', error: null },
    state: { value: '', error: null },
    country: { value: '', error: null },
    latitude: { value: '', error: null },
    longitude: { value: '', error: null },
    virtual: { value: false, error: null },
    url: { value: '', error: null },
    description: { value: '', error: null },
  })

  const handleInputChange = async (event: any) => {
    setShowDropdown(false)
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: { value: event.target.value, error: null },
      }
    })
    if (data.street?.value?.length > 1) {
      setShowAutoAddress(true)
      try {
        const { res, err } = await getAutocompleteAddressFromGoogle(
          data.street.value,
        )
        const addressRes = res.data
        if (addressRes.predictions) {
          setSuggestions(
            addressRes.predictions.map((prediction: any) => ({
              description: prediction.description,
              place_id: prediction.place_id,
            })),
          )
        } else {
          console.error('Error fetching suggestions:', addressRes.error)
        }
      } catch (error) {
        console.error('Network error:', error)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleBackButtonClick = async () => {
    if (!data.country.value && !data.city.value && !data.state.value) {
      if (onBackBtnClick) {
        onBackBtnClick()
      }
      return
    }

    const jsonData = {
      street: data.street.value,
      society: data.society.value,
      locality: data.locality.value,
      city: data.city.value,
      pin_code: data.pin_code.value,
      post_code: data.post_code.value,
      state: data.state.value,
      country: data.country.value,
      latitude: data.latitude.value,
      longitude: data.longitude.value,
    }
    setBackBtnLoading(true)
    const { err, res } = await updateListingAddress(
      listingModalData._address?._id
        ? listingModalData._address?._id
        : listingModalData._address,
      jsonData,
    )
    if (err) return console.log(err)

    if (onBackBtnClick) {
      onBackBtnClick()
    }
  }
  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)
    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }, [data, initialData, onStatusChange])
  const handleSubmit = async () => {
    // if (isChanged) {
    if (data.virtual.value === false) {
      if (listingModalData.type === listingTypes.PLACE) {
        if (isEmptyField(data.street.value) || !data.street.value) {
          streetRef.current?.focus()
          return setData((prev) => {
            return {
              ...prev,
              street: { ...prev.street, error: 'This field is required!' },
            }
          })
        }
        if (isEmptyField(data.society.value) || !data.society.value) {
          societyRef.current?.focus()
          return setData((prev) => {
            return {
              ...prev,
              society: { ...prev.society, error: 'This field is required!' },
            }
          })
        }
        if (isEmptyField(data.locality.value) || !data.locality.value) {
          localityRef.current?.focus()
          return setData((prev) => {
            return {
              ...prev,
              locality: { ...prev.locality, error: 'This field is required!' },
            }
          })
        }
      }
      if (listingModalData.type === listingTypes.PLACE) {
        if (isEmptyField(data.pin_code.value) || !data.pin_code.value) {
          pincodeRef.current?.focus()
          return setData((prev) => {
            return {
              ...prev,
              pin_code: { ...prev.pin_code, error: 'This field is required!' },
            }
          })
        }
        if (isEmptyField(data.post_code.value) || !data.post_code.value) {
          postcodeRef.current?.focus()
          return setData((prev) => {
            return {
              ...prev,
              post_code: {
                ...prev.post_code,
                error: 'This field is required!',
              },
            }
          })
        }
      }
      if (
        isEmptyField(data.city.value) ||
        !data.city.value ||
        isEmptyField(data.state.value) ||
        !data.state.value ||
        isEmptyField(data.country.value) ||
        !data.country.value
      ) {
        if (isEmptyField(data.city.value) || !data.city.value) {
          cityRef.current?.focus()
          setData((prev) => {
            return {
              ...prev,
              city: { ...prev.city, error: 'This field is required!' },
            }
          })
        }
        if (isEmptyField(data.state.value) || !data.state.value) {
          stateRef.current?.focus()
          setData((prev) => {
            return {
              ...prev,
              state: { ...prev.state, error: 'This field is required!' },
            }
          })
        }
        if (isEmptyField(data.country.value) || !data.country.value) {
          countryRef.current?.focus()
          setData((prev) => {
            return {
              ...prev,
              country: { ...prev.country, error: 'This field is required!' },
            }
          })
        }
        return
      }
    } else {
      if (isEmptyField(data.url.value) || !data.url.value) {
        urlRef.current?.focus()
        return setData((prev) => {
          return {
            ...prev,
            url: { ...prev.url, error: 'This field is required!' },
          }
        })
      }
    }
    const jsonData = {
      street: data.street.value,
      society: data.society.value,
      locality: data.locality.value,
      city: data.city.value,
      pin_code: data.pin_code.value,
      post_code: data.post_code.value,
      state: data.state.value,
      country: data.country.value,
      latitude: data.latitude.value,
      longitude: data.longitude.value,
      url: data.url.value,
      description: data.description.value,
      virtual: data.virtual.value,
    }
    setSubmitBtnLoading(true)
    const { err, res } = await updateListingAddress(
      listingModalData._address?._id
        ? listingModalData._address?._id
        : listingModalData._address,
      jsonData,
    )
    if (err) return console.log(err)
    if (onComplete) onComplete()
    else {
      window.location.reload()
      // dispatch(closeModal())
    }
    // }
  }

  const updateAddress = async () => {
    console.log('listingModalData', listingModalData)
    const { err, res } = await getListingAddress(
      listingModalData._address?._id
        ? listingModalData._address?._id
        : listingModalData._address,
    )
    if (err) return console.log(err)

    setData({
      street: { value: res?.data.data.address.street, error: null },
      society: { value: res?.data.data.address.society, error: null },
      locality: { value: res?.data.data.address.locality, error: null },
      city: { value: res?.data.data.address.city, error: null },
      pin_code: { value: res?.data.data.address.pin_code, error: null },
      post_code: { value: res?.data.data.address.post_code, error: null },
      state: { value: res?.data.data.address.state, error: null },
      country: { value: res?.data.data.address.country, error: null },
      latitude: { value: res?.data.data.address.latitude, error: null },
      longitude: { value: res?.data.data.address.longitude, error: null },
      virtual: { value: res?.data.data.address.virtual, error: null },
      url: { value: res?.data.data.address.url, error: null },
      description: { value: res?.data.data.address.description, error: null },
    })
    setInitialData({
      street: { value: res?.data.data.address.street, error: null },
      society: { value: res?.data.data.address.society, error: null },
      locality: { value: res?.data.data.address.locality, error: null },
      city: { value: res?.data.data.address.city, error: null },
      pin_code: { value: res?.data.data.address.pin_code, error: null },
      post_code: { value: res?.data.data.address.post_code, error: null },
      state: { value: res?.data.data.address.state, error: null },
      country: { value: res?.data.data.address.country, error: null },
      latitude: { value: res?.data.data.address.latitude, error: null },
      longitude: { value: res?.data.data.address.longitude, error: null },
      virtual: { value: res?.data.data.address.virtual, error: null },
      url: { value: res?.data.data.address.url, error: null },
      description: { value: res?.data.data.address.description, error: null },
    })
    setDataLoaded(true)
  }

  useEffect(() => {
    streetRef.current?.focus()
    updateAddress()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (streetRef.current && !streetRef.current.contains(event.target)) {
        setShowDropdown(false)
        setShowAutoAddress(false)
      }
    }
    if (ShowDropdown || ShowAutoAddress) {
      window.addEventListener('click', handleClickOutside)
    }

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [ShowDropdown])

  const getLocation = () => {
    //Get latitude and longitude;
    const successFunction = (position: any) => {
      var lat = position.coords.latitude
      var long = position.coords.longitude
      setData((prev) => ({
        ...prev,
        latitude: { value: lat, error: null },
        longitude: { value: long, error: null },
      }))
      console.log(lat)
      console.log(long)
      handleGeocode(lat, long)
    }
    const errorFunction = () => {
      alert('Location permission denied!')
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction)
    }
  }

  useEffect(() => {
    if (!fetchLocation) {
      if (dataLoaded) {
        if (
          (!data.street.value || data.street.value === '') &&
          (!data.society.value || data.society.value === '') &&
          (!data.locality.value || data.locality.value === '') &&
          (!data.city.value || data.city.value === '') &&
          (!data.state.value || data.state.value === '') &&
          (!data.country.value || data.country.value === '')
        ) {
          getLocation()
          setFetchLocation(true)
        }
      }
    }
  }, [dataLoaded])

  const handleGeocode = (lat: any, long: any) => {
    setShowDropdown(true)
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCSFbd4Cf-Ui3JvMvEiXXs9xfGJaveKO_Y`,
      )
      .then((response) => {
        const { results } = response.data
        console.log('response', response)

        if (results && results.length > 0) {
          setShowDropdownList(
            results.slice(0, 6).map((result: any) => {
              const { address_components } = result
              console.log({ address_components })
              let addressParts: string[] = []
              let addressObj: AddressObj = {}
              address_components.forEach((component: any) => {
                if (component.types.includes('street_number')) {
                  addressParts.push(component.long_name)
                  addressObj.street_number = component.long_name
                }
                if (component.types.includes('neighborhood')) {
                  addressParts.push(component.long_name)
                  addressObj.neighbour = component.long_name
                }
                if (component.types.includes('route')) {
                  addressParts.push(component.long_name)
                  addressObj.route = component.long_name
                }
                if (component.types.includes('subpremise')) {
                  addressParts.push(component.long_name)
                  addressObj.subpremise = component.long_name
                }
                if (component.types.includes('premise')) {
                  addressParts.push(component.long_name)
                  if (addressObj.premise) {
                    addressObj.primise2 = component.long_name
                  } else {
                    addressObj.premise = component.long_name
                  }
                }
                if (component.types.includes('locality')) {
                  addressParts.push(component.long_name)
                  addressObj.locality = component.long_name
                }
                if (component.types.includes('administrative_area_level_1')) {
                  addressParts.push(component.long_name)
                  addressObj.administrative_area_level_1 = component.long_name
                }
                if (component.types.includes('country')) {
                  addressParts.push(component.long_name)
                  addressObj.country = component.long_name
                }

                if (component.types.includes('postal_code')) {
                  addressParts.push(component.long_name)
                  addressObj.post_code = component.long_name
                  addressObj.pin_code = component.long_name
                }
                if (component.types.includes('sublocality_level_1')) {
                  addressParts.push(component.long_name)
                  addressObj.sublocality_level_1 = component.long_name
                }
                if (component.types.includes('sublocality_level_2')) {
                  addressParts.push(component.long_name)
                  addressObj.sublocality_level_2 = component.long_name
                }
                if (component.types.includes('sublocality_level_3')) {
                  addressParts.push(component.long_name)
                  addressObj.sublocality_level_3 = component.long_name
                }
              })
              console.log('addpart', addressParts)

              return {
                ...result,
                formatted_address: addressParts.join(', '),
                addressObj,
              }
            }),
          )
        }
      })
      .catch((error) => {
        console.error('Error geocoding:', error)
      })
  }

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if (event?.srcElement?.tagName === 'svg') {
          return
        }
        nextButtonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])
  const HandleSaveError = async () => {
    if (
      !data.city.value ||
      data.city.value === '' ||
      !data.state ||
      data.state.value === '' ||
      !data.country.value ||
      data.country.value === ''
    ) {
      setIsError(true)
    }
  }

  useEffect(() => {
    if (confirmationModal) {
      HandleSaveError()
    }
  }, [confirmationModal])

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isError])

  const handleSelectAddress = (data: DropdownListItem) => {
    setShowDropdown(false)
    const { addressObj } = data

    const streetComponents = [
      addressObj.street_number,
      addressObj.subpremise,
      addressObj.premise,
      addressObj.primise2,
      addressObj.neighbour,
      addressObj.sublocality_level_3,
      addressObj.route,
    ].filter(Boolean)

    // Check if there are any street components to include
    const streetValue =
      streetComponents.length > 0 ? streetComponents.join(', ') : ''

    setData((prev) => ({
      ...prev,
      pin_code: {
        ...prev.pin_code,
        value: addressObj.pin_code ?? '',
        error: null,
      },
      post_code: {
        ...prev.post_code,
        value: addressObj.post_code ?? '',
        error: null,
      },
      country: {
        ...prev.country,
        value: addressObj.country ?? '',
        error: null,
      },
      city: {
        ...prev.city,
        value: addressObj.locality ?? '',
        error: null,
      },
      state: {
        ...prev.state,
        value: addressObj.administrative_area_level_1 ?? '',
        error: null,
      },
      society: {
        ...prev.society,
        value: addressObj.sublocality_level_2 ?? '',
        error: null,
      },
      street: {
        ...prev.street,
        value: streetValue,
        error: null,
      },
      locality: {
        ...prev.locality,
        value: addressObj.sublocality_level_1 ?? '',
        error: null,
      },
    }))
  }

  const handleSelectAddressTwo = async (
    suggestion: string,
    placeid: string,
  ) => {
    const details: any = {}
    const { res, err } = await getLatLongFromPlaceID(placeid)
    const latlongObj = res.data
    console.warn('suggestionssssss', suggestion)

    const terms = suggestion.split(',').map((term) => term.trim())

    if (terms.length >= 1) details.country = terms[terms.length - 1]
    if (terms.length >= 2) details.state = terms[terms.length - 2]
    if (terms.length >= 3) details.city = terms[terms.length - 3]
    if (terms.length >= 4) details.locality = terms[terms.length - 4]
    if (terms.length >= 5) details.society = terms[terms.length - 5]
    if (terms.length >= 6)
      details.street = terms.slice(0, terms.length - 5).join(', ')

    setData((prev) => ({
      ...prev,
      street: {
        ...prev.street,
        value: details.street || '',
        error: null,
      },
      locality: {
        ...prev.locality,
        value: details.locality || '',
        error: null,
      },
      city: {
        ...prev.city,
        value: details.city || '',
        error: null,
      },
      state: {
        ...prev.state,
        value: details.state || '',
        error: null,
      },
      country: {
        ...prev.country,
        value: details.country || '',
        error: null,
      },
      society: {
        ...prev.society,
        value: details.society || '',
        error: null,
      },
      latitude: {
        value: latlongObj.lat || '',
        error: null,
      },
      longitude: {
        value: latlongObj.lng || '',
        error: null,
      },
      pin_code: {
        value: latlongObj.zipcode || '',
        error: null,
      },
      post_code: {
        value: latlongObj.zipcode || '',
        error: null,
      },
    }))
    setShowAutoAddress(false)
  }

  const closedVirtualIcon = (
    <svg
      onClick={() => {
        setData((prev) => ({
          ...prev,
          virtual: { ...prev.virtual, value: !prev.virtual.value },
        }))
      }}
      xmlns="http://www.w3.org/2000/svg"
      cursor={'pointer'}
      width="39"
      height="21"
      viewBox="0 0 39 21"
      fill="none"
    >
      <rect
        x="0.0703125"
        y="0.614746"
        width="38"
        height="20"
        rx="10"
        fill="#CED4DA"
      />
      <circle cx="10.0703" cy="10.6147" r="8" fill="white" />
    </svg>
  )

  const openVirtualIcon = (
    <svg
      onClick={() => {
        setData((prev) => ({
          ...prev,
          virtual: { ...prev.virtual, value: !prev.virtual.value },
        }))
      }}
      xmlns="http://www.w3.org/2000/svg"
      cursor={'pointer'}
      width="39"
      height="21"
      viewBox="0 0 39 21"
      fill="none"
    >
      <rect
        x="0.0703125"
        y="0.614746"
        width="38"
        height="20"
        rx="10"
        fill="#8064A2"
      />
      <circle cx="28.0703" cy="10.6147" r="8" fill="white" />
    </svg>
  )

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
        OnBoarding={onBoarding}
      />
    )
  }
  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Location'}</h4>
          {(listingModalData?.type === 3 || listingModalData?.type === 4) && (
            <div
              className={
                styles['virtual-container'] +
                ` ${!onBoarding && styles['at-center-and-reverse']}`
              }
            >
              <p>Virtual</p>
              {data.virtual.value ? openVirtualIcon : closedVirtualIcon}
            </div>
          )}
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          {data.virtual.value === true ? (
            <>
              <div className={styles['input-box']}>
                <label>URL</label>
                <div
                  className={` ${styles['street-input-container']}  ${
                    data.url.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <input
                    type="text"
                    placeholder={`Zoom, YouTube Live, Facebook Live, etc.`}
                    value={data.url.value}
                    name="url"
                    required
                    onChange={handleInputChange}
                    ref={urlRef}
                  />
                </div>
                <p className={styles['helper-text']}>{data.url.error}</p>
              </div>
              <div className={styles['input-box']}>
                <label>Description</label>
                <div
                  className={` ${styles['street-input-container']}  ${
                    data.description.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <textarea
                    placeholder={`This could be sent out to registered participants.  You may include instructions to access, etc.`}
                    value={data.description.value}
                    name="description"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <p className={styles['helper-text']}>
                  {data.description.error}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Street Address */}
              <div className={styles['input-box']}>
                <label>Street Address</label>
                <div
                  className={` ${styles['street-input-container']}  ${
                    data.street.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <input
                    type="text"
                    placeholder={`Enter address or click on GPS icon to the right`}
                    value={data.street.value}
                    name="street"
                    required={listingModalData.type === listingTypes.PLACE}
                    onChange={handleInputChange}
                    ref={streetRef}
                  />
                  <Image
                    src={LocationIcon}
                    alt="location"
                    className={styles.locationImg}
                    onClick={() => {
                      getLocation()
                      streetRef?.current?.focus()
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        e.stopPropagation()
                        getLocation()
                        setTimeout(() => {
                          streetRef?.current?.focus()
                        }, 50)
                      }
                    }}
                  />
                </div>
                <div>
                  {ShowAutoAddress && (
                    <div className={styles['dropdown']}>
                      {suggestions.map((suggestion, index) => (
                        <p
                          onClick={() =>
                            handleSelectAddressTwo(
                              suggestion.description,
                              suggestion.place_id,
                            )
                          }
                          key={index}
                        >
                          {suggestion.description}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                {ShowDropdown && dropdownList.length !== 0 && (
                  <div className={styles['dropdown']}>
                    {dropdownList.map((location) => {
                      return location.formatted_address ? (
                        <p
                          onClick={() => {
                            handleSelectAddress(location)
                          }}
                          key={location.place_id}
                        >
                          {location.formatted_address}
                        </p>
                      ) : null
                    })}
                  </div>
                )}
                <p className={styles['helper-text']}>{data.street.error}</p>
              </div>
              <section className={styles['two-column-grid']}>
                <div
                  className={`${styles['input-box']} ${
                    data.society.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label className={styles['info-container']}>
                    <span>Society</span>

                    <CustomizedTooltips2
                      width={273}
                      placement="right"
                      title="Society is where community events are organized.  It could be an apartment complex, row of houses or neighbourhood, typically within walking distance.  It should ideally be between 20 and 2000 individual addresses."
                    >
                      <Image
                        height={18}
                        width={18}
                        src={InfoIcon}
                        alt="info-icon"
                      />
                    </CustomizedTooltips2>
                  </label>

                  <input
                    type="text"
                    placeholder={`Building Name`}
                    value={data.society.value}
                    required={listingModalData.type === listingTypes.PLACE}
                    name="society"
                    onChange={handleInputChange}
                    ref={societyRef}
                  />
                  <p className={styles['helper-text']}>{data.society.error}</p>
                </div>
                <div
                  className={`${styles['input-box']} ${
                    data.locality.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>Locality</label>
                  <input
                    type="text"
                    placeholder={`Locality`}
                    value={data.locality.value}
                    required={listingModalData.type === listingTypes.PLACE}
                    name="locality"
                    onChange={handleInputChange}
                    ref={localityRef}
                  />
                  <p className={styles['helper-text']}>{data.locality.error}</p>
                </div>
              </section>
              <section className={styles['two-column-grid']}>
                <div
                  className={`${styles['input-box']} ${
                    data.city.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>City</label>
                  <input
                    type="text"
                    placeholder={`City Name`}
                    required
                    value={data.city.value}
                    name="city"
                    ref={cityRef}
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>{data.city.error}</p>
                </div>

                <div className={styles['pincode-input-box']}>
                  <div className={styles['input-box']}>
                    <label>Postal Code</label>
                    <input
                      type="text"
                      placeholder={`Postal Code`}
                      value={data.post_code.value}
                      required={listingModalData.type === listingTypes.PLACE}
                      name="post_code"
                      onChange={handleInputChange}
                      ref={postcodeRef}
                    />
                    <p className={styles['helper-text']}>
                      {data.post_code.error}
                    </p>
                  </div>

                  <div className={styles['input-box']}>
                    <label className={styles['info-container']}>
                      <span>GPS PIN</span>

                      <CustomizedTooltips2
                        width={287}
                        placement="bottom-end"
                        title="GPS PIN Code is the mapping as per Google Maps.  Postal Code is the Post Office that delivers to this address.  In some cases, these two may be different.  Clicking on the GPS icon updates only the GPS PIN Code, not the Postal Code."
                      >
                        <Image
                          height={18}
                          width={18}
                          src={InfoIcon}
                          alt="info-icon"
                        />
                      </CustomizedTooltips2>
                    </label>
                    <input
                      type="text"
                      placeholder={`GPS PIN Code`}
                      value={data.pin_code.value}
                      required={listingModalData.type === listingTypes.PLACE}
                      name="pin_code"
                      onChange={handleInputChange}
                      ref={pincodeRef}
                    />
                    <p className={styles['helper-text']}>
                      {data.pin_code.error}
                    </p>
                  </div>
                </div>
              </section>
              <section className={styles['two-column-grid']}>
                <div
                  className={`${styles['input-box']} ${
                    data.state.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>State</label>
                  <input
                    type="text"
                    placeholder={`State Name`}
                    required
                    value={data.state.value}
                    name="state"
                    ref={stateRef}
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>{data.state.error}</p>
                </div>
                <div
                  className={`${styles['input-box']} ${
                    data.country.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>Country</label>
                  <input
                    type="text"
                    placeholder={`Country Name`}
                    required
                    value={data.country.value}
                    ref={countryRef}
                    name="country"
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>{data.country.error}</p>
                </div>
              </section>
            </>
          )}
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button
                className="modal-footer-btn cancel"
                onClick={handleBackButtonClick}
              >
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={handleBackButtonClick}>
                <Image
                  src={BackIcon}
                  alt="Back"
                  className="modal-mob-btn cancel"
                />
              </div>
            </>
          )}

          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Next'
            ) : (
              'Save'
            )}
          </button>
          {/* SVG Button for Mobile */}
          {onComplete ? (
            <div onClick={handleSubmit}>
              <Image
                src={NextIcon}
                alt="back"
                className="modal-mob-btn cancel"
              />
            </div>
          ) : (
            <button
              ref={nextButtonRef}
              className="modal-mob-btn-save"
              onClick={handleSubmit}
              disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Save'
              )}
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ListingAddressEditModal
