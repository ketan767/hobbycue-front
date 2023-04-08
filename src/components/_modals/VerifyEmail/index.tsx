import React from 'react'
import styles from './VerifyEmail.module.css'

import { useDispatch } from 'react-redux'

import { Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import AuthForm from '@/components/AuthForm/AuthForm'
import FormInput from '@/components/_formElements/Input'
import FilledButton from '@/components/_buttons/FilledButton'

export const VerifyEmailModal: React.FC<PropTypes> = (props) => {
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
      />
      <FilledButton className={styles['verify-btn']}>Verify Email</FilledButton>
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
