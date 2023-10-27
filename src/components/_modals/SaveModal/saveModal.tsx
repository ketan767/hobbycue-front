import React, { useEffect } from 'react'
import styles from './saveModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'

type Props = {
  setConfirmationModal?: any
  handleClose?: any
  handleSubmit?: any
}

const SaveModal: React.FC<Props> = ({
  setConfirmationModal,
  handleClose,
  handleSubmit,
}) => {
  return (
    <div className={`${styles['confirmation-modal']}`}>
      <div className={styles['confirmation-modal-body']}>
        <p> Would you like to save before exit ? </p>
        <div className={styles['buttons']}>
          <FilledButton className={styles['button1']} onClick={handleSubmit}>
            Yes
          </FilledButton>
          <OutlinedButton
            onClick={() => {
              handleClose()
              setConfirmationModal(false)
            }}
          >
            No
          </OutlinedButton>
        </div>
      </div>
    </div>
  )
}

export default SaveModal
