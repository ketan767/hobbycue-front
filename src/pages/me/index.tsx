import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const index = ({}) => {
  const { user } = useSelector((state: RootState) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (user?.profile_url) {
      router.push(`/profile/${user.profile_url}`)
    }
  }, [user, router])
  return null
}

export default index