import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './AddHobbyModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal } from '@/redux/slices/modal'
import CloseIcon from '@/assets/icons/CloseIcon'

type Props = {
  handleClose?: any
  handleSubmit?: any
}

const AddHobby: React.FC<Props> = ({ handleClose, handleSubmit }) => {
  const dispatch = useDispatch()

  return (
    <div className={`${styles['add-hobby']}`}>
      <div className={styles['header']}>
        <p>Add Hobby</p>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
      </div>
      <hr className={styles['modal-hr']} />
      <div className={styles['content']}>
        <p>
          Add <span>Pickleball</span> as a hobby so that we can grow this as a
          community
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
