import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './AddGenreModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal } from '@/redux/slices/modal'
import CloseIcon from '@/assets/icons/CloseIcon'

type Props = {
  handleClose?: any
  handleSubmit?: any
  propData?: any
}

const AddHobby: React.FC<Props> = ({ handleClose, handleSubmit, propData }) => {
  const dispatch = useDispatch()

  return (
    <div className={`${styles['add-hobby']}`}>
      <div className={styles['header']}>
        <p>Add Hobby</p>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={() => {
            dispatch(closeModal())
          }}
        />
      </div>
      <hr className={styles['modal-hr']} />
      <div className={styles['content']}>
        <p>
          Request HobbyCue Admin to add{' '}
          <span>{propData?.defaultValue ?? 'Pickleball'}</span> as a Genre/Style
          so that we can grow this as a community
        </p>
        <div className={styles['buttons']}>
          <FilledButton className={styles['button1']} onClick={handleClose}>
            Send Request
          </FilledButton>
        </div>
      </div>
    </div>
  )
}

export default AddHobby
