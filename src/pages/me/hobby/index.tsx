import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const index = () => {
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)
  useEffect(() => {
    if (user.profile_url) {
      router.push(`/profile/${user.profile_url}?showHobby=true`)
    }
  }, [user])
  return null
}
export default index
