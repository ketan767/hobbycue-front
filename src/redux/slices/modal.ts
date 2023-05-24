import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType =
  | null
  | 'auth'
  | 'email-verify'
  | 'user-onboarding'
  | 'listing-onboarding'
  | 'create-post'
  | 'upload-image'
  | 'profile-general-edit'
  | 'profile-about-edit'
  | 'profile-address-edit'
  | 'profile-hobby-edit'
  | 'profile-contact-edit'
  | 'listing-type-edit'
  | 'listing-general-edit'
  | 'listing-about-edit'
  | 'listing-address-edit'
  | 'listing-hobby-edit'
  | 'listing-contact-edit'
  | 'listing-tags-edit'

interface ModalState {
  activeModal: ModalType
  closable: boolean
  onModalClose?: (() => void) | null
  authFormData: { email: string; password: string; rememberMe: boolean }
}

const initialState: ModalState = {
  activeModal: null,
  closable: true,
  authFormData: {
    email: '',
    password: '',
    rememberMe: false,
  },
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(
      state,
      action: PayloadAction<{ type: ModalType; closable: boolean; onModalClose?: () => void }>,
    ) {
      state.activeModal = action.payload.type
      state.closable = action.payload.closable
      state.onModalClose = action.payload.onModalClose
    },
    closeModal(state) {
      state.activeModal = null
      state.closable = true
      if (state.onModalClose) {
        state.onModalClose()
        state.onModalClose = null
      }
    },
    updateAuthFormData(state, { payload }) {
      state.authFormData = payload
    },
    resetAuthFormData(state) {
      state.authFormData = { email: '', password: '', rememberMe: false }
    },
  },
})

export const { openModal, closeModal, updateAuthFormData, resetAuthFormData } = modalSlice.actions

export default modalSlice.reducer
