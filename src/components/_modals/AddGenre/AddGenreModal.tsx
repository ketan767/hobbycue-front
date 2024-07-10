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
  HobbyValue?: any
}

const AddGenre: React.FC<Props> = ({
  handleClose,
  handleSubmit,
  propData,
  HobbyValue,
}) => {
  const dispatch = useDispatch()
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

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
            <span>{propData?.defaultValue ?? 'genre'}</span> as a Genre/Style
            under <span>{HobbyValue?.defaultValue ?? 'Hobby'}</span> so that we
            can grow this as a community
          </p>
          <div className={styles['buttons']}>
            <FilledButton
              className={styles['button1']}
              onClick={handleSubmit()}
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

export default AddGenre
