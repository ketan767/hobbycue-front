import React, { useEffect, useRef, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './saveModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal, setHasChanges } from '@/redux/slices/modal'
import CloseIcon from '@/assets/icons/CloseIcon'
import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'

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
  const [YesBtnLoading, setYesBtnLoading] = useState<boolean>(false)
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const router = useRouter()
  const onboardcheck = () => {
    console.log('isError', isError)
    if (OnBoarding || !user.is_onboarded) {
      router.push(`/profile/${user.profile_url}`)
    } else if (isError) {
      setConfirmationModal(false)
    }

    dispatch(setHasChanges(false))
  }

  const handleYesClick = async () => {
    setYesBtnLoading(true)
    await handleSubmit()
    setYesBtnLoading(false)
    onboardcheck()
  }
  const wrapperRef = useRef<HTMLDivElement>(null)

  if (reloadrouter) {
    router.reload()
    return <div></div>
  }

  return (
    <div ref={wrapperRef} className={`${styles['confirmation-modal']}`}>
      <div className={styles['confirmation-modal-body']}>
        {/* <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        /> */}
        <p> Would you like to save before exit ? </p>
        <div className={styles['buttons']}>
          <FilledButton className={styles['button1']} onClick={handleYesClick}>
            {YesBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : (
              'Yes'
            )}
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
