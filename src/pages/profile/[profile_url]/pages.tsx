'use client'
import React, { useEffect, useState } from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import { getListingPages } from '@/services/listing.service'
import store, { RootState } from '@/redux/store'
import PageGridLayout from '@/layouts/PageGridLayout'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/redux/slices/modal'

import styles from '@/styles/ProfileListingPage.module.css'
import ListingCard from '@/components/ListingCard/ListingCard'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import ProfilePagesList from '@/components/ProfilePage/ProfilePagesList/ProfilePagesList'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'
import ProfileAddressSide from '@/components/ProfilePage/ProfileAddressSide'
import ProfileContactSide from '@/components/ProfilePage/ProfileContactSides'
import ProfileSocialMediaSide from '@/components/ProfilePage/ProfileSocialMedia/ProfileSocialMedia'
import { updateProfileMenuExpandAll } from '@/redux/slices/site'
import { useRouter } from 'next/router'
import { useMediaQuery } from '@mui/material'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

interface Props {
  data: ProfilePageData
}

const ProfileListingsPage: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { profile } = useSelector((state: RootState) => state?.site.expandMenu)
  const { user } = useSelector((state: RootState) => state.user)
  const [expandAll, setExpandAll] = useState(profile)
  const [mounted, setMounted] = useState(false)
  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateProfileMenuExpandAll(value))
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const router = useRouter()
  useEffect(() => {
    // Save scroll position when navigating away from the page
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPositionProfile', window.scrollY.toString())
    }

    // Restore scroll position when navigating back to the page
    const handleScrollRestoration = () => {
      const scrollPosition = sessionStorage.getItem('scrollPositionProfile')
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10))
        sessionStorage.removeItem('scrollPositionProfile')
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    router.events.on('routeChangeComplete', handleScrollRestoration)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleScrollRestoration)
    }
  }, [])
  useEffect(() => {
    if (user.id) {
      const userIsAuthorized =
        data.pageData.is_published || user._id === data.pageData.admin
      if (!userIsAuthorized) router.push('/404')
    }
  }, [user._id, data.pageData, router])
  // if (!user.is_onboarded && data?.pageData?.email !== user?.email) {
  //   return <ErrorPage />
  // }

  const itsMe = user?._id === data.pageData?._id
  const isMobile = useMediaQuery('(max-width:1100px)')
  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
    >
      <g clip-path="url(#clip0_15499_3164)">
        <path
          d="M26.5289 17.7933H17.9574V26.3647C17.9574 27.3076 17.186 28.079 16.2432 28.079C15.3003 28.079 14.5289 27.3076 14.5289 26.3647V17.7933H5.95745C5.01459 17.7933 4.24316 17.0219 4.24316 16.079C4.24316 15.1362 5.01459 14.3647 5.95745 14.3647H14.5289V5.7933C14.5289 4.85044 15.3003 4.07901 16.2432 4.07901C17.186 4.07901 17.9574 4.85044 17.9574 5.7933V14.3647H26.5289C27.4717 14.3647 28.2432 15.1362 28.2432 16.079C28.2432 17.0219 27.4717 17.7933 26.5289 17.7933Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_15499_3164">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(0.243164 0.0783691)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const handleAddPage = () => {
    router.push('/add-listing')
  }

  return (
    <>
      <Head>
        <title>{`Pages | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        activeTab={'pages'}
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        {data.pageData && (
          <PageGridLayout column={2}>
            <aside
              className={`custom-scrollbar ${styles['profile-left-aside']} ${
                expandAll ? '' : styles['display-none-responsive']
              }`}
            >
              {/* User Hobbies */}
              <ProfileHobbySideList data={data.pageData} />
              <ProfilePagesList data={data} />

              <div className={styles['display-mobile']}>
                <ProfileAddressSide data={data.pageData} />

                {/* User Contact Details */}
                <ProfileContactSide data={data.pageData} />

                {/*User Social Media visible only for mobile view */}
                <ProfileSocialMediaSide data={data.pageData} />
              </div>
            </aside>

            <main>
              {data.listingsData.length !== 0 && mounted ? (
                // <div className={styles['card-container']}>
                <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1100: 2 }}>
                  <Masonry
                    gutter={isMobile ? `8px` : `12px`}
                    style={{ columnGap: '24px', rowGap: '12px' }}
                  >
                    {itsMe && (
                      <div
                        onClick={handleAddPage}
                        className={styles['add-event']}
                      >
                        <div className={styles['new-tag']}>ADD NEW</div>
                        <button>{plusIcon}</button>
                      </div>
                    )}
                    {itsMe
                      ? data.listingsData.map((listing: any) => {
                          return (
                            <ListingCard key={listing._id} data={listing} />
                          )
                        })
                      : data.listingsData
                          .filter((listing: any) => listing?.is_published)
                          .map((listing: any) => (
                            <ListingCard key={listing._id} data={listing} />
                          ))}
                  </Masonry>
                </ResponsiveMasonry>
              ) : (
                // </div>
                <section className={styles['card-container']}>
                  {itsMe && (
                    <div
                      onClick={handleAddPage}
                      className={styles['add-event']}
                    >
                      <div className={styles['new-tag']}>ADD NEW</div>
                      <button>{plusIcon}</button>
                    </div>
                  )}
                  <div className={styles['no-posts-div']}>
                    <p className={styles['no-posts-text']}>
                      No pages available
                    </p>
                  </div>
                  {!isMobile && !itsMe && (
                    <div className={styles['no-posts-div']}></div>
                  )}
                </section>
              )}
            </main>

            {!itsMe && data.listingsData.length !== 0 ? (
              <div className={styles['card-container-mobile']}>
                {data.listingsData.map((listing: any) => {
                  return <ListingCard key={listing._id} data={listing} />
                })}
              </div>
            ) : data.listingsData.length === 0 ? (
              <section
                className={`${styles['dual-section-wrapper-mobile']} ${styles['mob-min-height']}`}
              >
                <div className={styles['no-posts-div'] + ' margin-bottom-43vh'}>
                  <p className={styles['no-posts-text']}>No pages available</p>
                </div>
              </section>
            ) : (
              ''
            )}
          </PageGridLayout>
        )}
      </ProfileLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query, req, res: ctxRes } = context

  // ctxRes.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=10, stale-while-revalidate=59'
  // )

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings`,
  )

  if (err) return { notFound: true }

  const user = res.data?.data?.users[0]

  if (!user) return { notFound: true }

  const { err: error, res: response } = await getListingPages(
    `populate=_hobbies,_address&admin=${user._id}`,
  )

  // if (response?.data.success && response.data.data.no_of_listings === 0) return { notFound: true }

  const data = {
    pageData: user,
    postsData: null,
    mediaData: null,
    listingsData: response?.data.data.listings,
    blogsData: null,
  }
  return {
    props: {
      data,
    },
  }
}

export default ProfileListingsPage
