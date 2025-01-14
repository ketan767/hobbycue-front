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

import ListingPageMain from '@/components/ListingPage/ListingPageMain/ListingPageMain'
import ListingStoreTab from '@/components/ListingPage/ListingPageStore/ListingPageStore'
import ErrorPage from '@/components/ErrorPage'
import { useMediaQuery } from '@mui/material'
import { formatDateRange, htmlToPlainTextAdv, pageType } from '@/utils'

type Props = {
  data: ListingPageData
  unformattedAbout?: string
  address?: any
  result?: any
  pageTypeAndCity?: any
  date?: any
  time?: string
  pageTypeAndPrice?: any
}

const ListingStore: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const { listing } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(listing)
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  // const { listingPageData } = useSelector((state: RootState) => state.site)
  console.log('posts data', props.data)
  useEffect(() => {
    dispatch(updateListingPageData(props.data.pageData))
    dispatch(updateListingModalData(props.data.pageData))
  }, [])
  const isMobile = useMediaQuery('(max-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateListingMenuExpandAll(value))
  }
  const router = useRouter()
  useEffect(() => {
    // Save scroll position when navigating away from the page
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
  }, [])
  if (
    props?.data?.pageData?.admin !== user?._id &&
    props?.data?.pageData?.is_published !== true
  ) {
    return <ErrorPage restricted />
  }
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/${pageType(
            props?.data?.pageData?.type,
          )}/${props?.data?.pageData?.page_url}/store`}
        />
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
          content={`${
            props?.data?.pageData?.type === 1 ||
            props?.data?.pageData?.type === 2
              ? props?.data?.pageData?.tagline
                ? props?.data?.pageData?.tagline +
                  ' ⬢ ' +
                  props?.pageTypeAndCity
                : props?.result + ' ⬢ ' + props.pageTypeAndCity
              : props?.data?.pageData?.type === 3
              ? props?.data?.pageData?.tagline
                ? props?.data?.pageData?.tagline +
                  ' ⬢ ' +
                  props?.pageTypeAndCity +
                  ' ' +
                  props?.date +
                  (props?.time ? ` | ${props?.time}` : '')
                : props?.address +
                  ' ⬢ ' +
                  props?.pageTypeAndCity +
                  ' ' +
                  props?.date +
                  (props?.time ? ` | ${props?.time}` : '')
              : props?.data?.pageData?.tagline
              ? props?.data?.pageData?.tagline + ' ⬢ ' + props?.pageTypeAndPrice
              : props?.result + ' ⬢ ' + props?.pageTypeAndPrice
          }`}
        />
        <meta property="og:image:alt" content="Profile picture" />
        <title>{`${props.data.pageData?.title} | HobbyCue`}</title>
      </Head>

      <ListingPageLayout
        activeTab={'store'}
        data={props.data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <ListingPageMain
          data={props.data.pageData}
          expandAll={expandAll}
          activeTab={'store'}
        >
          <div>
            <ListingStoreTab data={props?.data?.storeData} />
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
      typeId = 1
      break
    case 'place':
      typeId = 2
      break
    case 'program':
      typeId = 3
      break
    case 'product':
      typeId = 4
      break
    default:
      return { notFound: true }
  }

  const { err, res } = await getListingPages(
    `page_url=${query['page_url']}&populate=_hobbies,_address,seller,product_variant`,
  )

  if (res?.data.success && res.data.data.no_of_listings === 0) {
    return {
      notFound: true,
    }
  }

  const { err: storeErr, res: StoreRes } = await getListingPages(
    `seller=${res?.data?.data?.listings[0]._id}&populate=_hobbies,_address,seller,product_variant`,
  )

  if (res?.data.data.listings[0]?.type !== typeId) {
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
    storeData: StoreRes?.data?.data?.listings,
  }

  const address = [
    data.pageData?._address?.society,
    data.pageData?._address?.locality,
    data.pageData?._address?.city,
  ]
    .filter(Boolean)
    .join(', ')

  const unformattedAbout = htmlToPlainTextAdv(data.pageData?.description)

  const hobbiesDisplay =
    data.pageData?._hobbies
      ?.slice(0, 3)
      ?.map((hobbyItem: any, index: any) => {
        const hobbyDisplay = hobbyItem?.hobby?.display || ''
        const genreDisplay = hobbyItem?.genre?.display
          ? ` - ${hobbyItem?.genre?.display}`
          : ''
        const separator =
          index < data.pageData?._hobbies.length - 1 && index < 2 ? ', ' : ''
        return `${hobbyDisplay}${genreDisplay}${separator}`
      })
      ?.join('') || ''

  const additionalHobbies =
    data.pageData?._hobbies?.length > 3
      ? ` (+${data.pageData?._hobbies?.length - 3})`
      : ''

  const result = `${hobbiesDisplay}${additionalHobbies}`

  const pageTypeAndCity =
    data.pageData?.page_type.map((pt: string, index: number) => {
      return `${index > 0 ? ' ' : ''}${pt}`
    }) +
      (data.pageData?._address?.city
        ? ` | ${data.pageData?._address?.city}`
        : '') || '\u00a0'

  const date =
    data.pageData?.event_date_time.length !== 0
      ? formatDateRange(data.pageData?.event_date_time[0])
      : ''

  const time = data.pageData?.event_date_time[0]?.from_time
    ? ` ${data.pageData?.event_date_time[0]?.from_time}` +
      (data.pageData?.event_date_time[0]?.to_time
        ? ` - ${data.pageData?.event_date_time[0]?.to_time}`
        : '')
    : ''

  const pageTypeAndPrice =
    data.pageData?.page_type.map((pt: string, index: number) => {
      return `${index > 0 ? ' ' : ''}${pt}`
    }) +
    (data.pageData?.product_variant?.variations[0]?.value
      ? ` | ₹${data.pageData?.product_variant?.variations[0]?.value}`
      : ` | ₹0`)

  return {
    props: {
      data,
      address,
      unformattedAbout,
      result,
      pageTypeAndCity,
      date,
      time,
      pageTypeAndPrice,
    },
  }
}

export default ListingStore
