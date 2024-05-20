import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import { isEmpty, isEmptyField } from '@/utils'
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
import CustomizedTooltips2 from '@/components/Tooltip/Tooltip2'

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

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const cityRef = useRef<HTMLInputElement>(null)
  const stateRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)
  const pincodeRef = useRef<HTMLInputElement>(null)
  const postcodeRef = useRef<HTMLInputElement>(null)
  const streetRef = useRef<HTMLInputElement>(null)
  const localityRef = useRef<HTMLInputElement>(null)
  const societyRef = useRef<HTMLInputElement>(null)
  const [initialData, setInitialData] = useState({})
  const [isChanged, setIsChanged] = useState(false)
  const [ShowDropdown, setShowDropdown] = useState<boolean>(false)
  const [dropdownList, setShowDropdownList] = useState<DropdownListItem[]>([])

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
  })

  const handleInputChange = (event: any) => {
    setShowDropdown(false)
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: { value: event.target.value, error: null },
      }
    })
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
            post_code: { ...prev.post_code, error: 'This field is required!' },
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
      }
    }
    if (ShowDropdown) {
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
                if (component.types.includes('pin_code')) {
                  addressParts.push(component.long_name)
                  addressObj.pin_code = component.long_name
                }
                if (component.types.includes('post_code')) {
                  addressParts.push(component.long_name)
                  addressObj.post_code = component.long_name
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
        if (event?.srcElement?.tagName === "svg") {
          return;
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
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <>
            {/* Street Address */}
            <div className={styles['input-box']}>
              <label>Street Address</label>
              <div
                className={` ${styles['street-input-container']}  ${data.street.error ? styles['input-box-error'] : ''
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
                      e.preventDefault();
                      e.stopPropagation();
                      getLocation();
                      setTimeout(() => {
                        streetRef?.current?.focus();
                      }, 50);
                    }
                  }}
                />
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
                className={`${styles['input-box']} ${data.society.error ? styles['input-box-error'] : ''
                  }`}
              >
                <label className={styles['info-container']}>
                  <span>Society</span>
                  <CustomizedTooltips2 placement="right" title='Society is where community events are organized.  It could be an apartment complex, row of houses or neighbourhood, typically within walking distance.  It should ideally be between 20 and 2000 individual addresses.'>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.25 12.75H9.75V8.25H8.25V12.75ZM9 6.75C9.2125 6.75 9.39075 6.678 9.53475 6.534C9.67875 6.39 9.7505 6.212 9.75 6C9.7495 5.788 9.6775 5.61 9.534 5.466C9.3905 5.322 9.2125 5.25 9 5.25C8.7875 5.25 8.6095 5.322 8.466 5.466C8.3225 5.61 8.2505 5.788 8.25 6C8.2495 6.212 8.3215 6.39025 8.466 6.53475C8.6105 6.67925 8.7885 6.751 9 6.75ZM9 16.5C7.9625 16.5 6.9875 16.303 6.075 15.909C5.1625 15.515 4.36875 14.9808 3.69375 14.3063C3.01875 13.6318 2.4845 12.838 2.091 11.925C1.6975 11.012 1.5005 10.037 1.5 9C1.4995 7.963 1.6965 6.988 2.091 6.075C2.4855 5.162 3.01975 4.36825 3.69375 3.69375C4.36775 3.01925 5.1615 2.485 6.075 2.091C6.9885 1.697 7.9635 1.5 9 1.5C10.0365 1.5 11.0115 1.697 11.925 2.091C12.8385 2.485 13.6323 3.01925 14.3063 3.69375C14.9803 4.36825 15.5148 5.162 15.9098 6.075C16.3048 6.988 16.5015 7.963 16.5 9C16.4985 10.037 16.3015 11.012 15.909 11.925C15.5165 12.838 14.9823 13.6318 14.3063 14.3063C13.6303 14.9808 12.8365 15.5152 11.925 15.9097C11.0135 16.3042 10.0385 16.501 9 16.5ZM9 15C10.675 15 12.0938 14.4187 13.2563 13.2562C14.4187 12.0937 15 10.675 15 9C15 7.325 14.4187 5.90625 13.2563 4.74375C12.0938 3.58125 10.675 3 9 3C7.325 3 5.90625 3.58125 4.74375 4.74375C3.58125 5.90625 3 7.325 3 9C3 10.675 3.58125 12.0937 4.74375 13.2562C5.90625 14.4187 7.325 15 9 15Z" fill="#939CA3" />
                    </svg>
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
                className={`${styles['input-box']} ${data.locality.error ? styles['input-box-error'] : ''
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
                className={`${styles['input-box']} ${data.city.error ? styles['input-box-error'] : ''
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
                  <p className={styles['helper-text']}>{data.post_code.error}</p>
                </div>

                <div className={styles['input-box']}>
                  <label className={styles['info-container']}>
                    <span>GPS PIN Code</span>
                    <CustomizedTooltips2 placement="bottom-end" title='GPS PIN Code is the mapping as per Google Maps.  Postal Code is the Post Office that delivers to this address.  In some cases, these two may be different.  Clicking on the GPS icon updates only the GPS PIN Code, not the Postal Code.'>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.25 12.75H9.75V8.25H8.25V12.75ZM9 6.75C9.2125 6.75 9.39075 6.678 9.53475 6.534C9.67875 6.39 9.7505 6.212 9.75 6C9.7495 5.788 9.6775 5.61 9.534 5.466C9.3905 5.322 9.2125 5.25 9 5.25C8.7875 5.25 8.6095 5.322 8.466 5.466C8.3225 5.61 8.2505 5.788 8.25 6C8.2495 6.212 8.3215 6.39025 8.466 6.53475C8.6105 6.67925 8.7885 6.751 9 6.75ZM9 16.5C7.9625 16.5 6.9875 16.303 6.075 15.909C5.1625 15.515 4.36875 14.9808 3.69375 14.3063C3.01875 13.6318 2.4845 12.838 2.091 11.925C1.6975 11.012 1.5005 10.037 1.5 9C1.4995 7.963 1.6965 6.988 2.091 6.075C2.4855 5.162 3.01975 4.36825 3.69375 3.69375C4.36775 3.01925 5.1615 2.485 6.075 2.091C6.9885 1.697 7.9635 1.5 9 1.5C10.0365 1.5 11.0115 1.697 11.925 2.091C12.8385 2.485 13.6323 3.01925 14.3063 3.69375C14.9803 4.36825 15.5148 5.162 15.9098 6.075C16.3048 6.988 16.5015 7.963 16.5 9C16.4985 10.037 16.3015 11.012 15.909 11.925C15.5165 12.838 14.9823 13.6318 14.3063 14.3063C13.6303 14.9808 12.8365 15.5152 11.925 15.9097C11.0135 16.3042 10.0385 16.501 9 16.5ZM9 15C10.675 15 12.0938 14.4187 13.2563 13.2562C14.4187 12.0937 15 10.675 15 9C15 7.325 14.4187 5.90625 13.2563 4.74375C12.0938 3.58125 10.675 3 9 3C7.325 3 5.90625 3.58125 4.74375 4.74375C3.58125 5.90625 3 7.325 3 9C3 10.675 3.58125 12.0937 4.74375 13.2562C5.90625 14.4187 7.325 15 9 15Z" fill="#939CA3" />
                      </svg>
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
                  <p className={styles['helper-text']}>{data.pin_code.error}</p>
                </div>
              </div>


            </section>
            <section className={styles['two-column-grid']}>
              <div
                className={`${styles['input-box']} ${data.state.error ? styles['input-box-error'] : ''
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
                className={`${styles['input-box']} ${data.country.error ? styles['input-box-error'] : ''
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
