import React from 'react'
import styles from './VerifyEmail.module.css'

import { useDispatch, useSelector } from 'react-redux'

import { Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import AuthForm from '@/components/AuthForm/AuthForm'
import FormInput from '@/components/_formElements/Input'
import FilledButton from '@/components/_buttons/FilledButton'
import { RootState } from '@/redux/store'
import { register } from '@/services/authService'
import { useRouter } from 'next/router'
import { updateIsLoggedIn } from '@/redux/slices/user'

export const VerifyEmailModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { email } = useSelector((state: RootState) => state.modal.authFormData)

  const [otp, setOtp] = React.useState('')

  const [errMsg, setErrMsg] = React.useState(null)

  const handleRegister = () => {
    register({ email, otp }, (err, res) => {
      if (err) {
        if (err.response.data.message === 'Invalid or expired OTP')
          return setErrMsg(err.response.data.message)
        return alert(err.response?.data?.messgae)
      }

      if (res.status === 200 && res.data.success) {
        localStorage.setItem('token', res.data.data.token)
        console.log(res.data.data.token)
        dispatch(updateIsLoggedIn(true))
        dispatch(closeModal())
        // @TODO:
        // router.push('/profile/devansh')
      }
    })
  }

  return (
    <div className={styles['modal-wrapper']}>
      <h3>Verify your email</h3>
      <p>
        We have sent a verification code to rakeshshah123@gmail.com. Please check your e-mail and
        enter that code below to proceed.
      </p>
      <FormInput
        className={styles['verify-code-input']}
        type="text"
        placeholder="Verification code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        error={Boolean(errMsg)}
        helperText={errMsg}
      />

      <FilledButton onClick={handleRegister} className={styles['verify-btn']}>
        Verify Email
      </FilledButton>
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
