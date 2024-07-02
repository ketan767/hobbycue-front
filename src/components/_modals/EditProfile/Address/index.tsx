import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import { checkFullname, isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, setHasChanges } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import LocationIcon from '@/assets/svg/location-2.svg'

import axios from 'axios'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import InfoIcon from '@/assets/svg/infoIcon.svg'
import Image from 'next/image'
import CustomizedTooltips2 from '@/components/Tooltip/Tooltip2'
import { gmapAutoComplete } from '@/services/auth.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  addLocation?: boolean
  title?: String
  editLocation?: boolean
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  [key: string]: any
  CheckIsOnboarded?: any
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

const ProfileAddressEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  addLocation,
  title: modalTitle,
  editLocation,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  CheckIsOnboarded,
}) => {
  const dispatch = useDispatch()
  const { user, addressToEdit } = useSelector((state: RootState) => state.user)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [ShowDropdown, setShowDropdown] = useState<boolean>(false)
  const [ShowAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [dropdownList, setShowDropdownList] = useState<DropdownListItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [initialData, setInitialData] = useState({})
  const [initialLabel, setInitialLabel] = useState('')
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    dispatch(setHasChanges(false))
  }, [])

  useEffect(() => {
    if (addLocation !== true) {
      const adressToEditObj = user?._addresses?.find(
        (obj: any) => obj?._id === addressToEdit,
      )
      if (adressToEditObj) {
        setInitialData(adressToEditObj)
        setInitialLabel(adressToEditObj?.label)
      } else {
        setInitialData({
          street: user.primary_address?.street,
          society: user.primary_address?.society,
          locality: user.primary_address?.locality,
          city: user.primary_address?.city,
          pin_code: user.primary_address?.pin_code,
          post_code: user.primary_address?.post_code,
          state: user.primary_address?.state,
          country: user.primary_address?.country,
          latitude: user.primary_address?.latitude,
          longitude: user.primary_address?.longitude,
        })
      }
    } else {
      setInitialData({
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
      })
    }
  }, [user, editLocation, addLocation, addressToEdit])

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  const [addressLabel, setAddressLabel] = useState('')
  const [data, setData] = useState<ProfileAddressPayload>({
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
    set_as_primary: false,
  })

  const [inputErrs, setInputErrs] = useState<{ [key: string]: string | null }>({
    street: null,
    society: null,
    locality: null,
    city: null,
    pin_code: null,
    post_code: null,
    state: null,
    country: null,
    latitude: null,
    longitude: null,
    addressLabel: null,
  })

  const cityRef = useRef<HTMLInputElement>(null)
  const stateRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)
  const addressLabelRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleInputChange = async (event: any) => {
    setShowDropdown(false)
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
    setInputErrs((prev) => ({ ...prev, [name]: null }))
    if (data.street?.length > 1) {
      setShowAutoAddress(true)
      try {
        const { err, res } = await gmapAutoComplete(data?.street)
        if (err) {
          console.error(err)
          return
        }
        const addressRes = res?.data.data
        if (addressRes.predictions) {
          console.warn('suggestionsssss', addressRes)
          setSuggestions(
            addressRes.predictions.map(
              (prediction: any) => prediction.description,
            ),
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
    const { set_as_primary: set_as_primary, ...currentData } = {
      ...data,
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

  const Backsave = async () => {
    console.warn('running back')
    setBackBtnLoading(true)
    if (!data.city || data.city === '') {
      if (onBackBtnClick) onBackBtnClick()
      setBackBtnLoading(false)
    } else {
      if (editLocation) {
        let reqBody: any = { ...data }
        reqBody.label = addressLabel
        updateUserAddress(addressToEdit, reqBody, async (err, res) => {
          if (err) {
            return console.log(err)
          }
          setBackBtnLoading(true)
          if (!res.data.success) {
            return alert('Something went wrong!')
          }

          const newOnboardingStep =
            Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'

          let updatedCompletedSteps = [...user.completed_onboarding_steps]

          if (!updatedCompletedSteps.includes('Address')) {
            updatedCompletedSteps.push('Address')
          }

          const { err: updtProfileErr, res: updtProfileRes } =
            await updateMyProfileDetail({
              onboarding_step: newOnboardingStep,
              completed_onboarding_steps: updatedCompletedSteps,
            })
          const { err: error, res: response } = await getMyProfileDetail()

          if (error) return console.log(error)
          if (response?.data.success) {
            dispatch(updateUser(response.data.data.user))
            if (onBackBtnClick) onBackBtnClick()
            setBackBtnLoading(false)
          }
        })
        return
      }
      if (addLocation) {
        let reqBody: any = { ...data }
        reqBody.label = addressLabel
        addUserAddress(reqBody, async (err, res) => {
          console.warn({ res })
          setBackBtnLoading(true)
          if (err) {
            return console.log(err)
          }
          if (!res.data.success) {
            return alert('Something went wrong!')
          }
          const newOnboardingStep =
            Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
          let updatedCompletedSteps = [...user.completed_onboarding_steps]

          if (!updatedCompletedSteps.includes('Address')) {
            updatedCompletedSteps.push('Address')
          }

          const { err: updtProfileErr, res: updtProfileRes } =
            await updateMyProfileDetail({
              onboarding_step: newOnboardingStep,
              completed_onboarding_steps: updatedCompletedSteps,
            })
          const { err: error, res: response } = await getMyProfileDetail()

          if (error) return console.log(error)
          if (response?.data.success) {
            dispatch(updateUser(response.data.data.user))
            if (onBackBtnClick) onBackBtnClick()
            setBackBtnLoading(false)
          }
        })
      } else if (!user.is_onboarded) {
        data.set_as_primary = true
        let reqBody: any = { ...data }
        reqBody.label = 'Default'

        if (!user.primary_address?._id) {
          setBackBtnLoading(true)
          addUserAddress(reqBody, async (err, res) => {
            console.warn({ res })
            if (err) {
              return console.log(err)
            }
            if (!res.data.success) {
              return alert('Something went wrong!')
            }
            const newOnboardingStep =
              Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
            let updatedCompletedSteps = [...user.completed_onboarding_steps]

            if (!updatedCompletedSteps.includes('Address')) {
              updatedCompletedSteps.push('Address')
            }

            const { err: updtProfileErr, res: updtProfileRes } =
              await updateMyProfileDetail({
                onboarding_step: newOnboardingStep,
                completed_onboarding_steps: updatedCompletedSteps,
                primary_address: res?.data?._id,
              })
            const { err: error, res: response } = await getMyProfileDetail()

            if (error) return console.log(error)
            if (response?.data.success) {
              dispatch(updateUser(response.data.data.user))

              if (onBackBtnClick) onBackBtnClick()
              setBackBtnLoading(false)
            }
          })
        } else if (user.primary_address._id) {
          setBackBtnLoading(true)
          updateUserAddress(
            user.primary_address._id,
            reqBody,
            async (err, res) => {
              if (err) {
                return console.log(err)
              }
              if (!res.data.success) {
                return alert('Something went wrong!')
              }
              const newOnboardingStep =
                Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
              let updatedCompletedSteps = [...user.completed_onboarding_steps]

              if (!updatedCompletedSteps.includes('Address')) {
                updatedCompletedSteps.push('Address')
              }

              const { err: updtProfileErr, res: updtProfileRes } =
                await updateMyProfileDetail({
                  onboarding_step: newOnboardingStep,
                  completed_onboarding_steps: updatedCompletedSteps,
                })
              const { err: error, res: response } = await getMyProfileDetail()

              if (error) return console.log(error)
              if (response?.data.success) {
                dispatch(updateUser(response.data.data.user))
                if (onBackBtnClick) onBackBtnClick()
                setBackBtnLoading(false)
              }
            },
          )
        }
      } else {
        updateUserAddress(user.primary_address._id, data, async (err, res) => {
          setBackBtnLoading(true)
          if (err) {
            return console.log(err)
          }
          if (!res.data.success) {
            return alert('Something went wrong!')
          }
          const newOnboardingStep =
            Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
          let updatedCompletedSteps = [...user.completed_onboarding_steps]

          if (!updatedCompletedSteps.includes('Address')) {
            updatedCompletedSteps.push('Address')
          }

          const { err: updtProfileErr, res: updtProfileRes } =
            await updateMyProfileDetail({
              onboarding_step: newOnboardingStep,
              completed_onboarding_steps: updatedCompletedSteps,
            })
          const { err: error, res: response } = await getMyProfileDetail()

          if (error) return console.log(error)
          if (response?.data.success) {
            dispatch(updateUser(response?.data.data.user))
            if (onBackBtnClick) onBackBtnClick()
            setBackBtnLoading(false)
          }
        })
      }
    }
  }

  const handleSubmit = async () => {
    if (
      !data.city ||
      data.city === '' ||
      (addLocation && addressLabel === '')
    ) {
      if (!data.city || data.city === '') {
        cityRef.current?.focus()
        setInputErrs((prev) => {
          return { ...prev, city: 'This field is required!' }
        })
        setConfirmationModal(false)
        return
      }

      if (
        addLocation &&
        addressLabel === '' &&
        user?._addresses?.length !== 0
      ) {
        addressLabelRef.current?.focus()
        setInputErrs((prev) => {
          return { ...prev, addressLabel: 'This field is required!' }
        })
        setConfirmationModal(false)
      }

      if (checkFullname(data.city)) {
        cityRef.current?.focus()
        setConfirmationModal(false)
        return setInputErrs((prev) => {
          return {
            ...prev,
            city: 'City should not contain any numbers!',
          }
        })
      }
    }
    setSubmitBtnLoading(true)
    if (editLocation) {
      let reqBody: any = { ...data }
      reqBody.label = addressLabel
      await updateUserAddress(addressToEdit, reqBody, async (err, res) => {
        if (err) {
          setSubmitBtnLoading(false)
          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)
          return alert('Something went wrong!')
        }

        let updatedCompletedSteps = [...user.completed_onboarding_steps]

        if (!updatedCompletedSteps.includes('Address')) {
          updatedCompletedSteps.push('Address')
        }
        const newOnboardingStep =
          Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
        const { err: updtProfileErr, res: updtProfileRes } =
          await updateMyProfileDetail({
            onboarding_step: newOnboardingStep,
            completed_onboarding_steps: updatedCompletedSteps,
          })
        const { err: error, res: response } = await getMyProfileDetail()

        setSubmitBtnLoading(false)
        if (error) return console.log(error)
        if (response?.data.success) {
          dispatch(updateUser(response.data.data.user))
          if (onComplete) onComplete()
          else {
            if (!user.is_onboarded) {
              await CheckIsOnboarded()
            } else {
              window.location.reload()
              dispatch(closeModal())
            }
          }
        }
      })
      return
    }
    if (addLocation) {
      let reqBody: any = { ...data }
      reqBody.label = addressLabel
      if (user?._addresses?.length === 0 && reqBody.label === '') {
        reqBody.label = 'Default'
      }
      await addUserAddress(reqBody, async (err, res) => {
        console.warn({ res })
        // res.data.data.newAddress._id
        if (err) {
          setSubmitBtnLoading(false)
          setConfirmationModal(false)
          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)
          setConfirmationModal(false)
          return alert('Something went wrong!')
        }
        const newOnboardingStep =
          Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
        let updatedCompletedSteps = [...user.completed_onboarding_steps]

        if (!updatedCompletedSteps.includes('Address')) {
          updatedCompletedSteps.push('Address')
        }

        if (user?.primary_address?._id) {
          const { err: updtProfileErr, res: updtProfileRes } =
            await updateMyProfileDetail({
              onboarding_step: newOnboardingStep,
              completed_onboarding_steps: updatedCompletedSteps,
            })
        } else {
          const { err: updtProfileErr, res: updtProfileRes } =
            await updateMyProfileDetail({
              onboarding_step: newOnboardingStep,
              completed_onboarding_steps: updatedCompletedSteps,
              primary_address: res?.data?.data?.newAddress?._id,
            })
        }

        const { err: error, res: response } = await getMyProfileDetail()

        setSubmitBtnLoading(false)
        if (error) {
          setConfirmationModal(false)
          return console.log(error)
        }
        if (response?.data.success) {
          dispatch(updateUser(response.data.data.user))
          if (onComplete) onComplete()
          else {
            window.location.reload()
            dispatch(closeModal())
          }
        }
      })
    } else if (!user.is_onboarded) {
      data.set_as_primary = true
      let reqBody: any = { ...data }
      reqBody.label = 'Default'

      if (!user.primary_address?._id) {
        addUserAddress(reqBody, async (err, res) => {
          console.log(res)
          if (err) {
            setSubmitBtnLoading(true)
            return console.log(err)
          }
          if (!res.data.success) {
            setSubmitBtnLoading(false)
            return alert('Something went wrong!')
          }
          const newOnboardingStep =
            Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
          let updatedCompletedSteps = [...user.completed_onboarding_steps]

          if (!updatedCompletedSteps.includes('Address')) {
            updatedCompletedSteps.push('Address')
          }

          const { err: updtProfileErr, res: updtProfileRes } =
            await updateMyProfileDetail({
              onboarding_step: newOnboardingStep,
              completed_onboarding_steps: updatedCompletedSteps,
            })
          const { err: error, res: response } = await getMyProfileDetail()

          setSubmitBtnLoading(false)
          if (error) return console.log(error)
          if (response?.data.success) {
            dispatch(updateUser(response.data.data.user))

            if (onComplete) onComplete()
            else {
              if (!user.is_onboarded) {
                await CheckIsOnboarded()
              } else {
                window.location.reload()
                dispatch(closeModal())
              }
            }
          }
        })
      } else if (user.primary_address._id) {
        updateUserAddress(
          user.primary_address._id,
          reqBody,
          async (err, res) => {
            if (err) {
              setSubmitBtnLoading(false)
              return console.log(err)
            }
            if (!res.data.success) {
              setSubmitBtnLoading(false)
              return alert('Something went wrong!')
            }
            const newOnboardingStep =
              Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
            let updatedCompletedSteps = [...user.completed_onboarding_steps]

            if (!updatedCompletedSteps.includes('Address')) {
              updatedCompletedSteps.push('Address')
            }

            const { err: updtProfileErr, res: updtProfileRes } =
              await updateMyProfileDetail({
                onboarding_step: newOnboardingStep,
                completed_onboarding_steps: updatedCompletedSteps,
              })
            const { err: error, res: response } = await getMyProfileDetail()

            setSubmitBtnLoading(false)
            if (error) return console.log(error)
            if (response?.data.success) {
              dispatch(updateUser(response.data.data.user))
              if (onComplete) onComplete()
              else {
                if (!user.is_onboarded) {
                  await CheckIsOnboarded()
                } else {
                  window.location.reload()
                  dispatch(closeModal())
                }
              }
            }
          },
        )
      }
    } else {
      updateUserAddress(user.primary_address._id, data, async (err, res) => {
        if (err) {
          setSubmitBtnLoading(false)
          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)
          return alert('Something went wrong!')
        }
        const newOnboardingStep =
          Number(user?.onboarding_step) > 3 ? user?.onboarding_step : '4'
        let updatedCompletedSteps = [...user.completed_onboarding_steps]

        if (!updatedCompletedSteps.includes('Address')) {
          updatedCompletedSteps.push('Address')
        }

        const { err: updtProfileErr, res: updtProfileRes } =
          await updateMyProfileDetail({
            onboarding_step: newOnboardingStep,
            completed_onboarding_steps: updatedCompletedSteps,
          })
        const { err: error, res: response } = await getMyProfileDetail()

        setSubmitBtnLoading(false)
        if (error) return console.log(error)
        if (response?.data.success) {
          dispatch(updateUser(response?.data.data.user))
          if (onComplete) onComplete()
          else {
            if (!user.is_onboarded) {
              await CheckIsOnboarded()
            } else {
              window.location.reload()
              dispatch(closeModal())
            }
          }
        }
      })
    }
  }

  useEffect(() => {
    if (editLocation) {
      const address = user._addresses.find(
        (address: any) => address._id === addressToEdit,
      )
      console.log('address', address)
      if (address) {
        setData(address)
        setAddressLabel(address.label)
        setDataLoaded(true)
      }
    } else if (addLocation) {
      setDataLoaded(true) // just to fetch geolocation
    } else {
      setDataLoaded(true)
      setData({
        street: user.primary_address?.street,
        society: user.primary_address?.society,
        locality: user.primary_address?.locality,
        city: user.primary_address?.city,
        pin_code: user.primary_address?.pin_code,
        post_code: user.primary_address?.post_code,
        state: user.primary_address?.state,
        country: user.primary_address?.country,
        latitude: user.primary_address?.latitude,
        longitude: user.primary_address?.longitude,
      })
    }
  }, [user, editLocation])

  useEffect(() => {
    if (isEmpty(data.state) || isEmpty(data.city) || isEmpty(data.country)) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

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

  useEffect(() => {
    if (dataLoaded) {
      if (
        (!data.city || data.city === '') &&
        (!data.state || data.state === '') &&
        (!data.country || data.country === '')
      ) {
        getLocation()
      }
    }
  }, [dataLoaded])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // Check if the click target is outside of the dropdown container
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    // Add event listener when the dropdown is shown
    if (ShowDropdown) {
      window.addEventListener('click', handleClickOutside)
    }

    // Remove event listener when the component unmounts or when the dropdown is hidden
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [ShowDropdown])

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
  console.log('dropdownlist', dropdownList)
  const HandleSaveError = async () => {
    if (
      !data.city ||
      data.city === '' ||
      !data.state ||
      data.state === '' ||
      !data.country ||
      data.country === ''
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
      setData((prev: ProfileAddressPayload) => ({
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
      setData((prev: ProfileAddressPayload) => ({
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

  const handleSelectAddressTwo = (suggestion: string) => {
    const details: any = {}
    console.warn('suggestionssssss', suggestion)

    const terms = suggestion.split(',').map((term) => term.trim())

    if (terms.length >= 1) details.country = terms[terms.length - 1]
    if (terms.length >= 2) details.state = terms[terms.length - 2]
    if (terms.length >= 3) details.city = terms[terms.length - 3]
    if (terms.length >= 4) details.locality = terms[terms.length - 4]
    if (terms.length >= 5) details.society = terms[terms.length - 5]
    if (terms.length >= 6)
      details.street = terms.slice(0, terms.length - 5).join(', ')

    setData((prev: ProfileAddressPayload) => ({
      ...prev,
      street: details?.street || '',
      locality: details.locality || '',
      city: details.city || '',
      state: details.state || '',
      country: details.country || '',
      society: details.society || '',
    }))
    setShowAutoAddress(false)
  }

  useEffect(() => {
    const { set_as_primary, ...currentData } = data
    if (initialLabel !== addressLabel) {
      setIsChanged(true)
      dispatch(setHasChanges(true))
    }
    if (JSON.stringify(initialData) !== JSON.stringify(currentData)) {
      setIsChanged(true)
      dispatch(setHasChanges(true))
    } else {
      setIsChanged(false)
      dispatch(setHasChanges(false))
    }
    console.warn({ currentData, initialData })
  }, [data, initialData, addressLabel, initialLabel])

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
            if (isChanged) {
              setConfirmationModal(true)
            } else {
              handleClose()
            }
          }}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>
            {modalTitle ? modalTitle : 'Location'}
          </h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          {addLocation || editLocation ? (
            <div
              className={`${styles['input-box']} ${
                inputErrs.addressLabel ? styles['input-box-error'] : ''
              }`}
            >
              <label className={styles['label-required']}>Address Label</label>
              <div className={styles['street-input-container']}>
                <input
                  type="text"
                  placeholder={`Eg: Home, Office`}
                  required
                  value={addressLabel}
                  name="label"
                  ref={addressLabelRef}
                  onChange={(e: any) => {
                    setAddressLabel(e.target.value)
                    setInputErrs((prev) => ({ ...prev, addressLabel: null }))
                  }}
                />
              </div>
              <p className={styles['helper-text']}>{inputErrs.addressLabel}</p>
            </div>
          ) : (
            <></>
          )}
          <>
            {/* Street Address */}
            <div className={styles['input-box']}>
              <label>Street Address</label>
              <div className={styles['street-input-container']}>
                <input
                  type="text"
                  placeholder={`Enter address or click on GPS icon to the right`}
                  required
                  value={data.street}
                  name="street"
                  ref={inputRef}
                  onChange={handleInputChange}
                />
                <Image
                  src={LocationIcon}
                  alt="location"
                  className={styles.locationImg}
                  onClick={() => {
                    getLocation()
                    inputRef?.current?.focus()
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.stopPropagation()
                      getLocation()
                      setTimeout(() => {
                        inputRef?.current?.focus()
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
                        onClick={() => handleSelectAddressTwo(suggestion)}
                        key={index}
                      >
                        {suggestion}
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
              <p className={styles['helper-text']}>{inputErrs.street}</p>
            </div>
            <section className={styles['two-column-grid']}>
              <div className={styles['input-box']}>
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
                  value={data.society}
                  name="society"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.society}</p>
              </div>
              <div className={styles['input-box']}>
                <label>Locality</label>
                <input
                  type="text"
                  placeholder={`Locality`}
                  value={data.locality}
                  name="locality"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.locality}</p>
              </div>
            </section>
            <section className={styles['two-column-grid']}>
              <div
                className={`${styles['input-box']} ${
                  inputErrs.city ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>City</label>
                <input
                  type="text"
                  placeholder={`City Name`}
                  required
                  value={data.city}
                  ref={cityRef}
                  name="city"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.city}</p>
              </div>

              <div className={styles['pincode-input-box']}>
                <div className={styles['input-box']}>
                  <label> Postal code</label>
                  <input
                    type="text"
                    placeholder={`Postal Code`}
                    required
                    value={data.post_code}
                    name="post_code"
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>{inputErrs.post_code}</p>
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
                    placeholder={`PIN Code`}
                    required
                    value={data.pin_code}
                    name="pin_code"
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>{inputErrs.pin_code}</p>
                </div>
              </div>
            </section>
            <section className={styles['two-column-grid']}>
              <div
                className={`${styles['input-box']} ${
                  inputErrs.state ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>State</label>
                <input
                  type="text"
                  placeholder={`State Name`}
                  // required
                  value={data.state}
                  ref={stateRef}
                  name="state"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.state}</p>
              </div>
              <div
                className={`${styles['input-box']} ${
                  inputErrs.country ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>Country</label>
                <input
                  type="text"
                  placeholder={`Country Name`}
                  // required
                  value={data.country}
                  name="country"
                  ref={countryRef}
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.country}</p>
              </div>
            </section>
            <div className={styles['input-box']}>
              <label>Location ID</label>

              <input
                className={styles['temp-input-box']}
                disabled
                type="text"
                placeholder={`This feature is under development. Come back soon to view this`}
              />
            </div>
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel" onClick={Backsave}>
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={Backsave}>
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

export default ProfileAddressEditModal
