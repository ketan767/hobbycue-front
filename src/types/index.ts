type InputData<type> = {
  value: type
  error: string | null
}

// Profile Page
type ProfileLayoutMode = 'view' | 'edit'

type ProfilePageTabs = 'home' | 'posts' | 'media' | 'pages' | 'blogs'

type HobbyPageTabs = 'home' | 'posts' | 'links' | 'pages' | 'store' | 'blogs'

type ProfilePageData = {
  pageData: any //{ [key: string]: any }
  postsData: any //{ [key: string]: any }
  mediaData: any //{ [key: string]: any }
  listingsData: any //{ [key: string]: any }
  blogsData: any //{ [key: string]: any }
  hobbyData?: any

}

type LocalStorageActiveProfile = {
  type: 'user' | 'listing'
  id: string
}

type CommunityPageTabs = 'posts' | 'links' | 'pages' | 'store' | 'blogs'
