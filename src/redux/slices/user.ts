import { getMyProfileDetail } from '@/services/user.service'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
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
    updateUserListing: (state, { payload }) => {
      state.listing = payload
    },
    updateActiveProfile: (
      state,
      { payload }: PayloadAction<{ type: 'user' | 'listing'; data: any }>,
    ) => {
      state.activeProfile = { type: payload.type, data: payload.data }

      const data: LocalStorageActiveProfile = { type: payload.type, id: payload.data._id }
      localStorage.setItem('active_profile', JSON.stringify(data))
    },
  },
})

export const {
  updateIsAuthenticated,
  updateIsLoggedIn,
  updateUser,
  updateActiveProfile,
  updateUserListing,
} = authSlice.actions

export default authSlice.reducer
