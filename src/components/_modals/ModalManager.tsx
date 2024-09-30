import {
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
  LegacyRef,
  MutableRefObject,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { AuthModal } from './AuthModal'
import { Dialog, Modal, Grow, Fade, useMediaQuery } from '@mui/material'
import { closeModal, openModal } from '@/redux/slices/modal'
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
import ListingCTAModal from './EditListing/ListingCTA'
import RelatedListingEditModal from './EditListing/ListingRelated/ListingRelated'
import RelatedListingRightEditModal from './EditListing/ListingRelatedRight/ListingRelatedRight'
import UploadVideoPage from './uploadVideoPage'
import UploadImagePage from './uploadImagePage'
import UploadVideoUser from './UploadVideoUser'
import SocialMediaEditModal from './EditProfile/SocialMedia/SocialMedia'
import ListingSocialMediaEditModal from './EditListing/ListingSocialMedia/ListingSocialMedia'
import ChangePasswordModal from './ChangePassword/ChangePassword'
import EmailForgetPassword from './EmailForgetPassword/EmailForgetPassword'
import EmailSentModal from './EmailSent/EmailSent'
import ResetPasswordModal from './ResetPassword/ResetPassword'
import ShareModal from './ShareModal/ShareModal'
import ClaimModal from './ClaimModal/ClaimModal'
import VerifyActionModal from './VerifyAction/VerifyAction'
import SetPasswordModal from './CreatePassword'
import ViewImageModal from './ViewImage'
import { ModalType } from '@/redux/slices/modal'
import SupportModal from './EditListing/ListingSupport'
import hobbycueLogo from '../../assets/svg/Search/hobbycue.svg'
import UserOnboardingWelcomeModal from './UserOnboardingWelcomeModal/UserOnboardingWelcomeModal.tsx'

import ExpiredPassword from './ExpiredPasswordModal'

import SimpleSnackbar from '../_snackbar/Snackbar'
import { types } from 'util'
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar'
import UserReport from './EditProfile/ReportUser'
import ListingReport from './EditListing/ListingReport'
import ContactToOwner from './EditListing/ListingContactOwner'
import ConfirmEmail from './ConfirmEmail/ConfirmEmail'
import ListingSupportModal from './EditListing/ListingSupport'
import SupportUserModal from './EditProfile/supportUser'
import AddHobby from './AddHobby/AddHobbyModal'
import ListingContactToOwner from './EditListing/ListingContactOwner'
import UserContactToOwner from './EditProfile/UserContactOwner'
import { PostModal } from './PostModal/PostModal'
import { setHasChanges } from '@/redux/slices/modal'
import { useRouter } from 'next/router'
import SaveModal from './SaveModal/saveModal'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { sendWelcomeMail } from '@/services/auth.service'
import { showProfileError, updateUser } from '@/redux/slices/user'
import ListingReview from './EditListing/ListingReview'
import ListingProductVariantsModal from './EditListing/ListingProductVariants'
import ListingProductPurchase from './ListingProductPurchase'
import HandleAdminAction from './AdminModals/ActionModal'
import AdminActionModal from './AdminModals/ActionModal'
import ListingAddEvent from './EditListing/ListingAddEvent'
import SimpleOnboarding from './EditProfile/SimpleOnboarding'
import ProductCategoryModal from './EditListing/ProductCategory/ProductCategory'
import HobbyAboutEditModal from './EditHobby/About'
import FBNoEmail from './FBNoEmail'

const CustomBackdrop: React.FC = () => {
  const { activeModal } = useSelector((state: RootState) => state.modal)

  // Always return a valid React element
  if (activeModal !== 'auth' && activeModal !== 'social-media-share') {
    return <div className={styles['custom-backdrop']}></div>
  } else {
    return <div className={styles['custom-backdrop-full']}></div>
  }
}

export interface SnackbarState {
  show: boolean
  message: string
  type: 'error' | 'success'
}

const ModalManager: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null)
  const modalWrapperRef = useRef<HTMLDivElement>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: '',
    type: 'success',
  })
  const [closeIconClicked, setCloseIconClicked] = useState<boolean>(false)
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const [showAddHobbyModal, setShowAddHobbyModal] = useState(false)
  const [showAddGenreModal, setShowAddGenreModal] = useState(false)
  const triggerSnackbar = (data: SnackbarState) => {
    setSnackbar(data)
  }

  const resetSnackbar = (data: SnackbarState) => {
    setSnackbar(data)
  }
  const router = useRouter()
  const dispatch = useDispatch()
  const [confirmationModal, setConfirmationModal] = useState(false)
  const { activeModal, closable, propData, hasChanges } = useSelector(
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
    'email-forget-password': closewithoutCfrm,
    'email-sent': closewithoutCfrm,
    'social-media-share': closewithoutCfrm,
    'Verify-ActionModal': closewithoutCfrm,
    'Set-PasswordModal': closewithoutCfrm,
  }

  function handleClose() {
    console.log('haschange', hasChanges)
    if (activeModal === 'user-onboarding-welcome') {
      localStorage.setItem('modal-shown-after-login', 'true')
      dispatch(closeModal())
    }
    if (
      ['View-Image-Modal', 'CopyProfileDataModal'].includes(String(activeModal))
    ) {
      dispatch(closeModal())
    } else if (confirmationModal) {
      setConfirmationModal(false)
    } else if (hasChanges && !confirmationModal) {
      setConfirmationModal(true)
    } else {
      dispatch(closeModal())
    }
  }

  function closeSnackbar() {
    setSnackbar({
      show: false,
      message: '',
      type: 'success',
    })
  }

  function closewithoutCfrm() {
    dispatch(closeModal())
  }

  const handleStatusChange = (isChanged: boolean) => {
    console.log('Manager isChange', isChanged)
    dispatch(setHasChanges(isChanged))
  }

  const activeCloseHandler =
    activeModal !== null
      ? specialCloseHandlers[activeModal] ?? handleClose
      : handleClose

  const IsOnboardingCompete = async () => {
    console.log('isOnboardingComplete clicked')
    if (user.is_onboarded) {
      return
    }
    const payload: sendWelcomeMailPayload = {
      to: user?.public_email,
      name: user.full_name,
    }

    const { err: error, res: response } = await getMyProfileDetail()

    if (response?.data?.data?.user?.completed_onboarding_steps.length === 3) {
      await sendWelcomeMail(payload)

      const data = { is_onboarded: true }
      const { err, res } = await updateMyProfileDetail(data)

      if (err) return console.log(err)
      if (res?.data.success) {
        dispatch(updateUser(res.data.data.user))
        dispatch(closeModal())
      }

      window.location.href = `/community`
    } else {
      if (activeModal !== 'profile-general-edit') {
        window.location.href = `/profile/${user.profile_url}`
        dispatch(showProfileError(true))
      }
    }
  }

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
    setCloseIconClicked(false)
  }, [activeModal])
  useEffect(() => {
    if (activeModal !== null) document.body.style.overflow = 'hidden'
    else
      setTimeout(() => {
        document.body.style.overflow = 'auto'
      }, 500)
  }, [activeModal])

  console.log('showaddhobby', showAddHobbyModal)

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (!showAddGenreModal && !showAddHobbyModal) {
        if (event.key === 'Escape') {
          if (activeModal === 'user-onboarding-welcome') {
            localStorage.setItem('modal-shown-after-login', 'true')
            dispatch(closeModal())
          }
          if (
            activeModal === 'user-onboarding' &&
            !user?.is_onboarded &&
            !hasChanges
          ) {
            window.location.href = `/profile/${user?.profile_url}`
            dispatch(showProfileError(true))
            dispatch(closeModal())
          }

          if (
            ['View-Image-Modal', 'CopyProfileDataModal'].includes(
              String(activeModal),
            )
          ) {
            dispatch(closeModal())
          }
          if (confirmationModal) {
            setConfirmationModal(false)
          } else if (hasChanges) {
            setConfirmationModal(true)
          } else if (isLoggedIn && !user.is_onboarded) {
            setConfirmationModal(true)
          } else {
            dispatch(closeModal())
          }
        }
      } else {
        if (
          activeModal === 'listing-hobby-edit' ||
          activeModal === 'profile-hobby-edit'
        ) {
          setShowAddHobbyModal(false)
          setShowAddGenreModal(false)
        }
      }
    },
    [
      hasChanges,
      confirmationModal,
      dispatch,
      activeModal,
      showAddGenreModal,
      showAddHobbyModal,
    ],
  )

  useEffect(() => {
    document.addEventListener('keydown', escFunction, { capture: true })
    return () => {
      document.removeEventListener('keydown', escFunction, { capture: true })
    }
  }, [escFunction])

  const handleBgClick = (event: any) => {
    if (!showAddGenreModal && !showAddHobbyModal) {
      if (
        event.target === mainRef.current ||
        event.target === modalWrapperRef.current
      ) {
        handleClose()
        setCloseIconClicked((prev) => !prev)
      }
    } else {
      if (mainRef.current && !mainRef.current.contains(event.target as Node)) {
        if (
          activeModal === 'listing-hobby-edit' ||
          activeModal === 'profile-hobby-edit'
        ) {
          setShowAddGenreModal(false)
          setShowAddHobbyModal(false)
        }
      }
    }
  }
  const props = {
    setConfirmationModal,
    confirmationModal,
    handleClose,
    onStatusChange: handleStatusChange,
    propData,
    showAddGenreModal,
    showAddHobbyModal,
    setShowAddGenreModal,
    setShowAddHobbyModal,
    CheckIsOnboarded: IsOnboardingCompete,
  }

  const viewImageProps = {
    handleClose,
  }

  const isMobile = useMediaQuery('(max-width:1100px)')

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
            ref={modalWrapperRef}
          >
            <main
              className={
                `${
                  !(activeModal === 'user-onboarding-welcome')
                    ? activeModal === 'create-post' ||
                      activeModal === 'update-post'
                      ? styles['create-post-postion']
                      : styles['pos-relative']
                    : ''
                }` +
                ` ${
                  (activeModal === 'add-event' || activeModal === 'auth') &&
                  styles['self-centre']
                }`
              }
              ref={mainRef}
            >
              {activeModal !== 'listing-onboarding' &&
                activeModal !== 'user-onboarding-welcome' &&
                activeModal !== 'add-event' &&
                activeModal !== 'auth' &&
                activeModal !== 'social-media-share' &&
                activeModal !== 'user-onboarding' && (
                  <>
                    <header className={styles['header']}>
                      <Image
                        className={styles['responsive-logo']}
                        src={hobbycueLogo}
                        alt="hobbycue"
                        height={40}
                        width={40}
                      />

                      <h2 className={styles['modal-heading']}>
                        {activeModal === 'SimpleOnboarding' &&
                          `Complete your User Profile`}
                      </h2>
                    </header>
                  </>
                )}
              {activeModal === 'FBNoEmail' && <FBNoEmail />}
              {activeModal === 'auth' && <AuthModal />}
              {activeModal === 'email-verify' && <VerifyEmailModal />}
              {activeModal === 'post' && <PostModal {...props} />}
              {activeModal === 'user-onboarding' && (
                <UserOnboardingModal {...props} />
              )}
              {activeModal === 'listing-onboarding' && (
                <ListingOnboardingModal {...props} />
              )}
              {activeModal === 'create-post' && (
                <CreatePost propData={propData} />
              )}
              {activeModal === 'update-post' && (
                <CreatePost propData={propData} />
              )}
              {activeModal === 'upload-image' && <UploadImageModal />}

              {activeModal === 'profile-general-edit' && (
                <ProfileGeneralEditModal {...props} />
              )}
              {activeModal === 'profile-about-edit' && (
                <ProfileAboutEditModal {...props} />
              )}
              {activeModal === 'Hobby-about-edit' && (
                <HobbyAboutEditModal {...props} />
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
              {activeModal === 'listing-cta-edit' && (
                <ListingCTAModal {...props} />
              )}
              {activeModal === 'listing-product-variants-edit' && (
                <ListingProductVariantsModal {...props} />
              )}
              {activeModal === 'listing-product-purchase' && (
                <ListingProductPurchase {...props} />
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
              {activeModal === 'ListingSupportModal' && (
                <ListingSupportModal {...props} />
              )}
              {activeModal === 'SupportUserModal' && (
                <SupportUserModal {...props} />
              )}
              {activeModal === 'UserReportModal' && <UserReport {...props} />}
              {activeModal === 'PostReportModal' && <UserReport {...props} />}
              {activeModal === 'ListingReportModal' && (
                <ListingReport {...props} />
              )}
              {activeModal === 'ListingReviewModal' && (
                <ListingReview {...props} />
              )}
              {activeModal === 'Listing-Contact-To-Owner' && (
                <ListingContactToOwner {...props} />
              )}
              {activeModal === 'User-Contact-To-Owner' && (
                <UserContactToOwner {...props} />
              )}
              {activeModal === 'save-Modal' && <SaveModal {...props} />}
              {activeModal === 'product-category' && (
                <ProductCategoryModal {...props} />
              )}

              {/* 
              On user-onboarding-welcome, UserOnboardingWelcomeModal is shown via navbar component for some functionalities
              */}

              {activeModal === 'user-onboarding-welcome' && (
                <UserOnboardingWelcomeModal />
              )}

              {activeModal === 'claim-listing' && (
                <ClaimModal setSnackbar={setSnackbar} />
              )}
              {activeModal === 'upload-video-page' && <UploadVideoPage />}
              {activeModal === 'upload-image-page' && <UploadImagePage />}
              {activeModal === 'upload-video-user' && <UploadVideoUser />}
              {activeModal === 'ExpiredPassword' && <ExpiredPassword />}
              {activeModal === 'social-media-edit' && (
                <SocialMediaEditModal {...props} />
              )}
              {activeModal === 'change-password' && <ChangePasswordModal />}

              {activeModal === 'email-forget-password' && (
                <EmailForgetPassword />
              )}
              {activeModal === 'confirm-email' && <ConfirmEmail />}
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
              {activeModal === 'View-Image-Modal' && (
                <ViewImageModal {...viewImageProps} />
              )}

              {activeModal === 'HandleAdminAction' && (
                <AdminActionModal {...propData} />
              )}
              {activeModal === 'SimpleOnboarding' && (
                <SimpleOnboarding {...props} />
              )}
              {activeModal === 'add-event' && <ListingAddEvent {...propData} />}
              {/* Modal Close Icon */}
              {closable &&
                activeModal !== 'auth' &&
                activeModal !== 'social-media-share' &&
                activeModal !== 'user-onboarding-welcome' &&
                activeModal !== 'add-event' &&
                !showAddGenreModal &&
                !showAddHobbyModal && (
                  <CloseIcon
                    className={
                      styles['modal-close-icon'] +
                      ` ${closeIconClicked ? styles['close-icon-clicked'] : ''}`
                    }
                    onClick={() => {
                      activeCloseHandler()
                      setCloseIconClicked((prev) => !prev)
                    }}
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
      {/* <SimpleSnackbar
        triggerOpen={snackbar.show}
        message={snackbar.message}
        resetSnackbar={resetSnackbar}
        textColor="#7f63a1"
        bgColor="#ffffff"
      /> */}
      <CustomSnackbar
        triggerOpen={snackbar.show}
        message={snackbar.message ?? 'Link Copied'}
        type={snackbar.type}
        closeSnackbar={closeSnackbar}
      />
    </>
  )
}

export default ModalManager
