import { createSlice } from '@reduxjs/toolkit'

interface BlogState {
  allBlogs: object[]
  allCategories: object[]
  allTags: object[]
  filterCategoryId: null | string
  filterTagsId: string[]
}

const initialState: BlogState = {
  allBlogs: [],
  allCategories: [],
  allTags: [],
  filterCategoryId: null,
  filterTagsId: [],
}

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    updateBlogs: (state, { payload }) => {
      state.allBlogs = payload
    },
    updateBlogCategories: (state, { payload }) => {
      state.allCategories = payload
    },
    updateBlogTags: (state, { payload }) => {
      state.allTags = payload
    },
    updateFilterCategoryId: (state, { payload }) => {
      state.filterCategoryId = payload
    },
    addFilterTagId: (state, { payload }) => {
      state.filterTagsId = state.filterTagsId.concat(payload)
    },
    removeFilterTagId: (state, { payload }) => {
      state.filterTagsId = state.filterTagsId.filter((id) => id !== payload)
    },
  },
})

export const {
  updateBlogs,
  updateBlogCategories,
  updateBlogTags,
  updateFilterCategoryId,
  addFilterTagId,
  removeFilterTagId,
} = blogsSlice.actions
export default blogsSlice.reducer
