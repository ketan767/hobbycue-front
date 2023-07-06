import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'

import { ReactNode } from 'react'
import Link from 'next/link'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingHeader from '@/components/ListingPage/ListingHeader/ListingHeader'
import { useRouter } from 'next/router'
import ListingHomeTab from '@/components/ListingPage/ListingHomeTab/ListingHomeTab'
import { updateListingLayoutMode } from '@/redux/slices/site'

type Props = {
  activeTab: ListingPageTabs
  data: ListingPageData
  children: React.ReactNode
}

const ListingPageLayout: React.FC<Props> = ({ children, activeTab, data }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )

  const tabs: ListingPageTabs[] = [
    'home',
    'posts',
    'media',
    'reviews',
    'events',
    'store',
  ]

  useEffect(() => {
    if (
      isLoggedIn &&
      isAuthenticated &&
      Boolean(
        user._listings?.find(
          (listing: any) => listing.page_url === router.query.page_url,
        ),
      )
    )
      dispatch(updateListingLayoutMode('edit'))
    else dispatch(updateListingLayoutMode('view'))
  }, [router.pathname, isLoggedIn, isAuthenticated, user])

  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <ListingHeader data={data.pageData} />

      {/* Navigation Links */}
      <nav className={styles['nav']}>
        <div className={styles['navigation-tabs']}>
          {tabs.map((tab) => {
            return (
              <Link
                key={tab}
                href={`/page/${router.query.page_url}/${
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

export default ListingPageLayout
