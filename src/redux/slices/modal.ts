import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType =
  | null
  | 'auth'
  | 'email-verify'
  | 'user-onboarding'
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

interface ModalState {
  activeModal: ModalType
  closable: boolean
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
    openModal(state, action: PayloadAction<{ type: ModalType; closable: boolean }>) {
      state.activeModal = action.payload.type
      state.closable = action.payload.closable
    },
    closeModal(state) {
      state.activeModal = null
      state.closable = true
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
