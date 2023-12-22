import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import {
  getAllUserDetail,
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import PageContentBox from '@/layouts/PageContentBox'
import { openModal } from '@/redux/slices/modal'

import styles from '@/styles/ProfileHomePage.module.css'
import ProfileAddressSide from '@/components/ProfilePage/ProfileAddressSide'
import ProfileContactSide from '@/components/ProfilePage/ProfileContactSides'
import { getAllPosts } from '@/services/post.service'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import PostCard from '@/components/PostCard/PostCard'
import ProfilePagesList from '@/components/ProfilePage/ProfilePagesList/ProfilePagesList'
import PinnedPostWrapper from '@/layouts/PinnedPost/PinnedPost'
import ProfileSocialMediaSide from '@/components/ProfilePage/ProfileSocialMedia/ProfileSocialMedia'
import { getListingPages } from '@/services/listing.service'
import PostWrapper from '@/layouts/PinnedPost/PinnedPost'
import { updateUser } from '@/redux/slices/user'
import { withAuth } from '@/navigation/withAuth'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'

interface Props {
  data: ProfilePageData
}

const ProfileHome: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const [pageData, setPageData] = useState(data.pageData)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [displayAbout, setDisplayAbout] = useState(false)
  const [displayOther, setDisplayOther] = useState(false)

  const [posts, setPosts] = useState([])
  const router = useRouter()
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getAllPosts(
      `author_type=User&_author=${data.pageData._id}&populate=_author,_genre,_hobby`,
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
  useEffect(() => {
    getPost()
  }, [user.pinned_post])

  let pinnedPosts = posts.filter((item: any) => item.isPinned === true)
  let unpinnnedPosts = posts.filter((item: any) => item.isPinned !== true)
  console.log('profileurl', data)

  return (
    <>
      <Head>
        <title>{`${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'home'} data={data}>
        {data.pageData && (
          <PageGridLayout column={3}>
            <aside
              className={`custom-scrollbar ${styles['profile-left-aside']}`}
            >
              {/* User Hobbies */}
              <ProfileHobbySideList data={pageData} />
              <ProfilePagesList data={data} />
            </aside>

            <main>
              {/* User About */}
              <PageContentBox
                showEditButton={profileLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'profile-about-edit', closable: true }),
                  )
                }
                setDisplayData={setDisplayAbout}
              >
                <h4>About</h4>
                <div
                  className={`${styles['color-light']} ${styles['about-text']}${
                    displayAbout ? ' ' + styles['about-text-mobile'] : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: pageData?.about }}
                ></div>
              </PageContentBox>

              {/* User Information */}
              <PageContentBox
                showEditButton={profileLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'profile-general-edit', closable: true }),
                  )
                }
                setDisplayData={setDisplayOther}
              >
                <h4 className={styles['other-info-heading']}>
                  Other Information
                </h4>
                <div
                  className={`${styles['display-mobile-none']}${
                    displayOther
                      ? ' ' +
                        styles['display-flex-col'] +
                        ' ' +
                        styles['other-info-mob-div']
                      : ''
                  }`}
                >
                  <h4 className={styles['other-info-subheading']}>
                    Profile URL
                  </h4>
                  <p className={styles['color-light']}>
                    {pageData.profile_url}
                  </p>
                  {pageData.gender && (
                    <>
                      <h4 className={styles['other-info-subheading']}>
                        Gender
                      </h4>
                      <p className={styles['color-light']}>{pageData.gender}</p>
                    </>
                  )}
                  {pageData.year_of_birth && (
                    <>
                      <h4 className={styles['other-info-subheading']}>
                        Year Of Birth
                      </h4>
                      <p className={styles['color-light']}>
                        {pageData.year_of_birth}
                      </p>
                    </>
                  )}
                </div>
              </PageContentBox>

              <section className={styles['posts-container']}>
                {loadingPosts ? (
                  <PostCardSkeletonLoading />
                ) : (
                  posts.length === 0 && 'No Posts'
                )}

                {pinnedPosts.map((post: any) => {
                  return (
                    <PostWrapper title="Pinned Post" key={post._id}>
                      <PostCard
                        key={post._id}
                        postData={post}
                        fromProfile={true}
                        onPinPost={onPinPost}
                      />
                    </PostWrapper>
                  )
                })}
                {unpinnnedPosts.length > 0 && (
                  <PostWrapper title="Recent Post">
                    {unpinnnedPosts.map((post: any) => {
                      return (
                        <PostCard
                          key={post._id}
                          postData={post}
                          fromProfile={true}
                          onPinPost={onPinPost}
                        />
                      )
                    })}
                  </PostWrapper>
                )}
              </section>
            </main>

            <aside>
              {/* User Locations */}
              <ProfileAddressSide data={pageData} />

              {/* User Contact Details */}
              <ProfileContactSide data={pageData} />
              <ProfileSocialMediaSide data={pageData} />
            </aside>
            
            <div className={styles['nav-mobile']}>
            <ProfileNavigationLinks activeTab={'home'}/>
            </div>

            <section className={styles['posts-container-mobile']}>
                {loadingPosts ? (
                  <PostCardSkeletonLoading />
                ) : (
                  posts.length === 0 && 'No Posts'
                )}

                {pinnedPosts.map((post: any) => {
                  return (
                    <PostWrapper title="Pinned Post" key={post._id}>
                      <PostCard
                        key={post._id}
                        postData={post}
                        fromProfile={true}
                        onPinPost={onPinPost}
                      />
                    </PostWrapper>
                  )
                })}
                {unpinnnedPosts.length > 0 && (
                  <PostWrapper title="Recent Post">
                    {unpinnnedPosts.map((post: any) => {
                      return (
                        <PostCard
                          key={post._id}
                          postData={post}
                          fromProfile={true}
                          onPinPost={onPinPost}
                        />
                      )
                    })}
                  </PostWrapper>
                )}
              </section>
          </PageGridLayout>
        )}
      </ProfileLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context
  console.log('context', context)

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings`,
  )

  if (err) return { notFound: true }

  if (res?.data.success && res.data.data.no_of_users === 0)
    return { notFound: true }

  const user = res.data?.data?.users[0]

  if (!user) return { notFound: true }

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

export default withAuth(ProfileHome)
