import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import { ProfileAddressData, addUserAddress, updateMyUserDetail } from '@/services/userService'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUserDetail } from '@/redux/slices/user'
import { RootState } from '@/redux/store'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const ProfileAddressEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { userDetail } = useSelector((state: RootState) => state.user)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [data, setData] = useState<ProfileAddressData>({
    street: '',
    society: '',
    locality: '',
    city: '',
    pin_code: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
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

  const handleInputChange = (event: any) => {
    setData((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
    setInputErrs((prev) => {
      return { ...prev, [event.target.name]: null }
    })
  }

  const handleSubmit = () => {
    if (isEmptyField(data.street)) {
      return setInputErrs((prev) => {
        return { ...prev, street: 'This field is required!' }
      })
    }
    if (isEmptyField(data.city)) {
      return setInputErrs((prev) => {
        return { ...prev, city: 'This field is required!' }
      })
    }
    if (isEmptyField(data.pin_code)) {
      return setInputErrs((prev) => {
        return { ...prev, pin_code: 'This field is required!' }
      })
    }
    if (isEmptyField(data.state)) {
      return setInputErrs((prev) => {
        return { ...prev, state: 'This field is required!' }
      })
    }

    if (isEmptyField(data.country)) {
      return setInputErrs((prev) => {
        return { ...prev, country: 'This field is required!' }
      })
    }

    setSubmitBtnLoading(true)
    addUserAddress(data, (err, res) => {
      setSubmitBtnLoading(false)
      if (err) return console.log(err)
      if (!res.data.success) return alert('Something went wrong!')
      dispatch(updateUserDetail(res.data.data.user))
      if (onComplete) onComplete()
      else dispatch(closeModal())
    })
  }

  useEffect(() => {
    setData({
      street: userDetail.street,
      society: userDetail.society,
      locality: userDetail.locality,
      city: userDetail.city,
      pin_code: userDetail.pin_code,
      state: userDetail.state,
      country: userDetail.country,
      latitude: userDetail.latitude,
      longitude: userDetail.longitude,
    })
  }, [userDetail])

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
              <input
                type="text"
                placeholder={`Enter address or click the "locate me" icon to auto-detect`}
                required
                value={data.street}
                name="street"
                onChange={handleInputChange}
              />
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
              <div className={styles['input-box']}>
                <label>City</label>
                <input
                  type="text"
                  placeholder={`Enter City Name`}
                  required
                  value={data.city}
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
              <div className={styles['input-box']}>
                <label>State</label>
                <input
                  type="text"
                  placeholder={`Enter State Name`}
                  required
                  value={data.state}
                  name="state"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.state}</p>
              </div>
              <div className={styles['input-box']}>
                <label>Country</label>
                <input
                  type="text"
                  placeholder={`Enter Country Name`}
                  required
                  value={data.country}
                  name="country"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{inputErrs.country}</p>
              </div>
            </section>
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <Button variant="outlined" size="medium" color="primary" onClick={onBackBtnClick}>
              Back
            </Button>
          )}
          <Button
            className={styles['submit']}
            variant="contained"
            size="medium"
            color="primary"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? <CircularProgress color="inherit" size={'22px'} /> : 'Next'}
          </Button>
        </footer>
      </div>
    </>
  )
}

export default ProfileAddressEditModal
