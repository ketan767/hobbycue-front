import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'

import { ReactNode } from 'react'
import Link from 'next/link'
import ListingPageMain from '@/components/ListingPage/ListingPageMain/ListingPageMain'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingHeader from '@/components/ListingPage/ListingHeader/ListingHeader'
import { useRouter } from 'next/router'
import ListingHomeTab from '@/components/ListingPage/ListingHomeTab/ListingHomeTab'
import { updateListingLayoutMode } from '@/redux/slices/site'
import ListingHeaderSmall from '@/components/ListingPage/ListingHeader/ListingHeaderSmall'
import { error } from 'console'
import { getListingPages } from '@/services/listing.service'

interface Props {
  activeTab: ListingPageTabs
  data: ListingPageData['pageData']
  children: React.ReactElement<{ hobbyError?: boolean }>
  hobbyError?: boolean
}

const ListingPageLayout: React.FC<Props> = ({ data, children, activeTab }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [showSmallHeader, setShowSmallHeader] = useState(false)
  const [hobbyError, setHobbyError] = useState(false)

  function checkScroll() {
    const scrollValue = window.scrollY || document.documentElement.scrollTop

    if (scrollValue >= 308) setShowSmallHeader(true)
    else setShowSmallHeader(false)
  }
  const navigationTabs = (tab: any) => {
    if (data.pageData._hobbies.length === 0) {
      setHobbyError(true)
    } else {
      router.push(`/page/${router.query.page_url}/${tab !== 'home' ? tab : ''}`)
    }
  }
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const determineUserMode = () => {
    if (isLoggedIn && isAuthenticated) {
      const userHasListing = Boolean(
        user._listings?.find(
          (listing: any) => listing.page_url === router.query.page_url,
        ),
      )

      if (userHasListing) {
        dispatch(updateListingLayoutMode('edit'))
      } else {
        dispatch(updateListingLayoutMode('view'))
      }
    } else {
      dispatch(updateListingLayoutMode('view'))
    }
  }

  console.log('dataa', data)

  useEffect(() => {
    window.addEventListener('scroll', checkScroll)

    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  useEffect(() => {
    if (router.isReady) {
      determineUserMode()
    }
  }, [user, router.query.page_url, isLoggedIn, isAuthenticated, dispatch])

  const tabs: ListingPageTabs[] = [
    'home',
    'posts',
    'media',
    'reviews',
    'events',
    'store',
  ]
  let content

  if (React.isValidElement(children) && typeof children.type !== 'string') {
    content = React.cloneElement(children, { hobbyError: hobbyError })
  } else {
    content = children
  }

  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <ListingHeader data={data.pageData} />
      {showSmallHeader && (
        <ListingHeaderSmall data={data.pageData} activeTab={activeTab} />
      )}
      {/* Navigation Links */}
      <nav className={styles['nav']}>
        <div className={styles['navigation-tabs']}>
          {tabs.map((tab) => {
            return (
              <a
                key={tab}
                onClick={() => navigationTabs(tab)}
                className={activeTab === tab ? styles['active'] : ''}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </a>
            )
          })}
        </div>
      </nav>

      {/* Profile Page Body, where all contents of different tabs appears. */}
      <main>{children}</main>
    </>
  )
}

export default ListingPageLayout
