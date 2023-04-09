import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: Boolean
  isLoggedIn: Boolean
  isRegistered: Boolean
}

const initialState: AuthState = {
  isAuthenticated: true,
  isLoggedIn: true,
  isRegistered: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuth: (state, { payload }) => {
      state.isAuthenticated = payload
    },
    updateIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload
    },
    updateIsRegistered: (state, { payload }) => {
      state.isRegistered = payload
    },
  },
})

export const { updateAuth, updateIsLoggedIn, updateIsRegistered } = authSlice.actions

export default authSlice.reducer
