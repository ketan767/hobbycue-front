import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType = null | 'auth' | 'email-verify' | 'user-onboarding'

interface ModalState {
  activeModal: ModalType
  closable: boolean
  authModalData: { email: string; password: string; rememberMe: boolean }
}

const initialState: ModalState = {
  activeModal: null,
  closable: true,
  authModalData: {
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
    },
    updateAuthModalData(state, { payload }) {
      state.authModalData = payload
    },
    resetAuthModalData(state) {
      state.authModalData = { email: '', password: '', rememberMe: false }
    },
  },
})

export const { openModal, closeModal, updateAuthModalData, resetAuthModalData } = modalSlice.actions

export default modalSlice.reducer
