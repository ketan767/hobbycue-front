import React, { useEffect, useRef, useState } from 'react'

import ProfileHeader from '../../components/ProfilePage/ProfileHeader/ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { updateProfileLayoutMode } from '@/redux/slices/site'
import ProfileHeaderSmall from '@/components/ProfilePage/ProfileHeader/ProfileHeaderSmall'
import HobbyPageHeader from '@/components/HobbyPage/HobbyHeader/HobbyHeader'

type Props = {
  activeTab: HobbyPageTabs
  data: any
  children: React.ReactNode
}

const HobbyPageLayout: React.FC<Props> = ({ children, activeTab, data }) => {
  const [showSmallHeader, setShowSmallHeader] = useState(false)

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
      <HobbyPageHeader data={data} activeTab={activeTab} />
      {/* {showSmallHeader && (
        <HobbyPageHeader data={data.pageData} activeTab={activeTab} />
      )} */}

      {/* Profile Page Body, where all contents of different tabs appears. */}
      <main>{children}</main>
    </>
  )
}

export default HobbyPageLayout
