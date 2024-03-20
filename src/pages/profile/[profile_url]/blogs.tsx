import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import ProfilePagesList from '@/components/ProfilePage/ProfilePagesList/ProfilePagesList'
import { getListingPages } from '@/services/listing.service'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'
import ProfileAddressSide from '@/components/ProfilePage/ProfileAddressSide'
import ProfileContactSide from '@/components/ProfilePage/ProfileContactSides'
import ProfileSocialMediaSide from '@/components/ProfilePage/ProfileSocialMedia/ProfileSocialMedia'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateProfileMenuExpandAll } from '@/redux/slices/site'
import ErrorPage from '@/components/ErrorPage'

interface Props {
  data: ProfilePageData
}

const ProfileBlogsPage: React.FC<Props> = ({ data }) => {
  // const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
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
  if (!user.is_onboarded && data?.pageData?.email !== user?.email) {
    return <ErrorPage />
  }
  return (
    <>
      <Head>
        <title>{`Posts | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        activeTab={'blogs'}
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <PageGridLayout column={2}>
          <aside className={expandAll ? '' : styles['display-none']}>
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
          <div className={styles['nav-mobile']}>
            <ProfileNavigationLinks activeTab={'blogs'} />
          </div>
          <section className={`${styles['dual-section-wrapper']}`}>
            <div className={styles['no-posts-div']}>
              <p className={styles['no-posts-text']}>
                This feature is under development. Come back soon to view this
              </p>
            </div>
            <div className={styles['no-posts-div']}></div>
            <div className={styles['no-posts-div']}></div>
          </section>
        </PageGridLayout>
      </ProfileLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings`,
  )

  if (err) return { notFound: true }

  const user = res.data?.data?.users[0]

  if (res?.data.success && res.data.data.no_of_users === 0)
    return { notFound: true }

  const { err: error, res: response } = await getListingPages(
    `populate=_hobbies,_address&admin=${user._id}`,
  )

  const data = {
    pageData: res.data.data.users[0],
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

export default ProfileBlogsPage
