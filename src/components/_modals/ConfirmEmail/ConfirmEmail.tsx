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
import {
  closeModal,
  openModal,
  updateForgotPasswordEmail,
} from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { changePassword, forgotPassword } from '@/services/auth.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const ConfirmEmailModal: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [email, setEmail] = useState('')

  const [errors, setErrors] = useState({
    email: '',
  })
  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    const { err, res } = await forgotPassword({
      email,
    })
    setSubmitBtnLoading(false)
    if (err) {
      console.log(err?.response)
      if (err?.response?.data?.message) {
        setErrors({
          ...errors,
          email: err?.response?.data?.message,
        })
      }
      return
    }
    if (res?.data.success) {
      console.log(res.data.data.user)
      alert(res.data.data.user.otp)

      dispatch(openModal({ type: 'reset-password', closable: true }))
      dispatch(updateForgotPasswordEmail(email))
      // dispatch(closeModal())
      // window.location.reload()
    }
  }
  //   console.log('user', user)

  useEffect(() => {
    setErrors({
      email: '',
    })
  }, [email])
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>Forgot Password</h4>
        </header>
        <section className={styles['body']}>
          <div className={styles.inputField}>
            <label className={styles.label}>
              Enter the email address below to get forgotten password link to
              reset your hobbycue password.
            </label>
            <div
              className={`${styles['input-box']} ${
                errors.email ? styles['input-error'] : ''
              }`}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Email Address"
              />
              <p className={styles['helper-text']}>{errors.email}</p>
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
              'Send'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default ConfirmEmailModal
