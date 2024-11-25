import { setRedirectPath } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const index = () => {
  const router = useRouter()
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const [isInitialized, setIsInitialized] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      dispatch(setRedirectPath('/me'))
      return
    }
    const handleRedirect = () => {
      if (isLoggedIn && user?.profile_url) {
        router.push(`/profile/${user.profile_url}`)
      } else if (!isLoggedIn) {
        router.push('/?me=true')
      }
    }

    handleRedirect()
  }, [isLoggedIn, user?.profile_url, router, isInitialized])

  if (!isInitialized) {
    return null
  }

  return null
}
export default index
