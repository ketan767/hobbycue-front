import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { GetServerSideProps } from 'next'
import {
  getAllUserDetail,
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import { getAllPosts } from '@/services/post.service'
import PostCard from '@/components/PostCard/PostCard'
import { getListingPages } from '@/services/listing.service'
import styles from '@/styles/ProfilePostsPage.module.css'
import ProfileAddressSide from '@/components/ProfilePage/ProfileAddressSide'
import ProfileContactSide from '@/components/ProfilePage/ProfileContactSides'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import ProfilePagesList from '@/components/ProfilePage/ProfilePagesList/ProfilePagesList'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import { showProfileError, updateUser } from '@/redux/slices/user'
import PostWrapper from '@/layouts/PinnedPost/PinnedPost'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'
import ProfileSocialMediaSide from '@/components/ProfilePage/ProfileSocialMedia/ProfileSocialMedia'
import { RootState } from '@/redux/store'
import { updateProfileMenuExpandAll } from '@/redux/slices/site'
import ErrorPage from '@/components/ErrorPage'
import { useMediaQuery } from '@mui/material'

interface Props {
  data: ProfilePageData
}

const ProfilePostsPage: React.FC<Props> = ({ data }) => {
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [posts, setPosts] = useState([])
  const dispatch = useDispatch()
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { refreshNum } = useSelector((state: RootState) => state.post)
  const { profile } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(profile)
  const router = useRouter()
  const isMobile = useMediaQuery('(min-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])
  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getAllPosts(
      `author_type=User&_author=${data.pageData._id}&populate=_author,_genre,_hobby,_allHobbies._hobby1,_allHobbies._hobby2,_allHobbies._hobby3,_allHobbies._genre1,_allHobbies._genre2,_allHobbies._genre3`,
    )
    setLoadingPosts(false)
    if (err) return console.log(err)
    if (res.data.success) {
      let allPosts = res.data.data.posts
      allPosts = allPosts.map((post: any) => {
        if (post._id === user.pinned_post) {
          return { ...post, isPinned: true }
        } else {
          return post
        }
      })
      allPosts = allPosts.sort((x: any) => (x.isPinned ? -1 : 1))
      setPosts(allPosts)
    }
  }

  useEffect(() => {
    getPost()
  }, [user.pinned_post, refreshNum])

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

  const onPinPost = async (postId: any) => {
    console.log(postId)
    const reqBody = {
      pinned_post: postId,
    }
    const { err, res } = await updateMyProfileDetail(reqBody)

    if (err) {
      return console.log(err)
    }

    const { err: error, res: response } = await getMyProfileDetail()

    if (error) return console.log(error)
    if (response?.data.success) {
      console.log('response', response)
      dispatch(updateUser(response.data.data.user))
      // window.location.reload()
    }
  }
  let pinnedPosts = posts.filter((item: any) => item.isPinned === true)
  let unpinnnedPosts = posts.filter((item: any) => item.isPinned !== true)
  console.log('posts', data)

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateProfileMenuExpandAll(value))
  }

  const HandleNotOnboard = () => {
    // router.push(`/profile/${user.profile_url}`)
    // dispatch(showProfileError(true))
    dispatch(openModal({ type: 'SimpleOnboarding', closable: true }))
  }

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
        activeTab={'posts'}
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <PageGridLayout column={3}>
          <aside
            className={`custom-scrollbar ${styles['profile-left-aside']} ${
              expandAll ? '' : styles['display-none-responsive']
            }`}
          >
            <ProfileHobbySideList data={data.pageData} />
            <ProfilePagesList data={data} />
            <div className={styles['display-mobile']}>
              {/* User Locations */}
              <ProfileAddressSide data={data.pageData} />

              {/* User Contact Details */}
              <ProfileContactSide data={data.pageData} />

              {/*User Social Media visible only for mobile view */}
              <ProfileSocialMediaSide data={data.pageData} />
            </div>
          </aside>
          <main className={styles['middle-section']}>
            {profileLayoutMode === 'edit' && (
              <>
                <section
                  className={`content-box-wrapper ${styles['start-post-btn-container']}`}
                >
                  <button
                    onClick={() => {
                      if (user.is_onboarded)
                        dispatch(
                          openModal({ type: 'create-post', closable: true }),
                        )
                      else HandleNotOnboard()
                    }}
                    className={styles['start-post-btn']}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_704_44049)">
                        <path
                          d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_704_44049">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span>Start a post</span>
                  </button>
                </section>
              </>
            )}
            {isLoggedIn ? (
              <section className={styles['posts-container']}>
                {loadingPosts ? (
                  <>
                    <PostCardSkeletonLoading />
                    <PostCardSkeletonLoading />
                    <PostCardSkeletonLoading />
                  </>
                ) : (
                  posts.length === 0 && (
                    <div className={styles['no-posts-container']}>
                      <p>No posts available</p>
                    </div>
                  )
                )}

                {pinnedPosts.map((post: any) => {
                  return (
                    <PostWrapper title="Pinned Post" key={post._id}>
                      <PostCard
                        key={post._id}
                        postData={post}
                        fromProfile={true}
                        onPinPost={onPinPost}
                        currentSection="posts"
                      />
                    </PostWrapper>
                  )
                })}
                {unpinnnedPosts.length > 0 && (
                  <PostWrapper title={pinnedPosts.length > 0 ? 'Recent Post' : ''}>
                    {unpinnnedPosts.map((post: any) => {
                      return (
                        <PostCard
                          key={post._id}
                          postData={post}
                          fromProfile={true}
                          onPinPost={onPinPost}
                          currentSection="posts"
                        />
                      )
                    })}
                  </PostWrapper>
                )}
              </section>
            ) : (
              ''
              // <div className={styles['no-posts-container']}>
              //   <p
              //     className="cursor-pointer"
              //     onClick={() => {
              //       dispatch(openModal({ type: 'auth', closable: true }))
              //     }}
              //   >
              //     Login to see the posts
              //   </p>
              // </div>
            )}
          </main>
          <aside className={styles['display-desktop']}>
            {/* User Locations */}
            <ProfileAddressSide data={data.pageData} />

            {/* User Contact Details */}
            <ProfileContactSide data={data.pageData} />

            {/*User Social Media visible only for mobile view */}
            <ProfileSocialMediaSide data={data.pageData} />
          </aside>
          {isMobile && (
            <div style={{ height: '8px', background: '#EBEDF0' }}></div>
          )}
          {profileLayoutMode == 'edit' && (
            <section
              className={`content-box-wrapper ${styles['start-post-btn-container-mobile']}`}
            >
              <button
                onClick={() => {
                  if (user.is_onboarded)
                    dispatch(openModal({ type: 'create-post', closable: true }))
                  else HandleNotOnboard()
                }}
                className={styles['start-post-btn']}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_704_44049)">
                    <path
                      d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
                      fill="#8064A2"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_704_44049">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <span>Start a post</span>
              </button>
            </section>
          )}
          {isMobile && (
            <div style={{ height: '8px', background: '#EBEDF0' }}></div>
          )}
          <section className={styles['posts-container-mobile']}>
            {loadingPosts ? (
              <PostCardSkeletonLoading />
            ) : (
              posts.length === 0 && (
                <div className={styles['no-posts-container']}>
                  <p>No posts available</p>
                </div>
              )
            )}

            {pinnedPosts.map((post: any) => {
              return (
                <PostWrapper title="Pinned Post" key={post._id}>
                  <PostCard
                    key={post._id}
                    postData={post}
                    fromProfile={true}
                    onPinPost={onPinPost}
                    currentSection="posts"
                  />
                </PostWrapper>
              )
            })}
            {unpinnnedPosts.length > 0 && (
              <PostWrapper title={pinnedPosts.length > 0 ? 'Recent Post' : ''}>
                {unpinnnedPosts.map((post: any) => {
                  return (
                    <PostCard
                      key={post._id}
                      postData={post}
                      fromProfile={true}
                      onPinPost={onPinPost}
                      currentSection="posts"
                    />
                  )
                })}
              </PostWrapper>
            )}
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
  const user = res.data?.data?.users[0]
  if (err) return { notFound: true }
  const { err: error, res: response } = await getListingPages(
    `populate=_hobbies,_address&admin=${user._id}`,
  )

  if (res?.data.success && res.data.data.no_of_users === 0)
    return { notFound: true }

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

export default ProfilePostsPage
