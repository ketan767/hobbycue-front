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
import IconButton from '@mui/material/IconButton'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { changePassword } from '@/services/auth.service'
import PasswordAnalyzer from '@/components/PasswordAnalyzer/PasswordAnalyzer'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CloseIcon from '@/assets/icons/CloseIcon'

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

const ChangePasswordModal: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const [nextDisabled, setNextDisabled] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  // const [showCrmPassword, setShowCrmPassword] = useState(false)
  const [showcurrPassword, setShowcurrPassword] = useState(false)
  const [showValidations, setShowValidations] = useState(false)
  const [inputValidation, setInputValidation] = useState(
    validatePasswordConditions(newPassword),
  )
  const currentPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [strength, setStrength] = useState(0)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  useEffect(() => {
    currentPasswordRef.current?.focus()
  }, [])

  useEffect(() => {
    const result = validatePasswordConditions(newPassword)
    setInputValidation(result)
  }, [newPassword])

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (buttonClicked: string) => {
    if (currentPassword === '') {
      currentPasswordRef.current?.focus()
      setErrors({
        ...errors,
        currentPassword: 'Please enter the current password!',
      })
      return
    }
    if (newPassword === '' && buttonClicked === 'currentPassword') {
      newPasswordRef.current?.focus()
      return
    } else if (newPassword === '' && buttonClicked !== 'currentPassword') {
      setErrors({ ...errors, newPassword: 'Please enter the new password!' })
      newPasswordRef.current?.focus()
      return
    }

    const strengthNum = getStrengthNum(inputValidation)
    if (strengthNum < 3) {
      newPasswordRef.current?.focus()
      setErrors({ ...errors, newPassword: 'Please enter a strong password!' })
      return
    }
    if (confirmPassword === '' && buttonClicked !== 'confirmPassword') {
      confirmPasswordRef.current?.focus()
      return
    } else if (confirmPassword === '' && buttonClicked === 'confirmPassword') {
      confirmPasswordRef.current?.focus()
      setErrors({
        ...errors,
        confirmPassword: 'Please re-enter the new password!',
      })
      return
    }
    if (confirmPassword !== newPassword) {
      confirmPasswordRef.current?.focus()
      setErrors({ ...errors, confirmPassword: 'Passwords does not match!' })
      return
    }
    setSubmitBtnLoading(true)
    const { err, res } = await changePassword({
      currentPassword,
      newPassword,
    })

    if (err) {
      if (err?.response?.data?.message) {
        setErrors({
          ...errors,
          currentPassword: err?.response?.data?.message,
        })
      }
      setSubmitBtnLoading(false)
      return
    }
    if (res?.data.success) {
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Password Changed',
      })
      setTimeout(() => {
        dispatch(closeModal())
        setSubmitBtnLoading(false)
      }, 2500)
    }
  }

  function handleClose() {
    dispatch(closeModal())
  }

  useEffect(() => {
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }, [currentPassword, newPassword, confirmPassword])

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
          <h4 className={styles['heading']}>Change Password</h4>
          <button onClick={handleClose} style={{ backgroundColor: 'transparent', display: 'flex', border: 'none' }}>
            <CloseIcon />
          </button>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <div className={styles.inputField}>
            <label className={styles.label}>Current Password</label>
            <div
              className={`${styles['input-box']} ${
                errors.currentPassword ? styles['input-box-error'] : ''
              }`}
            >
              <TextField
                autoComplete="off"
                className={`textFieldClass`}
                inputRef={currentPasswordRef}
                fullWidth
                style={
                  !(errors.currentPassword === '')
                    ? { border: '1px solid red', borderRadius: '8px' }
                    : {}
                }
                required
                inputProps={{ inputMode: 'text' }}
                placeholder="Current Password"
                type={showcurrPassword ? 'text' : 'password'}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit('currentPassword')
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      className={styles['hide-icon']}
                      onClick={() => setShowcurrPassword(!showcurrPassword)}
                    >
                      {showcurrPassword ? (
                        <VisibilityRoundedIcon />
                      ) : (
                        <VisibilityOffRoundedIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />

              <p className={styles['helper-text']}>{errors.currentPassword}</p>
            </div>
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>New Password</label>

            <div
              className={`${styles['input-box']} ${
                errors.newPassword ? styles['input-box-error'] : ''
              }`}
              style={{ marginBottom: 15 }}
            >
              <TextField
                autoComplete="off"
                className={`textFieldClass`}
                fullWidth
                required
                style={
                  !(errors.newPassword === '')
                    ? { border: '1px solid red', borderRadius: '8px' }
                    : {}
                }
                inputRef={newPasswordRef}
                placeholder="New Password"
                type={showPassword ? 'text' : 'password'}
                onFocus={() => setShowValidations(true)}
                onBlur={() => setShowValidations(false)}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit('newPassword')
                  }
                }}
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

              <p className={styles['helper-text']}>{errors.newPassword}</p>
            </div>
            <PasswordAnalyzer strength={strength - 2} />
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>Confirm New Password</label>
            <div
              className={`${styles['input-box']} ${
                errors.confirmPassword ? styles['input-box-error'] : ''
              }`}
              style={{ marginBottom: '0' }}
            >
              <TextField
                autoComplete="off"
                className={`textFieldClass`}
                value={confirmPassword}
                type={'password'}
                style={
                  !(errors.confirmPassword === '')
                    ? { border: '1px solid red', borderRadius: '8px' }
                    : {}
                }
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                inputRef={confirmPasswordRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit('confirmPassword')
                  }
                }}
                // InputProps={{
                //   endAdornment: (
                //     <IconButton
                //       onClick={() => setShowCrmPassword(!showCrmPassword)}
                //     >
                //       {showCrmPassword ? (
                //         <VisibilityRoundedIcon />
                //       ) : (
                //         <VisibilityOffRoundedIcon />
                //       )}
                //     </IconButton>
                //   ),
                // }}
              />
              <p className={styles['helper-text']}>{errors.confirmPassword}</p>
            </div>
          </div>
        </section>

        <footer className={styles['footer']}>
          <button
            className="modal-footer-btn cancel"
            onClick={() => {
              handleClose()
            }}
          >
            Cancel
          </button>
          <button
            className={`modal-footer-btn submit ${styles['save-btn']}`}
            onClick={() => {
              handleSubmit('confirmPassword')
            }}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'16px'} />
            ) : (
              'Save'
            )}
          </button>
          <OutlinedButton
            className={styles.mobBtnCancel}
            onClick={() => {
              handleClose()
            }}
          >
            Cancel
          </OutlinedButton>
          <button
            className={`modal-mob-btn-save ${styles.mobBtnSave}`}
            onClick={() => {
              handleSubmit('confirmPassword')
            }}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'14px'} />
            ) : (
              'Save'
            )}
          </button>
        </footer>
      </div>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default ChangePasswordModal
