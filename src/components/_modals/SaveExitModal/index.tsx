import React from 'react'
import { Modal, Fade } from '@mui/material'
import styles from './SaveExit.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons//OutlinedButton'
interface Props {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  handleClose: () => void
}
const CustomBackdrop: React.FC = () => {
  return <div className={styles['custom-backdrop']}></div>
}
const SaveAndExitModal: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
  handleClose,
}) => {
  return (
    <Modal
      slots={{ backdrop: CustomBackdrop }}
      open={isOpen}
      closeAfterTransition
      onClose={handleClose}
    >
      <Fade in={isOpen} exit={!isOpen}>
        <div
          className={`${styles['modal-wrapper']} ${
            isOpen ? styles['in-active'] : ''
          }  `}
        >
          <div className={`${styles['confirmation-modal']}`}>
            <div className={styles['confirmation-modal-body']}>
              <p> Would you like to save before exit ? </p>
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

export default SaveAndExitModal
