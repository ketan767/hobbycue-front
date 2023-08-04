import React, { useState, useEffect } from 'react'
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
    specialChar: /^(?=.*[@$!%*?&])/.test(password),
    length: /^(?=.{8,})/.test(password),
  }
  return validation
}

const ChangePasswordModal: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [url, setUrl] = useState('')
  const { authFormData } = useSelector((state: RootState) => state.modal)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showcurrPassword, setShowcurrPassword] = useState(false)
  const [inputValidation, setInputValidation] = useState(
    validatePasswordConditions(authFormData.password),
  )
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const handleSubmit = async () => {
    if (confirmPassword !== newPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords does not match!' })
      return
    }
    setSubmitBtnLoading(true)
    const { err, res } = await changePassword({
      currentPassword,
      newPassword,
    })
    setSubmitBtnLoading(false)
    if (err) {
      if (err?.response?.data?.message) {
        setErrors({
          ...errors,
          currentPassword: err?.response?.data?.message,
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
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>Change Password</h4>
        </header>
        <hr />
        <section className={styles['body']}>
          <div className={styles.inputField}>
            <label className={styles.label}>Current Password</label>
            <div
              className={`${styles['input-box']} ${
                errors.currentPassword ? styles['input-error'] : ''
              }`}
            >
              <TextField
                fullWidth
                required
                placeholder="Enter Current Password"
                type={showcurrPassword ? 'text' : 'password'}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
                errors.newPassword ? styles['input-error'] : ''
              }`}
            >
              <TextField
                fullWidth
                required
                placeholder="Enter New Password"
                type={showPassword ? 'text' : 'password'}
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

              <div className={styles['validation-messages']}>
                <p
                  className={
                    inputValidation.lowercase ? styles['valid'] : undefined
                  }
                >
                  Must contain at least one lowercase letter
                </p>
                <p
                  className={
                    inputValidation.uppercase ? styles['valid'] : undefined
                  }
                >
                  Must contain at least one uppercase letter
                </p>
                <p
                  className={
                    inputValidation.number ? styles['valid'] : undefined
                  }
                >
                  Must contain at least one number
                </p>
                <p
                  className={
                    inputValidation.specialChar ? styles['valid'] : undefined
                  }
                >
                  Must contain at least one special character
                </p>
                <p
                  className={
                    inputValidation.length ? styles['valid'] : undefined
                  }
                >
                  Must be at least 8 characters long
                </p>
              </div>

              <p className={styles['helper-text']}>{errors.newPassword}</p>
            </div>
          </div>
          <div className={styles.inputField}>
            <label className={styles.label}>Confirm New Password</label>
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
              'Save'
            )}
          </button>

          <OutlinedButton
            onClick={() => {
              handleClose()
            }}
          >
            Cancel
          </OutlinedButton>
        </footer>
      </div>
    </>
  )
}

export default ChangePasswordModal
