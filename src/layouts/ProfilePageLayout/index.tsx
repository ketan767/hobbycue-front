import React, { useEffect, useRef, useState } from 'react'

import ProfileHeader from '../../components/ProfilePage/ProfileHeader/ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { updateProfileLayoutMode } from '@/redux/slices/site'
import ProfileHeaderSmall from '@/components/ProfilePage/ProfileHeader/ProfileHeaderSmall'

type Props = {
  activeTab: ProfilePageTabs
  data: ProfilePageData
  children: React.ReactNode
}

const ProfileLayout: React.FC<Props> = ({ children, activeTab, data }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { isLoggedIn, isAuthenticated, user, activeProfile } = useSelector(
    (state: RootState) => state.user,
  )
  const [showSmallHeader, setShowSmallHeader] = useState(false)

  useEffect(() => {
    if (
      isLoggedIn &&
      isAuthenticated &&
      router.query.profile_url === user.profile_url
    ) {
      dispatch(updateProfileLayoutMode('edit'))
    } else {
      dispatch(updateProfileLayoutMode('view'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router.pathname,
    router.query.profile_url,
    isLoggedIn,
    isAuthenticated,
    user,
    activeProfile,
  ])

  function checkScroll() {
    const scrollValue = window.scrollY || document.documentElement.scrollTop

    if (scrollValue >= 308) setShowSmallHeader(true)
    else setShowSmallHeader(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScroll)
    // return window.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <ProfileHeader data={data.pageData} activeTab={activeTab} />
      {showSmallHeader && (
        <ProfileHeaderSmall data={data.pageData} activeTab={activeTab} />
      )}
      {/* Profile Page Body, where all contents of different tabs appears. */}
      <main>{children}</main>
    </>
  )
}

export default ProfileLayout
