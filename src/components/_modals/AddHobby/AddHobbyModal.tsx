import React, { useEffect, useState, useRef } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'

import styles from './AddHobbyModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import CloseIcon from '@/assets/icons/CloseIcon'

import { SnackbarState } from '../ModalManager'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { closeModal } from '@/redux/slices/modal'

type Props = {
  handleClose?: any
  handleSubmit?: any
  propData?: any
  selectedHobbyText?: string
}

const AddHobby: React.FC<Props> = ({
  handleClose,
  handleSubmit,
  propData,
  selectedHobbyText,
}) => {
  const dispatch = useDispatch()
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        buttonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedHobbyText])

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }

  return (
    <>
      <div className={`${styles['add-hobby']}`}>
        <div className={styles['header']}>
          <p>{'Request Hobby'}</p>
          <CloseIcon
            className={styles['modal-close-icon']}
            onClick={() => {
              handleClose()
            }}
          />
        </div>
        <hr className={styles['modal-hr']} />
        <div className={styles['content']}>
          {selectedHobbyText ? (
            <p>
              Request HobbyCue Admin to add{' '}
              <span>{selectedHobbyText ?? 'Typed Hobby'}</span> as a hobby so
              that we can grow this as a community
            </p>
          ) : (
            <p>
              Request HobbyCue Admin to add{' '}
              <span>{propData?.defaultValue ?? 'Typed Hobby'}</span> as a hobby
              so that we can grow this as a community
            </p>
          )}
          <div className={styles['buttons']}>
            <FilledButton
              className={styles['button1']}
              onClick={handleSubmit()}
              inviteBtnRef={buttonRef}
            >
              Send
            </FilledButton>
          </div>
        </div>
      </div>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default AddHobby
