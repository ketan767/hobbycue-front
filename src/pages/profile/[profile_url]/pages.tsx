import { useRouter } from 'next/router'
import React from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import { getListingPages } from '@/services/listing.service'
import ProfilePagesTab from '@/components/ProfilePage/ProfilePagesTab/ProfilePagesTab'

interface Props {
  data: ProfilePageData
}

const ProfileListingsPage: React.FC<Props> = ({ data }) => {
  // const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  console.log(data)

  return (
    <>
      <Head>
        <title>{`Posts | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'pages'} data={data}>
        {data.pageData && <ProfilePagesTab data={data} />}
      </ProfileLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings`,
  )

  if (err) return { notFound: true }

  const user = res.data?.data?.users[0]

  if (!user) return { notFound: true }

  const { err: error, res: response } = await getListingPages(
    `populate=_hobbies,_address&admin=${user._id}`,
  )

  if (response?.data.success && response.data.data.no_of_listings === 0) return { notFound: true }

  const data = {
    pageData: user,
    postsData: null,
    mediaData: null,
    listingsData: response?.data.data.listings,
    blogsData: null,
  }
  return {
    props: {
      data,
    },
  }
}

export default ProfileListingsPage
