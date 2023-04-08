import React from 'react'
import styles from './VerifyEmail.module.css'

import { useDispatch } from 'react-redux'

import { Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import AuthForm from '@/components/AuthForm/AuthForm'

export const VerifyEmailModal: React.FC<PropTypes> = (props) => {
  return <div className={styles['modal-wrapper']}>Verify</div>
}

type PropTypes = {
  closeModal?: () => void
}
