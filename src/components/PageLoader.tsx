// components/PageLoader.tsx

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const PageLoader = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url: any, { shallow }: any) => {
      console.time('Loading Time!')
      console.log(`App is changing to ${url} ${shallow ? 'with' : 'without'} shallow routing`)
    }
    const handleComplete = () => {
      console.log('Loading Completed..')
      console.timeEnd('Loading Time')
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return loading ? (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Loading...</h1>
    </>
  ) : null
}

export default PageLoader
