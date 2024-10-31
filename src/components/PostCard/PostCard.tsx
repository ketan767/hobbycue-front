import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './PostCard.module.css'
import { dateFormat, isVideoLink, pageType } from '@/utils'
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
import post, { setActivePost } from '@/redux/slices/post'
import defaultImg from '@/assets/svg/default-images/default-user-icon.svg'

import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'
import { useMediaQuery } from '@mui/material'
import LinkPreviewLoader from '../LinkPreviewLoader'
import DeletePrompt from '../DeletePrompt/DeletePrompt'
import ReactPlayer from 'react-player'
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
  const { user, activeProfile, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  )
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
      : comments.length > 0
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
  const [deleteData, setDeleteData] = useState<{
    open: boolean
    _id: string | undefined
  }>({
    open: false,
    _id: undefined,
  })

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

  const postUrl = `${window.location.origin}/post/${postData._id}`

  const handleCardClick = async (e: any) => {
    // Check if the click is on the post-card-wrapper itself, not on its children
    // if (e.currentTarget === e.target) {
    //   router.push(`/post/${postData._id}`)
    // }
    await fetchComments()
  }
  const postedByMe =
    (postData.author_type === 'User' &&
      postData?._author?.email === user?.email) ||
    (postData?.author_type === 'Listing' &&
      activeProfile?.data?.admin === user?._id)
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
  const fetchComments = async () => {
    console.error('running comm')
    const { err, res } = await getPostComment(
      `_post=${props.postData._id}&populate=_author`,
    )
    if (err) return console.log(err)
    setComments(res?.data?.data?.comments)
  }
  useEffect(() => {
    const fetchCommentsInUseeffect = async () => {
      const { err, res } = await getPostComment(
        `_post=${props.postData._id}&populate=_author`,
      )
      if (err) return console.log(err)
      setComments(res?.data?.data?.comments)
      console.error({ comments: res?.data?.data?.comments })
      if (res?.data?.data?.comments && res?.data?.data?.comments?.length > 0) {
        setShowComments(props.currentSection === 'links' ? false : true)
      }
    }
    if (props.currentSection !== 'links') {
      fetchCommentsInUseeffect()
    }
  }, [])

  const handleDeletePost = async (postid: any) => {
    const { err, res } = await deletePost(postid)
    if (err) {
      console.log(err)
      setDeleteData({ open: false, _id: undefined })
      setSnackbar({
        display: true,
        type: 'warning',
        message: 'Something went wrong',
      })
    } else if (res.data.success) {
      setDeleteData({ open: false, _id: undefined })
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
  const handleShowDelete = (postid: string) => {
    setDeleteData({ open: true, _id: postid })
  }

  const isMobile = useMediaQuery('(max-width:1100px)')
  const processedContent = postData.content

    .replace(/<img\b[^>]*>/g, '')

    .replace(/(https?:\/\/[^\s<]+)(?![^<]*<\/a>)/gi, (url: string) => {
      const href =
        url.startsWith('http://') || url.startsWith('https://')
          ? url
          : `https://${url}`
      return `<a href="${href}" class="${pageUrlClass}" target="_blank" style="color: rgb(128, 100, 162);">${url}</a>`
    })

  const finalContent = processedContent.replace(
    /<a\b([^>]*)>/gi,
    (match: any) => {
      if (!match.includes('style=')) {
        return match.replace('<a', '<a style="color: rgb(128, 100, 162);"')
      }
      return match
    },
  )

  return (
    <>
      <div className={styles['post-card-wrapper']} onClick={handleCardClick}>
        {/* Card Header */}
        {(!has_link ||
          props.currentSection === 'posts' ||
          router.pathname.startsWith('/post') ||
          router.pathname.endsWith('/posts')) && (
          <header>
            <Link
              href={
                postData?.author_type === 'User'
                  ? `/profile/${postData?._author?.profile_url}`
                  : `/${pageType(postData?._author.type)}/${
                      postData?._author?.page_url
                    }`
              }
              onClick={(e) => {
                e.preventDefault()
                isLoggedIn
                  ? router.push(
                      `${
                        postData?.author_type === 'User'
                          ? `/profile/${postData?._author?.profile_url}`
                          : `/${pageType(postData?._author.type)}/${
                              postData?._author?.page_url
                            }`
                      }`,
                    )
                  : dispatch(openModal({ type: 'auth', closable: true }))
              }}
            >
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
                    className={`${
                      postData?._author?.type == 1
                        ? `default-people-listing-icon ${styles['default-img']}`
                        : postData?._author?.type == 2
                        ? `${styles['default-img']} default-place-listing-icon`
                        : postData?._author?.type == 3
                        ? `${styles['default-img']} default-program-listing-icon`
                        : postData?._author?.type == 4
                        ? `${styles['default-img']} default-product-listing-icon`
                        : `${styles['default-img']} default-user-icon`
                    } ${styles['author-listing']}`}
                  ></div>
                )
              ) : postData?._author?.profile_image ? (
                <div className={styles['author-profile']}>
                  <img
                    src={postData?._author?.profile_image}
                    alt="Author Profile"
                    width={40}
                    height={40}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`${styles['author-profile']} default-user-icon`}
                ></div>
              )}
            </Link>
            <div>
              <Link
                href={
                  postData?.author_type === 'User'
                    ? `/profile/${postData?._author?.profile_url}`
                    : `/${pageType(postData?._author?.type)}/${
                        postData?._author?.page_url
                      }`
                }
                onClick={(e) => {
                  e.preventDefault()
                  isLoggedIn
                    ? router.push(
                        `${
                          postData?.author_type === 'User'
                            ? `/profile/${postData?._author?.profile_url}`
                            : `/${pageType(postData?._author.type)}/${
                                postData?._author?.page_url
                              }`
                        }`,
                      )
                    : dispatch(openModal({ type: 'auth', closable: true }))
                }}
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
                          dispatch(
                            openModal({
                              type: 'update-post',
                              closable: true,
                              propData: postData,
                            }),
                          )
                          setOpenAction(false)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleShowDelete(postData._id)
                          setOpenAction(false)
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      dispatch(
                        openModal({
                          type: 'PostReportModal',
                          closable: true,
                          propData: { reported_url: postUrl },
                        }),
                      )
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
                  if (isLoggedIn && fromProfile && postedByMe) {
                    setOptionsActive(true)
                  } else if (!isLoggedIn) {
                    dispatch(openModal({ type: 'auth', closable: true }))
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
          <style>{`
          .ql-editor.ql-indent-1{
            padding-left:4px;
          }
          .ql-editor ul, 
          .ql-editor ol {
            font-family:'Poppins';
            padding-left: 4px; 
            font-size:14px;
            text-align:justify; 
          }

          .ql-editor a {
            font-family:'Poppins';
            color: rgb(128, 100, 162);  
            text-decoration: none !important;
            font-size:14px;
            text-align:justify;
          }
          .ql-editor p {
            font-family:'Poppins';
            font-size:14px;
            text-align:justify;
          }
      `}</style>
          {(!has_link ||
            props.currentSection === 'posts' ||
            router.pathname.startsWith('/post') ||
            router.pathname.endsWith('/posts')) && (
            <div className="ql-snow">
              <div
                className={`ql-editor`}
                dangerouslySetInnerHTML={{ __html: finalContent }}
              ></div>
            </div>
          )}
          {postData.video_url && (
            <video width="320" height="240" controls className={styles.video}>
              <source src={postData.video_url} type="video/mp4"></source>
            </video>
          )}
          {postData.media?.length > 0 && props.currentSection !== 'links' ? (
            <>
              {postData?.media?.length === 1 ? (
                <img
                  src={postData?.media[0]}
                  className={styles['post-image']}
                  alt=""
                  onClick={() => {
                    dispatch(
                      openModal({
                        type: 'View-Image-Modal',
                        closable: false,
                        imageurl: postData?.media[0],
                      }),
                    )
                  }}
                />
              ) : (
                <Slider
                  setActiveIdx={setActiveIdx}
                  activeIdx={activeIdx}
                  images={postData.media}
                  sameImgLinkInMeta={metaData.image}
                ></Slider>
              )}
            </>
          ) : (
            <>
              {has_link && props.currentSection !== 'links' && (
                <div
                  className={
                    isVideoLink(url)
                      ? styles['post-video-link']
                      : styles['posts-meta-parent']
                  }
                >
                  {linkLoading ? (
                    <LinkPreviewLoader />
                  ) : (
                    <>
                      {isVideoLink(url) ? (
                        <div className={styles.videoPlayer}>
                          <ReactPlayer
                            className={styles.reactplayer}
                            width="100%"
                            height="410px"
                            url={url}
                            controls={true}
                          />
                        </div>
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
                                {metaData?.title}
                              </a>

                              <a
                                href={url}
                                target="_blank"
                                className={styles.contentUrl}
                              >
                                {metaData?.description}
                              </a>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
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
                <div className={styles['meta-author']}>
                  <p className={styles['author-name']}>
                    {postData?.author_type === 'User'
                      ? postData?._author?.full_name
                      : postData?.author_type === 'Listing'
                      ? postData?._author?.title
                      : ' '}
                  </p>
                  <p className={styles['date']}>
                    <span className={styles['separator']}>|</span>
                    {' ' + dateFormat.format(new Date(postData.createdAt))}
                  </p>
                </div>
                <div className={styles['meta-author']}>
                  <p className={styles['date']}>{postData?._hobby?.display}</p>

                  <p className={styles['date']}>
                    <span className={styles['separator']}>|</span>
                    {' ' + postData?.visibility}
                  </p>
                </div>

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
            {showComments && <PostComments data={postData} />}
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
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_18724_19460)">
                  <path
                    d="M6.21582 18.685H6.16653L6.13254 18.7207L2.33082 22.7125V4.1C2.33082 3.00316 3.18456 2.115 4.21582 2.115H20.2158C21.2471 2.115 22.1008 3.00316 22.1008 4.1V16.7C22.1008 17.7968 21.2471 18.685 20.2158 18.685H6.21582ZM20.2158 16.815H20.3308V16.7V4.1V3.985H20.2158H4.21582H4.10082V4.1V18.8V19.0875L4.2991 18.8793L6.26511 16.815H20.2158Z"
                    fill="#8064A2"
                    stroke="white"
                    stroke-width="0.23"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_18724_19460">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.21582)"
                    />
                  </clipPath>
                </defs>
              </svg>
              {/* Share Icon */}
              <svg
                className={styles['share-icon']}
                onClick={handleShare}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.70167 21.7376L1.83759 22.196L1.97522 21.7381L2.43911 20.1948L2.43922 20.1944C3.60848 16.2646 7.06959 13.6235 11.045 13.6235C11.2041 13.6235 11.4683 13.63 11.7726 13.6375C11.7769 13.6377 11.7812 13.6378 11.7854 13.6379V16.6745C11.7854 17.0517 11.8997 17.3412 12.0854 17.5375C12.2705 17.7332 12.5164 17.8253 12.7578 17.8253C13.0292 17.8253 13.2917 17.7202 13.543 17.5173C13.5431 17.5172 13.5433 17.5171 13.5434 17.517L21.5985 11.0765L21.5985 11.0765C21.9415 10.8021 22.1427 10.4056 22.1427 9.99264C22.1427 9.57973 21.9415 9.18321 21.5985 8.90879L21.5985 8.90877L13.5428 2.4678L13.5428 2.46778L13.5407 2.46615C13.2935 2.27596 13.0316 2.16 12.7578 2.16C12.5164 2.16 12.2705 2.2521 12.0854 2.44774C11.8997 2.64407 11.7854 2.93357 11.7854 3.31081V6.51611C11.4754 6.50453 11.1997 6.50453 11.0455 6.50453H11.045C5.38622 6.50453 0.794764 11.2564 0.794764 17.0848C0.794764 18.1425 0.948439 19.1909 1.24663 20.2029L1.2467 20.2032L1.70167 21.7376ZM13.0165 7.65534V3.64347L20.8135 9.88108L20.8134 9.8813L20.8209 9.88655C20.8814 9.92896 20.8938 9.96947 20.8938 9.99264C20.8938 10.0157 20.8815 10.0588 20.8135 10.1131L13.0165 16.3507V12.5887V12.4514L12.8794 12.446L12.4261 12.4283C12.4258 12.4282 12.4255 12.4282 12.4253 12.4282C11.8963 12.4013 11.3144 12.3924 11.045 12.3924C7.22779 12.3924 3.83618 14.5215 2.06436 17.8512C2.04464 17.5977 2.03478 17.3429 2.03478 17.0848C2.03478 11.9313 6.07913 7.75347 11.045 7.75347C11.3018 7.75347 11.8621 7.76235 12.3691 7.78014C12.3692 7.78014 12.3692 7.78014 12.3692 7.78014L12.8687 7.79798L13.0165 7.80326V7.65534Z"
                  fill="#8064A2"
                  stroke="#8064A2"
                  stroke-width="0.285472"
                />
              </svg>
              {/* Bookmark Icon */}
              {/* <CustomizedTooltips title='This feature is under development'> */}

              <svg
                onClick={showFeatureUnderDevelopment}
                className={styles['bookmark-icon']}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g clip-path="url(#clip0_18724_19457)">
                  <path
                    d="M11.8435 19.441L11.7695 19.4065L11.6955 19.441L4.44453 22.8248V4.43294C4.44453 3.23193 5.3442 2.27461 6.41239 2.27461H17.1267C18.1949 2.27461 19.0945 3.23193 19.0945 4.43294V22.8248L11.8435 19.441ZM17.0516 19.7577L17.3017 19.8764V19.5996V5.59961C17.3017 4.87562 16.7549 4.25794 16.0552 4.25794H7.48382C6.78415 4.25794 6.23739 4.87562 6.23739 5.59961V19.5996V19.8764L6.48744 19.7577L11.7695 17.25L17.0516 19.7577Z"
                    fill="#8064A2"
                    stroke="white"
                    stroke-width="0.35"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_18724_19457">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.21582)"
                    />
                  </clipPath>
                </defs>
              </svg>
              {/* </CustomizedTooltips> */}
            </section>

            {/* Comments Section */}
            {(showComments || router.pathname.startsWith('/post/')) && (
              <PostComments data={postData} />
            )}
          </footer>
        )}
      </div>
      {deleteData.open && (
        <DeletePrompt
          triggerOpen={deleteData.open}
          _id={deleteData._id}
          closeHandler={() => {
            setDeleteData({ open: false, _id: undefined })
          }}
          noHandler={() => {
            setDeleteData({ open: false, _id: undefined })
          }}
          yesHandler={handleDeletePost}
          text="post"
        />
      )}
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
