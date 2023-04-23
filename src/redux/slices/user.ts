import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: Boolean
  isLoggedIn: Boolean
  isRegistered: Boolean
  userDetail: any
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoggedIn: false,
  isRegistered: false,
  userDetail: {},
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateIsAuthenticated: (state, { payload }) => {
      state.isAuthenticated = payload
    },
    updateIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload
    },
    updateIsRegistered: (state, { payload }) => {
      state.isRegistered = payload
    },
    updateUserDetail: (state, { payload }) => {
      state.userDetail = payload
    },
  },
})

export const { updateIsAuthenticated, updateIsLoggedIn, updateIsRegistered, updateUserDetail } =
  authSlice.actions

export default authSlice.reducer
