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
import ErrorPage from '@/components/ErrorPage'

interface Props {
  data: ProfilePageData
}

const ProfileListingsPage: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { profile } = useSelector((state: RootState) => state?.site.expandMenu)
  const { user } = useSelector((state: RootState) => state.user)
  const [expandAll, setExpandAll] = useState(profile)
  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateProfileMenuExpandAll(value))
  }

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

  return (
    <>
      <Head>
        <title>{`Posts | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        activeTab={'pages'}
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        {data.pageData && (
          <PageGridLayout column={2}>
            <aside className={`custom-scrollbar ${styles['profile-left-aside']} ${
                expandAll ? '' : styles['display-none']
              }`}>
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
              {data.listingsData.length !== 0 ? (
                <div className={styles['card-container']}>
                  {data.listingsData.map((listing: any) => {
                    return <ListingCard key={listing._id} data={listing} />
                  })}
                </div>
              ) : (
                <section
                  className={`${styles['dual-section-wrapper-desktop']}`}
                >
                  <div className={styles['no-posts-div']}>
                    <p className={styles['no-posts-text']}>
                      No pages available
                    </p>
                  </div>
                  <div className={styles['no-posts-div']}></div>
                </section>
              )}
            </main>

            <div className={styles['nav-mobile']}>
              <ProfileNavigationLinks activeTab={'pages'} />
            </div>
            {data.listingsData.length !== 0 ? (
              <div className={styles['card-container-mobile']}>
                {data.listingsData.map((listing: any) => {
                  return <ListingCard key={listing._id} data={listing} />
                })}
              </div>
            ) : (
              <section className={`${styles['dual-section-wrapper-mobile']} ${styles['mob-min-height']}`}>
                <div className={styles['no-posts-div']}>
                  <p className={styles['no-posts-text']}>No pages available</p>
                </div>
              </section>
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
