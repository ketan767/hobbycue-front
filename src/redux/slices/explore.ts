import { createSlice } from '@reduxjs/toolkit'

interface SearchFields {
  name: string
  keyword: string
  hobby: string
  category: string
  sub_category: string
  location: string
  isSearching: boolean
}

const initialState: SearchFields = {
  name: '',
  keyword: '',
  hobby: '',
  category: '',
  sub_category: '',
  location: '',
  isSearching: false,
}

export const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setName: (state, action: { payload: string }) => {
      state.name = action.payload
    },
    setKeyword: (state, action: { payload: string }) => {
      state.keyword = action.payload
    },
    setHobby: (state, action: { payload: string }) => {
      state.hobby = action.payload
    },
    setCategory: (state, action: { payload: string }) => {
      state.category = action.payload
    },
    setSub_category: (state, action: { payload: string }) => {
      state.sub_category = action.payload
    },
    setLocation: (state, action: { payload: string }) => {
      state.location = action.payload
    },
    setSearching: (state, action: { payload: boolean }) => {
      state.isSearching = action.payload
    },
  },
})

export const {
  setName,
  setKeyword,
  setHobby,
  setCategory,
  setSub_category,
  setLocation,
  setSearching,
} = exploreSlice.actions
export default exploreSlice.reducer
