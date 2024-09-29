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

const FBNoEmail: React.FC<Props> = ({}) => {
  const elementRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [email, setEmail] = useState('')

  const [errors, setErrors] = useState({
    email: '',
  })

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  function isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    if (isValidEmail(email) === false) {
      setSubmitBtnLoading(false)
      setErrors({ email: 'Email is invalid!' })
      elementRef.current?.focus()
      return
    }
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
        elementRef.current?.focus()
      }
      return
    }
    if (res?.data.success) {
      dispatch(openModal({ type: 'reset-password', closable: true }))
      dispatch(updateForgotPasswordEmail(email))
      // dispatch(closeModal())
      // window.location.reload()
    }
  }
  //   console.log('user', user)

  useEffect(() => {
    elementRef.current?.focus()
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    setErrors({
      email: '',
    })
  }, [email])

  const handleHavePassword = () => {
    dispatch(openModal({ type: 'auth', closable: true }))
  }
  const handleSetPassword = () => {
    dispatch(openModal({ type: 'confirm-email', closable: true }))
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>Sign In Failed</h4>
        </header>
        <section className={styles['body']}>
          <div className={styles.inputField}>
            <p className={styles.label}>
              We could not obtain your credentials from Facebook. If you have a
              HobbyCue password, you may enter your Email ID and password to
              proceed. Else, choose the Set Password option to create one.
            </p>
            {/* <div
              className={`${styles['input-box']} ${
                errors.email ? styles['input-error'] : ''
              }`}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Email Address"
                ref={elementRef}
              />
              <p className={styles['helper-text']}>{errors.email}</p>
            </div> */}
          </div>
        </section>

        <footer className={styles['footer']}>
          <Button className={styles.continueBtn} onClick={handleHavePassword}>
            I have a HobbyCue password
          </Button>
          <Button className={styles.continueBtn} onClick={handleSetPassword}>
            Set Password
          </Button>
          {/* <button
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
          <button
            ref={nextButtonRef}
            className="modal-mob-btn-save"
            onClick={handleSubmit}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'14px'} />
            ) : (
              'Send'
            )}
          </button> */}
        </footer>
      </div>
    </>
  )
}

export default FBNoEmail
