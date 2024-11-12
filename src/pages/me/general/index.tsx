import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const index = () => {
  const router = useRouter()
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      return
    }
    const handleRedirect = () => {
      if (isLoggedIn && user?.profile_url) {
        router.push(`/profile/${user.profile_url}?showGeneral=true`)
      } else if (!isLoggedIn) {
        router.push('/?showAuth=true')
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
