import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './AddGenreModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal } from '@/redux/slices/modal'
import CloseIcon from '@/assets/icons/CloseIcon'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  handleClose?: any
  handleSubmit?: any
  propData?: any
}

const AddGenre: React.FC<Props> = ({ handleClose, handleSubmit, propData }) => {
  const dispatch = useDispatch()
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
    setTimeout(() => {
      handleClose()
    }, 2000)
  }
  return (
    <>
      <div className={`${styles['add-hobby']}`}>
        <div className={styles['header']}>
          <p>Request Genre/Style</p>
          <CloseIcon
            className={styles['modal-close-icon']}
            onClick={() => {
              handleClose()
            }}
          />
        </div>
        <hr className={styles['modal-hr']} />
        <div className={styles['content']}>
          <p>
            Request HobbyCue Admin to add{' '}
            <span>{propData?.defaultValue ?? 'genre'}</span> as a
            Genre/Style so that we can grow this as a community
          </p>
          <div className={styles['buttons']}>
            <FilledButton
              className={styles['button1']}
              onClick={showFeatureUnderDevelopment}
            >
              Send Request
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

export default AddGenre
