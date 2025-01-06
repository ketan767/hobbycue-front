import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType =
  | null
  | 'BlogFilterMobileModal'
  | 'blogPublish'
  | 'post'
  | 'auth'
  | 'add-hobby'
  | 'email-verify'
  | 'user-onboarding'
  | 'listing-onboarding'
  | 'create-post'
  | 'update-post'
  | 'upload-image'
  | 'profile-general-edit'
  | 'profile-about-edit'
  | 'profile-address-edit'
  | 'profile-hobby-edit'
  | 'profile-contact-edit'
  | 'listing-type-edit'
  | 'listing-general-edit'
  | 'listing-about-edit'
  | 'listing-cta-edit'
  | 'listing-product-variants-edit'
  | 'listing-product-purchase'
  | 'listing-working-hours-edit'
  | 'listing-event-hours-edit'
  | 'listing-address-edit'
  | 'listing-hobby-edit'
  | 'listing-contact-edit'
  | 'listing-tags-edit'
  | 'listing-social-media-edit'
  | 'related-listing-left-edit'
  | 'related-listing-right-edit'
  | 'upload-video-page'
  | 'upload-image-page'
  | 'upload-video-user'
  | 'upload-image-user'
  | 'social-media-edit'
  | 'change-password'
  | 'email-forget-password'
  | 'confirm-email'
  | 'email-sent'
  | 'reset-password'
  | 'social-media-share'
  | 'claim-listing'
  | 'add-location'
  | 'user-address-edit'
  | 'CopyProfileDataModal'
  | 'Verify-ActionModal'
  | 'Set-PasswordModal'
  | 'View-Image-Modal'
  | 'user-onboarding-welcome'
  | 'ExpiredPassword'
  | 'ListingSupportModal'
  | 'SupportUserModal'
  | 'UserReportModal'
  | 'ListingReportModal'
  | 'ListingReviewModal'
  | 'Listing-Contact-To-Owner'
  | 'User-Contact-To-Owner'
  | 'add-genre'
  | 'save-Modal'
  | 'HandleAdminAction'
  | 'add-event'
  | 'SimpleOnboarding'
  | 'product-category'
  | 'Hobby-about-edit'
  | 'PostReportModal'
  | "FBNoEmail"


  interface ModalState {
    activeModal: ModalType
    closable: boolean
    onModalClose?: (() => void) | null
    authFormData: { email: string; password: string; rememberMe: boolean }
    forgotPasswordEmail: string
    shareUrl: string
    onVerify?: (() => void) | null
    verified?: boolean
    imageUrl: string
    propData?:any
    hasChanges?:boolean
  }
  
  const initialState: ModalState = {
    activeModal: null,
    closable: true,
    imageUrl: '',
    authFormData: {
      email: '',
      password: '',
      rememberMe: false,
    },
    forgotPasswordEmail: "",
    shareUrl: '',
    onVerify: null,
    verified: false,
    propData:{},
    hasChanges:false
  }
  
  const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      openModal(
        state,
        action: PayloadAction<{
          type: ModalType;
          closable: boolean;
          onModalClose?: () => void;
          onVerify?: () => void;
          imageurl?: string | undefined
          propData?:any
          modalType?: any
          description?:any

        }>
      ) {
        state.activeModal = action.payload.type
        state.closable = action.payload.closable
        state.onModalClose = action.payload.onModalClose
        state.onVerify = action.payload.onVerify
        state.verified = false
        state.imageUrl = action.payload.imageurl || '';
        state.propData=action.payload.propData
      },
      setVerified(state, action: PayloadAction<boolean>) {
        state.verified = action.payload
        if (state.verified && state.onVerify) {
          state.onVerify()
        }
      },
      closeModal(state) {
        state.activeModal = null
        state.closable = true
        state.onVerify = null
        if (state.onModalClose) {
          state.onModalClose()
        }
      },
      updateImageUrl(state, action: PayloadAction<string>) {
        state.imageUrl = action.payload;
      },
      updateAuthFormData(state, { payload }) {
        state.authFormData = payload
      },
      resetAuthFormData(state) {
        state.authFormData = { email: '', password: '', rememberMe: false }
      },
      updateForgotPasswordEmail(state, { payload }) {
        state.forgotPasswordEmail = payload
      },
      updateShareUrl(state, { payload }) {
        state.shareUrl = payload
      },
      setHasChanges(state, action:PayloadAction<boolean>){
        state.hasChanges = action.payload;
      }
    },
  })
  
  export const {
    openModal,
    closeModal,
    updateAuthFormData,
    resetAuthFormData,
    updateForgotPasswordEmail,
    updateShareUrl,
    setVerified,
    updateImageUrl,
    setHasChanges
  } = modalSlice.actions
  
  export default modalSlice.reducer