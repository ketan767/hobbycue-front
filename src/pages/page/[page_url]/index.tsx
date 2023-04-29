import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/userService'
import Head from 'next/head'
import ProfileLayout from '@/components/ProfilePage/ProfileLayout'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = {
  data: any
}

const Profile: React.FC<Props> = (props) => {
  const { data } = props

  const [detail, setDetail] = useState(data?.data?.users[0])
  console.log('🚀 ~ file: index.tsx:19 ~ detail:', detail)

  const router = useRouter()

  const { isLoggedIn, isAuthenticated, userDetail } = useSelector((state: RootState) => state.user)
  console.log('🚀 ~ file: index.tsx:28 ~ useEffect ~ userDetail:', userDetail)

  useEffect(() => {
    if (isLoggedIn && isAuthenticated && detail._id === userDetail._id) setDetail(userDetail)
  }, [userDetail])

  if (!detail) {
    return <h1>Loading...</h1>
  }
  return (
    <>
      <Head>
        <title>{`${detail.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        activeTab={'Home'}
        profileUrl={router.query.profile_url as string}
        detail={detail}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address`,
  )
  console.log({ err, data: res.data })

  if (res.data.success && res.data.data.no_of_users === 0) {
    return {
      notFound: true,
    }
  }
  return {
    props: { data: res.data },
  }
}

export default Profile
