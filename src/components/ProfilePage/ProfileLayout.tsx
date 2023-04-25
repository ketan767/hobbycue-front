import React, { useState, useEffect } from 'react'
import styles from './ProfileLayout.module.css'

import { ReactNode } from 'react'
import Link from 'next/link'
import ProfileHeader from './Header/Header'
import HomeTab from './HomeTab/HomeTab'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = {
  profileUrl: string
  activeTab: 'Home' | 'Posts' | 'Media' | 'Pages' | 'Blogs'
  detail: any
}
export type ProfileMode = 'view' | 'edit'

const ProfileLayout: React.FC<Props> = (props) => {
  const { profileUrl, activeTab, detail } = props

  const { isLoggedIn, isAuthenticated, userDetail } = useSelector((state: RootState) => state.user)

  const [profileMode, setProfileMode] = useState<ProfileMode>('view')

  useEffect(() => {
    if (isLoggedIn && isAuthenticated && profileUrl === userDetail.profile_url)
      setProfileMode('edit')
    else setProfileMode('view')
  }, [profileUrl, isLoggedIn, isAuthenticated, userDetail])

  return (
    <>
      <ProfileHeader detail={detail} />

      {/* Navigation Links */}
      <nav>
        <div className={styles['navigation-tabs']}>
          <Link
            href={`/profile/${profileUrl}`}
            className={activeTab === 'Home' ? styles['active'] : ''}
          >
            Home
          </Link>
          <Link
            href={`/profile/${profileUrl}/posts`}
            className={activeTab === 'Posts' ? styles['active'] : ''}
          >
            Posts
          </Link>
          <Link
            href={`/profile/${profileUrl}/media`}
            className={activeTab === 'Media' ? styles['active'] : ''}
          >
            Media
          </Link>
          <Link
            href={`/profile/${profileUrl}/pages`}
            className={activeTab === 'Pages' ? styles['active'] : ''}
          >
            Pages
          </Link>
          <Link
            href={`/profile/${profileUrl}/blogs`}
            className={activeTab === 'Blogs' ? styles['active'] : ''}
          >
            Blogs
          </Link>
        </div>
      </nav>

      {/*  */}
      <main>
        {activeTab === 'Home' && <HomeTab detail={detail} profileMode={profileMode} />}
        {activeTab === 'Posts' && <h1>Posts</h1>}
        {activeTab === 'Media' && <h1>Media</h1>}
      </main>
    </>
  )
}

export default ProfileLayout
