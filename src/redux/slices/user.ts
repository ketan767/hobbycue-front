import { getMyProfileDetail } from '@/services/user.service'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  isUserDataLoaded: boolean
  isLoggedIn: Boolean
  isAuthenticated: Boolean
  profileData: any
  user: any
  listing: any
  activeProfile: {
    type: 'user' | 'listing'
    data: any
  }
  addressToEdit: any
  showProfileError: Boolean,
  CurrentUrl: String
  linkviaAuth: string
}

const initialState: AuthState = {
  isUserDataLoaded: false,
  isLoggedIn: false,
  isAuthenticated: false,
  user: {},
  profileData:{},
  listing: [],
  activeProfile: {
    type: 'user',
    data: null,
  },
  addressToEdit: null,
  showProfileError: false,
  CurrentUrl: '',
  linkviaAuth:''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateIsUserDataLoaded: (state, action) => {
      state.isUserDataLoaded = action.payload
    },
    updateIsAuthenticated: (state, { payload }) => {
      state.isAuthenticated = payload
    },
    updateIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload
    },
    updateUser: (state, { payload }) => {
      state.user = payload
    },
    updateProfileData: (state, { payload }) => {
      state.profileData = payload
    },
    updateUserListing: (state, { payload }) => {
      state.listing = payload
    },
    updateAddressToEdit: (state, { payload }) => {
      state.addressToEdit = payload
    },
    updateActiveProfile: (
      state,
      { payload }: PayloadAction<{ type: 'user' | 'listing'; data: any }>,
    ) => {
      state.activeProfile = { type: payload.type, data: payload.data }

      const data: LocalStorageActiveProfile = {
        type: payload.type,
        id: payload.data?._id,
      }
      localStorage.setItem('active_profile', JSON.stringify(data))
    },
    showProfileError(state, action: PayloadAction<boolean>) {
      state.showProfileError = action.payload;
    },
    UpdateCurrentUrl(state, action: PayloadAction<string>) {
      state.CurrentUrl = action.payload;
    },
    SetLinkviaAuth(state, action: PayloadAction<string>) {
      state.linkviaAuth = action.payload;
    },
  },
})

export const {
  updateIsUserDataLoaded,
  updateIsAuthenticated,
  updateIsLoggedIn,
  updateUser,
  updateActiveProfile,
  updateUserListing,
  updateAddressToEdit,
  updateProfileData,
  showProfileError,
  UpdateCurrentUrl,
  SetLinkviaAuth,
} = authSlice.actions

export default authSlice.reducer
