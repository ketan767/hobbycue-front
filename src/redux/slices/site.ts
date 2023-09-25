import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ListingModalData = {
  /**
   * * `1 -> PERSON`
   * * `2 -> PLACE`
   * * `3 -> PROGRAM`
   * * `4 -> PRODUCT`
   */
  type?: ListingPages | null
  page_type?: string | string[]
  title?: string
  page_url?: string
  gender?: 'male' | 'female' | null
  year?: string
  admin_note?: string
  tagline?: string
  description?: string
  public_email?: string
  phone?: string
  website?: string
  whatsapp_number?: string
  _address?: any
  _hobbies?: any
  work_hours?: any
  _id?: string
  event_date_time?: {
    from_time: any
    to_time: any
    from_date: any
    to_date: any
  },
  images?: [],
  social_media_urls?: any
  is_published?: boolean
  is_onboarded?: boolean
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  soundcloud_url?: string
  pinterest_url?: string
  tripadvisor_url?: string
  ultimate_guiter_url?: string
  strava_url?: string
  deviantarts_url?: string
  behance_url?: string
  goodreads_url?: string
  smule_url?: string
  chess_url?: string
  bgg_url?: string
  twitter_url?: string
  linkedin_url?: string
  video_url?: string
  profile_image?: string
  cover_image?: string
  _tags?: any
  related_listings_left?: {
    relation: string
    listings: any
  }
  related_listings_right?: any
}

interface AuthState {
  listingLayoutMode: ListingLayoutMode
  profileLayoutMode: ProfileLayoutMode
  listingPageData: any
  listingModalData: ListingModalData
  editPhotoModalData: {
    type: 'profile' | 'cover' | null
    image: any
    onComplete: any
  }
  showPageLoader: boolean
  listingTypeModalMode? : any
}

const initialState: AuthState = {
  listingLayoutMode: 'view',
  profileLayoutMode: 'view',
  listingPageData: {},
  listingModalData: {
    type: null,
    page_type: '',
    title: '',
    page_url: '',
    gender: null,
    year: '',
    admin_note: '',
    tagline: '',
  },
  editPhotoModalData: {
    image: null,
    type: null,
    onComplete: null,
  },
  showPageLoader: false,
  listingTypeModalMode : 'create'
}

/** Template Listing Data 
 * {
    "type": "1",
    "is_published": false,
    "is_onboarded": false,
    "page_type": ["Specialist"],
    "title": "okay",
    "tagline": "tag",
    "description": null,
    "gender": "male",
    "year": 2000,
    "public_email": null,
    "phone": null,
    "website": null,
    "whatsapp_number": null,
    "facebook_url": null,
    "instagram_url": null,
    "twitter_url": null,
    "linkedin_url": null,
    "admin": "64441a500be57b65f6b6dabd",
    "admin_note": "secret, shh..",
    "profile_image": null,
    "cover_image": null,
    "_hobbies": [],
    "_id": "645caa27528aee0c798052a5",
    "page_url": "page-url",
    "createdAt": "2023-05-11T08:41:11.550Z",
    "updatedAt": "2023-05-11T08:41:11.550Z",
    "__v": 0
}
 */

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    updateListingLayoutMode: (
      state,
      { payload }: PayloadAction<ListingLayoutMode>,
    ) => {
      state.listingLayoutMode = payload
    },
    updateProfileLayoutMode: (
      state,
      { payload }: PayloadAction<ProfileLayoutMode>,
    ) => {
      state.profileLayoutMode = payload
    },
    updateListingPageData: (state, { payload }) => {
      state.listingPageData = payload
    },
    updateListingModalData: (
      state,
      { payload }: PayloadAction<ListingModalData>,
    ) => {
      state.listingModalData = payload
    },
    updatePhotoEditModalData: (
      state,
      {
        payload,
      }: PayloadAction<{
        type: 'profile' | 'cover' | null
        image: any
        onComplete: any
      }>,
    ) => {
      state.editPhotoModalData = payload
    },
    updateEventDateTime: (state, { payload }) => {
      state.listingPageData.event_date_time = payload
    },
    updateRelatedListingsLeft: (state, { payload }) => {
      state.listingPageData.related_listings_left.listings = payload
    },
    setShowPageLoader: (state, { payload }: { payload: boolean }) => {
      state.showPageLoader = payload
    },
    updateListingTypeModalMode: (state, { payload }) => {
      state.listingTypeModalMode = payload.mode
    },
  },
})

export const {
  updateListingLayoutMode,
  updateProfileLayoutMode,
  updateListingPageData,
  updateListingModalData,
  updatePhotoEditModalData,
  updateEventDateTime,
  updateRelatedListingsLeft,
  setShowPageLoader,
  updateListingTypeModalMode
} = siteSlice.actions

export default siteSlice.reducer
