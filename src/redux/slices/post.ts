import { createSlice } from '@reduxjs/toolkit'

interface PostState {
  allPosts: object[]
  allPages: object[]
  loading: boolean
  pagesLoading: boolean
  activePost: any
  filters:{
    location:string|null,
    hobby:string,
    genre:string,
  }
}

const initialState: PostState = {
  allPosts: [],
  allPages: [],
  loading: false,
  pagesLoading: true,
  activePost: {} ,
  filters:{
    location:null,
    hobby:"",
    genre:"",
  },
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
    setActivePost: (state, { payload }) => {
      state.activePost = payload
    },
    setFilters: (state, {payload}) => {
      state.filters = {...state.filters,...payload}
    }
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

export const {
  updatePosts,
  updatePages,
  updateLoading,
  updatePagesLoading,
  setActivePost,
  setFilters,
} = postSlice.actions
export default postSlice.reducer
