import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import {
  getMyProfileDetail,
  notifyMaintenance,
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
import { useRouter } from 'next/router'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type Snackbar = {
  message: string
  triggerOpen: boolean
  type: 'error' | 'success'
}

const ConfirmEmail: React.FC<Props> = ({}) => {
  const elementRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [email, setEmail] = useState('')
  const [showSnackbar, setShowSnackbar] = useState<Snackbar>({
    message: '',
    triggerOpen: false,
    type: 'success',
  })
  const router = useRouter()

  const is5XXPage = /^\/5\d{2}$/.test(router.asPath)

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
    if (is5XXPage) {
      try {
        const { res, err } = await notifyMaintenance({ email })
        if (err || !res?.data?.success) {
          throw err || new Error('Error in 500 page')
        }
        setShowSnackbar({
          message: "You will receive an e-mail as soon as we're back",
          triggerOpen: true,
          type: 'success',
        })
      } catch (err: any) {
        console.log('Error in 500 page', err)
        if (err.response?.status === 400) {
          setShowSnackbar({
            message: 'You are already on our waiting list!',
            triggerOpen: true,
            type: 'success',
          })
        }
        // if (err.message === '')
      } finally {
        setSubmitBtnLoading(false)
        setTimeout(() => {
          dispatch(closeModal())
        }, 3 * 1000)
        return
      }
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

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>Confirm E-mail</h4>
        </header>
        <section className={styles['body']}>
          <div className={styles.inputField}>
            <label className={styles.label}>
              {is5XXPage
                ? `Enter your email address, and we will notify you as soon as we are back.`
                : `Enter the email address of the account, and we will send you a
              verification code to set a password.`}
            </label>
            <div
              className={`${styles['input-box']} ${
                errors.email ? styles['input-error'] : ''
              }`}
            >
              <input
                autoComplete="new"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Email Address"
                ref={elementRef}
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
          </button>
        </footer>
      </div>
      <CustomSnackbar
        message={showSnackbar.message}
        triggerOpen={showSnackbar.triggerOpen}
        type={showSnackbar.type}
        closeSnackbar={() =>
          setShowSnackbar({ ...showSnackbar, triggerOpen: false })
        }
      />
    </>
  )
}

export default ConfirmEmail
