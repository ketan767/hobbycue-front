import { createSlice } from '@reduxjs/toolkit'

interface BlogState {
  blog: any
  refetch: number
  preview: boolean
}

const initialState: BlogState = {
  blog: {},
  refetch: 0,
  preview: false,
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlog: (state, action) => {
      state.blog = action.payload
    },
    setRefetch: (state, action) => {
      state.refetch = action.payload
    },
    setPreview: (state, action) => {
      state.preview = action.payload
    },
  },
})

export const { setBlog, setRefetch, setPreview } = blogSlice.actions

export default blogSlice.reducer
