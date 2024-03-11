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
  showAllHobbies:boolean;
  
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

  showAll:true,
  showAllUsers: false,
  showAllPeople: false,
  showAllPlace: false,
  showAllEvent: false,
  showAllProducts: false,
  showAllHobbies:false
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
        state.showAllHobbies = false;
      
    },

    toggleShowAllUsers: (state) => {
      if (!state.showAllUsers) {
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
        state.showAll = false;
        state.showAllUsers = true;
        state.showAllHobbies = false;
      } else {
        state.showAll = true;
        state.showAllUsers = false;
      }
    },
    toggleShowAllHobbies: (state) => {
      if (!state.showAllHobbies) {
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
        state.showAll = false;
        state.showAllUsers = false;
        state.showAllHobbies = true
      } else {
        state.showAll = true;
        state.showAllHobbies = false;
      }
    },
    toggleShowAllPeople: (state) => {
      if (!state.showAllPeople) {
        state.showAllUsers = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
        state.showAll = false;
        state.showAllHobbies = false;
        state.showAllPeople = true;
      } else {
        state.showAll = true;
        state.showAllPeople = false;
      }
    },
    toggleShowAllPlace: (state) => {
      if (!state.showAllPlace) {
        state.showAllUsers = false;
        state.showAllHobbies = false;
        state.showAllPeople = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
        state.showAll = false;
        state.showAllPlace = true;
      } else {
        state.showAll = true;
        state.showAllPlace = false;
      }
    },
    toggleShowAllEvent: (state) => {
      if (!state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllHobbies = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllProducts = false;
        state.showAll = false;
        state.showAllEvent = true;
      } else {
        state.showAll = true;
        state.showAllEvent = false;
      }
    },
    toggleShowAllProducts: (state) => {
      if (!state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllHobbies = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAll = false;
        state.showAllProducts = true;
      } else {
        state.showAll = true;
        state.showAllProducts = false;
      }
    },
    showAllUsersTrue: (state) => {
      state.showAllUsers = true;
      if (state.showAllUsers) {
        state.showAllHobbies = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    showAllPeopleTrue: (state) => {
      state.showAllPeople = true;
      if (state.showAllPeople) {
        state.showAllHobbies = false;
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
        state.showAllHobbies = false;
        state.showAllPeople = false;
        state.showAllEvent = false;
        state.showAllProducts = false;
      }
    },
    showAllEventTrue: (state) => {
      state.showAllEvent = true;
      if (state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllHobbies = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllProducts = false;
      }
    },
    showAllProductsTrue: (state) => {
      state.showAllProducts = true;
      if (state.showAllEvent) {
        state.showAllUsers = false;
        state.showAllHobbies = false;
        state.showAllPeople = false;
        state.showAllPlace = false;
        state.showAllEvent = false;
      }
    },
    showAllTrue: (state) => {
      state.showAll = true;
      state.showAllUsers = false;
      state.showAllHobbies = false;
      state.showAllPeople = false;
      state.showAllEvent = false;
      state.showAllProducts = false;
      state.showAllPlace = false;
    }
  },
});

export const { setUserSearchResults, setTypeResultOne,setTypeResultTwo, setTypeResultThree, setSearchString,
   setHobbiesSearchResult,toggleShowAll, toggleShowAllUsers, toggleShowAllPeople, toggleShowAllPlace, toggleShowAllEvent,toggleShowAllProducts,
  showAllEventTrue,showAllPeopleTrue,showAllPlaceTrue,showAllUsersTrue,showAllProductsTrue, showAllTrue, toggleShowAllHobbies
  } = searchSlice.actions;

export default searchSlice.reducer;
