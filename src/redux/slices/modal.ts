import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType = null | 'auth' | 'email-verify' | 'user-onboarding'

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
