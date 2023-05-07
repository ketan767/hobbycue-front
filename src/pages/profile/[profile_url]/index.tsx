import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'

interface Props {
  data: ProfilePageData
}

const ProfileHome: React.FC<Props> = ({ data }) => {
  // const { isLoggedIn, isAuthenticated, user } = useSelector((state: RootState) => state.user)

  // useEffect(() => {
  //  if (isLoggedIn && isAuthenticated && data.pageData._id === user._id) setDetail(user)
  // }, [user])

  const { isLoggedIn, isAuthenticated, user } = store.getState().user

  return (
    <>
      <Head>
        <title>{`${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'home'} data={data} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings`,
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

export default ProfileHome
