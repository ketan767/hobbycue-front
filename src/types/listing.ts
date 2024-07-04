/**
 * * `1 -> PERSON`
 * * `2 -> PLACE`
 * * `3 -> PROGRAM`
 * * `4 -> PRODUCT`
 */
type ListingPages = 1 | 2 | 3 | 4 | 5

type PeoplePageType =  {
  name: string;
  description: string;
}[];

type PlacePageType =  {
  name: string;
  description: string;
}[];

type ProgramPageType =  {
  name: string;
  description: string;
}[];

type ProductPageType = {
  name: string;
  description: string;
}[];
// Listing Page
type ListingPageTabs = 'home' | 'posts' |'events' | 'media' | 'reviews' | 'store' | 'orders'

type ListingLayoutMode = 'view' | 'edit'

type ListingPageData = {
  pageData: any //{ [key: string]: any }
  postsData: any //{ [key: string]: any }
  mediaData: any //{ [key: string]: any }
  reviewsData: any //{ [key: string]: any }
  eventsData: any //{ [key: string]: any }
  storeData: any //{ [key: string]: any }
  metadata?:any
}
