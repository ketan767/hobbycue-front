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
import { updateProfileData, updateUser } from '@/redux/slices/user'
import { withAuth } from '@/navigation/withAuth'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'
import {
  updateAboutOpenState,
  updateProfileLayoutMode,
  updateProfileMenuExpandAll,
} from '@/redux/slices/site'
import ErrorPage from '@/components/ErrorPage'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { useMediaQuery } from '@mui/material'
import { htmlToPlainTextAdv } from '@/utils'

interface Props {
  data: ProfilePageData
  unformattedAbout?: string
}

const ProfileHome: React.FC<Props> = ({ data, unformattedAbout }) => {
  console.warn({ data })
  const dispatch = useDispatch()
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const { profile } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(profile)
  const [pageData, setPageData] = useState(data.pageData)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [displayAbout, setDisplayAbout] = useState(false)
  const [displayOther, setDisplayOther] = useState(false)
  const { activeModal } = useSelector((state: RootState) => state.modal)
  const [hobbyError, setHobbyError] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [locationError, setLocationError] = useState(false)
  const [contactError, setContactError] = useState(false)
  const [showAbout, setShowAbout] = useState(true)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const [posts, setPosts] = useState([])
  const router = useRouter()
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const isMobile = useMediaQuery('(min-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(true)
    }
  }, [isMobile])
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
  useEffect(() => {
    getPost()
  }, [user.pinned_post])

  let pinnedPosts = posts.filter((item: any) => item.isPinned === true)
  let unpinnnedPosts = posts.filter((item: any) => item.isPinned !== true)
  console.log('profileurl', data)

  useEffect(() => {
    if (expandAll !== undefined) {
      setDisplayAbout(expandAll)
      setDisplayOther(expandAll)
    }
  }, [expandAll])

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateProfileMenuExpandAll(value))
  }

  useEffect(() => {
    setPageData(data?.pageData)
    dispatch(updateProfileData(data.pageData))
  }, [data?.pageData])

  useEffect(() => {
    if (user.id) {
      const userIsAuthorized =
        data.pageData.is_published || user._id === data.pageData.admin
      if (!userIsAuthorized) router.push('/404')
    }
  }, [user._id, data.pageData, router])

  const navigationTabs = (tab: string) => {
    let hasError = false
    console.log({ hobbies: data.pageData._hobbies })

    if (profileLayoutMode === 'edit') {
      setHobbyError(false)
      setLocationError(false)
      setTitleError(false)
      if (data.pageData._hobbies.length === 0) {
        setHobbyError(true)
        hasError = true
      }
      if (
        !data.pageData.primary_address ||
        !data.pageData.primary_address.city
      ) {
        setLocationError(true)
        hasError = true
      }
      if (!data.pageData.full_name || data.pageData.full_name === '') {
        setTitleError(true)
        hasError = true
      }
      // if (
      //   !data.pageData.website &&
      //   !data.pageData.public_email &&
      //   !data.pageData.whatsapp_number.number &&
      //   !data.pageData.phone.number
      // ) {
      //   setContactError(true)
      //   hasError = true
      // }
      if (!hasError) {
        router.push(
          `/profile/${router.query.profile_url}/${tab !== 'home' ? tab : ''}`,
        )
      } else {
        // setSnackbar({
        //   display: true,
        //   type: 'warning',
        //   message: 'Fill up the mandatory fields.',
        // })
        dispatch(
          openModal({
            type: 'SimpleOnboarding',
            closable: true,
            propData: { showError: true },
          }),
        )
      }
    } else {
      router.push(
        `/profile/${router.query.profile_url}/${tab !== 'home' ? tab : ''}`,
      )
    }
  }
  const { CurrentUrl, showProfileError } = useSelector(
    (state: RootState) => state.user,
  )

  useEffect(() => {
    if (showProfileError && profileLayoutMode === 'edit') {
      noDataChecker()
    }
  }, [CurrentUrl, showProfileError])

  const noDataChecker = () => {
    let hasError = false

    if (profileLayoutMode === 'edit') {
      setHobbyError(false)
      setLocationError(false)
      setTitleError(false)
      if (data.pageData._hobbies.length === 0) {
        setHobbyError(true)
        hasError = true
      }
      if (
        !data.pageData.primary_address ||
        !data.pageData.primary_address.city
      ) {
        setLocationError(true)
        hasError = true
      }
      if (!data.pageData.full_name || data.pageData.full_name === '') {
        setTitleError(true)
        hasError = true
      }
      // if (
      //   !data.pageData.website &&
      //   !data.pageData.public_email &&
      //   !data.pageData.whatsapp_number.number &&
      //   !data.pageData.phone.number
      // ) {
      //   setContactError(true)
      //   hasError = true
      // }

      /** ⬆️ UPDATE THE ONBOARDING STATUS IN DB */
      // updateMyProfileDetail({
      //   ...data.pageData,
      //   is_onboarded: !hasError,
      // })
      //   .then(({ res, err }) => {
      //     console.log('asifs res', res)
      //     if (!err && res?.data?.success) {
      //       return getMyProfileDetail()
      //     }
      //   })
      //   .then((response) => {
      //     dispatch(updateUser(response?.res?.data.data.user))
      //   })
      if (hasError) {
        dispatch(
          openModal({
            type: 'SimpleOnboarding',
            closable: true,
            propData: { showError: true },
          }),
        )
      }
    }
    return hasError
  }

  useEffect(() => {
    if (router.asPath.includes('showGeneral=true')) {
      router.replace(`/profile/${user.profile_url}`)
      dispatch(
        openModal({
          type: 'profile-general-edit',
          closable: true,
        }),
      )
    } else if (router.asPath.includes('showHobby=true')) {
      router.replace(`/profile/${user.profile_url}`)
      dispatch(openModal({ type: 'profile-hobby-edit', closable: true }))
    } else if (router.asPath.includes('showLocation=true')) {
      router.replace(`/profile/${user.profile_url}`)
      dispatch(openModal({ type: 'profile-address-edit', closable: true }))
    }
  }, [router.asPath])

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content={`${data?.pageData?.profile_image}`}
        />
        <meta
          property="og:image:secure_url"
          content={`${data?.pageData?.profile_image}`}
        />
        <meta
          property="og:description"
          content={`${
            (data?.pageData?.tagline || '') +
            (data?.pageData?.tagline && unformattedAbout ? ' | ' : '') +
            (unformattedAbout || '')
          }`}
        />
        <meta property="og:image:alt" content="Profile picture" />
        <title>{`${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        navigationTabs={navigationTabs}
        activeTab={'home'}
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
        titleError={titleError}
        noDataChecker={noDataChecker}
      >
        {data?.pageData && (
          <PageGridLayout activeTab="home" column={3}>
            <aside
              className={`custom-scrollbar ${styles['profile-left-aside']} ${
                expandAll ? '' : styles['display-none-responsive']
              }`}
            >
              <div className={styles['display-mobile-initial']}>
                {htmlToPlainTextAdv(data?.pageData?.description).trim().length >
                  0 && (
                  <PageContentBox
                    showEditButton={profileLayoutMode === 'edit'}
                    onEditBtnClick={() =>
                      dispatch(
                        openModal({
                          type: 'listing-about-edit',
                          closable: true,
                        }),
                      )
                    }
                    setDisplayData={() => {
                      setShowAbout((prev) => !prev)
                      dispatch(
                        updateAboutOpenState({
                          [data?.pageData?._id]: !showAbout,
                        }),
                      )
                    }}
                    expandData={showAbout}
                  >
                    <div className={`${styles['location-heading']}`}>
                      <h4 className={styles['heading']}>About</h4>
                      <ul
                        className={`${styles['hobby-list']} ${
                          styles['tags-list']
                        } ${styles['display-desktop']}${
                          showAbout ? ' ' + styles['display-mobile'] : ''
                        }`}
                      ></ul>
                    </div>
                    {showAbout && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: data?.pageData?.description,
                        }}
                      ></div>
                    )}
                  </PageContentBox>
                )}
              </div>
              {/* User Hobbies */}
              <ProfileHobbySideList
                hobbyError={hobbyError}
                data={pageData}
                expandData={expandAll}
              />
              <ProfilePagesList expandData={expandAll} data={data} />

              <div className={styles['display-mobile']}>
                {/* User Locations */}
                <ProfileAddressSide
                  addressError={locationError}
                  data={pageData}
                  expandData={expandAll}
                />

                {/* User Contact Details */}
                <ProfileContactSide
                  contactError={contactError}
                  data={pageData}
                  expandData={expandAll}
                />
                <ProfileSocialMediaSide
                  expandData={expandAll}
                  data={pageData}
                />
              </div>
            </aside>

            <main>
              {/* User About for desktop view*/}

              <div className={styles['display-desktop']}>
                <PageContentBox
                  showEditButton={profileLayoutMode === 'edit'}
                  onEditBtnClick={() =>
                    dispatch(
                      openModal({ type: 'profile-about-edit', closable: true }),
                    )
                  }
                  setDisplayData={setDisplayAbout}
                >
                  <h4 className={styles['no-margin']}>About</h4> 
                  {/* About of profile page */}
                  <div className={`ql-snow`}>
                    <div
                      className={`ql-editor ${styles['ql-editor']} ${styles['fontFouteen']}`}
                      dangerouslySetInnerHTML={{ __html: pageData?.about }}
                    ></div>
                  </div>
                </PageContentBox>
              </div>

              {/* User Information */}
              <div
                className={
                  profileLayoutMode === 'edit'
                    ? styles['display-desktop']
                    : styles['display-none']
                }
              >
                <PageContentBox
                  showEditButton={profileLayoutMode === 'edit'}
                  onEditBtnClick={() =>
                    dispatch(
                      openModal({
                        type: 'profile-general-edit',
                        closable: true,
                      }),
                    )
                  }
                  setDisplayData={setDisplayOther}
                  expandData={expandAll}
                >
                  <h4 className={styles['other-info-heading']}>
                    Other Information
                  </h4>
                  <div
                    className={`${styles['display-desktop']}${
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
                        <p className={styles['color-light']}>
                          {pageData.gender}
                        </p>
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
              </div>

              {/* <section className={styles['posts-container']}>
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
              </section> */}
            </main>

            <aside className={styles['display-desktop']}>
              {/* User Locations */}
              <ProfileAddressSide
                addressError={locationError}
                data={pageData}
              />

              {/* User Contact Details */}
              <ProfileContactSide contactError={contactError} data={pageData} />
              <ProfileSocialMediaSide data={pageData} />
            </aside>

            {/* About for mobile view */}
            {(pageData?.about || profileLayoutMode == 'edit') && (
              <div
                className={`${styles['display-mobile']} ${styles['mob-min-height']}`}
              >
                <PageContentBox
                  showEditButton={profileLayoutMode === 'edit'}
                  onEditBtnClick={() =>
                    dispatch(
                      openModal({ type: 'profile-about-edit', closable: true }),
                    )
                  }
                >
                  <h4>About</h4>
                  {pageData?.about && (
                    // <div
                    //   className={`${styles['color-light']} ${styles['about-text']} ${styles['about-text-mobile']}`}
                    //   dangerouslySetInnerHTML={{ __html: pageData?.about }}
                    // ></div>
                    <div className={`ql-snow`}>
                      <div
                        className={`ql-editor ${styles['ql-editor']}`}
                        dangerouslySetInnerHTML={{ __html: pageData?.about }}
                      ></div>
                    </div>
                  )}
                </PageContentBox>
              </div>
            )}

            {/* User Information for mobile view */}
            <div
              className={`${
                profileLayoutMode === 'edit'
                  ? styles['display-mobile']
                  : styles['display-none']
              } ${' margin-bottom-52vh'}`}
            >
              <PageContentBox
                expandData={expandAll}
                showEditButton={profileLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({
                      type: 'profile-general-edit',
                      closable: true,
                    }),
                  )
                }
              >
                <h4 className={styles['other-info-heading']}>
                  Other Information
                </h4>
                <div
                  className={`${styles['display-flex-col']} ${styles['other-info-mob-div']}`}
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
            </div>

            {/* <section className={styles['posts-container-mobile']}>
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
            </section> */}
          </PageGridLayout>
        )}
      </ProfileLayout>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
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

  const { err: error1, res: response1 } = await getListingPages(
    `populate=_hobbies,_address&admin=${user._id}`,
  )
  const { err: error2, res: response2 } = await getListingPages(
    `populate=_hobbies,_address&public_email=${user.email}`,
  )
  const combinedListingsData = [
    ...(response1?.data.data.listings || []),
    ...(response2?.data.data.listings || []),
  ]

  const uniqueListingsData = combinedListingsData.filter(
    (listing, index, self) =>
      index === self.findIndex((l) => l.page_url === listing.page_url),
  )

  const data = {
    pageData: res.data.data.users[0],
    postsData: null,
    mediaData: null,
    listingsData: uniqueListingsData,
    blogsData: null,
  }

  const unformattedAbout = htmlToPlainTextAdv(res.data.data.users[0]?.about)

  return {
    props: {
      data,
      unformattedAbout,
    },
  }
}

export default ProfileHome
