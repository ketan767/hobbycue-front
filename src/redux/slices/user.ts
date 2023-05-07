import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isLoggedIn: Boolean
  isAuthenticated: Boolean
  user: any
  listings: any
}

const initialState: AuthState = {
  isLoggedIn: false,
  isAuthenticated: false,
  user: {},
  listings: [],
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
    updateUser: (state, { payload }) => {
      state.user = payload
    },
  },
})

export const { updateIsAuthenticated, updateIsLoggedIn, updateUser } = authSlice.actions

export default authSlice.reducer
