import { useCallback, useEffect, useState } from 'react'
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
import ShareModal from './ShareModal/ShareModal'
import FilledButton from '../_buttons/FilledButton'
import OutlinedButton from '../_buttons/OutlinedButton'

const CustomBackdrop: React.FC = () => {
  return <div className={styles['custom-backdrop']}></div>
}

const ModalManager: React.FC = () => {
  const dispatch = useDispatch()
  const [confirmationModal, setConfirmationModal] = useState(false)
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

  const escFunction = useCallback((event: any) => {
    if (event.key === 'Escape') {
      handleClose()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [escFunction])

  const handleBgClick = (event: any) => {
    // event.preventDefault()
    if (event.target === event.currentTarget) {
      setConfirmationModal(true)
    }
  }

  return (
    <>
      <Modal
        slots={{ backdrop: CustomBackdrop }}
        open={Boolean(activeModal)}
        closeAfterTransition
        onClose={handleClose}
      >
        <Fade
          in={Boolean(activeModal)}
          exit={!Boolean(activeModal)}
          onClick={handleBgClick}
        >
          <div
            className={`${styles['modal-wrapper']} ${
              confirmationModal ? styles['in-active'] : ''
            }  `}
          >
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
              {activeModal === 'social-media-share' && <ShareModal />}

              {/* Modal Close Icon */}
              {closable && (
                <CloseIcon
                  className={styles['modal-close-icon']}
                  onClick={handleClose}
                />
              )}
            </main>
            {confirmationModal && (
              <div className={`${styles['confirmation-modal']}`}>
                <div className={styles['confirmation-modal-body']}>
                  <p> Are you sure you want to close the modal ? </p>
                  <div className={styles['buttons']}>
                    <FilledButton
                      onClick={() => {
                        handleClose()
                        setConfirmationModal(false)
                      }}
                    >
                      Yes
                    </FilledButton>
                    <OutlinedButton onClick={() => setConfirmationModal(false)}>
                      No
                    </OutlinedButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Fade>
      </Modal>
    </>
  )
}

export default ModalManager
