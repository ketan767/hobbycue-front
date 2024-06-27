import React, { useEffect, useRef, useState } from 'react'

import ProfileHeader from '../../components/ProfilePage/ProfileHeader/ProfileHeader'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { updateProfileLayoutMode } from '@/redux/slices/site'
import ProfileHeaderSmall from '@/components/ProfilePage/ProfileHeader/ProfileHeaderSmall'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'
import styles from './styles.module.css'
import Image from 'next/image'
import { closeModal, openModal } from '@/redux/slices/modal'
import { getMyProfileDetail } from '@/services/user.service'
type Props = {
  activeTab: ProfilePageTabs
  data: ProfilePageData
  children: React.ReactElement
  setExpandAll?: (value: boolean) => void
  expandAll?: boolean
  navigationTabs?: (tab: string) => void
  titleError?: boolean
  noDataChecker?: () => boolean
}

const ProfileLayout: React.FC<Props> = ({
  children,
  activeTab,
  data,
  setExpandAll,
  expandAll,
  navigationTabs,
  titleError,
  noDataChecker,
}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { isLoggedIn, isAuthenticated, user, activeProfile } = useSelector(
    (state: RootState) => state.user,
  )
  const [showSmallHeader, setShowSmallHeader] = useState(false)
  const { activeModal } = useSelector((state: RootState) => state.modal)
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

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
    } else if (activeModal !== 'SimpleOnboarding') {
      dispatch(closeModal())
    }
  }, [isLoggedIn])

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
      <ProfileHeader
        noDataChecker={noDataChecker}
        titleError={titleError}
        data={data.pageData}
      />
      <div className={styles['nav']}>
        <ProfileNavigationLinks
          navigationTabs={navigationTabs}
          activeTab={activeTab}
        />
      </div>

      {showSmallHeader && (
        <ProfileHeaderSmall
          navigationTabs={navigationTabs}
          data={data.pageData}
          activeTab={activeTab}
          noDataChecker={noDataChecker}
        />
      )}

      <div
        onClick={() => {
          if (setExpandAll !== undefined) setExpandAll(!expandAll)
        }}
        className={styles['expand-all']}
      >
        {expandAll ? <p>Collapse All</p> : <p>Expand All</p>}
        <Image
          src={ChevronDown}
          className={`${expandAll ? styles['rotate-180'] : styles['rotate-0']}`}
          style={{ transition: 'all 0.3s ease' }}
          alt=""
        />
      </div>
      {/* Profile Page Body, where all contents of different tabs appears. */}
      <main>{React.cloneElement(children, { expandAll })}</main>
    </>
  )
}

export default ProfileLayout
