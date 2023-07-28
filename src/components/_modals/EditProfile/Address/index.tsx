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
}

const ProfileAddressEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

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
  })

  
  const cityRef = useRef<HTMLInputElement>(null)
  const stateRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)


  const handleInputChange = (event: any) => {
    setData((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
    setInputErrs((prev) => {
      return { ...prev, [event.target.name]: null }
    })
  }

  const handleSubmit = () => {
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
    if (!user.is_onboarded) {
      data.set_as_primary = true
      addUserAddress(data, async (err, res) => {
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
  }, [user])

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
    const errorFunction = () => {
      alert('Location permission denied!')
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction)
    }
  }

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
          let city = ''
          let state = ''
          let country = ''
          let pin_code = ''

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
          })
          setData((prev) => {
            return {
              ...prev,
              state,
              city,
              street: formatted_address,
              country,
              pin_code,
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
          <h4 className={styles['heading']}>{'Location'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <>
            {/* Street Address */}
            <div className={styles['input-box']}>
              <label>Street Address</label>
              <div className={styles['street-input-container']}>
                <input
                  type="text"
                  placeholder={`Enter address or click the "locate me" icon to auto-detect`}
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
              onClick={onBackBtnClick}
            >
              Back
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
