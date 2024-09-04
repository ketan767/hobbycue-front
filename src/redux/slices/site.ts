import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ListingModalData = {
  /**
   * * `1 -> PERSON`
   * * `2 -> PLACE`
   * * `3 -> PROGRAM`
   * * `4 -> PRODUCT`
   */
  admin?: string 
  seller?: any
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
  phone?: {
    number?: any
    prefix?: any
  };
  website?: string
  whatsapp_number?: {
    number?: any
    prefix?: any
  };
  _address?: any
  _hobbies?: any
  work_hours?: any
  _id?: string
  event_date_time?: {
    from_time: any
    to_time: any
    from_date: any
    to_date: any
  }[]
  images?: any
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
    relation: any
    listings: any
  }
  related_listings_right?: any
  event_weekdays?:{
    from_time: string
    to_time: string
    from_day: string
    to_day: string
  }[]
  click_url?:string|null
  cta_text?:string|null
  product_category?:string|null
  parent_page?:string|null
  about?:string|null
}

interface AuthState {
  listingLayoutMode: ListingLayoutMode
  profileLayoutMode: ProfileLayoutMode
  listingPageData: any
  listingModalData: ListingModalData
  editPhotoModalData: {
    type: 'profile' | 'cover' | 'array' | null
    image: any
    onComplete: any
  }
  showPageLoader: boolean
  listingTypeModalMode?: any
  admin_nav:boolean
  expandMenu: {
    hobby: boolean
    listing: boolean
    profile: boolean
  },
  sidemenuRefresh: number
  searchToggleRefresh: number 
  hobbyStates?: {
    [key:string]:boolean
  }
  AboutStates?: {
    [key:string]:boolean
  }
  DescriptionStates?: {
    [key:string]:boolean
  }
  pagesStates?: {
    [key:string]:boolean
  }
  locationStates?: {
    [key:string]:boolean
  }
  contactStates?: {
    [key:string]:boolean
  }
  socialMediaStates?: {
    [key:string]:boolean
  }
  saleStates?: {
    [key:string]:boolean
  }
  tagsStates?: {
    [key:string]:boolean
  }
  relatedListingsStates?:{
    [key:string]:boolean
  }
  relatedListingsStates2?:{
    [key:string]:boolean
  }
  workingHoursStates?:{
    [key:string]:boolean
  }
  membersStates?:{
    [key:string]:boolean
  }
  active_img_product?:{
    idx: number,
    type: string
  }
  eventflowRunning:boolean
  pageDataForEvent:null|any
  totalEvents:number
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
    click_url: null,
    cta_text: 'Contact'
  },
  editPhotoModalData: {
    image: null,
    type: null,
    onComplete: null,
  },
  
  showPageLoader: false,
  listingTypeModalMode: 'create',
  admin_nav:true,
  expandMenu: {
    hobby: false,
    listing: false,
    profile: false
  },
  sidemenuRefresh: 0,
  searchToggleRefresh: 0,
  hobbyStates:{},
  AboutStates: {},
  DescriptionStates: {},
  pagesStates:{},
  locationStates:{},
  contactStates:{},
  socialMediaStates:{},
  tagsStates:{},
  relatedListingsStates:{},
  relatedListingsStates2:{},
  workingHoursStates:{},
  membersStates:{},
  eventflowRunning:false,
  pageDataForEvent:null,
  totalEvents:0,
  active_img_product: {
    idx: 0,
    type: 'image'
  }
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
        type: 'profile' | 'cover' | 'array' | null
        image: any
        onComplete: any
      }>,
    ) => {
      state.editPhotoModalData = payload
    },
    toggleAdminNav:(state)=>{
      state.admin_nav = !state.admin_nav;
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
    updateHobbyMenuExpandAll: (state, { payload }) => {
      state.expandMenu.hobby = payload
    },
    updateListingMenuExpandAll: (state, { payload }) => {
      state.expandMenu.listing = payload
    },
    updateProfileMenuExpandAll: (state, { payload }) => {
      state.expandMenu.profile = payload
    },
    increaseSidemenuRefresh: (state)=> {
      state.sidemenuRefresh = state.sidemenuRefresh+1
    },
    increaseSearchRefresh: (state)=> {
      state.searchToggleRefresh = state.searchToggleRefresh+1
    },
    updateAboutOpenState: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.AboutStates){
      state.AboutStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateDescriptionOpenState: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.DescriptionStates){
      state.DescriptionStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateHobbyOpenState: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.hobbyStates){
      state.hobbyStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateSaleOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.saleStates){
      state.saleStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updatePagesOpenState: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.pagesStates){
      state.pagesStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateLocationOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.locationStates){
      state.locationStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateContactOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.contactStates){
      state.contactStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateSocialMediaOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.socialMediaStates){
      state.socialMediaStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateTagsOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.tagsStates){
      state.tagsStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateRelatedListingsOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.relatedListingsStates){
      state.relatedListingsStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateRelatedListingsOpenStates2: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.relatedListingsStates2){
      state.relatedListingsStates2[objKey[0]] = payload[objKey[0]];
      }
    },
    updateWorkingHoursOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.workingHoursStates){
      state.workingHoursStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateMembersOpenStates: (state,{payload}:{payload:{
      [key:string]:boolean
    }})=>{
      const objKey = Object.keys(payload);
      if(objKey[0] && state.membersStates){
      state.membersStates[objKey[0]] = payload[objKey[0]];
      }
    },
    updateEventFlow: (state,{payload}:{payload:boolean}) => {
      state.eventflowRunning = payload
    },
    updatePageDataForEvent: (state,{payload}:{payload:any}) => {
      state.pageDataForEvent = payload;
    },
    updateTotalEvents: (state,{payload}:{payload:number}) => {
      state.totalEvents = payload;
    },
    updateActiveProductImg: (state,{payload}:{payload:any}) => {
      state.active_img_product = payload;
    }
  },
})

export const {
  updateActiveProductImg,
  updateSaleOpenStates,
  updateListingLayoutMode,
  updateProfileLayoutMode,
  updateListingPageData,
  updateListingModalData,
  updatePhotoEditModalData,
  updateEventDateTime,
  updateRelatedListingsLeft,
  setShowPageLoader,
  updateListingTypeModalMode,
  updateHobbyMenuExpandAll,
  updateListingMenuExpandAll,
  updateProfileMenuExpandAll,
  toggleAdminNav,
  increaseSidemenuRefresh,
  increaseSearchRefresh,
  updateHobbyOpenState,
  updateContactOpenStates,
  updateLocationOpenStates,
  updatePagesOpenState,
  updateSocialMediaOpenStates,
  updateRelatedListingsOpenStates,
  updateRelatedListingsOpenStates2,
  updateTagsOpenStates,
  updateWorkingHoursOpenStates,
  updateMembersOpenStates,
  updateEventFlow,
  updatePageDataForEvent,
  updateTotalEvents,
  updateAboutOpenState,
  updateDescriptionOpenState,
} = siteSlice.actions

export default siteSlice.reducer
