import { getMyProfileDetail } from '@/services/user.service'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isLoggedIn: Boolean
  isAuthenticated: Boolean
  user: any
  listing: any
  activeProfile: {
    type: 'user' | 'listing'
    data: any
  }
}

const initialState: AuthState = {
  isLoggedIn: false,
  isAuthenticated: false,
  user: {},
  listing: [],
  activeProfile: {
    type: 'user',
    data: null,
  },
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
    updateActiveProfile: (
      state,
      { payload }: PayloadAction<{ type: 'user' | 'listing'; data: any }>,
    ) => {
      state.activeProfile = {
        type: payload.type,
        data: payload.data,
      }
    },
  },
})

export const { updateIsAuthenticated, updateIsLoggedIn, updateUser, updateActiveProfile } =
  authSlice.actions

export default authSlice.reducer
