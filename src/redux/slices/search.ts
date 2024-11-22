import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Search } from 'react-router-dom'

interface Address {
  city: string
}

export interface User {
  profile_image: string
  full_name: string
  tagline: string
  primary_address: { city: string }
  profile_url: string
}

export interface Page {
  titleResults: any
  taglineResults: any
  profile_image: string
  title: string
  tagline: string
  _address: { city: string }
  page_url: string
  page_type: []
  event_date_time: any
  event_weekdays: any
}

interface hobbies {
  _id: string
  add_count: number
  cover_image: string | null
  profile_image: string | null
  genre: string[]
  slug: string
  display: string
  category: { display: string }
  sub_category: { display: string }
  description: string
  keywords: string[]
  level: number
  related_hobbies: string[]
  search_key: string[]
  show: boolean
  tags: string[]
}

interface blogs {
  _id: string
  url: string
  title: string
  tagline: string
  author: any
  cover_pic: string
  createdAt: string
}

interface posts {
  _id: string
  _author: any
  author_type: string
  createdAt: any
  _hobby: any
  visibility: any
  content: any
}

export interface SearchResults<T> {
  data: T[]
  message: string
  success: boolean
}

interface SearchState {
  userName: string
  userHobby: string
  userLocation: string
  postedBy: string
  userSearchResults: SearchResults<User>
  typeResultOne: SearchResults<Page>
  typeResultTwo: SearchResults<Page>
  typeResultThree: SearchResults<Page>
  typeResultFour: SearchResults<Page>
  classesResult: SearchResults<Page>
  rentalResult: SearchResults<Page>
  searchString: string
  currentPage: number
  result_pagination: number
  hobbiesSearchResults: SearchResults<hobbies>
  blogsSearchResults: SearchResults<blogs>
  postsSearchResults: SearchResults<posts>
  hasMore: boolean
  showAll: boolean
  showAllUsers: boolean
  showAllPeople: boolean
  showAllPlace: boolean
  showAllEvent: boolean
  showAllProducts: boolean
  showAllClasses: boolean
  showAllRentals: boolean
  showAllBlogs: boolean
  showAllPosts: boolean
  showAllHobbies: boolean
  explore: boolean
  loading: boolean
}

const initialState: SearchState = {
  userSearchResults: {
    data: [],
    message: '',
    success: false,
  },
  typeResultOne: {
    data: [],
    message: '',
    success: false,
  },
  typeResultTwo: {
    data: [],
    message: '',
    success: false,
  },
  typeResultThree: {
    data: [],
    message: '',
    success: false,
  },
  typeResultFour: {
    data: [],
    message: '',
    success: false,
  },
  classesResult: {
    data: [],
    message: '',
    success: false,
  },
  rentalResult: {
    data: [],
    message: '',
    success: false,
  },
  currentPage: 1,
  result_pagination: 1,
  hobbiesSearchResults: {
    data: [],
    message: '',
    success: false,
  },
  blogsSearchResults: {
    data: [],
    message: '',
    success: false,
  },
  postsSearchResults: {
    data: [],
    message: '',
    success: false,
  },
  userName: '',
  postedBy: '',
  userHobby: '',
  userLocation: '',
  searchString: '',
  hasMore: true,
  showAll: true,
  showAllUsers: false,
  showAllPeople: false,
  showAllPlace: false,
  showAllEvent: false,
  showAllProducts: false,
  showAllClasses: false,
  showAllRentals: false,
  showAllPosts: false,
  showAllBlogs: false,
  showAllHobbies: false,
  explore: false,
  loading: false,
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },
    setUserHobby: (state, action: PayloadAction<string>) => {
      state.userHobby = action.payload
    },
    setUserLocation: (state, action: PayloadAction<string>) => {
      state.userLocation = action.payload
    },
    setPostedBy: (state, action: PayloadAction<string>) => {
      state.postedBy = action.payload
    },
    setUserSearchResults: (
      state,
      action: PayloadAction<SearchResults<User>>,
    ) => {
      state.userSearchResults = action.payload
    },
    setTypeResultOne: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.typeResultOne = action.payload
    },
    setTypeResultTwo: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.typeResultTwo = action.payload
    },
    setTypeResultThree: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.typeResultThree = action.payload
    },
    setTypeResultFour: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.typeResultFour = action.payload
    },
    setClassesResult: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.classesResult = action.payload
    },
    setRentalResult: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.rentalResult = action.payload
    },
    setSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setResultPagination: (state, action: PayloadAction<number>) => {
      state.result_pagination = action.payload
    },
    setHobbiesSearchResult: (
      state,
      action: PayloadAction<SearchResults<hobbies>>,
    ) => {
      state.hobbiesSearchResults = action.payload
    },
    appendHobbiesSearchResult: (
      state,
      action: PayloadAction<SearchResults<hobbies>>,
    ) => {
      state.hobbiesSearchResults.data = [
        ...state.hobbiesSearchResults.data,
        ...action.payload.data,
      ]
    },
    setBlogsSearchResult: (
      state,
      action: PayloadAction<SearchResults<blogs>>,
    ) => {
      state.blogsSearchResults = action.payload
    },
    setPostsSearchResult: (
      state,
      action: PayloadAction<SearchResults<posts>>,
    ) => {
      state.postsSearchResults = action.payload
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    toggleShowAll: (state) => {
      state.showAllUsers = false
      state.showAllPeople = false
      state.showAllPlace = false
      state.showAllEvent = false
      state.showAllProducts = false
      state.showAllHobbies = false
      state.showAllClasses = false
      state.showAllRentals = false
    },

    toggleShowAllUsers: (state) => {
      if (!state.showAllUsers) {
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAll = false
        state.showAllUsers = true
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllHobbies = false
      } else {
        state.showAll = true
        state.showAllUsers = false
      }
    },
    toggleShowAllHobbies: (state) => {
      if (!state.showAllHobbies) {
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAll = false
        state.showAllUsers = false
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllHobbies = true
      } else {
        state.showAll = true
        state.showAllHobbies = false
      }
    },
    toggleShowAllPeople: (state) => {
      if (!state.showAllPeople) {
        state.showAllUsers = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAll = false
        state.showAllHobbies = false
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllPeople = true
      } else {
        state.showAll = true
        state.showAllPeople = false
      }
    },
    toggleShowAllPlace: (state) => {
      if (!state.showAllPlace) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAll = false
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllPlace = true
      } else {
        state.showAll = true
        state.showAllPlace = false
      }
    },
    toggleShowAllEvent: (state) => {
      if (!state.showAllEvent) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllProducts = false
        state.showAll = false
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllEvent = true
      } else {
        state.showAll = true
        state.showAllEvent = false
      }
    },
    toggleShowAllProducts: (state) => {
      if (!state.showAllProducts) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAll = false
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllProducts = true
      } else {
        state.showAll = true
        state.showAllProducts = false
      }
    },
    toggleShowAllClasses: (state) => {
      if (!state.showAllClasses) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllProducts = false
        state.showAll = false
        state.showAllEvent = false
        state.showAllRentals = false
        state.showAllClasses = true
      } else {
        state.showAll = true
        state.showAllClasses = false
      }
    },
    toggleShowAllRentals: (state) => {
      if (!state.showAllRentals) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllProducts = false
        state.showAll = false
        state.showAllEvent = true
        state.showAllClasses = false
        state.showAllRentals = true
      } else {
        state.showAll = true
        state.showAllRentals = false
      }
    },

    toggleShowAllBlogs: (state) => {
      if (!state.showAllBlogs) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAll = false
        state.showAllProducts = false
        state.showAllPosts = false
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllBlogs = true
      } else {
        state.showAll = true
        state.showAllBlogs = false
      }
    },
    toggleShowAllPosts: (state) => {
      if (!state.showAllPosts) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAll = false
        state.showAllProducts = false
        state.showAllBlogs = false
        state.showAllClasses = false
        state.showAllRentals = false
        state.showAllPosts = true
      } else {
        state.showAll = true
        state.showAllPosts = false
      }
    },
    showAllUsersTrue: (state) => {
      state.showAllUsers = true
      if (state.showAllUsers) {
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAllClasses = false
        state.showAllRentals = false
      }
    },
    showAllPeopleTrue: (state) => {
      state.showAllPeople = true
      if (state.showAllPeople) {
        state.showAllHobbies = false
        state.showAllUsers = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAllClasses = false
        state.showAllRentals = false
      }
    },
    showAllPlaceTrue: (state) => {
      state.showAllPlace = true
      if (state.showAllPlace) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAllClasses = false
        state.showAllRentals = false
      }
    },
    showAllEventTrue: (state) => {
      state.showAllEvent = true
      if (state.showAllEvent) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllProducts = false
        state.showAllClasses = false
        state.showAllRentals = false
      }
    },
    showAllProductsTrue: (state) => {
      state.showAllProducts = true
      if (state.showAllEvent) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllClasses = false
        state.showAllRentals = false
      }
    },
    showAllClassesTrue: (state) => {
      state.showAllClasses = true
      if (state.showAllEvent) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllRentals = false
      }
    },
    showAllRentalsTrue: (state) => {
      state.showAllRentals = true
      if (state.showAllEvent) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllClasses = false
      }
    },
    showAllPostsTrue: (state) => {
      state.showAllPosts = true
      if (state.showAllEvent) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAllBlogs = false
        state.showAllClasses = false
        state.showAllRentals = false
      }
    },
    showAllBlogsTrue: (state) => {
      state.showAllBlogs = true
      if (state.showAllEvent) {
        state.showAllUsers = false
        state.showAllHobbies = false
        state.showAllPeople = false
        state.showAllPlace = false
        state.showAllEvent = false
        state.showAllProducts = false
        state.showAllPosts = false
        state.showAllClasses = false
        state.showAllRentals = false
      }
    },
    showAllTrue: (state) => {
      state.showAll = true
      state.showAllUsers = false
      state.showAllHobbies = false
      state.showAllPeople = false
      state.showAllEvent = false
      state.showAllProducts = false
      state.showAllPlace = false
      state.showAllPosts = false
      state.showAllBlogs = false
      state.showAllClasses = false
      state.showAllRentals = false
    },
    setExplore: (state, { payload }: { payload: boolean }) => {
      state.explore = payload
    },
    setSearchLoading: (state, { payload }: { payload: boolean }) => {
      state.loading = payload
    },
    resetSearch: () => {
      return initialState
    },
  },
})

export const {
  setUserName,
  setUserHobby,
  setUserLocation,
  setPostedBy,
  setUserSearchResults,
  setTypeResultOne,
  setTypeResultTwo,
  setTypeResultThree,
  setTypeResultFour,
  setClassesResult,
  setRentalResult,
  setSearchString,
  setBlogsSearchResult,
  setPostsSearchResult,
  setHobbiesSearchResult,
  toggleShowAll,
  toggleShowAllUsers,
  toggleShowAllPeople,
  toggleShowAllPlace,
  toggleShowAllEvent,
  toggleShowAllProducts,
  toggleShowAllClasses,
  toggleShowAllRentals,
  showAllEventTrue,
  showAllPeopleTrue,
  showAllPlaceTrue,
  showAllUsersTrue,
  showAllProductsTrue,
  showAllClassesTrue,
  showAllRentalsTrue,
  showAllTrue,
  toggleShowAllHobbies,
  resetSearch,
  setExplore,
  setSearchLoading,
  toggleShowAllBlogs,
  toggleShowAllPosts,
  showAllBlogsTrue,
  showAllPostsTrue,
  setHasMore,
  setResultPagination,
  setCurrentPage,
  appendHobbiesSearchResult,
} = searchSlice.actions

export default searchSlice.reducer
