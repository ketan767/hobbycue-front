import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  ProfileTab: 'Home' | 'Posts' | 'Media' | 'Pages' | 'Blogs'
}

const initialState: AuthState = {
  ProfileTab: 'Home',
}

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {},
})

export const {} = siteSlice.actions

export default siteSlice.reducer
