import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress, useMediaQuery } from '@mui/material'
import {
  TrendingHobbiesByUser,
  addUserAddress,
  addUserHobbies,
  addUserHobby,
  getMyProfileDetail,
  updateMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import {
  checkFullname,
  containOnlyNumbers,
  isEmpty,
  isEmptyField,
} from '@/utils'
import { closeModal, setHasChanges } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateUser } from '@/redux/slices/user'
import FilledButton from '@/components/_buttons/FilledButton'
import axios from 'axios'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'
import LocationIcon from '@/assets/svg/location-2.svg'
import {
  SendHobbyRequest,
  getAllHobbies,
  getTrendingHobbies,
} from '@/services/hobby.service'
import Link from 'next/link'
import { BubbleChartTwoTone } from '@mui/icons-material'
import CrossIcon from '@/assets/svg/cross.svg'

import {
  getAutocompleteAddressFromGoogle,
  getLatLongFromPlaceID,
} from '@/services/auth.service'

import { useRouter } from 'next/router'
import AddHobby from '../../AddHobby/AddHobbyModal'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  CheckIsOnboarded?: any
  setShowAddHobbyModal?: any
  showAddHobbyModal?: boolean
  propData?: {
    selectedHobbyToAdd?: {
      _id: string
      display: string
      level: number
      show: boolean
    }
    showError?: boolean
  }
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
type DropdownListItemHobby = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
  genreId?: any
}

type ProfileGeneralData = {
  full_name: string
  public_email: string
  tagline: string
  display_name: string
  profile_url: string
  gender: 'male' | 'female' | null
  year_of_birth: string
  onboarding_step?: string
  completed_onboarding_steps?: any
}

type Snackbar = {
  triggerOpen: boolean
  message: string
  type: 'error' | 'success'
  closeSnackbar?: () => void
}

const SimpleOnboarding: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  setShowAddHobbyModal,
  onStatusChange,
  propData,
  showAddHobbyModal,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const selectedHobbyToAdd = propData && propData?.selectedHobbyToAdd
  const { user } = useSelector((state: RootState) => state.user)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [SubmitAddress, setSubmitAddress] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [nextDisabled, setNextDisabled] = useState(false)
  const [isError, setIsError] = useState(false)
  const [HobbyError, setHobbyError] = useState(false)
  const [focusedHobbyIndex, setFocusedHobbyIndex] = useState<number>(-1)
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [selectedHobbies, setselectedHobbies] = useState<
    DropdownListItemHobby[]
  >([])
  const [initialData, setInitialData] = useState<ProfileGeneralData>()
  const [isChanged, setIsChanged] = useState(false)
  const AddressRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const fullNameRef = useRef<HTMLInputElement>(null)
  const displayNameRef = useRef<HTMLInputElement>(null)
  const profileUrlRef = useRef<HTMLInputElement>(null)
  const dobRef = useRef<HTMLInputElement>(null)
  const hobbyDropDownWrapperRef = useRef<HTMLDivElement>(null)
  const [userHobbies, setUserHobbies]: any = useState([])
  const hobbyDropdownRef = useRef<HTMLDivElement>(null)
  const [urlSpanLength, setUrlSpanLength] = useState<number>(0)
  const [dropdownList, setShowDropdownList] = useState<DropdownListItem[]>([])
  const urlSpanRef = useRef<HTMLSpanElement>(null)
  const hobbysearchref = useRef<HTMLInputElement>(null)
  const [ShowDropdown, setShowDropdown] = useState<boolean>(false)
  const [ShowAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [showHobbyDowpdown, setShowHobbyDowpdown] = useState<boolean>(false)
  const [errorOrmsg, setErrorOrmsg] = useState<string | null>(null)
  const [trendingHobbies, setTrendingHobbies] = useState([])
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

  const [data, setData] = useState<ProfileGeneralData>({
    full_name: '',
    public_email: '',
    tagline: '',
    display_name: '',
    profile_url: '',
    gender: null,
    year_of_birth: '',

    completed_onboarding_steps: 'General',
  })

  const [inputErrs, setInputErrs] = useState<{ [key: string]: string | null }>({
    full_name: null,
    public_email: null,
    location: null,
    hobbies: null,
  })

  const [showSnackbar, setShowSnackbar] = useState<Snackbar>({
    triggerOpen: false,
    message: '',
    type: 'success' || 'error',
  })

  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    DropdownListItemHobby[]
  >([])

  const handleInputChangeAddress = async (event: any) => {
    setShowDropdown(false)
    const { name, value } = event.target
    setAddressData((prev) => ({ ...prev, [name]: value }))
    setInputErrs((prev) => ({ ...prev, [name]: null }))
    if (Addressdata.street?.length > 1) {
      setShowAutoAddress(true)
      try {
        const { res, err } = await getAutocompleteAddressFromGoogle(
          Addressdata.street,
        )
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
    const { set_as_primary: set_as_primary, ...currentData } = {
      ...Addressdata,
      [name]: value,
    }
    const hasChanges =
      JSON.stringify(currentData) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)
    dispatch(setHasChanges(hasChanges))
    if (onStatusChange) {
      onStatusChange(hasChanges)
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

    setAddressData((prev) => ({
      ...prev,
      street: `${details.street ? details.street + ',' : ''} ${
        details.society ? details.society + ',' : ''
      } ${details.locality ? details.locality + ',' : ''} ${
        details.city ? details.city + ',' : ''
      } ${details.state ? details.state + ',' : ''} ${details.country}`,
      locality: details.locality || '',
      city: details.city || '',
      state: details.state || '',
      country: details.country || '',
      society: details.society || '',
      latitude: latlongObj?.lat || '',
      longitude: latlongObj?.lng || '',
      pin_code: latlongObj.zipcode || '',
      post_code: latlongObj.zipcode || '',
    }))
    setShowAutoAddress(false)
  }

  const updateStreet = async () => {
    const detail: any = {}
    const terms = selectedAddress.split(',').map((term) => term.trim())

    if (terms.length >= 1) detail.country = terms[terms.length - 1]
    if (terms.length >= 2) detail.state = terms[terms.length - 2]
    if (terms.length >= 3) detail.city = terms[terms.length - 3]
    if (terms.length >= 4) detail.locality = terms[terms.length - 4]
    if (terms.length >= 5) detail.society = terms[terms.length - 5]
    if (terms.length >= 6)
      detail.street = terms.slice(0, terms.length - 5).join(', ')

    setAddressData((Addressdata.street = detail.street ? detail.street : ''))
  }

  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    if (name === 'profile_url') {
      // Only apply this modification for the profile_url field
      // Replace special characters with '-'
      const modifiedValue = value.replace(/[^a-zA-Z0-9-]/g, '-')
      setData((prev) => ({ ...prev, [name]: modifiedValue }))
      setInputErrs((prev) => ({ ...prev, [name]: null }))
    } else {
      setData((prev) => ({ ...prev, [name]: value }))
      setInputErrs((prev) => ({ ...prev, [name]: null }))
    }

    // Compare current data with initial data to check for changes
    const currentData = { ...data, [name]: value }
    const hasChanges =
      JSON.stringify(currentData) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)
    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }

  const handleSubmit = async () => {
    if (
      hobbyInputValue.includes(',') ||
      hobbyInputValue.includes('.') ||
      hobbyInputValue.length > 25
    ) {
      setInputErrs((prev) => ({
        ...prev,
        hobbies:
          'Please Type and Select hobbies individually.  Added ones will appear below the Hobbies* label',
      }))
      return
    } else {
      setInputErrs((prev) => ({
        ...prev,
        hobbies: null,
      }))
    }
    let inputhobby = null
    let hasErrors = false
    setErrorOrmsg('')
    setInputErrs((prev) => {
      return {
        ...prev,
        hobbies: '',
        location: '',
        full_name: '',
        public_email: '',
      }
    })
    setIsError(false)
    if (hobbyInputValue) {
      const matchedHobby = hobbyDropdownList.find(
        (hobby) =>
          hobby.display.toLowerCase() === hobbyInputValue.toLowerCase(),
      )
      if (!matchedHobby) {
        setShowAddHobbyModal(true)
        return
      } else if (matchedHobby) {
        inputhobby = matchedHobby
      }
    }
    if (selectedHobbies.length === 0 && !hobbyInputValue) {
      hobbysearchref?.current?.focus()
      setInputErrs((prev) => {
        return { ...prev, hobbies: 'This field is required!' }
      })
      setIsError(true)
      hasErrors = true
    }

    if (isEmptyField(data.public_email) || !data.public_email) {
      emailRef.current?.focus()
      setInputErrs((prev) => {
        return { ...prev, public_email: 'This field is required' }
      })
      hasErrors = true
      setIsError(true)
    }

    if (isEmptyField(Addressdata.street) || !Addressdata.street) {
      AddressRef?.current?.focus()
      setInputErrs((prev) => {
        return { ...prev, location: 'This field is required!' }
      })
      hasErrors = true
      setIsError(true)
    }
    if (isEmptyField(data.full_name) || !data.full_name) {
      fullNameRef.current?.focus()
      setInputErrs((prev) => {
        return { ...prev, full_name: 'This field is required!' }
      })
      hasErrors = true
      setIsError(true)
    }

    if (hasErrors === true) {
      if (confirmationModal) setConfirmationModal(false)
      return
    }

    setSubmitBtnLoading(true)
    const { err, res } = await updateMyProfileDetail({
      ...data,
      is_onboarded: true,
    })
    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }
    if (!res?.data.success) {
      setSubmitBtnLoading(false)
    }
    await updateStreet()
    let reqBody: any = { ...Addressdata }
    if (user?._addresses?.length === 0 && reqBody.label === '') {
      reqBody.label = 'Default'
    }
    if (user?.primary_address?._id) {
      updateUserAddress(user.primary_address._id, reqBody, async (err, res) => {
        if (err) {
          return console.log(err)
        }

        if (!res.data.success) {
          return alert('Something went wrong!')
        }
      })
    } else {
      await addUserAddress(reqBody, async (err, res) => {
        console.warn({ res })

        if (err) {
          setSubmitBtnLoading(false)

          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)

          return alert('Something went wrong!')
        }
      })
    }

    const hobbies = selectedHobbies.map((item) => ({
      hobby: item?._id,
      genre: item?.genreId,
      level: 1,
    }))

    await addUserHobbies({ hobbies }, (err, res) => {
      if (err) {
        console.log(err)
      }
    })

    if (inputhobby) {
      console.warn('inputthobby', inputhobby)
      let hobby = {
        hobby: inputhobby?._id,
        genre: inputhobby?.genreId,
        level: 1,
      }

      await addUserHobby(hobby, (err, res) => {
        if (err) {
          console.log(err)
        }
      })
    }

    const { err: error, res: response } = await getMyProfileDetail()
    setSubmitBtnLoading(false)
    if (error) return console.log(error)
    if (response?.data.success) {
      dispatch(updateUser(response?.data.data.user))

      window.location.href = '/community'
      dispatch(closeModal())
    }
  }
  console.warn('selectedhobiessssss', selectedHobbies)
  useEffect(() => {
    if (
      isEmpty(data.full_name) ||
      isEmpty(data.display_name) ||
      isEmpty(data.profile_url)
    ) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

  const checkProfileUrl = () => {
    const token = localStorage.getItem('token')
    if (!user.profile_url) return
    if (!data.profile_url) return
    const headers = { Authorization: `Bearer ${token}` }
    if (user.profile_url !== data.profile_url) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/check-profile-url/${data.profile_url}`,
          { headers },
        )
        .then((res) => {
          console.log('res', res)
          setInputErrs((prev) => {
            return { ...prev, profile_url: null }
          })
        })
        .catch((err) => {
          console.log('err', err)
          setInputErrs((prev) => {
            return { ...prev, profile_url: 'This profile url is already taken' }
          })
        })
    } else {
      setInputErrs((prev) => {
        return { ...prev, profile_url: null }
      })
    }
  }
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (AddressRef.current && !AddressRef.current.contains(event.target)) {
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
  }, [ShowDropdown, ShowAutoAddress])

  useEffect(() => {
    checkProfileUrl()
  }, [data.profile_url, user.profile_url])

  useEffect(() => {
    if (onComplete !== undefined && /^\d+$/.test(user.profile_url)) {
      let profileUrl = data.full_name
      profileUrl = profileUrl
        ?.toLowerCase()
        .replace(/\s+/g, '-') // Replace consecutive spaces with a single hyphen
        .replace(/[^\w\s-]/g, '-') // Replace special characters with a single hyphen
        .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
      setData((prev) => ({ ...prev, profile_url: profileUrl }))
      if (!user.display_name) {
        setData((prev) => ({
          ...prev,
          display_name: profileUrl.split('-')[0], // Use modified profileUrl for display_name
        }))
      }
    }
  }, [data.full_name])

  console.warn('userdataa', user)
  useEffect(() => {
    // Set initial data with user's current profile data
    const initialProfileData = {
      full_name: user.full_name || '',
      public_email: user.public_email || '',
      tagline: user.tagline || '',
      display_name: user.display_name || '',
      profile_url: user.profile_url || '',
      gender: user.gender || null,
      year_of_birth: user.year_of_birth || '',
      onboarding_step: user.onboarding_step || '0',
    }
    const hobbiesData = user._hobbies?.map((hobby: any) => ({
      _id: hobby.hobby._id,
      display: `${hobby.hobby.display}${
        hobby.genre ? ' - ' + hobby?.genre?.display : ''
      }`,
      sub_category: hobby?.sub_category,
      genre: hobby?.genre?.display,
      genreId: hobby.genre?._id,
    }))
    setselectedHobbies(hobbiesData)

    let addressText = ''
    if (user?.primary_address?.street) {
      addressText += `${user?.primary_address?.street}, `
    }
    if (user?.primary_address?.society) {
      addressText += `${user?.primary_address?.society}, `
    }
    if (user?.primary_address?.locality) {
      addressText += `${user?.primary_address?.locality}, `
    }
    if (user?.primary_address?.city) {
      addressText += `${user?.primary_address?.city}, `
    }
    if (user?.primary_address?.state) {
      addressText += `${user?.primary_address?.state}, `
    }
    if (user?.primary_address?.country) {
      addressText += `${user?.primary_address?.country} `
    }
    setSelectedAddress(addressText)
    setAddressData({
      ...Addressdata,
      street: addressText,
      society: user?.primary_address?.society,
      locality: user?.primary_address?.locality,
      city: user?.primary_address?.city,
      state: user?.primary_address?.state,
      country: user?.primary_address?.country,
      pin_code: user?.primary_address?.pin_code,
      post_code: user?.primary_address?.post_code,
    })

    setInitialData(initialProfileData)
    setData(initialProfileData)
  }, [user])
  useEffect(() => {
    if (propData?.showError) handleSubmit()
  }, [initialData])

  useEffect(() => {
    fullNameRef?.current?.focus()
    const length = urlSpanRef.current?.offsetWidth ?? 0
    setUrlSpanLength(length + 12)
  }, [])
  const HandleSaveError = async () => {
    if (
      isEmptyField(data.full_name) ||
      !data.full_name ||
      !data.display_name ||
      data.display_name === '' ||
      isEmptyField(data.profile_url) ||
      !data.profile_url
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
                  addressObj.pin_code = component.long_name
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

  const getLocation = () => {
    //Get latitude and longitude;
    const successFunction = (position: any) => {
      var lat = position.coords.latitude
      var long = position.coords.longitude
      console.log(lat)
      console.log(long)
      handleGeocode(lat, long)
    }
    const errorFunction = (err: any) => {
      console.log('err', err)
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction, {
        maximumAge: 60000,
        timeout: 12000,
        enableHighAccuracy: true,
      })
    }
  }
  // Correct usage of setAddressData
  const handleSelectAddress = (data: DropdownListItem) => {
    console.log({ data })
    setShowDropdown(false)
    const { addressObj } = data
    console.log(data, 'selected')

    if (
      addressObj.street_number &&
      addressObj.neighbour &&
      addressObj.route &&
      addressObj.sublocality_level_3
    ) {
      setAddressData((prev: ProfileAddressPayload) => ({
        ...prev,
        pin_code: addressObj.pin_code ?? '',
        post_code: addressObj.post_code ?? '',
        country: addressObj.country ?? '',
        city: addressObj.locality ?? '',
        state: addressObj.administrative_area_level_1 ?? '',
        society: addressObj.sublocality_level_2 ?? '',
        street: `${addressObj.street_number}, ${addressObj.neighbour}, ${
          addressObj.route
        }, ${[addressObj.premise, addressObj.primise2]
          .filter(Boolean)
          .join(', ')}, ${addressObj.sublocality_level_3}`,
        locality: addressObj.sublocality_level_1 ?? '',
      }))
    } else {
      setAddressData((prev: ProfileAddressPayload) => ({
        ...prev,
        pin_code: addressObj.pin_code ?? '',
        post_code: addressObj.post_code ?? '',
        country: addressObj.country ?? '',
        city: addressObj.locality ?? '',
        state: addressObj.administrative_area_level_1 ?? '',
        society: addressObj.sublocality_level_2 ?? '',
        street: [
          addressObj.street_number,
          addressObj.subpremise,
          addressObj.premise,
          addressObj.primise2,
          addressObj.neighbour,
          addressObj.sublocality_level_3,
          addressObj.route,
        ]
          .filter(Boolean)
          .join(', '),
        locality: addressObj.sublocality_level_1 ?? '',
      }))
    }
    setIsChanged(true)
    dispatch(setHasChanges(true))
  }

  const handleHobbySelection = async (selectedHobby: DropdownListItemHobby) => {
    const isAlreadySelected = selectedHobbies.some(
      (hobby) => hobby?.display === selectedHobby?.display,
    )

    if (isAlreadySelected) {
      setInputErrs((prev) => {
        return { ...prev, hobbies: 'Same hobby detected in the hobbies list' }
      })
      return
    }

    // Proceed with updating state if the hobby is not already selected
    setData((prev) => ({ ...prev, hobby: selectedHobby }))
    setHobbyInputValue(selectedHobby?.display ?? hobbyInputValue)
    setselectedHobbies((prev) => [...prev, selectedHobby])
    setHobbyInputValue('')
    setInputErrs((prev) => ({
      ...prev,
      hobbies: null,
    }))
    setIsChanged(true)
    dispatch(setHasChanges(true))
  }

  const removeSelectedHobby = (hobbyToRemove: any) => {
    setselectedHobbies((prev) =>
      prev.filter((hobby) => hobby.display !== hobbyToRemove.display),
    )
  }

  const handleHobbyInputChange = async (e: any) => {
    if (
      e.target.value.includes(',') ||
      e.target.value.includes('.') ||
      e.target.value.length > 25
    ) {
      setInputErrs((prev) => ({
        ...prev,
        hobbies:
          'Please Type and Select hobbies individually.  Added ones will appear below the Hobbies* label',
      }))
    } else {
      setInputErrs((prev) => ({
        ...prev,
        hobbies: null,
      }))
    }
    setShowHobbyDowpdown(true)
    setHobbyInputValue(e.target.value)
    setHobbyError(false)
    setErrorOrmsg(null)

    setData((prev) => {
      return { ...prev, hobby: null }
    })

    if (isEmptyField(e.target.value)) {
      setHobbyDropdownList([])
      setFocusedHobbyIndex(-1)
      return
    }

    const query = `fields=display,genre&level=3&level=2&level=1&level=0&show=true&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)

    let sortedHobbies = res.data.hobbies
    let exactMatch = sortedHobbies.find(
      (hobby: any) =>
        hobby.display.toLowerCase() === e.target.value.toLowerCase(),
    )

    if (exactMatch) {
      // Run another query if there's an exact match
      const additionalQuery = `fields=display&show=true&genre=${exactMatch.genre[0]}&level=5`
      const { err: additionalErr, res: additionalRes } = await getAllHobbies(
        additionalQuery,
      )
      if (additionalErr) return console.log(additionalErr)

      // Append the new hobbies to the sortedHobbies list
      const additionalHobbies = additionalRes.data.hobbies.map(
        (hobby: any) => ({
          ...hobby,
          display: `${exactMatch.display} - ${hobby.display}`,
          _id: exactMatch._id,
          genreId: hobby._id,
        }),
      )

      sortedHobbies = sortedHobbies.concat(additionalHobbies)
    }

    if (e.target.value.toLowerCase() === 'sing') {
      // Prioritize "vocal music" at the top
      sortedHobbies = sortedHobbies.sort((a: any, b: any) => {
        if (a.display.toLowerCase() === 'vocal music') return -1
        if (b.display.toLowerCase() === 'vocal music') return 1
        return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
      })
    } else {
      // Sort alphabetically
      sortedHobbies = sortedHobbies.sort((a: any, b: any) => {
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
    }

    setHobbyDropdownList(sortedHobbies)
    setFocusedHobbyIndex(-1)
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
        if (hobbyInputValue.length !== 0 && !showHobbyDowpdown) {
          //AddButtonRef.current?.click()
        } else if (focusedHobbyIndex !== -1 && showHobbyDowpdown) {
          handleHobbySelection(hobbyDropdownList[focusedHobbyIndex]).finally(
            () => {
              setShowHobbyDowpdown(false)
            },
          )
        } else if (focusedHobbyIndex === -1 && hobbyInputValue.length !== 0) {
          setShowHobbyDowpdown(false)
          // handleGenreInputFocus();
        }
        break
      default:
        break
    }
  }
  const fetchTrendingHobbies = async () => {
    const { err, res } = await TrendingHobbiesByUser()

    if (err) {
      return console.log('err', err)
    }
    setTrendingHobbies(res?.data?.data)
    console.warn('trending hobbiesssss', res?.data)
  }

  useEffect(() => {
    fullNameRef?.current?.focus()
    fetchTrendingHobbies()
  }, [])

  const isMobile = useMediaQuery('(max-width:1100px)')

  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<
    { description: string; place_id: string }[]
  >([])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    if (e.target.value.length > 2) {
      try {
        const { res, err } = await getAutocompleteAddressFromGoogle(
          e.target.value,
        )
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

  if (showAddHobbyModal) {
    return (
      <>
        <AddHobby
          handleClose={() => {
            setShowAddHobbyModal(false)
          }}
          handleSubmit={() => async () => {
            let jsonData = {
              user_id: user._id,
              user_type: 'user',
              hobby: hobbyInputValue,
              level: 'Hobby',
            }
            const { err, res } = await SendHobbyRequest(jsonData)
            if (res?.data.success) {
              setShowAddHobbyModal(false)
              setErrorOrmsg(
                `${hobbyInputValue} has been requested. You can add it later if approved.`,
              )
              setHobbyInputValue('')
            } else if (err) {
              setShowSnackbar({
                triggerOpen: true,
                type: 'error',
                message: 'Something went wrong',
              })
              console.log(err)
            }
          }}
          propData={{ defaultValue: hobbyInputValue }}
          selectedHobbyText={
            selectedHobbyToAdd &&
            selectedHobbyToAdd?.show === false &&
            selectedHobbyToAdd.display === hobbyInputValue
              ? selectedHobbyToAdd.display
              : undefined
          }
        />

        <CustomSnackbar
          message={showSnackbar.message}
          type={showSnackbar.type}
          triggerOpen={showSnackbar.triggerOpen}
          closeSnackbar={() => {
            setShowSnackbar({
              message: '',
              triggerOpen: false,
              type: 'success',
            })
          }}
        />
      </>
    )
  }

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
      />
    )
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={() => {
            console.warn('Close clickeddddddddddd')
            isChanged ? setConfirmationModal(true) : handleClose()
          }}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Complete your User Profile'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <>
            <section className={styles['two-column-grid']}>
              {/* Full Name */}
              <div
                className={`${styles['input-box']} ${
                  inputErrs.full_name ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>Full Name</label>
                <input
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  required
                  value={data.full_name}
                  name="full_name"
                  onChange={handleInputChange}
                  ref={fullNameRef}
                />
                <p className={styles['helper-text']}>{inputErrs.full_name}</p>
              </div>
              <div
                className={`${styles['input-box']} ${
                  inputErrs.public_email ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>Email ID</label>
                <input
                  type="text"
                  required
                  placeholder=""
                  value={data.public_email}
                  ref={emailRef}
                  name="public_email"
                  autoComplete="email"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>
                  {inputErrs.public_email}
                </p>
              </div>
            </section>

            {/* Address */}
            <div className={styles['input-box']}>
              <label className={styles['label-required']}>Location</label>
              <div
                className={`${styles['street-input-container']} ${
                  inputErrs.location ? styles['input-box-error'] : ''
                }`}
              >
                <input
                  type="text"
                  placeholder={`Enter address or click on GPS icon to the right`}
                  required
                  value={Addressdata.street}
                  name="street"
                  ref={AddressRef}
                  onChange={handleInputChangeAddress}
                  autoComplete="off"
                />
                <Image
                  src={LocationIcon}
                  alt="location"
                  className={styles.locationImg}
                  onClick={() => {
                    getLocation()
                    AddressRef?.current?.focus()
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.stopPropagation()
                      getLocation()
                      setTimeout(() => {
                        AddressRef?.current?.focus()
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
                        onClick={() => {
                          handleSelectAddressTwo(
                            suggestion.description,
                            suggestion.place_id,
                          )
                          setSelectedAddress(suggestion.description)
                        }}
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
              <p className={styles['helper-text']}>{inputErrs.location}</p>
            </div>

            {/* Hobby search */}
            <div
              ref={hobbyDropDownWrapperRef}
              className={styles['dropdown-wrapper']}
            >
              <div
                className={`${styles['input-box']}  ${
                  inputErrs.hobbies ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>Hobbies</label>
                <ul className={`${styles['hobby-list']}`}>
                  {selectedHobbies?.map((item: any) => {
                    if (typeof item === 'string') return
                    return (
                      <div key={item._id}>
                        <li>
                          {item?.display}

                          <Image
                            src={CrossIcon}
                            style={{ cursor: 'pointer' }}
                            width={18}
                            height={18}
                            alt="cancel"
                            onClick={() => removeSelectedHobby(item)}
                          />
                        </li>
                      </div>
                    )
                  })}
                </ul>
                <input
                  type="text"
                  placeholder="Type and select..."
                  autoComplete="name"
                  required
                  value={hobbyInputValue}
                  onFocus={() => setShowHobbyDowpdown(true)}
                  onBlur={() =>
                    setTimeout(() => {
                      if (!isMobile) setShowHobbyDowpdown(false)
                    }, 300)
                  }
                  ref={hobbysearchref}
                  onChange={handleHobbyInputChange}
                  onKeyDown={handleHobbyKeyDown}
                />
                {inputErrs.hobbies || errorOrmsg ? (
                  <p
                    className={
                      inputErrs.hobbies
                        ? styles['helper-text']
                        : styles['helper-text-green']
                    }
                  >
                    {inputErrs.hobbies} {errorOrmsg}{' '}
                  </p>
                ) : (
                  ''
                )}

                {showHobbyDowpdown && hobbyDropdownList.length !== 0 && (
                  <div
                    className={`${styles['dropdown']}`}
                    ref={hobbyDropdownRef}
                  >
                    {hobbyDropdownList.map((hobby, index) => (
                      <p
                        id={`option-h-${index}`}
                        key={hobby._id}
                        onClick={() => {
                          handleHobbySelection(hobby)
                          setShowHobbyDowpdown(false)
                        }}
                        className={
                          index === focusedHobbyIndex
                            ? styles['dropdown-option-focus']
                            : ''
                        }
                      >
                        {hobby.display}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <label className={styles['label']}>Trending - click to add</label>

            <ul
              className={`${styles['hobby-list']} ${styles['trending-hobbies-list']}`}
            >
              {trendingHobbies?.map((item: any) => {
                if (typeof item === 'string') return

                const isAlreadySelected = selectedHobbies?.some(
                  (hobby) => hobby?._id === item?._id,
                )

                const handleClick = () => {
                  if (isAlreadySelected) {
                    setInputErrs((prev) => ({
                      ...prev,
                      hobbies: 'Hobby already exists in your list',
                    }))
                  } else {
                    setselectedHobbies((prev) => [...prev, item])
                    setInputErrs((prev) => ({
                      ...prev,
                      hobbies: null,
                    }))
                    setIsChanged(true)
                    dispatch(setHasChanges(true))
                  }
                }

                return (
                  <div
                    className={styles.trendingHobby}
                    onClick={handleClick}
                    key={item._id}
                  >
                    <li>
                      {item?.display}
                      {item?.genre && ` - ${item?.genre?.display} `}
                    </li>
                  </div>
                )
              })}
            </ul>
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button
              className="modal-footer-btn cancel"
              onClick={onBackBtnClick}
            >
              Back
            </button>
          )}
          <div onClick={onBackBtnClick}>
            <Image src={BackIcon} alt="Back" className={styles['Back-btn']} />
          </div>

          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Finish'
            ) : (
              'Finish'
            )}
          </button>
          {/* SVG Button for Mobile */}
          {onComplete ? (
            <div onClick={handleSubmit}>
              <Image
                src={NextIcon}
                alt="next"
                className={`${styles['next-genral-btn']} modal-mob-btn submit`}
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
                'Finish'
              )}
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default SimpleOnboarding
