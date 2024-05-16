import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './PostCard.module.css'
import { dateFormat } from '@/utils'
import Link from 'next/link'
import BarsIcon from '../../assets/svg/vertical-bars.svg'
import PostVotes from './Votes'
import PostComments from './Comments'
import {
  deletePost,
  getAllPosts,
  getMetadata,
  getPostComment,
} from '@/services/post.service'
import { useRouter } from 'next/router'
import useCheckIfClickedOutside from '@/hooks/useCheckIfClickedOutside'
import Slider from '../Slider/Slider'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import CustomizedTooltips from '../Tooltip/ToolTip'
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar'
import { RootState } from '@/redux/store'
import { setActivePost } from '@/redux/slices/post'
import defaultImg from '@/assets/svg/default-images/default-user-icon.svg'

import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'
import { useMediaQuery } from '@mui/material'
import LinkPreviewLoader from '../LinkPreviewLoader'
type Props = {
  postData: any
  fromProfile?: boolean
  onPinPost?: any
  currentSection?: 'posts' | 'links'
}

const PostCard: React.FC<Props> = (props) => {
  // const [type, setType] = useState<'User' | 'Listing'>()
  // console.warn({props})
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)
  const [has_link, setHas_link] = useState(props.postData.has_link)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [openAction, setOpenAction] = useState(false)
  // console.log('🚀 ~ file: PostCard.tsx:20 ~ router:', router)
  const { fromProfile, onPinPost } = props
  const optionRef: any = useRef(null)
  const editReportDeleteRef: any = useRef(null)
  const [postData, setPostData] = useState(props.postData)
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(
    props.currentSection === 'links'
      ? false
      : props.postData.has_link
      ? true
      : false,
  )
  const pageUrlClass = styles.postUrl
  // useEffect(() => {
  //   if (postData?.media?.length > 0 || postData?.video_url) {
  //     setHas_link(false)
  //   }
  // }, [postData])
  const dispatch = useDispatch()
  const [url, setUrl] = useState('')
  const [optionsActive, setOptionsActive] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
    url: '',
  })
  const [linkLoading, setLinkLoading] = useState(false)

  const domain = metaData?.url
    ? new URL(metaData.url).hostname.replace('www.', '')
    : ''
  const displayDomain = domain ? domain.split('.').slice(-2).join('.') : ''
  useCheckIfClickedOutside(optionRef, () => setOptionsActive(false))

  const modalRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        editReportDeleteRef.current &&
        !editReportDeleteRef.current.contains(event.target)
      ) {
        setOpenAction(false)
      }
    }

    // Bind the event listener
    document.addEventListener('click', handleClickOutside)

    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  const updatePost = async () => {
    const { err, res } = await getAllPosts(
      `_id=${postData._id}&populate=_author,_genre,_hobby`,
    )
    if (err) return console.log(err)
    if (res.data.success) {
      setPostData(res.data.data.posts[0])
      return
    }
  }

  useEffect(() => {
    if (router.query['comments'] === 'show') {
      setShowComments(true)
    }
  }, [])

  useEffect(() => {
    if (has_link) {
      const regex =
        /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
      const url = postData?.content.match(regex)
      if (url) {
        setUrl(url[0])
      }
      if (url) {
        setLinkLoading(true)
        getMetadata(url[0])
          .then((res: any) => {
            setMetaData(res?.res?.data?.data.data)
            setLinkLoading(false)
          })
          .catch((err) => {
            console.log(err)
            setLinkLoading(false)
          })
      }
    }
  }, [postData])

  const handleShare = () => {
    dispatch(updateShareUrl(`${window.location.origin}/post/${postData._id}`))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const handleCardClick = async (e: any) => {
    // Check if the click is on the post-card-wrapper itself, not on its children
    // if (e.currentTarget === e.target) {
    //   router.push(`/post/${postData._id}`)
    // }
    await fetchComments()
  }
  const postedByMe = postData?._author?.email === user?.email
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
  const fetchComments = async () => {
    const { err, res } = await getPostComment(
      `_post=${props.postData._id}&populate=_author`,
    )
    if (err) return console.log(err)
    setComments(res?.data?.data?.comments)
  }
  useEffect(() => {
    if (props.currentSection === 'links') {
      fetchComments()
    }
  }, [])

  const handleDeletePost = async (postid: any) => {
    const { err, res } = await deletePost(postid)
    if (err) {
      console.log(err)
      setSnackbar({
        display: true,
        type: 'warning',
        message: 'Something went wrong',
      })
    } else if (res.data.success) {
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Post deleted Successfully',
      })
      setTimeout(() => {
        router.reload()
      }, 1000)
    }
  }

  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <>
      <div className={styles['post-card-wrapper']} onClick={handleCardClick}>
        {/* Card Header */}
        {(!has_link || props.currentSection === 'posts') && (
          <header>
            <Link href={`/profile/${postData?._author?.profile_url}`}>
              {postData?.author_type === 'Listing' ? (
                postData?._author?.profile_image ? (
                  <img
                    className={styles['author-listing']}
                    src={postData?._author?.profile_image}
                    alt="Author Profile"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div
                    className={`default-people-listing-icon  ${styles['author-listing']}`}
                  ></div>
                )
              ) : postData?._author?.profile_image ? (
                <img
                  className={styles['author-profile']}
                  src={postData?._author?.profile_image}
                  alt="Author Profile"
                  width={40}
                  height={40}
                />
              ) : (
                <div
                  className={`${styles['author-profile']} default-author-icon`}
                ></div>
              )}
            </Link>
            <div>
              <Link
                href={
                  postData?.author_type === 'User'
                    ? `/profile/${postData?._author?.profile_url}`
                    : `/page/${postData?._author?.page_url}`
                }
              >
                <p className={styles['author-name']}>
                  {postData?.author_type === 'User'
                    ? postData?._author?.full_name
                    : postData?.author_type === 'Listing'
                    ? postData?._author?.title
                    : ''}
                </p>
              </Link>
              <p
                className={styles['post-other-info']}
                onClick={() => {
                  dispatch(setActivePost({ ...postData, comments: comments }))
                  dispatch(openModal({ type: 'post', closable: false }))
                }}
              >
                <span>
                  {dateFormat.format(new Date(postData.createdAt))}
                  {' | '}
                </span>
                <span>{`${postData?._hobby?.display}${
                  postData._genre ? ' - ' + postData?._genre?.display : ''
                }`}</span>
                <span>
                  {postData?.visibility ? ` | ${postData?.visibility}` : ''}
                </span>
              </p>
            </div>
            <div ref={editReportDeleteRef} className={styles.actionIcon}>
              {openAction === true && (
                <div className={styles.editReportDelete}>
                  {postedByMe && (
                    <>
                      <button
                        onClick={() => {
                          showFeatureUnderDevelopment()
                          setOpenAction(false)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeletePost(postData._id)
                          setOpenAction(false)
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      showFeatureUnderDevelopment()
                      setOpenAction(false)
                    }}
                  >
                    Report
                  </button>
                </div>
              )}
              <svg
                /////
                ref={optionRef}
                className={styles['more-actions-icon']}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => {
                  if (fromProfile && postedByMe) {
                    setOptionsActive(true)
                  } else setOpenAction(true)
                }}
              >
                <g clip-path="url(#clip0_173_72891)">
                  <path
                    d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                    fill="#8064A2"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_173_72891">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {optionsActive && fromProfile && (
                <ul className={styles.optionsContainer}>
                  <li
                    onClick={
                      onPinPost !== undefined
                        ? () => onPinPost(postData._id)
                        : () => {}
                    }
                  >
                    Pin post
                  </li>
                  <li
                    onClick={() => {
                      showFeatureUnderDevelopment()
                      setOptionsActive(false)
                    }}
                  >
                    Edit
                  </li>
                  <li
                    onClick={() => {
                      showFeatureUnderDevelopment()
                      setOptionsActive(false)
                    }}
                  >
                    Delete
                  </li>
                </ul>
              )}
            </div>
          </header>
        )}
        {/* Card Body */}

        <section className={styles['body']}>
          {(!has_link || props.currentSection === 'posts') && (
            <div
              className={styles['content'] + ' ql-editor'}
              dangerouslySetInnerHTML={{
                __html: postData.content
                  .replace(/<img\b[^>]*>/g, '') // deleted all images from here then did the link formatting
                  .replace(
                    /(?:\b(?:https?:\/\/|ftp|file):\/\/|www\.)?([-A-Z0-9+&@#/%?=~_|!:,.;]*\.[a-zA-Z]{2,}(?:[-A-Z0-9+&@#/%?=~_|])*(?:\?[^\s]*)?)/gi,
                    (match: any, url: string) => {
                      const href =
                        url.startsWith('http://') || url.startsWith('https://')
                          ? url
                          : `http://${url}`
                      return `<a href="${href}" class="${pageUrlClass}" target="_blank">${url}</a>`
                    },
                  ),
              }}
            ></div>
          )}
          {postData.video_url && (
            <video width="320" height="240" controls className={styles.video}>
              <source src={postData.video_url} type="video/mp4"></source>
            </video>
          )}
          {postData.media?.length > 0 && props.currentSection !== 'links' ? (
            <Slider
              setActiveIdx={setActiveIdx}
              activeIdx={activeIdx}
              images={postData.media}
              sameImgLinkInMeta={metaData.image}
            ></Slider>
          ) : (
            <></>
          )}
          {has_link && props.currentSection !== 'links' && (
            <div className={styles['posts-meta-parent']}>
              {linkLoading ? (
                <LinkPreviewLoader />
              ) : (
                <>
                  <div className={styles['posts-meta-data-container']}>
                    <a
                      href={url}
                      target="_blank"
                      className={styles['posts-meta-img']}
                    >
                      <img
                        src={
                          (typeof metaData?.image === 'string' &&
                            metaData.image) ||
                          (typeof metaData?.icon === 'string' &&
                            metaData.icon) ||
                          defaultImg
                        }
                        alt="link-image"
                        width={80}
                        height={80}
                      />
                    </a>
                    <div className={styles['posts-meta-content']}>
                      <a
                        href={url}
                        target="_blank"
                        className={styles.contentHead}
                      >
                        {' '}
                        {metaData?.title}{' '}
                      </a>
                      {!isMobile && (
                        <a
                          href={url}
                          target="_blank"
                          className={styles.contentUrl}
                        >
                          {' '}
                          {metaData?.description}{' '}
                        </a>
                      )}
                    </div>
                  </div>
                  {isMobile && (
                    <a href={url} target="_blank" className={styles.contentUrl}>
                      {' '}
                      {metaData?.description}{' '}
                    </a>
                  )}
                </>
              )}
            </div>
          )}
          {has_link && props.currentSection === 'links' && (
            <div className={styles.postMetadata}>
              <a href={url} target="_blank" className={styles.metaImgContainer}>
                <img
                  src={
                    (typeof metaData?.image === 'string' && metaData.image) ||
                    (typeof metaData?.icon === 'string' && metaData.icon) ||
                    defaultImg
                  }
                  alt="link-image"
                  width={200}
                  height={130}
                />
              </a>
              <div className={styles.metaContent}>
                <a href={url} target="_blank" className={styles.contentHead}>
                  {' '}
                  {metaData?.title}{' '}
                </a>
                <a href={url} target="_blank" className={styles.contentUrl}>
                  {' '}
                  {displayDomain}{' '}
                </a>
                <div className={styles['meta-author']}>
                  <p className={styles['author-name']}>
                    {'Shared by '}
                    {postData?.author_type === 'User'
                      ? postData?._author?.full_name
                      : postData?.author_type === 'Listing'
                      ? postData?._author?.title
                      : ''}{' '}
                  </p>
                  <p className={styles['date']}>
                    {'Date - '}
                    {dateFormat.format(new Date(postData.createdAt))}
                  </p>
                </div>
                {/* <p className={styles.metaContentText}>
                  {metaData.description?.length > 150
                    ? metaData.description.slice(0, 150 - 3) + '...'
                    : metaData.description}
                </p> */}
                <section
                  className={styles['meta-actions'] + ` ${styles['links']}`}
                >
                  <PostVotes
                    data={postData}
                    styles={styles}
                    className={styles['meta-votes']}
                    updatePost={updatePost}
                  />
                  {props?.currentSection === 'links' && (
                    <div className={styles['comment-and-count']}>
                      <svg
                        onClick={() => {
                          dispatch(
                            setActivePost({ ...postData, comments: comments }),
                          )
                          dispatch(openModal({ type: 'post', closable: false }))
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_10350_4296)">
                          <path
                            d="M15 12.8775L14.1225 12H3V3H15V12.8775ZM15 1.5H3C2.175 1.5 1.5 2.175 1.5 3V12C1.5 12.825 2.175 13.5 3 13.5H13.5L16.5 16.5V3C16.5 2.175 15.825 1.5 15 1.5Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_10350_4296">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className={styles['comments-count']}>
                        {comments.length}
                      </p>
                    </div>
                  )}
                  {props.currentSection !== 'links' && (
                    <svg
                      onClick={(e: any) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setShowComments(!showComments)
                      }}
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill={showComments ? '#8064A2' : 'none'}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.42578 15.4746H4.01157L3.71867 15.7675L1.42578 18.0604V2.47461C1.42578 1.92689 1.87807 1.47461 2.42578 1.47461H18.4258C18.9735 1.47461 19.4258 1.92689 19.4258 2.47461V14.4746C19.4258 15.0223 18.9735 15.4746 18.4258 15.4746H4.42578Z"
                        stroke="#8064A2"
                        stroke-width="2"
                      />
                    </svg>
                  )}
                </section>
              </div>
            </div>
          )}
        </section>

        {/* Card Footer */}
        {props.currentSection === 'links' ? (
          <div className={styles['metadata-footer']}>
            <Link href={url} target="_blank">
              {url}
            </Link>
            {showComments && <PostComments data={postData} styles={styles} />}
          </div>
        ) : (
          <footer>
            <section className={styles['footer-actions-wrapper']}>
              <PostVotes
                data={postData}
                styles={styles}
                updatePost={updatePost}
              />

              {/* Comment Icon */}
              <svg
                onClick={() => setShowComments(!showComments)}
                width="21"
                height="21"
                viewBox="0 0 21 21"
                // fill={showComments ? '#8064A2' : 'none'}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.42578 15.4746H4.01157L3.71867 15.7675L1.42578 18.0604V2.47461C1.42578 1.92689 1.87807 1.47461 2.42578 1.47461H18.4258C18.9735 1.47461 19.4258 1.92689 19.4258 2.47461V14.4746C19.4258 15.0223 18.9735 15.4746 18.4258 15.4746H4.42578Z"
                  stroke="#8064A2"
                  stroke-width="2"
                />
              </svg>

              {/* Share Icon */}
              <svg
                className={styles['share-icon']}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleShare}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11.25"
                  fill="white"
                  stroke="#8064A2"
                  stroke-width="1.5"
                />
                <g clip-path="url(#clip0_173_72895)">
                  <path
                    d="M13.3335 10.0008V8.94083C13.3335 8.34749 14.0535 8.04749 14.4735 8.46749L17.5335 11.5275C17.7935 11.7875 17.7935 12.2075 17.5335 12.4675L14.4735 15.5275C14.0535 15.9475 13.3335 15.6542 13.3335 15.0608V13.9342C10.0002 13.9342 7.66685 15.0008 6.00018 17.3342C6.66685 14.0008 8.66685 10.6675 13.3335 10.0008Z"
                    fill="#8064A2"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_173_72895">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="matrix(-1 0 0 1 20 4)"
                    />
                  </clipPath>
                </defs>
              </svg>

              {/* Bookmark Icon */}
              {/* <CustomizedTooltips title='This feature is under development'> */}
              <svg
                onClick={showFeatureUnderDevelopment}
                className={styles['bookmark-icon']}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_173_72894)">
                  <path
                    d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V6C7 5.45 7.45 5 8 5H16C16.55 5 17 5.45 17 6V18Z"
                    fill="#8064A2"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_173_72894">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {/* </CustomizedTooltips> */}
            </section>

            {/* Comments Section */}
            {showComments && <PostComments data={postData} styles={styles} />}
          </footer>
        )}
      </div>
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

export default PostCard
