import React, { useState, useEffect } from 'react'
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
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { signIn } from '@/services/auth.service'
import { current } from '@reduxjs/toolkit'
import { setVerified } from './../../../redux/slices/modal'
import { passwordRequest } from '@/services/auth.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const VerifyActionModal: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [showcurrPassword, setShowcurrPassword] = useState(false)

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const data: any = {
    email: user.email,
    password: currentPassword,
    profile_url: user.profile_url,
  }

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    const { err, res } = await signIn(data)
    if (user.isPassword) {
      if (err?.response.data.message === 'Invalid email or password')
        setErrors({
          ...errors,
          currentPassword: 'Wrong password',
        })
      else if (res.status === 200 && res.data.success) {
        dispatch(setVerified(true))
      }

      setSubmitBtnLoading(false)
    } else {
      setErrors({
        ...errors,
        currentPassword: 'create an account password first',
      })
      setSubmitBtnLoading(false)
    }
  }

  const handleOpenCreatePassword = async () => {
    const email = user.email
    dispatch(openModal({ type: 'Set-PasswordModal', closable: true }))
    const { err, res } = await passwordRequest({
      email,
    })
    console.log(err)
    setSubmitBtnLoading(false)
    if (res?.data.success) {
      dispatch(updateForgotPasswordEmail(email))
    } else alert('Something went wrong')
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>Verify Action</h4>
        </header>
        <section className={styles['body']}>
          <div className={styles.inputField}>
            <label className={styles.label}>
              For security purposes, please verify this action using your
              password. If you signed up using Facebook or Google, please{' '}
              <span className={styles.link} onClick={handleOpenCreatePassword}>
                click here to create an account password.
              </span>{' '}
            </label>
            <div
              className={`${styles['input-box']} ${
                errors.currentPassword ? styles['input-error'] : ''
              }`}
            >
              <TextField
                fullWidth
                required
                placeholder="Enter Current Password"
                type={showcurrPassword ? 'text' : 'password'}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      className={styles['hide-icon']}
                      onClick={() => setShowcurrPassword(!showcurrPassword)}
                    >
                      {showcurrPassword ? (
                        <VisibilityRoundedIcon />
                      ) : (
                        <VisibilityOffRoundedIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />

              <p className={styles['helper-text']}>{errors.currentPassword}</p>
            </div>
          </div>
        </section>

        <footer className={styles['footer']}>
          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'16px'} />
            ) : (
              'Verify Action'
            )}
          </button>
          <button className="modal-mob-btn-save" onClick={handleSubmit}>
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : (
              'Verify Action'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default VerifyActionModal
