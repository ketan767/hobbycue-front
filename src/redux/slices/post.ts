import { createSlice } from '@reduxjs/toolkit'

interface PostState {
  allPosts: object[]
}

const initialState: PostState = {
  allPosts: [],
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePosts: (state, { payload }) => {
      state.allPosts = payload
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

export const { updatePosts } = postSlice.actions
export default postSlice.reducer
