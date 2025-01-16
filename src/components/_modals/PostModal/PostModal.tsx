/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'

import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  checkIfUrlExists,
  dateFormat,
  isEmptyField,
  isInstagramReelLink,
  isVideoLink,
  pageType,
} from '@/utils'
import { getAllHobbies } from '@/services/hobby.service'
import {
  addPostComment,
  createListingPost,
  createUserPost,
  getAllPosts,
  getMetadata,
  getPostComment,
  uploadImage,
} from '@/services/post.service'
import { closeModal, openModal, updateShareUrl } from '@/redux/slices/modal'

import DOMPurify from 'dompurify'
import { MenuItem, Select, useMediaQuery } from '@mui/material'
// import CancelBtn from '@/assets/svg/trash-icon.svg'
import CancelBtn from '@/assets/icons/x-icon.svg'
import FilledButton from '@/components/_buttons/FilledButton'
import InputSelect from '@/components/_formElements/Select/Select'
// import SaveModal from '../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import SaveModal from '../SaveModal/saveModal'
import Image from 'next/image'
import PostVotes from '@/components/PostCard/Votes'
import PostComments from '@/components/PostCard/Comments'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { setActivePost } from '@/redux/slices/post'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import defaultImg from '@/assets/svg/default-images/default-user-icon.svg'

import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'
import Link from 'next/link'
import Slider from '@/components/Slider/Slider'
import LinkPreviewLoader from '@/components/LinkPreviewLoader'
import { setShowPageLoader } from '@/redux/slices/site'
import ReactPlayer from 'react-player'
import ShareIcon from '@/assets/icons/ShareIcon'
import { useRouter } from 'next/router'
import CustomizedTooltips from '@/components/Tooltip/ToolTip'
import { link } from 'fs'

type Props = {
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  propData?: {
    showMoreComments?: boolean
  }
}

export const PostModal: React.FC<Props> = ({
  confirmationModal,
  setConfirmationModal,
  handleClose,
  propData,
}) => {
  const { activePost } = useSelector((state: RootState) => state.post)
  const dispatch = useDispatch()
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(true)
  const [displayMoreComments, setDisplayMoreComments] = useState(
    propData?.showMoreComments ?? false,
  )
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const [isChanged, setIsChanged] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
    url: '',
  })
  const [url, setUrl] = useState('')
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [linkLoading, setLinkLoading] = useState(false)
  const pageUrlClass = styles.postUrl
  const fetchComments = async () => {
    if (activePost?._id) {
      const { err, res } = await getPostComment(
        `_post=${activePost?._id}&populate=_author`,
      )
      if (err) return console.log(err)
      setComments(res?.data?.data?.comments)
    }
  }

  const addComment = async (event: any) => {
    if (isEmptyField(newComment)) return
    const jsonData = {
      postId: activePost?._id,
      commentBy:
        activeProfile?.type === 'user'
          ? 'User'
          : activeProfile?.type === 'listing'
          ? 'Listing'
          : '',
      commentById: activeProfile?.data._id,
      content: newComment,
      date: Date.now(),
    }
    if (!jsonData.commentBy) return
    const { err, res } = await addPostComment(jsonData)
    if (err) {
      console.log(err)
      return
    } else {
      dispatch(closeModal())
      window.location.reload()
    }
    await fetchComments()
  }

  useEffect(() => {
    fetchComments()
  }, [])

  useEffect(() => {
    if (activePost?.has_link) {
      const regex =
        /((https?:\/\/|ftp:\/\/|file:\/\/|www\.)[-A-Z0-9+&@#/%?=~_|!:,.;]*)/gi
      const url = activePost?.content.match(regex)
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
  }, [activePost])

  const handleShare = () => {
    dispatch(updateShareUrl(`${window.location.origin}/post/${activePost._id}`))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }

  const updatePost = async () => {
    const { err, res } = await getAllPosts(
      `_id=${activePost._id}&populate=_author,_genre,_hobby,_allHobbies._hobby1,_allHobbies._hobby2,_allHobbies._hobby3,_allHobbies._genre1,_allHobbies._genre2,_allHobbies._genre3`,
    )
    if (err) return console.log(err)
    if (res.data.success) {
      dispatch(setActivePost(res?.data?.data?.posts[0]))
      return
    }
  }

  useEffect(() => {
    console.log({ activePost }, { comments })
  }, [activePost, comments])

  useEffect(() => {
    if (newComment === '') {
      setIsChanged(false)
    } else {
      setIsChanged(true)
    }
  }, [newComment])
  const isReelBreakpoint = useMediaQuery('(max-width:600px)')
  const isMobile = useMediaQuery('(max-width:1100px)')
  dispatch(setShowPageLoader(false))

  const processedContent = activePost?.content

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

  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const router = useRouter()

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={addComment}
        setConfirmationModal={setConfirmationModal}
        // isError={isError}
      />
    )
  }

  return (
    <>
      <div className={`${styles['modal-wrapper']}`}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={() =>
            isChanged ? setConfirmationModal(true) : handleClose()
          }
        />

        <div className={`${styles['header']}`}>
          <Link
            href={
              activePost?.author_type === 'User'
                ? `/profile/${activePost?._author?.profile_url}`
                : `/${pageType(activePost?._author?.type)}/${
                    activePost?._author?.page_url
                  }`
            }
            onClick={(e) => {
              e.preventDefault()
              if (isLoggedIn) {
                dispatch(closeModal())
                router.push(
                  `${
                    activePost?.author_type === 'User'
                      ? `/profile/${activePost?._author?.profile_url}`
                      : `/${pageType(activePost?._author.type)}/${
                          activePost?._author?.page_url
                        }`
                  }`,
                )
              } else dispatch(openModal({ type: 'auth', closable: true }))
            }}
          >
            <div className={`${styles['header-user']}`}>
              {activePost?._author?.profile_image ? (
                <img
                  className={
                    activePost?.author_type === 'User'
                      ? styles['profile-img']
                      : styles['page-img']
                  }
                  src={activePost._author.profile_image}
                  alt=""
                  width={40}
                  height={40}
                />
              ) : (
                <Image
                  className={
                    activePost?.author_type === 'User'
                      ? styles['profile-img']
                      : styles['page-img']
                  }
                  src={defaultUserImage}
                  alt=""
                  width={40}
                  height={40}
                />
              )}

              <div className={styles['title']}>
                <p className="truncateOneLine">
                  {activePost.author_type === 'User'
                    ? activePost?._author?.full_name
                    : activePost?._author?.title}
                </p>
                <p>
                  <span>
                    {dateFormat?.format(new Date(activePost?.createdAt))}
                    {' | '}
                  </span>
                  {/* {activePost?._allHobbies?.length > 0 ? (
                    activePost?._allHobbies?.map(
                      (hobby: any, index: number) => {
                        return (
                          <span key={index}>
                            {`${hobby?.display}${
                              activePost?._allGenres[index - 1]?.display
                                ? ' - ' +
                                  activePost?._allGenres[index - 1]?.display
                                : ''
                            }`}
                            {index < activePost?._allHobbies?.length - 1
                              ? ', '
                              : ''}
                          </span>
                        )
                      },
                    )
                  ) : (
                    <span>{`${activePost?._hobby?.display}${
                      activePost._genre
                        ? ' - ' + activePost?._genre?.display
                        : ''
                    }`}</span>
                  )} */}
                  {activePost?._allHobbies?._hobby1?.display ? (
                    <>
                      <span>
                        {`${activePost?._allHobbies?._hobby1?.display}${
                          activePost?._allHobbies?._genre1?.display
                            ? ' - ' + activePost?._allHobbies?._genre1?.display
                            : ''
                        }`}
                        {activePost?._allHobbies?._hobby2?.display ? ', ' : ''}
                        {`${
                          activePost?._allHobbies?._hobby2?.display
                            ? activePost?._allHobbies?._hobby2?.display
                            : ''
                        }${
                          activePost?._allHobbies?._genre2?.display
                            ? ' - ' + activePost?._allHobbies?._genre2?.display
                            : ''
                        }`}
                        {activePost?._allHobbies?._hobby3?.display ? ', ' : ''}
                        {`${
                          activePost?._allHobbies?._hobby3?.display
                            ? activePost?._allHobbies?._hobby3?.display
                            : ''
                        }${
                          activePost?._allHobbies?._genre3?.display
                            ? ' - ' + activePost?._allHobbies?._genre3?.display
                            : ''
                        }`}
                      </span>
                    </>
                  ) : (
                    <span>{`${activePost?._hobby?.display}${
                      activePost._genre
                        ? ' - ' + activePost?._genre?.display
                        : ''
                    }`}</span>
                  )}
                  <span>
                    {activePost?._genre?.display &&
                      ` - ` + activePost?._genre.display}
                    {' | '}
                  </span>
                  <span>{activePost?.visibility}</span>
                </p>
              </div>
            </div>
          </Link>
          {/* <div className={`${styles['header-options']}`}> */}
          {/* <svg
              className={styles['more-actions-icon']}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
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
            </svg> */}
          {/* </div> */}
        </div>
        <div className={`${styles['body-wrapper']}`}>
          <div className={`${styles['body']}`}>
            <div
              className={styles['post-content']}
              dangerouslySetInnerHTML={{
                __html: finalContent,
              }}
            ></div>
            {activePost?.media?.length > 0 && (
              <div>
                {activePost?.media?.length === 1 ? (
                  <img
                    src={activePost?.media[0]}
                    className={styles['post-image']}
                    alt=""
                    onClick={() => {
                      dispatch(
                        openModal({
                          type: 'View-Image-Modal',
                          closable: false,
                          imageurl: activePost?.media[0],
                        }),
                      )
                    }}
                  />
                ) : (
                  <Slider
                    images={activePost.media}
                    setActiveIdx={undefined}
                    activeIdx={0}
                  />
                )}
              </div>
            )}
            {activePost?.has_link && activePost?.media.length == 0 && (
              <div
                style={linkLoading ? { margin: 'none' } : {}}
                className={
                  isVideoLink(url)
                    ? styles['post-video-link']
                    : styles['posts-meta-parent']
                }
              >
                {linkLoading ? (
                  <div style={{ width: '100vw' }}>
                    <LinkPreviewLoader />
                  </div>
                ) : (
                  <>
                    {isVideoLink(url) ? (
                      <div className={styles.videoPlayer}>
                        <ReactPlayer
                          width="100%"
                          height="410px"
                          style={{ overflow: 'hidden' }}
                          url={url}
                          controls={true}
                        />
                      </div>
                    ) : isInstagramReelLink(url) ? (
                      !isReelBreakpoint ? (
                        <div
                          onClick={() => window.open(url, '_blank')}
                          style={
                            isMobile
                              ? {
                                  background: '#fff',
                                  display: 'flex',
                                  justifyContent: 'between',
                                  alignItems: 'center',
                                  gap: '16px',
                                  cursor: 'pointer',
                                  padding: '0',
                                }
                              : {
                                  background: '#fff',
                                  display: 'flex',
                                  justifyContent: 'between',
                                  alignItems: 'center',
                                  gap: '16px',
                                  cursor: 'pointer',
                                  padding: '0 12px',
                                }
                          }
                        >
                          <div
                            style={{ width: '230.63px', maxHeight: '376.31px' }}
                          >
                            <img
                              style={{
                                cursor: 'pointer',
                                maxHeight: '376.31px',
                              }}
                              onClick={() => window.open(url, '_blank')}
                              width="230.63px"
                              src={
                                (typeof metaData?.image === 'string' &&
                                  metaData.image) ||
                                (typeof metaData?.icon === 'string' &&
                                  metaData.icon) ||
                                defaultImg
                              }
                              alt=""
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '16px',
                              fontSize: '15px',
                              justifyContent: 'start',
                              height: '376.31px',
                            }}
                          >
                            <p style={{ fontWeight: '500' }}>
                              {metaData?.title}
                            </p>
                            <p style={{ color: '#333' }}>
                              {metaData?.description?.split(':')[0]}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => window.open(url, '_blank')}
                          style={{
                            display: 'flex',
                            justifyContent: 'between',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            flexDirection: 'column',
                          }}
                        >
                          <div
                            style={{
                              width: 'calc(100%)',
                            }}
                          >
                            <img
                              style={{
                                cursor: 'pointer',
                              }}
                              width="100%"
                              onClick={() => window.open(url, '_blank')}
                              src={
                                (typeof metaData?.image === 'string' &&
                                  metaData.image) ||
                                (typeof metaData?.icon === 'string' &&
                                  metaData.icon) ||
                                defaultImg
                              }
                              alt=""
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '16px',
                              fontSize: '15px',
                              justifyContent: 'start',
                            }}
                          >
                            <p style={{ fontWeight: '500' }}>
                              {metaData?.title}
                            </p>
                            <p style={{ color: '#333' }}>
                              {metaData?.description?.split(':')[0]}
                            </p>
                          </div>
                        </div>
                      )
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
                              <>
                                <a
                                  href={url}
                                  target="_blank"
                                  className={styles.contentUrl}
                                >
                                  {' '}
                                  {metaData?.description?.split(' • ')[0]}{' '}
                                </a>
                                <a
                                  href={url}
                                  target="_blank"
                                  className={styles.contentUrl}
                                >
                                  {' '}
                                  {metaData?.description?.split(' • ')[1]}{' '}
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                        {isMobile && (
                          <>
                            <a
                              href={url}
                              target="_blank"
                              className={styles.contentUrl}
                            >
                              {' '}
                              {metaData?.description?.split(' • ')[0]}{' '}
                            </a>
                            <a
                              href={url}
                              target="_blank"
                              className={styles.contentUrl}
                            >
                              {' '}
                              {metaData?.description?.split(' • ')[1]}{' '}
                            </a>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            <div className={styles['post-functions']}>
              <div className={styles['likes-comments']}>
                <PostVotes
                  data={activePost}
                  styles={styles}
                  className={styles['meta-votes']}
                  updatePost={updatePost}
                />
                <CustomizedTooltips title="Comments">
                  <svg
                    onClick={(e: any) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setShowComments((prevValue) => !prevValue)
                    }}
                    cursor={'pointer'}
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    // fill={showComments ? '#8064A2' : 'none'}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.42578 15.4746H4.01157L3.71867 15.7675L1.42578 18.0604V2.47461C1.42578 1.92689 1.87807 1.47461 2.42578 1.47461H18.4258C18.9735 1.47461 19.4258 1.92689 19.4258 2.47461V14.4746C19.4258 15.0223 18.9735 15.4746 18.4258 15.4746H4.42578Z"
                      stroke="#8064A2"
                      stroke-width="2"
                    />
                  </svg>
                </CustomizedTooltips>
              </div>
              <div className={styles['bookmark-share']}>
                {/* Share Icon */}
                <CustomizedTooltips title="Share">
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
                      d="M1.68512 21.7425L1.83748 22.2563L1.99175 21.7431L2.45564 20.1997L2.45577 20.1993C3.62294 16.2766 7.07755 13.6408 11.045 13.6408C11.2031 13.6408 11.4655 13.6472 11.7682 13.6547V16.6745C11.7682 17.0553 11.8836 17.3493 12.0729 17.5494C12.2615 17.7488 12.512 17.8426 12.7578 17.8426C13.034 17.8426 13.3003 17.7355 13.554 17.5306C13.5541 17.5306 13.5541 17.5305 13.5542 17.5305L21.6093 11.09L21.6093 11.09C21.956 10.8126 22.16 10.4113 22.16 9.99264C22.16 9.57403 21.956 9.17271 21.6093 8.89531L21.6093 8.89529L13.5536 2.45432L13.5536 2.4543L13.5512 2.45247C13.3021 2.26085 13.0366 2.14273 12.7578 2.14273C12.512 2.14273 12.2615 2.23653 12.0729 2.43588C11.8836 2.63599 11.7682 2.93002 11.7682 3.31081V6.4982C11.4651 6.48727 11.1968 6.48727 11.0456 6.48727H11.045C5.37616 6.48727 0.7775 11.2474 0.7775 17.0848C0.7775 18.1441 0.931419 19.1942 1.23007 20.2078L1.23015 20.2081L1.68512 21.7425ZM13.0338 7.65534V3.67939L20.8028 9.89456L20.8026 9.89481L20.811 9.90069C20.8681 9.94068 20.8765 9.97637 20.8765 9.99264C20.8765 10.0088 20.8681 10.0474 20.8028 10.0996L13.0338 16.3148V12.5887V12.4348L12.8801 12.4288L12.427 12.411C12.4267 12.411 12.4264 12.411 12.4261 12.411C11.8967 12.3841 11.3146 12.3751 11.045 12.3751C7.24119 12.3751 3.85944 14.4857 2.07716 17.7907C2.06042 17.5572 2.05205 17.3224 2.05205 17.0848C2.05205 11.9403 6.08922 7.77073 11.045 7.77073C11.3016 7.77073 11.8616 7.77961 12.3685 7.79739C12.3686 7.7974 12.3686 7.7974 12.3686 7.7974L12.8681 7.81524L13.0338 7.82116V7.65534Z"
                      fill="#8064A2"
                      stroke="#8064A2"
                      stroke-width="0.32"
                    />
                  </svg>
                </CustomizedTooltips>

                {/* Bookmark Icon */}
                {/* <CustomizedTooltips title='This feature is under development'> */}
                <CustomizedTooltips title="Bookmark">
                  <svg
                    onClick={showFeatureUnderDevelopment}
                    className={styles['bookmark-icon']}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_19024_92507)">
                      <path
                        d="M11.615 19.1684L11.5537 19.1398L11.4924 19.1684L4.19871 22.5721V4.13314C4.19871 2.91801 5.10945 1.9448 6.19657 1.9448H16.9109C17.998 1.9448 18.9087 2.91801 18.9087 4.13314V22.5721L11.615 19.1684ZM16.8487 19.4308L17.0559 19.5292V19.2998V5.2998C17.0559 4.58993 16.5202 3.98814 15.8394 3.98814H7.268C6.58725 3.98814 6.05157 4.58993 6.05157 5.2998V19.2998V19.5292L6.25876 19.4308L11.5537 16.917L16.8487 19.4308Z"
                        fill="#8064A2"
                        stroke="white"
                        stroke-width="0.29"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_19024_92507">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </CustomizedTooltips>
              </div>
            </div>
          </div>
          {showComments && (
            <PostComments
              data={activePost}
              // styles={styles}
              onMoreComments={() => {
                setDisplayMoreComments((prevValue) => !prevValue)
              }}
              showAllComments={true}
              getInput={(input) => setNewComment(input)}
              hideSeeMore={!displayMoreComments}
            />
          )}
        </div>
      </div>
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
