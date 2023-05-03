import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { AuthModal } from './AuthModal'
import { Dialog, Modal, Grow, Fade } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import { VerifyEmailModal } from './VerifyEmail'
import styles from './ModalManager.module.css'
import { UserOnboardingModal } from './UserOnboardingModal'
import ProfileAboutEditModal from './EditProfile/About'
import ProfileGeneralEditModal from './EditProfile/General'
import ProfileAddressEditModal from './EditProfile/Address'
import ProfileHobbyEditModal from './EditProfile/Hobby'
import ListingTypeEditModal from './EditListing/ListingType'
import Image from 'next/image'
import CloseIcon from '@/assets/icons/CloseIcon'

const CustomBackdrop: React.FC = () => {
  return <div className={styles['custom-backdrop']}></div>
}

const ModalManager: React.FC = () => {
  const dispatch = useDispatch()

  const { activeModal, closable } = useSelector((state: RootState) => state.modal)

  function handleClose() {
    dispatch(closeModal())
  }

  useEffect(() => {
    if (activeModal !== null) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [activeModal])

  return (
    <>
      <Modal
        slots={{ backdrop: CustomBackdrop }}
        open={Boolean(activeModal)}
        closeAfterTransition
        onClose={handleClose}
      >
        <Fade in={Boolean(activeModal)} exit={!Boolean(activeModal)}>
          <div className={styles['modal-wrapper']}>
            <main>
              {activeModal === 'auth' && <AuthModal />}
              {activeModal === 'email-verify' && <VerifyEmailModal />}
              {activeModal === 'user-onboarding' && <UserOnboardingModal />}

              {activeModal === 'profile-general-edit' && <ProfileGeneralEditModal />}
              {activeModal === 'profile-about-edit' && <ProfileAboutEditModal />}
              {activeModal === 'profile-address-edit' && <ProfileAddressEditModal />}
              {activeModal === 'profile-hobby-edit' && <ProfileHobbyEditModal />}

              {activeModal === 'listing-type-edit' && <ListingTypeEditModal />}

              {/* Modal Close Icon */}
              {closable && (
                <CloseIcon className={styles['modal-close-icon']} onClick={handleClose} />
              )}
            </main>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default ModalManager
