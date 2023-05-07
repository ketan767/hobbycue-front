/**
 * * `1 -> PERSON`
 * * `2 -> PLACE`
 * * `3 -> PROGRAM`
 * * `4 -> PRODUCT`
 */
type ListingPages = 1 | 2 | 3 | 4

type PeoplePageType =
  | 'Teacher'
  | 'Trainer'
  | 'Coach'
  | 'Instructor'
  | 'Academia'
  | 'Professional'
  | 'Seller'
  | 'Specialist'
  | 'Ensemble'
  | 'Company'
  | 'Business'
  | 'Society'
  | 'Association'
  | 'Organization'

type PlacePageType =
  | 'Shop'
  | 'School'
  | 'Auditorium'
  | 'Clubhouse'
  | 'Studio'
  | 'Play Area'
  | 'Campus'

type ProgramPageType = 'Classes' | 'Workshop' | 'Performance' | 'Event'

// Listing Page
type ListingPageTabs = 'home' | 'posts' | 'media' | 'reviews' | 'events' | 'store'

type ListingLayoutMode = 'view' | 'edit'

type ListingPageData = {
  pageData: any //{ [key: string]: any }
  postsData: any //{ [key: string]: any }
  mediaData: any //{ [key: string]: any }
  reviewsData: any //{ [key: string]: any }
  eventsData: any //{ [key: string]: any }
  storeData: any //{ [key: string]: any }
}
