import { createSlice } from '@reduxjs/toolkit'

export interface FormValues {
  hobby: string
  genre: string
  keywords: string
  author: string
  status: string
  startDate: string
  endDate: string
  title: string
  tagline: string
  search: string
}

interface BlogState {
  blog: any
  refetch: number
  preview: boolean
  isEditing: boolean
  formValues: FormValues
}

export const initialFormValues: FormValues = {
  hobby: '',
  genre: '',
  keywords: '',
  author: '',
  status: '',
  startDate: 'Start Date',
  endDate: 'End Date',
  search: '',
  title: '',
  tagline: '',
}

const initialState: BlogState = {
  blog: {},
  refetch: 0,
  preview: false,
  isEditing: false,
  formValues: initialFormValues,
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
    setIsEditing: (state, action) => {
      state.isEditing = action.payload
    },
    setFormValues: (state, action) => {
      state.formValues = action.payload
    },
  },
})

export const { setBlog, setRefetch, setPreview, setIsEditing, setFormValues } =
  blogSlice.actions

export default blogSlice.reducer
