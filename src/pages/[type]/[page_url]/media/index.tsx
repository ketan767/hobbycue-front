import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import styles from '@/styles/Page.module.css'
import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingPageLayout from '@/layouts/ListingPageLayout'
import { getListingPages } from '@/services/listing.service'
import {
  updateListingMenuExpandAll,
  updateListingModalData,
  updateListingPageData,
} from '@/redux/slices/site'

import ListingHomeTab from '@/components/ListingPage/ListingHomeTab/ListingHomeTab'
import ListingPageMain from '@/components/ListingPage/ListingPageMain/ListingPageMain'
import ListingPostsTab from '@/components/ListingPage/ListingPagePosts/ListingPagePosts'
import ListingMediaTab from '@/components/ListingPage/ListingPageMedia'
import ErrorPage from '@/components/ErrorPage'
import { useMediaQuery } from '@mui/material'

type Props = { data: ListingPageData }

const ListingMedia: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const { listing } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(listing)
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const isMobile = useMediaQuery('(max-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])
  // const { listingPageData } = useSelector((state: RootState) => state.site)
  console.log('posts data', props.data)
  useEffect(() => {
    dispatch(updateListingPageData(props.data.pageData))
    dispatch(updateListingModalData(props.data.pageData))
  }, [])

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateListingMenuExpandAll(value))
  }
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPositionlisting', window.scrollY.toString())
    }

    // Restore scroll position when navigating back to the page
    const handleScrollRestoration = () => {
      const scrollPosition = sessionStorage.getItem('scrollPositionlisting')
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10))
        sessionStorage.removeItem('scrollPositionlisting')
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleScrollRestoration)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleScrollRestoration)
    }
  }, [router.events])
  if (
    props?.data?.pageData?.admin !== user?._id &&
    props?.data?.pageData?.is_published !== true
  ) {
    return <ErrorPage restricted />
  }
  return (
    <>
      <Head>
        <meta
          property="og:image"
          content={`${props?.data?.pageData?.profile_image}`}
        />
        <meta
          property="og:image:secure_url"
          content={`${props?.data?.pageData?.profile_image}`}
        />
        <meta
          property="og:description"
          content={`${props?.data?.pageData?.tagline ?? ''}`}
        />
        <meta property="og:image:alt" content="Profile picture" />
        <title>{`${props.data.pageData?.title} | HobbyCue`}</title>
      </Head>

      <ListingPageLayout
        activeTab={'media'}
        data={props.data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <ListingPageMain
          activeTab={'media'}
          data={props.data.pageData}
          expandAll={expandAll}
        >
          <div className={styles['display-desktop']}>
            <ListingMediaTab data={props.data.pageData} />
          </div>
        </ListingPageMain>
      </ListingPageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context
  const { page_url, type } = query

  let typeId
  switch (type) {
    case 'people':
      typeId = '1'
      break
    case 'person':
      typeId = '2'
      break
    case 'program':
      typeId = '3'
      break
    case 'product':
      typeId = '4'
      break
    default:
      return { notFound: true }
  }

  const { err, res } = await getListingPages(
    `page_url=${query['page_url']}&populate=_hobbies,_address,seller`,
  )

  if (res?.data.success && res.data.data.no_of_listings === 0) {
    return {
      notFound: true,
    }
  }

  const data = {
    pageData: res?.data.data.listings[0],
    postsData: null,
    mediaData: null,
    reviewsData: null,
    eventsData: null,
    storeData: null,
  }
  return {
    props: {
      data,
    },
  }
}

export default ListingMedia
