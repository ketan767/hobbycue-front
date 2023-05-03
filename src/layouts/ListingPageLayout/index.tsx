import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'

import { ReactNode } from 'react'
import Link from 'next/link'
import ProfileHeader from '../../components/ProfilePage/Header/Header'
import HomeTab from '../../components/ProfilePage/HomeTab/HomeTab'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import PostsTab from '../../components/ProfilePage/PostsTab/PostsTab'
import MediaTab from '../../components/ProfilePage/MediaTab/MediaTab'
import ListingHeader from '@/components/ListingPage/ListingHeader'
import { useRouter } from 'next/router'

type Props = {
  activeTab: ListingPageTabs
  data: any
}

const ListingPageLayout: React.FC<Props> = ({ activeTab, data }) => {
  const router = useRouter()

  const { isLoggedIn, isAuthenticated, user } = useSelector((state: RootState) => state.user)

  const tabs: ListingPageTabs[] = ['home', 'posts', 'media', 'reviews', 'events', 'store']

  const [profileMode, setProfileMode] = useState<ProfileMode>('view')

  useEffect(() => {
    if (isLoggedIn && isAuthenticated && router.query.profile_url === user.profile_url)
      setProfileMode('edit')
    else setProfileMode('view')
  }, [router, isLoggedIn, isAuthenticated, user])

  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <ListingHeader data={data} profileMode={profileMode} />

      {/* Navigation Links */}
      <nav>
        <div className={styles['navigation-tabs']}>
          {tabs.map((tab) => {
            return (
              <Link
                key={tab}
                href={`/page/${router.query.page_url}/${tab !== 'home' ? tab : ''}`}
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
      {/* <main>{activeTab === 'Home' && <HomeTab data={data} profileMode={profileMode} />}</main> */}
    </>
  )
}

export default ListingPageLayout
