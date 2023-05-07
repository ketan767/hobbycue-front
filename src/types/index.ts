type InputData<type> = {
  value: type
  error: string | null
}

// Profile Page
type ProfileLayoutMode = 'view' | 'edit'

type ProfilePageTabs = 'home' | 'posts' | 'media' | 'pages' | 'blogs'

type ProfilePageData = {
  pageData: any //{ [key: string]: any }
  postsData: any //{ [key: string]: any }
  mediaData: any //{ [key: string]: any }
  pagesData: any //{ [key: string]: any }
  blogsData: any //{ [key: string]: any }
}
