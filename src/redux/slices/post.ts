import { createSlice } from '@reduxjs/toolkit'

interface PostState {
  allPosts: object[]
  allPages: object[]
  loading: boolean,
  pagesLoading: boolean
}

const initialState: PostState = {
  allPosts: [],
  allPages: [],
  loading: false,
  pagesLoading: false
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePosts: (state, { payload }) => {
      state.allPosts = payload
    },
    updatePages: (state, { payload }) => {
      state.allPages = payload
    },
    updateLoading: (state, { payload }) => {
      state.loading = payload
    },
    updatePagesLoading: (state, { payload }) => {
      state.pagesLoading = payload
    },
    // updateBlogCategories: (state, { payload }) => {
    //   state.allCategories = payload
    // },
    // updateBlogTags: (state, { payload }) => {
    //   state.allTags = payload
    // },
    // updateFilterCategoryId: (state, { payload }) => {
    //   state.filterCategoryId = payload
    // },
    // addFilterTagId: (state, { payload }) => {
    //   state.filterTagsId = state.filterTagsId.concat(payload)
    // },
    // removeFilterTagId: (state, { payload }) => {
    //   state.filterTagsId = state.filterTagsId.filter((id) => id !== payload)
    // },
  },
})

export const { updatePosts, updatePages, updateLoading, updatePagesLoading } = postSlice.actions
export default postSlice.reducer
