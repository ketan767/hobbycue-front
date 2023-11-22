import { useContext, useCallback, useEffect, useState } from 'react'
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
import ListingCopyModal from './EditListing/ListingCopyModal'
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
import ClaimModal from './ClaimModal/ClaimModal'
import VerifyActionModal from './VerifyAction/VerifyAction'
import SetPasswordModal from './CreatePassword'
import { ModalType } from '@/redux/slices/modal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SimpleSnackbar from '../_snackbar/Snackbar'
import { types } from 'util'

const CustomBackdrop: React.FC = () => {
  return <div className={styles['custom-backdrop']}></div>
}
export interface SnackbarState {
  show: boolean
  message: string
}

const ModalManager: React.FC = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: '',
  })

  const triggerSnackbar = (data: SnackbarState) => {
    setSnackbar(data)
  }

  const resetSnackbar = (data: SnackbarState) => {
    setSnackbar(data)
  }

  const dispatch = useDispatch()
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { activeModal, closable } = useSelector(
    (state: RootState) => state.modal,
  )
  const specialCloseHandlers: Partial<{
    [key in Exclude<ModalType, null>]: () => void
  }> = {
    auth: closewithoutCfrm,
    'email-verify': closewithoutCfrm,
    'reset-password': closewithoutCfrm,
    'upload-video-page': closewithoutCfrm,
    'upload-image-page': closewithoutCfrm,
    'upload-video-user': closewithoutCfrm,
    'change-password': closewithoutCfrm,
    'confirm-email': closewithoutCfrm,
    'email-sent': closewithoutCfrm,
    'social-media-share': closewithoutCfrm,
    'Verify-ActionModal': closewithoutCfrm,
    'Set-PasswordModal': closewithoutCfrm,
  }

  function handleClose() {
    if (confirmationModal) {
      setConfirmationModal(false)
    } else if (hasChanges) {
      setConfirmationModal(true)
    } else {
      dispatch(closeModal())
    }
  }

  function closewithoutCfrm() {
    dispatch(closeModal())
  }

  const handleStatusChange = (isChanged: boolean) => {
    setHasChanges(isChanged)
  }

  const activeCloseHandler =
    activeModal !== null
      ? specialCloseHandlers[activeModal] ?? handleClose
      : handleClose

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    const navbar = document.querySelector('.navbar-wrappper') as HTMLElement

    if (activeModal !== null) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`

      if (navbar && getComputedStyle(navbar).position === 'sticky') {
        navbar.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      setTimeout(() => {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''

        if (navbar) {
          navbar.style.paddingRight = ''
        }
      }, 500)
    }
  }, [activeModal])

  useEffect(() => {
    if (activeModal !== null) document.body.style.overflow = 'hidden'
    else
      setTimeout(() => {
        document.body.style.overflow = 'auto'
      }, 500)
  }, [activeModal])

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (confirmationModal) {
          setConfirmationModal(false)
        } else if (hasChanges) {
          setConfirmationModal(true)
        } else {
          dispatch(closeModal())
        }
      }
    },
    [hasChanges, confirmationModal, dispatch],
  )

  useEffect(() => {
    document.addEventListener('keydown', escFunction, { capture: true })
    return () => {
      document.removeEventListener('keydown', escFunction, { capture: true })
    }
  }, [escFunction])

  const handleBgClick = (event: any) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }
  const props = {
    setConfirmationModal,
    confirmationModal,
    handleClose,
    onStatusChange: handleStatusChange,
  }

  return (
    <>
      <Modal
        disableEscapeKeyDown
        slots={{ backdrop: CustomBackdrop }}
        open={Boolean(activeModal)}
        closeAfterTransition
        onClose={() => setConfirmationModal(true)}
      >
        <Fade
          in={Boolean(activeModal)}
          exit={!Boolean(activeModal)}
          onClick={handleBgClick}
        >
          <div
            className={`${styles['modal-wrapper']} ${
              confirmationModal ? styles['ins-active'] : ''
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
                <ProfileGeneralEditModal {...props} />
              )}
              {activeModal === 'profile-about-edit' && (
                <ProfileAboutEditModal {...props} />
              )}
              {activeModal === 'profile-address-edit' && (
                <ProfileAddressEditModal {...props} />
              )}
              {activeModal === 'profile-hobby-edit' && (
                <ProfileHobbyEditModal {...props} />
              )}
              {activeModal === 'profile-contact-edit' && (
                <ProfileContactEditModal {...props} />
              )}
              {activeModal === 'CopyProfileDataModal' && <ListingCopyModal />}

              {activeModal === 'listing-type-edit' && (
                <ListingTypeEditModal {...props} />
              )}

              {activeModal === 'listing-tags-edit' && (
                <ListingTagsEditModal {...props} />
              )}
              {activeModal === 'listing-general-edit' && (
                <ListingGeneralEditModal {...props} />
              )}
              {activeModal === 'listing-about-edit' && (
                <ListingAboutEditModal {...props} />
              )}
              {activeModal === 'listing-working-hours-edit' && (
                <ListingWorkingHoursEditModal {...props} />
              )}
              {activeModal === 'listing-event-hours-edit' && (
                <ListingEventHoursEditModal {...props} />
              )}
              {activeModal === 'listing-contact-edit' && (
                <ListingContactEditModal {...props} />
              )}
              {activeModal === 'listing-address-edit' && (
                <ListingAddressEditModal {...props} />
              )}
              {activeModal === 'listing-hobby-edit' && (
                <ListingHobbyEditModal {...props} />
              )}
              {activeModal === 'related-listing-left-edit' && (
                <RelatedListingEditModal {...props} />
              )}
              {activeModal === 'related-listing-right-edit' && (
                <RelatedListingRightEditModal {...props} />
              )}
              {activeModal === 'listing-social-media-edit' && (
                <ListingSocialMediaEditModal {...props} />
              )}

              {activeModal === 'claim-listing' && <ClaimModal />}
              {activeModal === 'upload-video-page' && <UploadVideoPage />}
              {activeModal === 'upload-image-page' && <UploadImagePage />}
              {activeModal === 'upload-video-user' && <UploadVideoUser />}
              {activeModal === 'social-media-edit' && (
                <SocialMediaEditModal {...props} />
              )}
              {activeModal === 'change-password' && <ChangePasswordModal />}

              {activeModal === 'confirm-email' && <ConfirmEmailModal />}
              {activeModal === 'email-sent' && <EmailSentModal />}
              {activeModal === 'reset-password' && <ResetPasswordModal />}
              {activeModal === 'social-media-share' && (
                <ShareModal triggerSnackbar={triggerSnackbar} />
              )}
              {activeModal === 'add-location' && (
                <ProfileAddressEditModal
                  addLocation={true}
                  title={'Add New Location'}
                  {...props}
                />
              )}
              {activeModal === 'user-address-edit' && (
                <ProfileAddressEditModal
                  title="Edit Location"
                  editLocation={true}
                  {...props}
                />
              )}
              {activeModal === 'Verify-ActionModal' && <VerifyActionModal />}
              {activeModal === 'Set-PasswordModal' && <SetPasswordModal />}
              {/* Modal Close Icon */}
              {closable && (
                <CloseIcon
                  className={styles['modal-close-icon']}
                  onClick={activeCloseHandler}
                />
              )}
            </main>
            {/* {confirmationModal && (
              <div className={`${styles['confirmation-modal']}`}>
                <div className={styles['confirmation-modal-body']}>
                  <p> Would you like to save before exit ? </p>
                  <div className={styles['buttons']}>
                    <FilledButton
                      className={styles['button1']}
                      onClick={() => {
                        handleClose()
                        setConfirmationModal(false)
                        // window.location.reload()
                      }}
                    >
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
            )} */}
          </div>
        </Fade>
      </Modal>
      <SimpleSnackbar
        triggerOpen={snackbar.show}
        message={snackbar.message}
        resetSnackbar={resetSnackbar}
        textColor="#7f63a1"
        bgColor="#ffffff"
      />
    </>
  )
}

export default ModalManager
