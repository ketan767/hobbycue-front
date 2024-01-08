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

interface Props {
  data: ProfilePageData['pageData']
}

const ProfileMediaPage: React.FC<Props> = ({ data }) => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [posts, setPosts] = useState([])
  const [media, setMedia] = useState([])
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const [expandAll, setExpandAll] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
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

  return (
    <>
      <Head>
        <title>{`Media | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout
        activeTab={'media'}
        data={data}
        expandAll={expandAll}
        setExpandAll={setExpandAll}
      >
        <PageGridLayout column={2}>
          <aside>
            {/* User Hobbies */}
            <ProfileHobbySideList data={data.pageData} expandData={expandAll} />
            <ProfilePagesList data={data} expandData={expandAll} />

            <div className={styles['display-mobile']}>
              <ProfileAddressSide data={data.pageData} expandData={expandAll} />

              {/* User Contact Details */}
              <ProfileContactSide data={data.pageData} expandData={expandAll} />

              {/*User Social Media visible only for mobile view */}
              <ProfileSocialMediaSide
                data={data.pageData}
                expandData={expandAll}
              />
            </div>
          </aside>
          <div className={styles['nav-mobile']}>
            <ProfileNavigationLinks activeTab={'media'} />
          </div>
          <div>
            {profileLayoutMode === 'edit' && (
              <div className={styles.uploadContainer}>
                <div className={styles.uploadButton}>
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
                </div>
              </div>
            )}
            <div className={styles.medias}>
              {data?.pageData.video_url && (
                <div className={styles.image}>
                  {/* <video
                    width="250"
                    height="240"
                    controls={true}
                    className={styles.video}
                  >
                    <source src={user?.video_url} type="video/mp4" />
                  </video> */}
                  <ReactPlayer
                    width="100%"
                    height="250px"
                    url={data?.pageData?.video_url}
                    controls={true}
                  />
                </div>
              )}
              {data.pageData.images?.map((item: any, idx: number) => {
                return (
                  <div
                    key={idx}
                    className={styles.image}
                    onClick={() => OpenMediaImage(item)}
                  >
                    <img src={item} alt={`Media ${idx}`} />
                  </div>
                )
              })}
              <div></div>
            </div>
          </div>
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

export default ProfileMediaPage
