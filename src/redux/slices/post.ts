import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  allPosts: object[];
  post_pagination: number;
  currentPage: number;
  hasMore: boolean;
  allPages: object[];
  allBlogs?: object[];
  loading: boolean;
  pagesLoading: boolean;
  activePost: any;
  filters: {
    location: string | null;
    isPinCode: boolean;
    hobby: string;
    genre: string;
    seeMoreHobbies: boolean;
  };
  refreshNum: number;
}

const initialState: PostState = {
  allPosts: [],
  post_pagination: 1,
  hasMore: true,
  currentPage: 1,
  allPages: [],
  allBlogs: [],
  loading: false,
  pagesLoading: true,
  activePost: {},
  filters: {
    location: null,
    isPinCode: false,
    hobby: '',
    genre: '',
    seeMoreHobbies: false,
  },
  refreshNum: 0,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setIsPinCode : (state, { payload }) => {
      state.filters.isPinCode = payload;
    },
    updatePosts: (state, { payload }) => {
      state.allPosts = payload;
    },
    appendPosts: (state, { payload }) => {
      state.allPosts = [...state.allPosts, ...payload];
    },
    updatePages: (state, { payload }) => {
      state.allPages = payload;
    },
    updateHasMore: (state, { payload }) => {
      state.hasMore = payload;
    },
    updateBlogs: (state, { payload }) => {
      state.allBlogs = payload;
    },
    updateLoading: (state, { payload }) => {
      state.loading = payload;
    },
    updatePagesLoading: (state, { payload }) => {
      state.pagesLoading = payload;
    },
    setActivePost: (state, { payload }) => {
      state.activePost = payload;
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    },
    increaseRefreshNum: (state) => {
      state.refreshNum = state.refreshNum + 1;
    },
    updateCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    UpdatePostCount: (state, {payload}) => {
      state.post_pagination = payload
    }
  },
});

export const {
  setIsPinCode,
  updatePosts,
  appendPosts,
  updatePages,
  updateHasMore,
  updateBlogs,
  updateLoading,
  updatePagesLoading,
  setActivePost,
  setFilters,
  increaseRefreshNum,
  updateCurrentPage,
  UpdatePostCount,
} = postSlice.actions;
export default postSlice.reducer;
