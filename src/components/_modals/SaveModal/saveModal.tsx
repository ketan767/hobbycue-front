import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './saveModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal } from '@/redux/slices/modal'

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
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()

  const onboardcheck = () => {
    if (!user.is_onboarded || !listingModalData.is_onboarded)
      window.location.reload()
    console.log(listingModalData.is_onboarded)
  }
  return (
    <div className={`${styles['confirmation-modal']}`}>
      <div className={styles['confirmation-modal-body']}>
        <p> Would you like to save before exit ? </p>
        <div className={styles['buttons']}>
          <FilledButton
            className={styles['button1']}
            onClick={() => {
              onboardcheck()
              handleSubmit()
            }}
          >
            Yes
          </FilledButton>
          <OutlinedButton
            onClick={() => {
              handleClose()
              setConfirmationModal(false)
              dispatch(closeModal())
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
