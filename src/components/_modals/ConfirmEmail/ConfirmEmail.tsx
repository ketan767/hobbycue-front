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

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])
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
        emailRef?.current?.focus()
      }
      return
    }
    if (res?.data.success) {
      alert(res.data.data?.user.otp)

      dispatch(openModal({ type: 'reset-password', closable: true }))
      dispatch(updateForgotPasswordEmail(email))
      // dispatch(closeModal())
      // window.location.reload()
    }
  }
  //   console.log('user', user)

  useEffect(() => {
    emailRef?.current?.focus()
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
              Enter the email address of the account, and we will send you a
              verification code to reset password.
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
                ref={emailRef}
              />
              <p className={styles['helper-text']}>{errors.email}</p>
            </div>
          </div>
        </section>

        <footer className={styles['footer']}>
          <button
            ref={nextButtonRef}
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
