import React from 'react'
import styles from './AuthModal.module.css'

import { useDispatch } from 'react-redux'

import { Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import AuthForm from '@/components/AuthForm/AuthForm'

export const AuthModal: React.FC<PropTypes> = (props) => {
  return (
    <div className={styles['modal-wrapper']}>
      <AuthForm />
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
