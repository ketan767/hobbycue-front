import { setRedirectPath } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import Head from 'next/head'
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
        localStorage.setItem('meUrl', '/me')
        router.push('/?me=true')
      }
    }

    handleRedirect()
  }, [isLoggedIn, user?.profile_url, router, isInitialized])

  if (!isInitialized) {
    return null
  }

  return (
    <>
      <Head>
        <title>HobbyCue</title>
        <meta
          name="description"
          content="hobbycue – explore your hobby or passion Sign-in to interact with a community of fellow hobbyists and an eco-system of experts, teachers, suppliers, classes, workshops, and places to practice, participate or perform. Your hobby may be about visual or performing arts, sports, games, gardening, model making, cooking, indoor or outdoor activities… If you are an expert […]"
        />
        <link rel="manifest" href="/manifest.json"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:width" content="478" />
        <meta property="og:image:height" content="477" />
        <meta property="og:image:type" content="image/png" />
      </Head>
    </>
  )
}
export default index
