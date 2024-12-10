import { GetServerSideProps } from 'next'
import {
  getAllBlogs,
  updateBlog,
  uploadBlogImage,
} from '@/services/blog.services'
import styles from './../styles.module.css'
import BlogComments from './Comments'
import {
  calculateReadingTime,
  dateFormat,
  dateFormatwithYear,
  isMobile,
} from '@/utils'
import Image from 'next/image'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { useRouteError } from 'react-router-dom'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, openModal, updateShareUrl } from '@/redux/slices/modal'
import HobbyIconHexagon from '@/assets/icons/HobbyIconHexagon'
import CustomizedTooltips from '@/components/Tooltip/ToolTip'
import BlogActionBar from '@/components/Blog/BlogActionBar'
import BlogStickyHeader from '@/components/Blog/BlogStickyHeader'
import { RootState } from '@/redux/store'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import { updatePhotoEditModalData } from '@/redux/slices/site'
import CameraIcon from '@/assets/icons/CameraIcon'
import BlogContainer from '@/components/Blog/BlogContainer'
import QuillEditor from '@/pages/brand/QuillEditor'
import dynamic from 'next/dynamic'
import FilledButton from '@/components/_buttons/FilledButton'

import { CircularProgress } from '@mui/material'

import ModalWrapper from '@/components/Modal'
import EditBlog from '@/components/_modals/EditBlog/EditBlog'
import { Blog } from '@/types/blog'
import { setBlog, setIsEditing, setPreview } from '@/redux/slices/blog'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

type Props = {
  data: {
    blog_url?: any
  }
}
export const downarrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
  >
    <path
      d="M6.85547 9.50195L12.8555 15.502L18.8555 9.50195"
      stroke="#8064A2"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)
const BlogPage: React.FC<Props> = ({ data }) => {
  const [isAuthor, setIsAuthor] = useState(false)
  const [isAuthorizedToView, setIsAuthorizedToView] = useState(false)
  // const [isEditing, setIsEditing] = useState(false) // to check if the author is shown the editable interface

  const [hasChanged, setHasChanged] = useState(false)
  // const [blog, setBlog] = useState(data?.blog_url || {})

  const titleRef = useRef<HTMLTextAreaElement | null>(null)
  const taglineRef = useRef<HTMLTextAreaElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [vote, setVote] = useState<{ up: boolean; down: boolean }>({
    up: false,
    down: false,
  })
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isLoggedIn, isUserDataLoaded } = useSelector(
    (state: RootState) => state.user,
  )
  const { blog, refetch, isEditing } = useSelector(
    (state: RootState) => state.blog,
  )

  const fetchBlog = async () => {
    const { err, res } = await getAllBlogs(
      `url=${blog?.url}&populate=author,_hobbies`,
    )
    if (err) console.log('Error while fetching blog: ', err)
    dispatch(setBlog(res?.data?.data?.blog?.[0]))
  }

  useEffect(() => {
    dispatch(setBlog(data?.blog_url))
  }, [data])

  useEffect(() => {
    if (refetch > 0) {
      fetchBlog()
    }
  }, [refetch])

  const handleChange = (e: any, type: string) => {
    const { value } = e.target
    switch (type) {
      case 'title':
        if (value?.length > 100) return
        // setBlog((prev: any) => ({ ...prev, title: value }))
        dispatch(setBlog({ ...blog, title: value }))
        break
      case 'tagline':
        if (value?.length > 100) return
        // setBlog((prev: any) => ({ ...prev, tagline: value }))
        dispatch(setBlog({ ...blog, tagline: value }))
        break
      default:
        break
    }
  }

  const handleEditBlog = async (type: string) => {
    if (!isEditing || !blog) return

    let response: any = {}
    switch (type) {
      case 'title':
        if (!blog.title) return
        response = await updateBlog({
          blogId: blog._id,
          title: blog.title,
        })
        if (response?.res?.data?.success) {
          const newUrl = response?.res?.data?.data?.url
          router.replace(`/blog/${newUrl}`)
        }
        break

      case 'tagline':
        if (!blog.tagline) return
        response = await updateBlog({
          blogId: blog._id,
          tagline: blog.tagline,
        })
        router.replace(`/blog/${blog.url}`)
        break

      case 'content':
        if (!blog.content) return
        setBtnLoading(true)
        response = await updateBlog({
          blogId: blog._id,
          content: blog.content,
        })
        router.reload()
        break

      default:
        console.log('Wrong type passed in handleEditBlog()!')
        break
    }

    if (response?.err || !response?.res?.data?.success) {
      console.log('Error in handleEditBlog()!', response.err)
    }

    setBtnLoading(false)
  }

  const handleUploadCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    dispatch(
      updatePhotoEditModalData({
        type: 'cover',
        image: URL.createObjectURL(file),
        onComplete: uploadImageToServer,
      }),
    )
    dispatch(
      openModal({
        type: 'upload-image',
        closable: true,
      }),
    )
  }

  const uploadImageToServer = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('blog-image', blob)
    const { err, res } = await uploadBlogImage(formData, data.blog_url._id)
    if (err) return console.log('Error in uploadImageToServer(): ', err)
    if (res?.data.success) {
      dispatch(setBlog({ ...blog, cover_pic: res?.data?.data.img_url }))
      dispatch(closeModal())
    }
  }

  // const handleImageUpload = () => {
  //   if (!quillInstance) return

  //   const input = document.createElement('input')
  //   input.setAttribute('type', 'file')
  //   input.setAttribute('accept', 'image/*')
  //   input.click()

  //   input.onchange = async () => {
  //     const file = input.files?.[0]
  //     if (!file) return

  //     const formData = new FormData()
  //     formData.append('blog-image', file)
  //     // Send the image to the backend
  //     const { res, err } = await uploadBlogImage(formData, blog?._id, false)

  //     if (err)
  //       console.log('Error in uploading image @handleImageUpload(): ', err)

  //     if (res?.data?.success) {
  //       // Insert the uploaded image URL into the editor
  //       const imgUrl = res?.data?.data?.img_url
  //       const range = quillInstance.getSelection()
  //       quillInstance.insertEmbed(range.index, 'image', imgUrl)
  //     } else {
  //       console.error(
  //         'Image upload failed @handleImageUpload():',
  //         res?.data?.message,
  //       )
  //     }
  //   }
  // }

  useEffect(() => {
    if (blog?.content !== data?.blog_url?.content) {
      setHasChanged(true)
    } else {
      setHasChanged(false)
    }
  }, [blog, data])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 730) {
        setShowStickyHeader(true)
      } else {
        setShowStickyHeader(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const isPublished = data.blog_url?.status === 'Published'
    const isDraft = data.blog_url?.status === 'Draft'
    if (isPublished) {
      setIsAuthorizedToView(true)
    }
    // redirect if it is not published and user is not author
    if (isUserDataLoaded) {
      if (!isLoggedIn) {
        if (!isPublished) router.push('/404')
        return
      }

      if (isLoggedIn && user?._id) {
        const authorCheck =
          user._id === data.blog_url.author._id || user?.is_admin
        setIsAuthor(authorCheck)

        if (!isPublished) {
          if (authorCheck) {
            setIsAuthorizedToView(true)
          } else {
            router.push('/404')
            return
          }
        }
        if (isDraft && authorCheck) {
          dispatch(setIsEditing(true))
        }
      }
    }
  }, [user, isLoggedIn, isUserDataLoaded])

  /** Set upvote, downvote state initially from the DB */
  useEffect(() => {
    const initialUpvote = data?.blog_url?.up_votes?._users?.some(
      (id: any) => id === user._id,
    )
    if (initialUpvote) setVote({ up: true, down: false })

    const initialDownvote = data?.blog_url?.down_votes?._users?.some(
      (id: any) => id === user._id,
    )
    if (initialDownvote) setVote({ up: false, down: true })
  }, [user, data])

  const isMobileScreen = isMobile()

  useEffect(() => {
    const { preview: previewQuery } = router.query
    if (previewQuery) {
      dispatch(setPreview(true))
      dispatch(setIsEditing(false))
      setIsAuthor(false)
    } else {
      dispatch(setPreview(false))
    }
  })

  return (
    <>
      <Head>
        <meta property="og:image" content={`${data?.blog_url?.cover_pic}`} />
        <meta
          property="og:image:secure_url"
          content={`${data?.blog_url?.cover_pic}`}
        />
        <meta
          property="og:description"
          content={`${data?.blog_url?.description ?? ''}`}
        />
        <meta property="og:image:alt" content="Profile picture" />
        <title>{`${data?.blog_url?.title} | HobbyCue`}</title>
      </Head>

      {isAuthorizedToView && (
        <div className={styles.all}>
          <div className={styles['blog-header']}>
            <div className={styles.wrapper}>
              {isAuthor && (
                <div className={styles.buttonWrapper}>
                  <button
                    onClick={() =>
                      dispatch(
                        openModal({
                          type: 'blogPublish',
                          closable: true,
                        }),
                      )
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {downarrow}
                  </button>
                </div>
              )}
              {isEditing ? (
                <textarea
                  className={styles['blog-title'] + ' ' + styles.editInput}
                  placeholder="Title"
                  value={blog?.title || ''}
                  name="title"
                  onChange={(e) => handleChange(e, 'title')}
                  onBlur={() => handleEditBlog('title')}
                  ref={titleRef}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && titleRef.current?.blur()
                  }
                  rows={3}
                  // onInput={function (e) {
                  //   const target = e.target as HTMLTextAreaElement
                  //   target.style.height = 'auto'
                  //   target.style.height = target.scrollHeight + 'px'
                  // }}
                />
              ) : (
                <h1 className={styles['blog-title']}>
                  {data?.blog_url?.title}
                </h1>
              )}
            </div>
            {isEditing ? (
              <textarea
                className={styles['blog-desc'] + ' ' + styles.editInput}
                placeholder="Tagline"
                value={blog.tagline}
                name="tagline"
                onChange={(e) => handleChange(e, 'tagline')}
                onBlur={() => handleEditBlog('tagline')}
                ref={taglineRef}
                onKeyDown={(e) =>
                  e.key === 'Enter' && taglineRef.current?.blur()
                }
              />
            ) : (
              data?.blog_url?.tagline && (
                <h1 className={styles['blog-desc']}>
                  {data?.blog_url?.tagline}
                </h1>
              )
            )}

            {/* Cover Image */}
            {blog?.cover_pic ? (
              <div
                onClick={() => {
                  dispatch(
                    openModal({
                      type: 'View-Image-Modal',
                      closable: false,
                      // imageurl: data?.blog_url?.cover_pic,
                      imageurl: blog?.cover_pic ?? '',
                    }),
                  )
                }}
                className={styles['cover-image']}
              >
                <img
                  // src={data?.blog_url?.cover_pic}
                  src={blog.cover_pic ?? ''}
                  className={styles.coverBlur}
                  alt="cover image"
                />
                <img
                  // src={data?.blog_url?.cover_pic}
                  src={blog.cover_pic ?? ''}
                  className={styles.coverPic}
                  alt="cover image"
                />
                {isEditing && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      cameraInputRef.current?.click()
                    }}
                  >
                    <CameraIcon />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadCoverImage(e)}
                      ref={cameraInputRef}
                      hidden
                    />
                  </span>
                )}
              </div>
            ) : isEditing ? (
              <div className={styles['cover-image']}>
                <CoverPhotoLayout
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUploadCoverImage(e)
                  }
                  profileLayoutMode={'edit'}
                />
              </div>
            ) : (
              <></>
            )}

            {/* Author */}
            <div className={styles['flex-container']}>
              <div className={styles['author-wrapper']}>
                {/* pic */}
                <Link href={`/profile/${data?.blog_url?.author?.profile_url}`}>
                  <div className={styles['author-profile-image']}>
                    {data?.blog_url?.author?.profile_image ? (
                      <img
                        src={
                          data?.blog_url?.author?.profile_image ||
                          defaultUserImage
                        }
                        alt="profile image"
                      />
                    ) : (
                      <Image src={defaultUserImage} alt="profile image" />
                    )}
                  </div>
                </Link>
                {/* details */}
                <div className={styles['author-details']}>
                  <Link
                    href={`/profile/${data?.blog_url?.author?.profile_url}`}
                  >
                    <p className={`${styles['author-name']}`}>
                      {data?.blog_url?.author?.full_name}
                    </p>
                  </Link>
                  <div className={styles['date-and-hobbies']}>
                    <p>
                      {dateFormatwithYear?.format(
                        new Date(data?.blog_url?.createdAt),
                      )}
                    </p>
                    &#183;
                    <p>
                      {blog?.content ? calculateReadingTime(blog?.content) : 0}{' '}
                      min read
                    </p>
                    {!isMobileScreen && (
                      <>
                        &#183;
                        {data?.blog_url?._hobbies?.map(
                          (hobby: any, idx: any) => (
                            <span key={idx}>
                              {hobby?.hobby?.display}
                              {idx !== data?.blog_url?._hobbies?.length - 1
                                ? ', '
                                : ''}
                            </span>
                          ),
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {isMobileScreen && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <HobbyIconHexagon />
                  </span>
                  <div
                    className={`${styles['date-and-hobbies']} ${styles.res}`}
                  >
                    {data?.blog_url?._hobbies?.map((hobby: any, idx: any) => (
                      <span key={idx}>
                        {hobby?.hobby?.display}
                        {idx !== data?.blog_url?._hobbies?.length - 1
                          ? ', '
                          : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* actions for desktop */}
              {!isMobileScreen && (
                <div className={styles.desktopActions}>
                  <BlogActionBar
                    data={data}
                    vote={vote}
                    setVote={setVote}
                    isAuthor={isAuthor}
                  />
                </div>
              )}
            </div>
          </div>

          {/** Actions for Mobile */}
          {isMobileScreen && (
            <BlogActionBar
              data={data}
              vote={vote}
              setVote={setVote}
              isAuthor={isAuthor}
            />
          )}

          {/** Sticky header */}
          {!isMobileScreen && showStickyHeader && (
            <BlogStickyHeader
              data={data}
              vote={vote}
              setVote={setVote}
              isAuthor={isAuthor}
            />
          )}

          {/* Content */}
          <div className={styles.blogContainerParent}>
            <BlogContainer className={styles.blogWrapper}>
              {/* <div className={styles.blogWrapper}> */}
              {isEditing ? (
                <div className={styles.blogEditor}>
                  <ReactQuill
                    theme="snow"
                    value={blog.content}
                    onChange={(updatedValue) => {
                      dispatch(setBlog({ ...blog, content: updatedValue }))
                    }}
                    // onFocus={(e, editor) => setQuillInstance(editor)}
                    // onBlur={() => handleEditBlog('content')}
                    className={`${styles.quill} ${styles['ql-editor']} blog-quill`}
                    placeholder={'Text'}
                    modules={{
                      toolbar: {
                        container: [
                          [
                            'bold',
                            'italic',
                            'underline',
                            { list: 'ordered' },
                            { list: 'bullet' },
                            { header: '1' },
                            { header: '2' },
                          ],
                          ['link', 'image'],
                        ],
                        // handlers: {
                        //   image: () => handleImageUpload(), // Custom handler
                        // },
                      },
                    }}
                  />
                  <div className={styles.blogButtons}>
                    <FilledButton
                      className={styles.blogSaveButton}
                      onClick={() => dispatch(setIsEditing(false))}
                    >
                      Cancel
                    </FilledButton>
                    <FilledButton
                      className={styles.blogSaveButton}
                      onClick={() => handleEditBlog('content')}
                      disabled={!hasChanged || btnLoading}
                    >
                      {btnLoading ? (
                        <CircularProgress color="inherit" size={'14px'} />
                      ) : (
                        `Save`
                      )}
                    </FilledButton>
                  </div>
                </div>
              ) : (
                <div
                  className={styles.blogContent}
                  dangerouslySetInnerHTML={{
                    __html: data?.blog_url?.content,
                  }}
                />
              )}
              <div className={styles.profileAndComment}>
                <div className={styles['profile-wrapper']}>
                  <div className={`${styles['header-user']}`}>
                    {data.blog_url.author?.profile_image ? (
                      <Link
                        href={`/profile/${data.blog_url.author?.profile_url}/blogs`}
                        className={styles.textGray}
                      >
                        <img
                          className={styles['profile-img']}
                          src={data.blog_url.author.profile_image}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </Link>
                    ) : (
                      <Link
                        href={`/profile/${data.blog_url.author?.profile_url}/blogs`}
                        className={styles.textGray}
                      >
                        <Image
                          className={styles['profile-img']}
                          src={defaultUserImage}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </Link>
                    )}

                    <div className={styles['title']}>
                      <Link
                        href={`/profile/${data.blog_url.author?.profile_url}/blogs`}
                        className={styles.textGray}
                      >
                        <p className={styles['profile-title']}>
                          {data.blog_url.author?.full_name}
                        </p>
                      </Link>
                      <p>
                        <span>
                          {dateFormatwithYear?.format(
                            new Date(data.blog_url?.createdAt),
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  <ul className={styles['hobby-list']}>
                    {data?.blog_url?._hobbies?.map((item: any) => {
                      if (typeof item === 'string') return
                      return (
                        <Link
                          href={`/hobby/${
                            item?.genre?.slug ?? item?.hobby?.slug
                          }/blogs`}
                          className={styles.textGray}
                          key={item._id}
                        >
                          {item?.hobby?.display}
                          {item?.genre && ` - ${item?.genre?.display} `}
                        </Link>
                      )
                    })}
                  </ul>

                  <div className={styles['line-with-icon']}>
                    <svg
                      className={styles['line-svg']}
                      width="57"
                      height="22"
                      viewBox="0 0 57 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Vector"
                        d="M38.6605 20.1274C36.299 16.6738 33.1152 14.2768 29.442 12.4691C29.1866 12.3434 29.003 12.3219 28.7719 12.5742C28.3779 13.0044 27.8422 13.0194 27.403 12.6214C27.1602 12.4014 26.978 12.4166 26.7201 12.5489C22.9179 14.4998 19.5966 17.0027 17.3222 20.7112C17.0785 21.1086 16.7616 21.4071 16.2703 21.3498C15.8601 21.302 15.6025 21.0246 15.4981 20.6204C15.4034 20.2541 15.5934 19.969 15.7711 19.6805C17.3239 17.1597 19.362 15.0995 21.7651 13.3909C22.4898 12.8756 23.2405 12.3968 24.0298 11.8674C23.7827 11.7333 23.5647 11.7806 23.3604 11.7806C16.079 11.7787 8.79767 11.7801 1.51632 11.7803C1.19974 11.7803 0.876702 11.808 0.580302 11.662C0.189994 11.4698 -0.0627668 11.1642 0.0136071 10.7158C0.0910086 10.2614 0.379167 9.97582 0.866153 9.94776C1.04419 9.9375 1.22314 9.94142 1.40167 9.94138C8.16718 9.94 14.9327 9.93891 21.6982 9.93779C21.9875 9.93774 22.2768 9.93778 22.5868 9.79924C22.111 9.64463 21.6346 9.49179 21.1595 9.33506C19.9171 8.92522 18.6579 8.55878 17.4377 8.09095C16.0342 7.55284 14.8516 6.69307 14.1397 5.31995C13.0062 3.13363 14.1345 0.751862 16.5365 0.185742C18.6187 -0.305008 20.3583 0.422392 21.9226 1.70373C23.9018 3.32493 25.4868 5.31052 27.005 7.35167C27.0874 7.46237 27.1687 7.57382 27.2881 7.73604C27.8347 7.4324 28.3966 7.28766 28.895 7.87453C29.707 6.85699 30.4807 5.86009 31.2839 4.88768C32.462 3.46157 33.7117 2.09453 35.2752 1.08335C36.7411 0.135278 38.3368 -0.325488 40.0769 0.258804C42.8104 1.17664 43.5039 4.08159 41.5435 6.27736C40.4543 7.49735 39.0339 8.11265 37.5259 8.59197C36.2635 8.99327 35.0028 9.40027 33.6616 9.8303C33.9251 9.98262 34.1394 9.93113 34.3369 9.93102C41.2807 9.92715 48.2245 9.92019 55.1683 9.90949C55.6555 9.90874 55.9746 10.1317 56.079 10.5936C56.1936 11.1008 56.0038 11.4886 55.505 11.6953C55.2396 11.8053 54.9594 11.7823 54.6823 11.7823C47.4605 11.7829 40.2386 11.7829 33.0168 11.783C32.8001 11.783 32.5835 11.783 32.1735 11.783C32.7056 12.13 33.0886 12.3837 33.4755 12.6314C36.1475 14.3413 38.4291 16.4589 40.2129 19.0935C40.4234 19.4044 40.6241 19.7291 40.7746 20.0715C40.9755 20.5289 40.8627 20.9464 40.4189 21.1992C39.9664 21.457 39.5321 21.3913 39.2058 20.9586C39.0152 20.706 38.8569 20.4291 38.6605 20.1274ZM37.2287 2.14007C36.7329 2.3031 36.2897 2.56858 35.8868 2.88987C33.8847 4.48645 32.3224 6.48224 30.808 8.5201C30.7611 8.58323 30.7223 8.65479 30.8153 8.74528C30.8745 8.74528 30.9588 8.76623 31.0274 8.74225C33.437 7.90031 35.9196 7.27731 38.2994 6.35126C39.2739 5.97207 40.1132 5.36995 40.5902 4.37994C41.0451 3.43592 40.6846 2.48549 39.7028 2.09891C38.9119 1.78747 38.1122 1.84435 37.2287 2.14007ZM22.4372 4.74551C21.7296 4.02413 21.0405 3.28412 20.1986 2.7082C19.3157 2.10416 18.3581 1.80653 17.282 1.91607C15.7652 2.07046 15.106 3.3759 15.9103 4.6648C16.4356 5.50651 17.2224 6.03938 18.1287 6.37796C19.1846 6.77246 20.2579 7.12224 21.3313 7.4679C22.7717 7.93175 24.2193 8.37305 25.7899 8.86338C24.7006 7.39272 23.6624 6.04808 22.4372 4.74551Z"
                        fill="#CED4DA"
                      />
                    </svg>
                  </div>
                </div>

                <div className={styles['comment-container']}>
                  <div className={styles['comment']} id="comments">
                    <BlogComments data={data.blog_url} />
                  </div>
                </div>
              </div>
              {/* </div> */}
            </BlogContainer>
          </div>
          <CustomSnackbar
            message={snackbar.message}
            triggerOpen={snackbar.display}
            type={snackbar.type === 'success' ? 'success' : 'error'}
            closeSnackbar={() => {
              setSnackbar((prevValue) => ({ ...prevValue, display: false }))
            }}
          />
        </div>
      )}

      {/* <ModalWrapper isOpen={isModalOpen} onClose={setIsModalOpen}>
        <EditBlog setIsModalOpen={setIsModalOpen} data={data} />
      </ModalWrapper> */}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllBlogs(
    `url=${query['url']}&populate=author,_hobbies`,
  )

  if (!res || !res.data.success || res.data.data.blog.length === 0) {
    return {
      notFound: true,
    }
  }

  const data = {
    blog_url: res.data.data.blog[0],
  }

  return {
    props: {
      data,
    },
  }
}

export default BlogPage
