/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'

import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { checkIfUrlExists, dateFormat, isEmptyField } from '@/utils'
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
import { MenuItem, Select } from '@mui/material'
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

type Props = {
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  propData?:{
  showMoreComments?:boolean}
}

export const PostModal: React.FC<Props> = ({
  confirmationModal,
  setConfirmationModal,
  handleClose,
  propData
}) => {
  const { activePost } = useSelector((state: RootState) => state.post)
  const dispatch = useDispatch()
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(true)
  const [displayMoreComments, setDisplayMoreComments] = useState(propData?.showMoreComments??false)
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const [isChanged, setIsChanged] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
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
      `_id=${activePost._id}&populate=_author,_genre,_hobby`,
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
        {!displayMoreComments&&<CloseIcon
          className={styles['modal-close-icon']}
          onClick={() =>
            isChanged ? setConfirmationModal(true) : handleClose()
          }
        />}
        <div
          className={`${styles['header']}`}
          style={displayMoreComments ? { display: 'none' } : {}}
        >
          <div className={`${styles['header-user']}`}>
            <Image
              src={activePost?._author?.profile_image??defaultUserImage}
              alt=""
              width={40}
              height={40}
            ></Image>
            <div className={styles['title']}>
              <p>{activePost?._author?.full_name}</p>
              <p>
                <span>
                  {dateFormat?.format(new Date(activePost?.createdAt))}
                  {' | '}
                </span>
                <span>
                  {activePost?._hobby?.display}
                  {' | '}
                </span>
                <span>{activePost?.visibility}</span>
              </p>
            </div>
          </div>
          <div className={`${styles['header-options']}`}>
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
          </div>
        </div>

        <div
          className={`${styles['body']}`}
          style={displayMoreComments ? { display: 'none' } : {}}
        >
          <div
            className={styles['post-content']}
            dangerouslySetInnerHTML={{
              __html: `${activePost?.content}`,
            }}
          ></div>
          {activePost?.media?.length > 0 && (
            <div>
              <img
                src={activePost?.media[0]}
                className={styles['post-image']}
                alt=""
              />
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
            </div>
            <div className={styles['bookmark-share']}>
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
            </div>
          </div>
        </div>
        {showComments && (
          <PostComments
            data={activePost}
            styles={styles}
            onMoreComments={() => {
              setDisplayMoreComments((prevValue) => !prevValue)
            }}
            showAllComments={true}
            getInput={(input) => setNewComment(input)}
            hideSeeMore={!displayMoreComments}
          />
        )}
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
