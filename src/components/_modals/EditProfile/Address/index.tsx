import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import { checkFullname, isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import LocationIcon from '@/assets/svg/location-2.svg'
import Image from 'next/image'
import axios from 'axios'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  addLocation?: boolean
  title?: String
  editLocation?: boolean
}

const ProfileAddressEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  addLocation,
  title: modalTitle,
  editLocation,
}) => {
  const dispatch = useDispatch()
  const { user, addressToEdit } = useSelector((state: RootState) => state.user)
  const [tempAddressId, setTempAddressId] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleInputChange = (event: any) => {
    setData((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
    setInputErrs((prev) => {
      return { ...prev, [event.target.name]: null }
    })
  }

  const Backsave = async () => {
    setBackBtnLoading(true)
    if (
      !addressLabel ||
      addressLabel === '' ||
      !data.city ||
      data.city === '' ||
      !data.state ||
      data.state === '' ||
      !data.country ||
      data.country === '' ||
      !data.society ||
      data.society === '' ||
      !data.locality ||
      data.locality === '' ||
      !data.pin_code ||
      data.pin_code === ''
    ) {
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
          setBackBtnLoading(true)
          if (err) {
            return console.log(err)
          }
          if (!res.data.success) {
            return alert('Something went wrong!')
          }
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
            console.log(res)
            if (err) {
              return console.log(err)
            }
            if (!res.data.success) {
              return alert('Something went wrong!')
            }

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

  const handleSubmit = () => {
    if (addLocation) {
      if (!addressLabel || addressLabel === '') {
        addressLabelRef.current?.focus()
        return setInputErrs((prev) => {
          return { ...prev, addressLabel: 'This field is required!' }
        })
      }
    }
    if (
      !data.city ||
      data.city === '' ||
      !data.state ||
      data.state === '' ||
      !data.country ||
      data.country === ''
    ) {
      let errors: typeof inputErrs = {}

      if (!data.city || data.city === '') {
        cityRef.current?.focus()
        errors.city = 'This field is required!'
      }

      if (!data.state || data.state === '') {
        stateRef.current?.focus()
        errors.state = 'This field is required!'
      }

      if (!data.country || data.country === '') {
        countryRef.current?.focus()
        errors.country = 'This field is required!'
      }

      return setInputErrs((prev) => {
        return { ...prev, ...errors }
      })
    }

    if (!data.city || data.city === '') {
      cityRef.current?.focus()
      return setInputErrs((prev) => {
        return { ...prev, city: 'This field is required!' }
      })
    }
    if (!data.state || data.state === '') {
      stateRef.current?.focus()
      return setInputErrs((prev) => {
        return { ...prev, state: 'This field is required!' }
      })
    }
    if (!data.country || data.country === '') {
      countryRef.current?.focus()
      return setInputErrs((prev) => {
        return { ...prev, country: 'This field is required!' }
      })
    }
    if (checkFullname(data.city)) {
      cityRef.current?.focus()
      return setInputErrs((prev) => {
        return {
          ...prev,
          city: 'City should not contain any numbers!',
        }
      })
    }
    if (checkFullname(data.state)) {
      stateRef.current?.focus()
      return setInputErrs((prev) => {
        return {
          ...prev,
          state: 'State should not contain any numbers!',
        }
      })
    }

    if (checkFullname(data.country)) {
      countryRef.current?.focus()
      return setInputErrs((prev) => {
        return {
          ...prev,
          country: 'Country should not contain any numbers!',
        }
      })
    }
    setSubmitBtnLoading(true)
    if (editLocation) {
      let reqBody: any = { ...data }
      reqBody.label = addressLabel
      updateUserAddress(addressToEdit, reqBody, async (err, res) => {
        if (err) {
          setSubmitBtnLoading(false)
          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)
          return alert('Something went wrong!')
        }
        const { err: error, res: response } = await getMyProfileDetail()

        setSubmitBtnLoading(false)
        if (error) return console.log(error)
        if (response?.data.success) {
          dispatch(updateUser(response.data.data.user))
          if (onComplete) onComplete()
          else {
            window.location.reload()
            dispatch(closeModal())
          }
        }
      })
      return
    }
    if (addLocation) {
      let reqBody: any = { ...data }
      reqBody.label = addressLabel
      addUserAddress(reqBody, async (err, res) => {
        if (err) {
          setSubmitBtnLoading(false)
          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)
          return alert('Something went wrong!')
        }
        const { err: error, res: response } = await getMyProfileDetail()

        setSubmitBtnLoading(false)
        if (error) return console.log(error)
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

          const { err: error, res: response } = await getMyProfileDetail()

          setSubmitBtnLoading(false)
          if (error) return console.log(error)
          if (response?.data.success) {
            dispatch(updateUser(response.data.data.user))

            if (onComplete) onComplete()
            else {
              window.location.reload()
              dispatch(closeModal())
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

            const { err: error, res: response } = await getMyProfileDetail()

            setSubmitBtnLoading(false)
            if (error) return console.log(error)
            if (response?.data.success) {
              dispatch(updateUser(response.data.data.user))
              if (onComplete) onComplete()
              else {
                window.location.reload()
                dispatch(closeModal())
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
        const { err: error, res: response } = await getMyProfileDetail()

        setSubmitBtnLoading(false)
        if (error) return console.log(error)
        if (response?.data.success) {
          dispatch(updateUser(response?.data.data.user))
          if (onComplete) onComplete()
          else {
            window.location.reload()
            dispatch(closeModal())
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
      }
    } else if (addLocation) {
    } else {
      setData({
        street: user.primary_address?.street,
        society: user.primary_address?.society,
        locality: user.primary_address?.locality,
        city: user.primary_address?.city,
        pin_code: user.primary_address?.pin_code,
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
      alert('Location permission denied!')
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
    getLocation()
  }, [])

  const handleGeocode = (lat: any, long: any) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCSFbd4Cf-Ui3JvMvEiXXs9xfGJaveKO_Y`,
      )
      .then((response) => {
        const { results } = response.data
        console.log('response', response)
        if (results && results.length > 0) {
          const { formatted_address, address_components } = results[0]
          let society = data.society
          let locality = data.locality
          let city = data.city
          let state = data.state
          let country = data.country
          let pin_code = data.pin_code

          address_components.forEach((component: any) => {
            if (component.types.includes('locality')) {
              city = component.long_name
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name
            }
            if (component.types.includes('country')) {
              country = component.long_name
            }
            if (component.types.includes('postal_code')) {
              pin_code = component.long_name
            }
            if (component.types.includes('sublocality_level_3')) {
              locality = component.long_name
            }
            if (component.types.includes('neighborhood')) {
              society = component.long_name
            }
          })
          setData((prev) => {
            return {
              ...prev,
              state: data.state ? data.state : state,
              city: data.city ? data.city : city,
              street: data.street ? data.street : formatted_address,
              country: data.country ? data.country : country,
              pin_code: data.pin_code ? data.pin_code : pin_code,
              locality: data.locality ? data.locality : locality,
              society: data.society ? data.society : society,
            }
          })
        }
      })
      .catch((error) => {
        console.error('Error geocoding:', error)
      })
  }
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>
            {modalTitle ? modalTitle : 'Location'}
          </h4>
        </header>

        <hr />

        <section className={styles['body']}>
          {addLocation || editLocation ? (
            <div
              className={`${styles['input-box']} ${
                inputErrs.addressLabel ? styles['input-box-error'] : ''
              }`}
            >
              <label>Address Label</label>
              <div className={styles['street-input-container']}>
                <input
                  type="text"
                  placeholder={`Eg: Home, Office`}
                  required
                  value={addressLabel}
                  name="label"
                  ref={inputRef}
                  onChange={(e: any) => setAddressLabel(e.target.value)}
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
                  placeholder={`Enter address or click the 'GPS icon' to auto-detect`}
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
                  onClick={getLocation}
                />
              </div>
              <p className={styles['helper-text']}>{inputErrs.street}</p>
            </div>
            <section className={styles['two-column-grid']}>
              <div className={styles['input-box']}>
                <label>Society</label>
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
                  placeholder={`Enter Locality`}
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
                  placeholder={`Enter City Name`}
                  required
                  value={data.city}
                  ref={cityRef}
                  name="city"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.city}</p>
              </div>
              <div className={styles['input-box']}>
                <label>PIN Code</label>
                <input
                  type="text"
                  placeholder={`Enter PIN Code`}
                  required
                  value={data.pin_code}
                  name="pin_code"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.pin_code}</p>
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
                  placeholder={`Enter State Name`}
                  required
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
                  placeholder={`Enter Country Name`}
                  required
                  value={data.country}
                  name="country"
                  ref={countryRef}
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.country}</p>
              </div>
            </section>
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button
              className="modal-footer-btn cancel"
              onClick={Backsave}
              disabled={backBtnLoading ? backBtnLoading : backDisabled}
            >
              {backBtnLoading ? (
                <CircularProgress color="inherit" size={'24px'} />
              ) : onBackBtnClick ? (
                'Back'
              ) : (
                'Back'
              )}
            </button>
          )}

          <button
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
        </footer>
      </div>
    </>
  )
}

export default ProfileAddressEditModal
