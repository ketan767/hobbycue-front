import React, {
  HTMLInputTypeAttribute,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './VerifyEmail.module.css'

import { useDispatch, useSelector } from 'react-redux'

import { CircularProgress, Modal } from '@mui/material'
import { closeModal, openModal } from '@/redux/slices/modal'
import AuthForm from '@/components/AuthForm/AuthForm'
import FormInput from '@/components/_formElements/Input'
import FilledButton from '@/components/_buttons/FilledButton'
import { RootState } from '@/redux/store'
import { register } from '@/services/auth.service'
import { useRouter } from 'next/router'
import {
  updateIsAuthenticated,
  updateIsLoggedIn,
  updateUser,
} from '@/redux/slices/user'
import { isBrowser } from '@/utils'
import UAParser from 'ua-parser-js'

export const VerifyEmailModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { email } = useSelector((state: RootState) => state.modal.authFormData)
  const { user } = useSelector((state: RootState) => state.user)
  const otpref = useRef<HTMLInputElement>(null)
  const desktopSubmitBtnRef = useRef<HTMLButtonElement>(null)
  const [otp, setOtp] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>({
    device: 'unknown',
    browser: 'unknown',
  })

  useEffect(() => {
    const getBrowserData = async () => {
      if (isBrowser()) {
        const parser = new UAParser()
        const result = parser.getResult()
        const userAgent = navigator?.userAgent
        const regex = /\(([^)]+)\)/
        const match = userAgent.match(regex)

        const device = match ? match[1] : null
        const deviceType = window.innerWidth < 800 ? 'Phone' : 'Desktop'
        setDeviceInfo({
          device: `${deviceType} - ${device}`,
          browser: result?.browser?.name || 'unknown',
        })
      }
    }
    getBrowserData()
  }, [user])
  const handleRegister = async () => {
    const data = {
      email: email,
      otp: otp,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
    }
    setSubmitBtnLoading(true)
    const { err, res } = await register(data)
    setSubmitBtnLoading(false)
    if (err) {
      otpref?.current?.focus()
      if (err.response.data.message === 'Invalid or expired OTP')
        return setErrMsg('Invalid or expired OTP')
      return setErrMsg('Invalid or expired OTP')
    }

    if (res.status === 200 && res.data.success) {
      localStorage.setItem('token', res.data.data.token)
      dispatch(updateIsLoggedIn(true))
      // dispatch(updateIsAuthenticated(true))
      // dispatch(updateUser(res.data.data.user))
      router.push('/community', undefined, { shallow: false })
      dispatch(openModal({ type: 'SimpleOnboarding', closable: true }))
    }
  }
  useEffect(() => {
    otpref?.current?.focus()
  })

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        desktopSubmitBtnRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div className={styles['modal-wrapper']}>
      <h3>Verify your email</h3>
      <p className={styles.textMain}>
        We have sent a verification code to <span> {email}</span>. Please check
        your e-mail and enter that code below to proceed.
      </p>
      <div
        className={`${styles['input-box']} ${
          errMsg ? styles['input-box-error'] : ''
        }`}
      >
        <input
          ref={otpref}
          className={styles['verify-code-input']}
          type="text"
          placeholder="Verification code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={submitBtnLoading}
        />
        <p className={styles['helper-text']}>{errMsg}</p>
      </div>
      <footer className={styles['footer']}>
        <button
          disabled={submitBtnLoading}
          onClick={handleRegister}
          ref={desktopSubmitBtnRef}
          className={`modal-footer-btn submit ${styles['verify-btn']}`}
        >
          {submitBtnLoading ? (
            <CircularProgress color="inherit" size={'20px'} />
          ) : (
            'Verify Email'
          )}
        </button>

        <button
          className="modal-mob-btn-save"
          onClick={handleRegister}
          disabled={submitBtnLoading}
        >
          {' '}
          {submitBtnLoading ? (
            <CircularProgress color="inherit" size={'14px'} />
          ) : (
            'Verify Email'
          )}
        </button>
      </footer>
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
