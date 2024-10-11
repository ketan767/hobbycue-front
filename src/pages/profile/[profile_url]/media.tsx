import { useRouter } from 'next/router'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import {
  getAllUserDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { RootState } from '@/redux/store'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import PageGridLayout from '@/layouts/PageGridLayout'
import { getListingPages } from '@/services/listing.service'
import { getAllPosts, uploadImage } from '@/services/post.service'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import ProfilePagesList from '@/components/ProfilePage/ProfilePagesList/ProfilePagesList'
import ReactPlayer from 'react-player'
import { updateImageUrl } from '@/redux/slices/modal'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'
import ProfileAddressSide from '@/components/ProfilePage/ProfileAddressSide'
import ProfileContactSide from '@/components/ProfilePage/ProfileContactSides'
import ProfileSocialMediaSide from '@/components/ProfilePage/ProfileSocialMedia/ProfileSocialMedia'
import { updateProfileMenuExpandAll } from '@/redux/slices/site'
import ErrorPage from '@/components/ErrorPage'
import { useMediaQuery } from '@mui/material'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

import dynamic from 'next/dynamic'

const Masonry = dynamic(() => import('react-responsive-masonry'), {
  ssr: false,
})
const ResponsiveMasonry = dynamic(
  () => import('react-responsive-masonry').then((mod) => mod.ResponsiveMasonry),
  { ssr: false },
)

interface Props {
  data: ProfilePageData['pageData']
}

const ProfileMediaPage: React.FC<Props> = ({ data }) => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [posts, setPosts] = useState([])
  const [media, setMedia] = useState([])
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const { profile } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(profile)
  const inputRef = useRef<HTMLInputElement>(null)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const isMobile = useMediaQuery('(max-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])
  const dispatch = useDispatch()

  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getAllPosts(
      `author_type=User&_author=${data.pageData._id}&populate=_author,_genre,_hobby`,
    )
    setLoadingPosts(false)
    if (err) return console.log(err)
    if (res.data.success) {
      setPosts(res.data.data.posts)
      const allposts = res.data.data.posts
      let tempMedia: any = []
      allposts.forEach((post: any) => {
        if (post.media) {
          if (post.video_url) {
            tempMedia.push({
              type: 'video',
              src: post.video_url,
            })
          } else {
            post.media.forEach((singleMedia: any) => {
              tempMedia.push({
                type: 'image',
                src: singleMedia,
              })
            })
          }
        }
      })
      setMedia(tempMedia)
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  const handleImageChange = (e: any) => {
    const images = [...e.target.files]
    const image = e.target.files[0]
    handleImageUpload(image, false)
  }

  const handleImageUpload = async (image: any, isVideo: boolean) => {
    const fileTobeUploaded = image
    if (fileTobeUploaded) {
      const fileSize = fileTobeUploaded.size
      const fileSizeKB = fileSize / 1024
      if (fileSizeKB > 2048) {
        setSnackbar({
          display: true,
          type: 'warning',
          message: 'Image size should not be greater than 2MB',
        })
        return
      }
    }
    const formData = new FormData()
    formData.append('post', image)
    console.log('formData', formData)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      console.log(res.data)
      const img = res.data.data.url
      updateUser(img)
      // dispatch(closeModal())
    }
  }

  const updateUser = async (url: string) => {
    let arr: any = []
    if (user?.images) {
      arr = user.images
    }
    const { err, res } = await updateMyProfileDetail({
      images: [...arr, url],
    })
    if (err) return console.log(err)
    console.log(res)
    window.location.reload()
  }

  const OpenMediaImage = (image: string) => {
    dispatch(updateImageUrl(image))
    dispatch(
      openModal({
        type: 'View-Image-Modal',
        closable: false,
        imageurl: image,
      }),
    )
  }
  console.log('advd', data.pageData.video_url)

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
  const plusIconSvg = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="31.5" fill="white" stroke="#8064A2" />
      <g clip-path="url(#clip0_13842_168936)">
        <path
          d="M42.2857 33.7148H33.7143V42.2862C33.7143 43.2291 32.9429 44.0005 32 44.0005C31.0571 44.0005 30.2857 43.2291 30.2857 42.2862V33.7148H21.7143C20.7714 33.7148 20 32.9433 20 32.0005C20 31.0576 20.7714 30.2862 21.7143 30.2862H30.2857V21.7148C30.2857 20.7719 31.0571 20.0005 32 20.0005C32.9429 20.0005 33.7143 20.7719 33.7143 21.7148V30.2862H42.2857C43.2286 30.2862 44 31.0576 44 32.0005C44 32.9433 43.2286 33.7148 42.2857 33.7148Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_13842_168936">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(16 16)"
          />
        </clipPath>
      </defs>
    </svg>
  )
  const pencilIconSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_13842_168963)">
        <path
          d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354 14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867 5.91354L13.8067 4.69354Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_13842_168963">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  // if (!user.is_onboarded && data?.pageData?.email !== user?.email) {
  //   return <ErrorPage />
  // }

  return (
    <>
      <Head>
        <title>{`Media | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        activeTab={'media'}
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

          <div className={styles['main-media'] + ' margin-bottom-68vh'}>
            {profileLayoutMode === 'edit' && (
              <div className={styles.uploadContainer}>
                <div className={styles.uploadButtonDescktop}>
                  <div className={styles.newTag}>ADD NEW</div>
                  <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    className={styles.hidden}
                    onChange={(e) => handleImageChange(e)}
                    ref={inputRef}
                  />
                  {plusIconSvg}
                </div>

                <div className={styles.uploadVideoContainer}>
                  <div className={styles.uploadVideo}>
                    <p>Video</p>
                    <div
                      onClick={() => {
                        dispatch(
                          openModal({
                            type: 'upload-video-page',
                            closable: true,
                          }),
                        )
                      }}
                    >
                      {pencilIconSvg}
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      dispatch(
                        openModal({
                          type: 'upload-video-user',
                          closable: true,
                        }),
                      )
                    }}
                    className={styles.addvidText}
                  >
                    Add video URL to embedded the video
                  </div>
                </div>
                {/* <div className={styles.uploadButton}>
                  <p> image </p>
                  <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    className={styles.hidden}
                    onChange={(e) => handleImageChange(e)}
                    ref={inputRef}
                  />
                  <Image
                    src={EditIcon}
                    alt="edit"
                    className={styles.editIcon}
                    onClick={() => {
                      inputRef.current?.click()
                    }}
                  />
                </div>
                <div className={styles.uploadButton}>
                  <p> Video </p>
                  <Image
                    src={EditIcon}
                    alt="edit"
                    className={styles.editIcon}
                    onClick={() => {
                      dispatch(
                        openModal({
                          type: 'upload-video-user',
                          closable: true,
                        }),
                      )
                    }}
                  />
                </div> */}
              </div>
            )}
            {profileLayoutMode !== 'edit' &&
              !data.pageData?.video_url &&
              (!data.pageData?.images || data.pageData?.images?.length < 1) && (
                <section className={`${styles['dual-section-wrapper']}`}>
                  <div className={styles['no-posts-div']}>
                    <p className={styles['no-posts-text']}>
                      No media available
                    </p>
                  </div>
                  {!isMobile && <div className={styles['no-posts-div']}></div>}
                </section>
              )}

            {data.pageData ? (
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 0: 1, 600: 2, 1100: 2 }}
              >
                <Masonry
                  gutter={isMobile ? '8px' : '12px'}
                  style={{ columnGap: '24px', rowGap: '12px' }}
                >
                  {/* Images */}
                  {data.pageData.images?.map((item: any, idx: number) => (
                    <div key={idx} className={styles.medias}>
                      <div
                        className={styles.image}
                        onClick={() => OpenMediaImage(item)}
                      >
                        <img src={item} alt={`Image ${idx + 1}`} />
                      </div>
                    </div>
                  ))}

                  {/* Video */}
                  {data.pageData?.video_url && (
                    <div className={styles.medias}>
                      <div className={styles.videos}>
                        <ReactPlayer
                          width="100%"
                          height="100%"
                          url={data.pageData?.video_url}
                          controls={true}
                        />
                      </div>
                    </div>
                  )}
                </Masonry>
              </ResponsiveMasonry>
            ) : null}
          </div>
        </PageGridLayout>
      </ProfileLayout>
      {
        <CustomSnackbar
          message={snackbar.message}
          triggerOpen={snackbar.display}
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

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings`,
  )
  const user = res?.data?.data?.users[0]

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

export default ProfileMediaPage
