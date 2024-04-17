import React, { useEffect, useRef, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './saveModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal, setHasChanges } from '@/redux/slices/modal'
import CloseIcon from '@/assets/icons/CloseIcon'
import { useRouter } from 'next/router'
import { CircularProgress, useMediaQuery } from '@mui/material'
import { showProfileError, updateUser } from '@/redux/slices/user'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { sendWelcomeMail } from '@/services/auth.service'

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
  const { activeModal } = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch()
  const router = useRouter()
  const onboardcheck = () => {
    console.log('isError', isError)
    if (OnBoarding || !user.is_onboarded) {
      router.push(`/profile/${user.profile_url}`)
      setConfirmationModal(false)
      dispatch(closeModal())
      dispatch(showProfileError(true))
    } else if (isError) {
      setConfirmationModal(false)
    }

    dispatch(setHasChanges(false))
  }
  const handleListingOnboarding = async () => {
    if (activeModal === 'listing-onboarding') {
      window.location.reload()
    }
  }

  const handleYesClick = async () => {
    setYesBtnLoading(true)
    await handleSubmit()
    setYesBtnLoading(false)
    onboardcheck()
  }
  const wrapperRef = useRef<HTMLDivElement>(null)

  const IsOnboardingCompete = async () => {
    const payload: InviteToCommunityPayload = {
      to: user?.public_email,
      name: user.full_name,
    }
    console.log('activeprofileeeeeeeeeeee', user)
    const { err: error, res: response } = await getMyProfileDetail()

    if (response?.data?.data?.user?.completed_onboarding_steps.length === 3) {
      await sendWelcomeMail(payload)

      const data = { is_onboarded: true }
      const { err, res } = await updateMyProfileDetail(data)

      if (err) return console.log(err)
      if (res?.data.success) {
        dispatch(updateUser(res.data.data.user))
        setConfirmationModal(false)
        dispatch(closeModal())
      }

      window.location.href = `/community`
    } else {
      if (activeModal !== 'profile-general-edit') {
        window.location.href = `/profile/${user.profile_url}`
        dispatch(showProfileError(true))
        setConfirmationModal(false)
        dispatch(closeModal())
      }
    }
  }

  const isMobile = useMediaQuery("(max-width:1100px)");

  if (reloadrouter) {
    IsOnboardingCompete()
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
              <CircularProgress color="inherit" size={isMobile?'14px':'24px'} />
            ) : (
              'Yes'
            )}
          </FilledButton>
          <OutlinedButton
            onClick={() => {
              handleListingOnboarding()
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
