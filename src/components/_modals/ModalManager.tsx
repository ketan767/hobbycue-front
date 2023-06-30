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
import ListingAboutEditModal from './EditListing/ListingAbout'
import { ListingOnboardingModal } from './ListingOnboardingModal'
import { CreatePost } from './CreatePost'
import ListingGeneralEditModal from './EditListing/ListingGeneral'
import ListingContactEditModal from './EditListing/ListingContact'
import ListingAddressEditModal from './EditListing/ListingAddress'
import ListingHobbyEditModal from './EditListing/ListingHobby'
import { UploadImageModal } from './UploadImageModal'
import ProfileContactEditModal from './EditProfile/ProfileContact'
import ListingTagsEditModal from './EditListing/ListingTag/ListingTag'
import ListingWorkingHoursEditModal from './EditListing/ListingWorkingHours'
import ListingEventHoursEditModal from './EditListing/ListingEventHours'
import RelatedListingEditModal from './EditListing/ListingRelated/ListingRelated'
import RelatedListingRightEditModal from './EditListing/ListingRelatedRight/ListingRelatedRight'
import UploadVideoPage from './uploadVideoPage'
import UploadImagePage from './uploadImagePage'
import UploadVideoUser from './UploadVideoUser'
import SocialMediaEditModal from './EditProfile/SocialMedia/SocialMedia'
import ListingSocialMediaEditModal from './EditListing/ListingSocialMedia/ListingSocialMedia'
import ChangePasswordModal from './ChangePassword/ChangePassword'
import ConfirmEmailModal from './ConfirmEmail/ConfirmEmail'
import EmailSentModal from './EmailSent/EmailSent'
import ResetPasswordModal from './ResetPassword/ResetPassword'

const CustomBackdrop: React.FC = () => {
  return <div className={styles['custom-backdrop']}></div>
}

const ModalManager: React.FC = () => {
  const dispatch = useDispatch()

  const { activeModal, closable } = useSelector(
    (state: RootState) => state.modal,
  )

  function handleClose() {
    dispatch(closeModal())
  }

  useEffect(() => {
    if (activeModal !== null) document.body.style.overflow = 'hidden'
    else
      setTimeout(() => {
        document.body.style.overflow = 'auto'
      }, 500)
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
              {activeModal === 'listing-onboarding' && (
                <ListingOnboardingModal />
              )}

              {activeModal === 'create-post' && <CreatePost />}
              {activeModal === 'upload-image' && <UploadImageModal />}

              {activeModal === 'profile-general-edit' && (
                <ProfileGeneralEditModal />
              )}
              {activeModal === 'profile-about-edit' && (
                <ProfileAboutEditModal />
              )}
              {activeModal === 'profile-address-edit' && (
                <ProfileAddressEditModal />
              )}
              {activeModal === 'profile-hobby-edit' && (
                <ProfileHobbyEditModal />
              )}
              {activeModal === 'profile-contact-edit' && (
                <ProfileContactEditModal />
              )}

              {activeModal === 'listing-type-edit' && <ListingTypeEditModal />}
              {activeModal === 'listing-tags-edit' && <ListingTagsEditModal />}
              {activeModal === 'listing-general-edit' && (
                <ListingGeneralEditModal />
              )}
              {activeModal === 'listing-about-edit' && (
                <ListingAboutEditModal />
              )}
              {activeModal === 'listing-working-hours-edit' && (
                <ListingWorkingHoursEditModal />
              )}
              {activeModal === 'listing-event-hours-edit' && (
                <ListingEventHoursEditModal />
              )}
              {activeModal === 'listing-contact-edit' && (
                <ListingContactEditModal />
              )}
              {activeModal === 'listing-address-edit' && (
                <ListingAddressEditModal />
              )}
              {activeModal === 'listing-hobby-edit' && (
                <ListingHobbyEditModal />
              )}
              {activeModal === 'related-listing-left-edit' && (
                <RelatedListingEditModal />
              )}
              {activeModal === 'related-listing-right-edit' && (
                <RelatedListingRightEditModal />
              )}
              {activeModal === 'listing-social-media-edit' && (
                <ListingSocialMediaEditModal />
              )}
              {activeModal === 'upload-video-page' && <UploadVideoPage />}
              {activeModal === 'upload-image-page' && <UploadImagePage />}
              {activeModal === 'upload-video-user' && <UploadVideoUser />}
              {activeModal === 'social-media-edit' && <SocialMediaEditModal />}
              {activeModal === 'change-password' && <ChangePasswordModal />}

              {activeModal === 'confirm-email' && <ConfirmEmailModal />}
              {activeModal === 'email-sent' && <EmailSentModal />}
              {activeModal === 'reset-password' && <ResetPasswordModal />}

              {/* Modal Close Icon */}
              {closable && (
                <CloseIcon
                  className={styles['modal-close-icon']}
                  onClick={handleClose}
                />
              )}
            </main>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default ModalManager
