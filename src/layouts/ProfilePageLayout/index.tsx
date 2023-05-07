import React, { useState, useEffect } from 'react'
import styles from './ProfileLayout.module.css'

import { ReactNode } from 'react'
import Link from 'next/link'
import ProfileHeader from '../../components/ProfilePage/Header/Header'
import HomeTab from '../../components/ProfilePage/HomeTab/HomeTab'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import PostsTab from '../../components/ProfilePage/PostsTab/PostsTab'
import MediaTab from '../../components/ProfilePage/MediaTab/MediaTab'
import { useRouter } from 'next/router'

type Props = {
  activeTab: ProfilePageTabs
  data: ProfilePageData
}

const ProfileLayout: React.FC<Props> = ({ activeTab, data }) => {
  const router = useRouter()

  const { isLoggedIn, isAuthenticated, user } = useSelector((state: RootState) => state.user)

  const tabs: ProfilePageTabs[] = ['home', 'posts', 'media', 'pages', 'blogs']

  const [layoutMode, setLayoutMode] = useState<ProfileLayoutMode>('view')

  useEffect(() => {
    if (isLoggedIn && isAuthenticated && router.query.profile_url === user.profile_url)
      setLayoutMode('edit')
    else setLayoutMode('view')
  }, [router.query.profile_url, isLoggedIn, isAuthenticated, user])

  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <ProfileHeader data={data.pageData} mode={layoutMode} />

      {/* Navigation Links */}
      <nav>
        <div className={styles['navigation-tabs']}>
          {tabs.map((tab) => {
            return (
              <Link
                key={tab}
                href={`/profile/${router.query.profile_url}/${tab !== 'home' ? tab : ''}`}
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
      <main>
        {activeTab === 'home' && data.pageData && (
          <HomeTab data={data.pageData} mode={layoutMode} />
        )}
        {activeTab === 'posts' && data.postsData && <PostsTab />}
        {activeTab === 'media' && <MediaTab />}
      </main>
    </>
  )
}

export default ProfileLayout
