import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType = null | 'auth' | 'email-verify' | 'user-onboarding'

interface ModalState {
  activeModal: ModalType
}

const initialState: ModalState = {
  activeModal: 'user-onboarding',
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalType>) {
      state.activeModal = action.payload
    },
    closeModal(state) {
      state.activeModal = null
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
