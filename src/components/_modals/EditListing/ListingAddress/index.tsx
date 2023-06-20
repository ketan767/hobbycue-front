import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import { addUserAddress, getMyProfileDetail, updateUserAddress } from '@/services/user.service'
import { isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { getListingAddress, updateListingAddress } from '@/services/listing.service'
import LocationIcon from '@/assets/svg/location-2.svg'
import Image from 'next/image'
import axios from 'axios'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ListingAddressData = {
  street: InputData<string>
  society: InputData<string>
  locality: InputData<string>
  city: InputData<string>
  pin_code: InputData<string>
  state: InputData<string>
  country: InputData<string>
  latitude: InputData<string>
  longitude: InputData<string>
}

const ListingAddressEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [nextDisabled, setNextDisabled] = useState(false)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [data, setData] = useState<ListingAddressData>({
    street: { value: '', error: null },
    society: { value: '', error: null },
    locality: { value: '', error: null },
    city: { value: '', error: null },
    pin_code: { value: '', error: null },
    state: { value: '', error: null },
    country: { value: '', error: null },
    latitude: { value: '', error: null },
    longitude: { value: '', error: null },
  })

  const handleInputChange = (event: any) => {
    setData((prev) => {
      return { ...prev, [event.target.name]: { value: event.target.value, error: null } }
    })
  }

  const handleSubmit = async () => {
    if (isEmptyField(data.street.value)) {
      return setData((prev) => {
        return { ...prev, street: { ...prev.street, error: 'This field is required!' } }
      })
    }
    if (isEmptyField(data.city.value)) {
      return setData((prev) => {
        return { ...prev, city: { ...prev.city, error: 'This field is required!' } }
      })
    }
    if (isEmptyField(data.pin_code.value)) {
      return setData((prev) => {
        return { ...prev, pin_code: { ...prev.pin_code, error: 'This field is required!' } }
      })
    }
    if (isEmptyField(data.state.value)) {
      return setData((prev) => {
        return { ...prev, state: { ...prev.state, error: 'This field is required!' } }
      })
    }
    if (isEmptyField(data.country.value)) {
      return setData((prev) => {
        return { ...prev, country: { ...prev.country, error: 'This field is required!' } }
      })
    }

    const jsonData = {
      street: data.street.value,
      society: data.society.value,
      locality: data.locality.value,
      city: data.city.value,
      pin_code: data.pin_code.value,
      state: data.state.value,
      country: data.country.value,
      latitude: data.latitude.value,
      longitude: data.longitude.value,
    }
    setSubmitBtnLoading(true)
    const { err, res } = await updateListingAddress(listingModalData._address, jsonData)
    if (err) return console.log(err)
    if (onComplete) onComplete()
    else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

  const updateAddress = async () => {
    const { err, res } = await getListingAddress(listingModalData._address)
    if (err) return console.log(err)

    setData({
      street: { value: res?.data.data.address.street, error: null },
      society: { value: res?.data.data.address.society, error: null },
      locality: { value: res?.data.data.address.locality, error: null },
      city: { value: res?.data.data.address.city, error: null },
      pin_code: { value: res?.data.data.address.pin_code, error: null },
      state: { value: res?.data.data.address.state, error: null },
      country: { value: res?.data.data.address.country, error: null },
      latitude: { value: res?.data.data.address.latitude, error: null },
      longitude: { value: res?.data.data.address.longitude, error: null },
    })
  }

  useEffect(() => {
    setData({
      street: { value: '', error: null },
      society: { value: '', error: null },
      locality: { value: '', error: null },
      city: { value: '', error: null },
      pin_code: { value: '', error: null },
      state: { value: '', error: null },
      country: { value: '', error: null },
      latitude: { value: '', error: null },
      longitude: { value: '', error: null },
    })
    updateAddress()
  }, [user])

  useEffect(() => {
    if (
      isEmpty(data.street.value) ||
      isEmpty(data.pin_code.value) ||
      isEmpty(data.state.value) ||
      isEmpty(data.city.value) || 
      isEmpty(data.country.value) 
    ) {
      setNextDisabled(true)
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
          setData((prev: any) => {
            return {
              ...prev,
              street: {value:formatted_address, error: null},
              state: {value:state, error: null},
              city: {value:city, error: null},
              country: {value:country, error: null},
              pin_code: {value:pin_code, error: null},
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
          <h4 className={styles['heading']}>{'Address'}</h4>
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
                  value={data.street.value}
                  name="street"
                  onChange={handleInputChange}
                />
                <Image
                  src={LocationIcon}
                  alt="location"
                  className={styles.locationImg}
                  onClick={getLocation}
                />
              </div>
              <p className={styles['helper-text']}>{data.street.error}</p>
            </div>
            <section className={styles['two-column-grid']}>
              <div className={styles['input-box']}>
                <label>Society</label>
                <input
                  type="text"
                  placeholder={`Building Name`}
                  value={data.society.value}
                  name="society"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.society.error}</p>
              </div>
              <div className={styles['input-box']}>
                <label>Locality</label>
                <input
                  type="text"
                  placeholder={`Enter Locality`}
                  value={data.locality.value}
                  name="locality"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.locality.error}</p>
              </div>
            </section>
            <section className={styles['two-column-grid']}>
              <div className={styles['input-box']}>
                <label>City</label>
                <input
                  type="text"
                  placeholder={`Enter City Name`}
                  required
                  value={data.city.value}
                  name="city"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.city.error}</p>
              </div>
              <div className={styles['input-box']}>
                <label>PIN Code</label>
                <input
                  type="text"
                  placeholder={`Enter PIN Code`}
                  required
                  value={data.pin_code.value}
                  name="pin_code"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.pin_code.error}</p>
              </div>
            </section>
            <section className={styles['two-column-grid']}>
              <div className={styles['input-box']}>
                <label>State</label>
                <input
                  type="text"
                  placeholder={`Enter State Name`}
                  required
                  value={data.state.value}
                  name="state"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.state.error}</p>
              </div>
              <div className={styles['input-box']}>
                <label>Country</label>
                <input
                  type="text"
                  placeholder={`Enter Country Name`}
                  required
                  value={data.country.value}
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
            <button className="modal-footer-btn cancel" onClick={onBackBtnClick}>
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

export default ListingAddressEditModal
