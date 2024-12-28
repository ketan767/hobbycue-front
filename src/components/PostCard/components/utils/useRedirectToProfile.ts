import { useRouter } from 'next/router'

export default function useRedirectToProfile(comment: any) {
  const router = useRouter()
  const redirectToProfile = () => {
    let page_url = ''
    if (comment?._author?.page_url) {
      const listingType = comment?._author?.type
      if (listingType === 1) {
        page_url = '/people'
      } else if (listingType === 2) {
        page_url = '/place'
      } else if (listingType === 3) {
        page_url = '/program'
      } else {
        page_url = '/product'
      }
      page_url += '/' + comment?._author?.page_url
    } else {
      page_url = `/profile/${comment?._author?.profile_url}`
    }
    return router.push(page_url)
  }
  return redirectToProfile
}
