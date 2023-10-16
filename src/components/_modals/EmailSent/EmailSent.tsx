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
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { changePassword } from '@/services/auth.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const EmailSentModal: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [url, setUrl] = useState('')
  const [nextDisabled, setNextDisabled] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

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
  //   console.log('user', user)

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
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter Current Password"
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
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter New Password"
              />
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
          <OutlinedButton>Cancel</OutlinedButton>
        </footer>
      </div>
    </>
  )
}

export default EmailSentModal
