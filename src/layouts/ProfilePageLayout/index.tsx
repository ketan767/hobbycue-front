import React, { useState, useEffect } from 'react'
import styles from './ProfileLayout.module.css'

import { ReactNode } from 'react'
import Link from 'next/link'
import ProfileHeader from '../../components/ProfilePage/ProfileHeader/ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { updateProfileLayoutMode } from '@/redux/slices/site'

type Props = {
  activeTab: ProfilePageTabs
  data: ProfilePageData
  children: React.ReactNode
}

const ProfileLayout: React.FC<Props> = ({ children, activeTab, data }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  )

  const tabs: ProfilePageTabs[] = ['home', 'posts', 'media', 'pages', 'blogs']

  useEffect(() => {
    if (
      isLoggedIn &&
      isAuthenticated &&
      router.query.profile_url === user.profile_url
    )
      dispatch(updateProfileLayoutMode('edit'))
    else dispatch(updateProfileLayoutMode('view'))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.pathname,
    router.query.profile_url,
    isLoggedIn,
    isAuthenticated,
    user,
  ])

  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <ProfileHeader data={data.pageData} />

      {/* Navigation Links */}
      <nav>
        <div className={styles['navigation-tabs']}>
          {tabs.map((tab) => {
            return (
              <Link
                key={tab}
                href={`/profile/${router.query.profile_url}/${
                  tab !== 'home' ? tab : ''
                }`}
                shallow
                className={activeTab === tab ? styles['active'] : ''}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Profile Page Body, where all contents of different tabs appears. */}
      <main>{children}</main>
    </>
  )
}

export default ProfileLayout
