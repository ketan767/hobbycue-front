import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type NewListingData = {
  /**
   * * `1 -> PERSON`
   * * `2 -> PLACE`
   * * `3 -> PROGRAM`
   * * `4 -> PRODUCT`
   */
  type: ListingPages | null
  page_type: PeoplePageType | PlacePageType | ProgramPageType | null
}
interface AuthState {
  listingLayoutMode: ListingLayoutMode
  listingPageData: any
  newListingData: NewListingData
}

const initialState: AuthState = {
  listingLayoutMode: 'view',
  listingPageData: {},
  newListingData: {
    type: null,
    page_type: null,
  },
}

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    updateListingLayoutMode: (state, { payload }: PayloadAction<ListingLayoutMode>) => {
      state.listingLayoutMode = payload
    },
    updateListingPageData: (state, { payload }) => {
      state.listingPageData = payload
    },
    updateNewListingData: (state, { payload }: PayloadAction<NewListingData>) => {
      state.newListingData = payload
    },
  },
})

export const { updateListingLayoutMode, updateListingPageData, updateNewListingData } =
  siteSlice.actions

export default siteSlice.reducer
