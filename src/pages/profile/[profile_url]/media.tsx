import { useRouter } from 'next/router'
import React from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'

interface Props {
  data: ProfilePageData
}

const ProfilePostsPage: React.FC<Props> = ({ data }) => {
  // const { isLoggedIn, user } = useSelector((state: RootState) => state.user)

  return (
    <>
      <Head>
        <title>{`Posts | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'media'} data={data} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings`,
  )

  if (err) return { notFound: true }

  if (res?.data.success && res.data.data.no_of_users === 0) return { notFound: true }

  const data = {
    pageData: res.data.data.users[0],
    postsData: null,
    mediaData: null,
    pagesData: null,
    blogsData: null,
  }
  return {
    props: {
      data,
    },
  }
}

export default ProfilePostsPage
