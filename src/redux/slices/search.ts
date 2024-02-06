import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
  city: string;
}

interface User {
  profile_image: string;
  full_name: string;
  tagline: string;
  primary_address: { city: string }
  profile_url:string
}

export interface Page {
  titleResults: any
  taglineResults: any
  profile_image: string
  title: string
  tagline: string
  _address: { city: string }
  page_url:string
  page_type: []
}

interface hobbies {
  _id: string;
  profile_image: string | null;
  genre: string[];
  slug: string;
  display: string;
}

export interface SearchResults<T> {
  data: T[];
  message: string;
  success: boolean;
}


interface SearchState {
  userSearchResults: SearchResults<User>;
  typeResultOne: SearchResults<Page>;
  typeResultTwo: SearchResults<Page>;
  typeResultThree: SearchResults<Page>;
  searchString: string;
  hobbiesSearchResults: SearchResults<hobbies>;
  showAll:boolean
  showAllUsers: boolean;
  showAllPeople: boolean;
  showAllPlace: boolean;
  showAllEvent: boolean;
  showAllProducts:boolean;
  
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

  hobbiesSearchResults : {
    data: [],
    message: '',
    success: false,
  },
  searchString: '',

  showAll:false,
  showAllUsers: false,
  showAllPeople: false,
  showAllPlace: false,
  showAllEvent: false,
  showAllProducts: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setUserSearchResults: (state, action: PayloadAction<SearchResults<User>>) => {
      state.userSearchResults = action.payload;
    },
    setTypeResultOne: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.typeResultOne = action.payload;
    },
    setTypeResultTwo: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.typeResultTwo = action.payload;
    },
    setTypeResultThree: (state, action: PayloadAction<SearchResults<Page>>) => {
      state.typeResultThree = action.payload;
    },
    setSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    },

    setHobbiesSearchResult: (state, action: PayloadAction<SearchResults<hobbies>>) => {
      state.hobbiesSearchResults = action.payload;
    },

    
    toggleShowAll: (state) => {

        state.showAllUsers = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      
      
    },

    toggleShowAllUsers: (state) => {
      state.showAllUsers = !state.showAllUsers;
      if (state.showAllUsers) {
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    toggleShowAllPeople: (state) => {
      state.showAllPeople = !state.showAllPeople;
      if (state.showAllPeople) {
        state.showAllUsers = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    toggleShowAllPlace: (state) => {
      state.showAllPlace = !state.showAllPlace;
      if (state.showAllPlace) {
        state.showAllUsers = false;
        state.showAllPeople = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    toggleShowAllEvent: (state) => {
      state.showAllEvent = !state.showAllEvent;
      if (state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllProducts = false;
      }
    },
    toggleShowAllProducts: (state) => {
      state.showAllProducts = !state.showAllProducts;
      if (state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
      }
    },
    showAllUsersTrue: (state) => {
      state.showAllUsers = true;
      if (state.showAllUsers) {
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    showAllPeopleTrue: (state) => {
      state.showAllPeople = true;
      if (state.showAllPeople) {
        state.showAllUsers = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    showAllPlaceTrue: (state) => {
      state.showAllPlace = true;
      if (state.showAllPlace) {
        state.showAllUsers = false;
        state.showAllPeople = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    showAllEventTrue: (state) => {
      state.showAllEvent = true;
      if (state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllProducts = false;
      }
    },
    showAllProductsTrue: (state) => {
      state.showAllProducts = true;
      if (state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
      }
    },
  },
});

export const { setUserSearchResults, setTypeResultOne,setTypeResultTwo, setTypeResultThree, setSearchString,
   setHobbiesSearchResult,toggleShowAll, toggleShowAllUsers, toggleShowAllPeople, toggleShowAllPlace, toggleShowAllEvent,toggleShowAllProducts,
  showAllEventTrue,showAllPeopleTrue,showAllPlaceTrue,showAllUsersTrue,showAllProductsTrue
  } = searchSlice.actions;

export default searchSlice.reducer;
