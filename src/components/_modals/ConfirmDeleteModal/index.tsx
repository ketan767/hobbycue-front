import React from 'react'
import { Modal, Fade } from '@mui/material'
import styles from './confirmation.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons//OutlinedButton'
import CloseIcon from '@/assets/icons/CloseIcon'
interface Props {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  handleClose: () => void
  handleBgClick: (event: any) => void
}
const CustomBackdrop: React.FC = () => {
  return <div className={styles['custom-backdrop']}></div>
}
const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
  handleClose,
  handleBgClick,
}) => {
  return (
    <Modal
      slots={{ backdrop: CustomBackdrop }}
      open={isOpen}
      closeAfterTransition
      onClose={handleClose}
    >
      <Fade in={isOpen} exit={!isOpen} onClick={handleBgClick}>
        <div
          className={`${styles['modal-wrapper']} ${
            isOpen ? styles['in-active'] : ''
          }  `}
        >
          <div className={`${styles['confirmation-modal']}`}>
            <div className={styles['confirmation-modal-body']}>
              <CloseIcon
                className={styles['modal-close-icon']}
                onClick={handleClose}
              />
              <p> Are you sure you want to delete? </p>
              <div className={styles['buttons']}>
                <FilledButton className={styles['button1']} onClick={onConfirm}>
                  Yes
                </FilledButton>
                <OutlinedButton onClick={onCancel}>No</OutlinedButton>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default ConfirmationModal
