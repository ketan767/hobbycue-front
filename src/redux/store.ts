import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from './slices/blogsSlice'
import modalReducer from './slices/modalSlice'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    modal: modalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
