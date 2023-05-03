import { useRouter } from 'next/router'
import React from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/userService'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'

type Props = {
  data: any
}

const ProfilePostsPage: React.FC<Props> = (props) => {
  const { data } = props

  const detail = data.data.users[0]
  console.log('🚀 ~ file: [profile_url].tsx:31 ~ detail:', detail)

  // const { isLoggedIn, user } = useSelector((state: RootState) => state.user)

  if (!detail) {
    return <h1>Loading...</h1>
  }
  return (
    <>
      <Head>
        <title>{`Posts | ${detail.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'posts'} detail={detail} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses`,
  )

  return {
    props: { data: res.data },
  }
}

export default ProfilePostsPage
