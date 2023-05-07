import { configureStore } from '@reduxjs/toolkit'
import postReducer from './slices/post'
import modalReducer from './slices/modal'
import userReducer from './slices/user'
import siteReducer from './slices/site'

const store = configureStore({
  reducer: {
    post: postReducer,
    modal: modalReducer,
    user: userReducer,
    site: siteReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
