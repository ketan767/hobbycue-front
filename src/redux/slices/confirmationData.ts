import { createSlice } from '@reduxjs/toolkit'

interface ConfirmationDataType {
  croppedImage: string
}
const initialState: ConfirmationDataType = {
  croppedImage: '',
}

export const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    setCroppedImage(state, action: { payload: string }) {
      state.croppedImage = action.payload
    },
  },
})

export const { setCroppedImage } = confirmationSlice.actions
export default confirmationSlice.reducer
