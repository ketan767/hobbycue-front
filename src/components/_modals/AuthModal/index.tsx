import React from 'react'
import styles from './AuthModal.module.css'

import { useDispatch } from 'react-redux'

import { Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modalSlice'
import AuthForm from '@/components/AuthForm/AuthForm'

export const SignInModal: React.FC<PropTypes> = (props) => {
  return (
    <div className={styles['modal-wrapper']}>
      <AuthForm />
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
