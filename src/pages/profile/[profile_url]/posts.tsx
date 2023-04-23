import { useRouter } from 'next/router'
import React from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/userService'
import Head from 'next/head'
import ProfileLayout from '@/components/ProfilePage/ProfileLayout'

type Props = {
  data: any
}

const ProfilePostsPage: React.FC<Props> = (props) => {
  const { data } = props

  const detail = data.data.users[0]
  console.log('🚀 ~ file: [profile_url].tsx:31 ~ detail:', detail)

  const router = useRouter()

  // const { isLoggedIn, userDetail } = useSelector((state: RootState) => state.user)

  if (!detail) {
    return <h1>Loading...</h1>
  }
  return (
    <>
      <Head>
        <title>{detail.full_name}</title>
      </Head>

      <ProfileLayout
        activeTab={'Posts'}
        profileUrl={router.query.profile_url as string}
        detail={detail}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context

  let data = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses`,
  )

  return {
    props: { data },
  }
}

export default ProfilePostsPage
