import React, { useState } from 'react'
import styles from './VerifyEmail.module.css'

import { useDispatch, useSelector } from 'react-redux'

import { CircularProgress, Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import AuthForm from '@/components/AuthForm/AuthForm'
import FormInput from '@/components/_formElements/Input'
import FilledButton from '@/components/_buttons/FilledButton'
import { RootState } from '@/redux/store'
import { register } from '@/services/auth.service'
import { useRouter } from 'next/router'
import { updateIsAuthenticated, updateIsLoggedIn, updateUser } from '@/redux/slices/user'

export const VerifyEmailModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { email } = useSelector((state: RootState) => state.modal.authFormData)

  const [otp, setOtp] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false)

  const handleRegister = async () => {
    setSubmitBtnLoading(true)
    const { err, res } = await register({ email, otp })
    setSubmitBtnLoading(false)
    if (err) {
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
      // @TODO:
      // router.push('/profile/devansh')
    }
  }

  return (
    <div className={styles['modal-wrapper']}>
      <h3>Verify your email</h3>
      <p className={styles.textMain}>
        We have sent a verification code to <span> {email} </span>. Please check your e-mail and enter that code
        below to proceed.
      </p>
      <FormInput
        className={styles['verify-code-input']}
        type="text"
        placeholder="Verification code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        error={Boolean(errMsg)}
        helperText={errMsg}
        disabled={submitBtnLoading}
      />

      <FilledButton
        disabled={submitBtnLoading}
        onClick={handleRegister}
        className={styles['verify-btn']}
      >
        {submitBtnLoading ? <CircularProgress color="inherit" size={'20px'} /> : 'Verify Email'}
      </FilledButton>
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
