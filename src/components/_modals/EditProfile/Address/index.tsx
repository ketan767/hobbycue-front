import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import { addUserAddress, getMyProfileDetail, updateUserAddress } from '@/services/userService'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const ProfileAddressEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

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
    if (!user.is_onboarded) {
      data.set_as_primary = true
      addUserAddress(data, (err, res) => {
        if (err) {
          setSubmitBtnLoading(false)
          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)
          return alert('Something went wrong!')
        }
        getMyProfileDetail('populate=_hobbies,_addresses,primary_address', (err, res) => {
          setSubmitBtnLoading(false)
          if (err) return console.log(err)
          if (res.data.success) {
            dispatch(updateUser(res.data.data.user))
            if (onComplete) onComplete()
            else dispatch(closeModal())
          }
        })
      })
    } else {
      updateUserAddress(user.primary_address._id, data, (err, res) => {
        if (err) {
          setSubmitBtnLoading(false)
          return console.log(err)
        }
        if (!res.data.success) {
          setSubmitBtnLoading(false)
          return alert('Something went wrong!')
        }
        getMyProfileDetail('populate=_hobbies,_addresses,primary_address', (err, res) => {
          setSubmitBtnLoading(false)
          if (err) return console.log(err)
          if (res.data.success) {
            dispatch(updateUser(res.data.data.user))
            if (onComplete) onComplete()
            else dispatch(closeModal())
          }
        })
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
            <button className="modal-footer-btn cancel" onClick={onBackBtnClick}>
              Back
            </button>
          )}

          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
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
