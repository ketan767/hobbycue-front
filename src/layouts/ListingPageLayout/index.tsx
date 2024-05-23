import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'

import { ReactNode } from 'react'
import Link from 'next/link'
import ListingPageMain from '@/components/ListingPage/ListingPageMain/ListingPageMain'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingHeader from '@/components/ListingPage/ListingHeader/ListingHeader'
import { useRouter } from 'next/router'
import ListingHomeTab from '@/components/ListingPage/ListingHomeTab/ListingHomeTab'
import {
  updateListingLayoutMode,
  updateListingTypeModalMode,
} from '@/redux/slices/site'
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
import PageContentBox from '../PageContentBox'
import { openModal } from '@/redux/slices/modal'
import EditIcon from '@/assets/svg/edit-colored.svg'
import { SetLinkviaAuth } from '@/redux/slices/user'

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
  setExpandAll?: (value: boolean) => void
  expandAll?: boolean
}

const ListingPageLayout: React.FC<Props> = ({
  data,
  children,
  activeTab,
  expandAll,
  setExpandAll,
}) => {
  console.warn({ data })

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
    if (!isLoggedIn && tab === 'posts') {
      dispatch(
        SetLinkviaAuth(
          `/page/${router.query.page_url}/${tab !== 'home' ? tab : ''}`,
        ),
      )
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
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
      <ListingHeader
        setContactInfoErr={setContactInfoErr}
        setHAboutErr={setHAboutErr}
        setHobbyError={setHobbyError}
        setLocationErr={setLocationErr}
        setpageTypeErr={setpageTypeErr}
        data={data.pageData}
        activeTab={activeTab}
      />
      {showSmallHeader && (
        <ListingHeaderSmall data={data.pageData} activeTab={activeTab} />
      )}
      {/* Navigation Links */}
      <nav className={styles['nav']}>
        <div className={`${styles['navigation-tabs']}`}>
          {tabs.map((tab) => {
            if (tab === 'events') {
              if (data.pageData.type !== 3)
                return (
                  <a
                    key={tab}
                    onClick={() => navigationTabs(tab)}
                    className={activeTab === tab ? styles['active'] : ''}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </a>
                )
            } else {
              return (
                <a
                  key={tab}
                  onClick={() => navigationTabs(tab)}
                  className={activeTab === tab ? styles['active'] : ''}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </a>
              )
            }
          })}
          {/* Add a condition to include a blank tab if 'events' tab is not present */}
          {data.pageData.type === 3 && (
            <a key="blank-tab" href="#" className={styles.disabledtab}>
              {' '}
            </a>
          )}
        </div>
      </nav>
      <div
        className={`${styles['expand-all-page-type-wrapper']} ${styles['display-flex-mobile']}`}
      >
        <div
          className={`${styles['display-flex-mobile']} ${styles['listing-page-type-wrapper']}`}
          onClick={() => {
            if (listingLayoutMode === 'edit') {
              dispatch(openModal({ type: 'listing-type-edit', closable: true }))
              dispatch(updateListingTypeModalMode({ mode: 'edit' }))
            }
          }}
        >
          {data.pageData.page_type.map((type: any, idx: any) => {
            return (
              <div key={idx}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_173_56244)">
                    <path
                      d="M17 10.43V2H7V10.43C7 10.78 7.18 11.11 7.49 11.29L11.67 13.8L10.68 16.14L7.27 16.43L9.86 18.67L9.07 22L12 20.23L14.93 22L14.15 18.67L16.74 16.43L13.33 16.14L12.34 13.8L16.52 11.29C16.82 11.11 17 10.79 17 10.43ZM13 12.23L12 12.83L11 12.23V3H13V12.23Z"
                      fill="#0096C8"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_173_56244">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p>{type}</p>
              </div>
            )
          })}
          {listingLayoutMode === 'edit' && <Image src={EditIcon} alt="" />}
        </div>

        <div
          onClick={() => {
            if (setExpandAll !== undefined) setExpandAll(!expandAll)
          }}
          className={styles['expand-all']}
        >
          {expandAll ? <p>Collapse All</p> : <p>Expand All</p>}
          <Image
            src={ChevronDown}
            style={{transition:"all 0.3s ease"}}
            className={`${
              expandAll ? styles['rotate-180'] : styles['rotate-0']
            }`}
            alt=""
          />
        </div>
      </div>

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
          <div
            className={`${styles['navigation-tabs']} ${
              !expandAll ? styles['mobile-mt-0'] : ''
            }`}
          >
            {tabs.map((tab) => {
              if (tab === 'events') {
                if (data.pageData.type !== 3)
                  return (
                    <a
                      key={tab}
                      onClick={() => navigationTabs(tab)}
                      className={activeTab === tab ? styles['active'] : ''}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </a>
                  )
              } else {
                return (
                  <a
                    key={tab}
                    onClick={() => navigationTabs(tab)}
                    className={activeTab === tab ? styles['active'] : ''}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </a>
                )
              }
            })}
          </div>
        </nav>
        <div className={styles['display-mobile-main']}>
          {activeTab === 'home' && (
            <div className={styles['display-mobile']}>
              <PageContentBox
                className={AboutErr ? styles.errorBorder : ''}
                showEditButton={listingLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'listing-about-edit', closable: true }),
                  )
                }
              >
                <h4>About</h4>
                <div
                  className={`${styles['about-text']} ${styles['display-mobile']}`}
                  dangerouslySetInnerHTML={{
                    __html: data.pageData?.description,
                  }}
                ></div>
              </PageContentBox>
              <PageContentBox
                showEditButton={listingLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'listing-general-edit', closable: true }),
                  )
                }
              >
                <h4 className={styles['display-mobile']}>Other Information</h4>
                <div className={`${styles['other-data-wrapper-mobile']}`}>
                  <h4>Profile URL</h4>
                  <div className={styles.textGray}>
                    {data.pageData?.page_url}
                  </div>
                  {data.pageData?.gender && (
                    <>
                      <h4>Gender</h4>
                      <div className={styles.textGray}>
                        {data.pageData?.gender}
                      </div>
                    </>
                  )}
                  {data.pageData?.year && (
                    <>
                      <h4>Year</h4>
                      <div className={styles.textGray}>
                        {data.pageData?.year}
                      </div>
                    </>
                  )}
                  {data.pageData?.admin_note && (
                    <>
                      <h4>Notes</h4>
                      <div className={styles.textGray}>
                        {data.pageData?.admin_note}
                      </div>
                    </>
                  )}
                </div>
              </PageContentBox>
            </div>
          )}

          {activeTab === 'posts' && (
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
              <ListingReviewsTab pageData={data?.pageData} />
            </div>
          )}
          {activeTab === 'store' && (
            <div className={styles['display-mobile']}>
              <ListingStoreTab />
            </div>
          )}
          {activeTab === 'events' && (
            <div className={styles['display-mobile']}>
              <ListingEventsTab data={data.pageData} />
            </div>
          )}
        </div>
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
