import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './style.module.css'
import { isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import TextField from '@mui/material/TextField'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { changePassword, resetPassword } from '@/services/auth.service'
import IconButton from '@mui/material/IconButton'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ListingAboutData = {
  description: InputData<string>
}

function validatePasswordConditions(password: string) {
  const validation = {
    lowercase: /^(?=.*[a-z])/.test(password),
    uppercase: /^(?=.*[A-Z])/.test(password),
    number: /^(?=.*\d)/.test(password),
    specialChar: /^(?=.*[#()^+@$!%*?&])/.test(password),
    length: /^(?=.{8,})/.test(password),
  }
  return validation
}

const SetPasswordModal: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [url, setUrl] = useState('')
  const [nextDisabled, setNextDisabled] = useState(false)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const { forgotPasswordEmail } = useSelector((state: any) => state.modal)
  const newPasswordRef = useRef<HTMLInputElement>(null)

  const [showValidations, setShowValidations] = useState(false)
  const [inputValidation, setInputValidation] = useState(
    validatePasswordConditions(newPassword),
  )
  const [strength, setStrength] = useState(0)

  const [errors, setErrors] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const handleSubmit = async () => {
    if (confirmPassword !== newPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords does not match!' })
      return
    }
    setSubmitBtnLoading(true)
    const { err, res } = await resetPassword({
      email: forgotPasswordEmail,
      otp: otp,
      newPassword: newPassword,
    })
    setSubmitBtnLoading(false)
    if (err) {
      if (err?.response?.data?.message) {
        setErrors({
          ...errors,
          otp: err?.response?.data?.message,
        })
      }
      return
    }
    if (res?.data.success) {
      console.log(res.data)
      dispatch(closeModal())
      window.location.reload()
    }
  }
  //   console.log('user', user)

  const getStrengthNum = (object: any) => {
    let num = 0
    Object.keys(object).map((key: any) => {
      if (object[key] === true) {
        num += 1
      }
    })
    return num
  }

  useEffect(() => {
    setErrors({
      otp: '',
      newPassword: '',
      confirmPassword: '',
    })
  }, [otp, newPassword, confirmPassword])

  useEffect(() => {
    const strengthNum = getStrengthNum(inputValidation)
    setStrength(strengthNum)
  }, [newPassword, inputValidation])

  let threeConditionsValid = 0
  if (inputValidation.uppercase) {
    threeConditionsValid += 1
  }
  if (inputValidation.lowercase) {
    threeConditionsValid += 1
  }
  if (inputValidation.specialChar) {
    threeConditionsValid += 1
  }
  if (inputValidation.number) {
    threeConditionsValid += 1
  }
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>Set Password</h4>
        </header>
        <section className={styles['body']}>
          <div className={styles.inputField}>
            <label className={styles.label}>
              OTP to set password has been sent to your registerd E-mail id.
            </label>
            {/* <label className={styles.label}>Current Password</label> */}
            <div
              className={`${styles['input-box']} ${
                errors.otp ? styles['input-error'] : ''
              }`}
            >
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.input}
                placeholder="OTP"
              />
              <p className={styles['helper-text']}>{errors.otp}</p>
            </div>
          </div>
          <div className={styles.inputField}>
            {/* <label className={styles.label}>New Password</label> */}
            <div
              className={`${styles['input-box']} ${
                errors.newPassword ? styles['input-error'] : ''
              }`}
            >
              <TextField
                fullWidth
                required
                ref={newPasswordRef}
                placeholder="New Password"
                type={showPassword ? 'text' : 'password'}
                onFocus={() => setShowValidations(true)}
                onBlur={() => setShowValidations(false)}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <VisibilityRoundedIcon />
                      ) : (
                        <VisibilityOffRoundedIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
              {showValidations && (
                <div className={styles['validation-messages']}>
                  <p
                    className={
                      inputValidation.length ? styles['valid'] : undefined
                    }
                  >
                    At least 8 character in length.
                  </p>
                  <p
                    className={threeConditionsValid >= 3 ? styles['valid'] : ''}
                  >
                    3 out of 4 conditions below
                  </p>
                  <p
                    className={
                      inputValidation.lowercase ? styles['valid'] : undefined
                    }
                  >
                    Lower case letters (a-z)
                  </p>
                  <p
                    className={
                      inputValidation.uppercase ? styles['valid'] : undefined
                    }
                  >
                    Upper case letters (A-Z)
                  </p>
                  <p
                    className={
                      inputValidation.number ? styles['valid'] : undefined
                    }
                  >
                    Numbers (0-9)
                  </p>
                  <p
                    className={
                      inputValidation.specialChar ? styles['valid'] : undefined
                    }
                  >
                    Special characters (@,#,$)
                  </p>
                </div>
              )}
              {/* <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="New Password"
              /> */}
              <p className={styles['helper-text']}>{errors.newPassword}</p>
            </div>
          </div>
          <div className={styles.inputField}>
            {/* <label className={styles.label}>Confirm New Password</label> */}
            <div
              className={`${styles['input-box']} ${
                errors.confirmPassword ? styles['input-error'] : ''
              }`}
            >
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm New Password"
                type='password'
              />
              <p className={styles['helper-text']}>{errors.confirmPassword}</p>
            </div>
          </div>
        </section>

        <footer className={styles['footer']}>
          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'16px'} />
            ) : (
              'Verify Action'
            )}
          </button>
          <button className="modal-mob-btn-save" onClick={handleSubmit}>
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'16px'} />
            ) : (
              'Verify Action'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default SetPasswordModal
