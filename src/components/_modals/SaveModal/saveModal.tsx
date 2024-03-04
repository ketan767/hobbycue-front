import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './saveModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal } from '@/redux/slices/modal'
import CloseIcon from '@/assets/icons/CloseIcon'
import { useRouter } from 'next/router'

type Props = {
  setConfirmationModal?: any
  handleClose?: any
  handleSubmit?: any
  isError?: any
  OnBoarding?: any
  hasChange?: any
  reloadrouter?: any
}

const SaveModal: React.FC<Props> = ({
  setConfirmationModal,
  handleClose,
  handleSubmit,
  isError,
  OnBoarding = false,
  hasChange,
  reloadrouter,
}) => {
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const router = useRouter()
  const onboardcheck = () => {
    console.log('isError', isError)
    if (OnBoarding) {
      window.location.reload()
    } else if (isError) {
      setConfirmationModal(false)
    }
  }

  const handleYesClick = async () => {
    handleSubmit()
    onboardcheck()
  }

  if (reloadrouter) {
    router.reload()
    return <div></div>
  }

  return (
    <div className={`${styles['confirmation-modal']}`}>
      <div className={styles['confirmation-modal-body']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        <p> Would you like to save before exit ? </p>
        <div className={styles['buttons']}>
          <FilledButton className={styles['button1']} onClick={handleYesClick}>
            Yes
          </FilledButton>
          <OutlinedButton
            onClick={() => {
              handleClose
              onboardcheck()
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
