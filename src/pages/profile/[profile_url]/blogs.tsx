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
import { useMediaQuery } from '@mui/material'

import { createBlog, getAllBlogs } from '@/services/blog.services'
import BlogCard from '@/components/BlogCard/BlogCard'
import PlusIcon from '@/assets/icons/PlusIcon'
import dynamic from 'next/dynamic'
const ResponsiveMasonry = dynamic(
  () => import('react-responsive-masonry').then((mod) => mod.ResponsiveMasonry),
  {
    ssr: false,
  },
)
const Masonry = dynamic(() => import('react-responsive-masonry'), {
  ssr: false,
})

interface Props {
  data: ProfilePageData
}

const ProfileBlogsPage: React.FC<Props> = ({ data }) => {
  // const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { profile } = useSelector((state: RootState) => state?.site.expandMenu)
  const { user } = useSelector((state: RootState) => state.user)
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const [expandAll, setExpandAll] = useState(profile)
  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateProfileMenuExpandAll(value))
  }
  const isMobile = useMediaQuery('(max-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem(
        'scrollPositionProfile',
        window?.scrollY?.toString(),
      )
    }

    // Restore scroll position when navigating back to the page
    const handleScrollRestoration = () => {
      const scrollPosition = sessionStorage.getItem('scrollPositionProfile')
      if (scrollPosition) {
        window?.scrollTo(0, parseInt(scrollPosition, 10))
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

  const handleAddBlog = async (e: any) => {
    try {
      const { res, err } = await createBlog()
      if (err) throw err
      if (!res?.data?.success)
        throw new Error(res?.data?.message || 'Error creating blog!')
      const url = res?.data?.data?.url
      if (url) router.push(`/blog/${url}`)
      else throw new Error('Unsuccessful!')
    } catch (err) {
      console.log('Error while creating blog at handleAddBlog()!', err)
    }
  }

  return (
    <>
      <Head>
        <title>{`Blogs | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        activeTab={'blogs'}
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
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
            {/* </Masonry> */}
            {data?.blogsData.length !== 0 ? (
              // <div className={styles['three-column-grid-blogs']}>
              <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1100: 3 }}>
                <Masonry
                  gutter={isMobile ? `8px` : `24px`}
                  style={
                    isMobile
                      ? { columnGap: '24px', rowGap: '12px', marginTop: '8px' }
                      : { columnGap: '24px', rowGap: '24px' }
                  }
                >
                  {profileLayoutMode === 'edit' && (
                    <div
                      className={styles.uploadButtonDescktop}
                      onClick={handleAddBlog}
                    >
                      <div className={styles.newTag}>ADD NEW</div>
                      <PlusIcon />
                    </div>
                  )}
                  {data?.blogsData.map((blog: any) => {
                    return <BlogCard key={blog._id} data={blog} />
                  })}
                </Masonry>
              </ResponsiveMasonry>
            ) : (
              <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1100: 3 }}>
                <Masonry
                  gutter={isMobile ? `8px` : `12px`}
                  style={
                    isMobile
                      ? { columnGap: '24px', rowGap: '12px', marginTop: '8px' }
                      : { columnGap: '24px', rowGap: '12px' }
                  }
                  className={styles['dual-section-wrapper']}
                >
                  {profileLayoutMode === 'edit' ? (
                    <div
                      className={styles.uploadButtonDescktop}
                      onClick={handleAddBlog}
                    >
                      <div className={styles.newTag}>ADD NEW</div>
                      <PlusIcon />
                    </div>
                  ) : (
                    <div
                      style={
                        isMobile
                          ? {
                              marginTop: '8px',
                              height: '100px',
                              borderRadius: '0px',
                            }
                          : undefined
                      }
                      className={styles['no-posts-div']}
                    >
                      <p className={styles['no-posts-text']}>
                        No Blogs Available
                      </p>
                    </div>
                  )}
                  {/* {!isMobile && ( */}
                  <div
                    style={
                      isMobile
                        ? {
                            marginTop: '8px',
                            height: '100px',
                            borderRadius: '0px',
                          }
                        : undefined
                    }
                    className={styles['no-posts-div']}
                  >
                    <p className={styles['no-posts-text']}>
                      No Blogs Available
                    </p>
                  </div>
                  {/* )} */}
                  {!isMobile && (
                    <div
                      style={
                        isMobile
                          ? {
                              marginTop: '8px',
                              height: '100px',
                              borderRadius: '0px',
                            }
                          : undefined
                      }
                      className={styles['no-posts-div']}
                    >
                      <p className={styles['no-posts-text']}>
                        No Blogs Available
                      </p>
                    </div>
                  )}
                </Masonry>
              </ResponsiveMasonry>
              // <section
              //   className={`${styles['dual-section-wrapper']} ${styles['mob-min-height']} ${styles['mob-h-auto']}`}
              // >
              //   <div
              //     style={
              //       isMobile
              //         ? {
              //             marginTop: '8px',
              //             height: '100px',
              //             borderRadius: '0px',
              //           }
              //         : undefined
              //     }
              //     className={styles['no-posts-div']}
              //   >
              //     <p className={styles['no-posts-text']}>No Blogs Available</p>
              //   </div>
              //   {isMobile ? null : (
              //     <>
              //       <div className={styles['no-posts-div']}></div>
              //       <div className={styles['no-posts-div']}></div>
              //     </>
              //   )}
              // </section>
            )}
          </main>
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

  const { err: error, res: response } = await getAllBlogs(
    `populate=_hobbies,author&author=${user?._id}`,
  )

  const data = {
    pageData: res.data.data.users[0],
    postsData: null,
    mediaData: null,
    listingsData: null,
    blogsData: response?.data?.data?.blog,
    response: response?.data,
  }
  return {
    props: {
      data,
    },
  }
}

export default ProfileBlogsPage
