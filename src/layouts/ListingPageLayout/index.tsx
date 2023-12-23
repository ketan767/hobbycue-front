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
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import IconButton from '@mui/material/IconButton'
import WarningIcon from '@/assets/svg/warning-icon.svg'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import ListingPostsTab from '@/components/ListingPage/ListingPagePosts/ListingPagePosts'
import ListingMediaTab from '@/components/ListingPage/ListingPageMedia'
import ListingReviewsTab from '@/components/ListingPage/ListingPageReviews/ListingPageReviews'
import ListingStoreTab from '@/components/ListingPage/ListingPageStore/ListingPageStore'
import ListingEventsTab from '@/components/ListingPage/ListingPageEvents/ListingPageEvents'

interface Props {
  activeTab: ListingPageTabs
  data: ListingPageData['pageData']
  children: React.ReactElement<{
    hobbyError?: boolean
    pageTypeErr?: boolean
    AboutErr?: boolean
    ContactInfoErr?: boolean
    LocationErr?: boolean
  }>
}

const ListingPageLayout: React.FC<Props> = ({ data, children, activeTab }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [showSmallHeader, setShowSmallHeader] = useState(false)
  const [pageTypeErr, setpageTypeErr] = useState(false)
  const [hobbyError, setHobbyError] = useState(false)
  const [AboutErr, setHAboutErr] = useState(false)
  const [ContactInfoErr, setContactInfoErr] = useState(false)
  const [LocationErr, setLocationErr] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  const { listingModalData, listingLayoutMode } = useSelector(
    (state: RootState) => state.site,
  )

  console.log(activeTab, 'activeTab')

  function checkScroll() {
    const scrollValue = window.scrollY || document.documentElement.scrollTop

    if (scrollValue >= 308) setShowSmallHeader(true)
    else setShowSmallHeader(false)
  }
  const navigationTabs = (tab: any) => {
    let hasError = false
    console.log('layutmode', listingLayoutMode)

    if (listingLayoutMode === 'edit') {
      setHobbyError(false)
      setpageTypeErr(false)
      setHAboutErr(false)
      setContactInfoErr(false)
      setLocationErr(false)

      if (data.pageData._hobbies.length === 0) {
        setHobbyError(true)
        hasError = true
      }
      if (data.pageData.page_type.length === 0) {
        setpageTypeErr(true)
        hasError = true
      }
      if (data.pageData._hobbies.length === 0) {
        setHAboutErr(true)
        hasError = true
      }
      if (!data.pageData.phone && !data.pageData.public_email) {
        setContactInfoErr(true)
        hasError = true
      }
      if (!data.pageData._address.city) {
        setLocationErr(true)
        hasError = true
      }

      if (!hasError) {
        router.push(
          `/page/${router.query.page_url}/${tab !== 'home' ? tab : ''}`,
        )
      } else {
        setSnackBarOpen(true)
      }
    } else {
      router.push(`/page/${router.query.page_url}/${tab !== 'home' ? tab : ''}`)
    }
  }

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false)
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
    content = React.cloneElement(children, {
      hobbyError,
      pageTypeErr,
      AboutErr,
      ContactInfoErr,
      LocationErr,
    })
  } else {
    content = children
  }
  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <ListingHeader data={data.pageData} activeTab={activeTab} />
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
      <main>
        {React.cloneElement(children, {
          hobbyError,
          pageTypeErr,
          AboutErr,
          ContactInfoErr,
          LocationErr,
        })}
      </main>
      <div style={{ backgroundColor: '#f8f9fa' }}>
        <nav className={styles['nav-mobile']}>
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
        {(activeTab === 'home' || activeTab === 'posts') && (
          <div className={styles['display-mobile']}>
            <ListingPostsTab data={data} hideStartPost={true} />
          </div>
        )}
        {activeTab === 'media' && (
          <div className={styles['display-mobile']}>
            <ListingMediaTab data={data?.pageData} />
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className={styles['display-mobile']}>
            <ListingReviewsTab />
          </div>
        )}
        {activeTab === 'store' && (
          <div className={styles['display-mobile']}>
            <ListingStoreTab />
          </div>
        )}
        {activeTab === 'events' && (
          <div className={styles['display-mobile']}>
            <ListingEventsTab />
          </div>
        )}
      </div>
      {/* Snackbar component */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        key={'bottom' + 'left'}
        className={styles.customSnackbar}
      >
        <SnackbarContent
          className={styles.customSnackbarContent}
          message={
            <span className={styles.message}>
              <Image src={WarningIcon} alt="Warning" width={40} height={40} />
              Fill up the mandatory fields.
            </span>
          }
          action={[
            <IconButton
              key="close"
              className={styles.CloseIcon}
              onClick={handleCloseSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </>
  )
}

export default ListingPageLayout
