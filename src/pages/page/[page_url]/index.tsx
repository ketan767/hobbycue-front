import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingPageLayout from '@/layouts/ListingPageLayout'
import { getListingPages } from '@/services/listing.service'
import {
  updateListingModalData,
  updateListingPageData,
} from '@/redux/slices/site'
import ListingHomeTab from '@/components/ListingPage/ListingHomeTab/ListingHomeTab'
import ListingPageMain from '@/components/ListingPage/ListingPageMain/ListingPageMain'

type Props = { data: ListingPageData }

const ListingHome: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const [error, seterror] = useState({
    hobby: false,
    about: false,
    location: false,
    contact: false,
  })
  // const { isLoggedIn, isAuthenticated, user } = useSelector((state: RootState) => state.user)
  // const { listingPageData } = useSelector((state: RootState) => state.site)
  console.log('data', props.data)
  useEffect(() => {
    dispatch(updateListingPageData(props.data.pageData))
    dispatch(updateListingModalData(props.data.pageData))
  }, [])

  return (
    <>
      <Head>
        <title>{`${props.data.pageData?.title} | HobbyCue`}</title>
      </Head>

      <ListingPageLayout
        activeTab={'home'}
        data={props.data}
        seterror={seterror}
      >
        <ListingPageMain data={props.data.pageData}>
          <ListingHomeTab data={props.data.pageData} />
        </ListingPageMain>
      </ListingPageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getListingPages(
    `page_url=${query['page_url']}&populate=_hobbies,_address`,
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

export default ListingHome
