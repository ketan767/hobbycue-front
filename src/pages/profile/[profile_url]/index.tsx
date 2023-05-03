import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/userService'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = {
  data: any
}

const ProfileHome: React.FC<Props> = (props) => {
  const { data } = props

  const [detail, setDetail] = useState(data?.data?.users[0])

  const { isLoggedIn, isAuthenticated, user } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (isLoggedIn && isAuthenticated && detail._id === user._id) setDetail(user)
  }, [user])

  if (!detail) {
    return <h1>Loading...</h1>
  }
  return (
    <>
      <Head>
        <title>{`${detail.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'home'} detail={detail} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address`,
  )

  if (err) return { notFound: true }

  if (res?.data.success && res.data.data.no_of_users === 0) return { notFound: true }

  return {
    props: { data: res.data },
  }
}

export default ProfileHome
