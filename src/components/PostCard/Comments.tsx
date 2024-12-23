import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { addPostComment, getPostComment } from '@/services/post.service'
import { dateFormatShort, isEmptyField } from '@/utils'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostCommentVotes from './CommentVotes'
import { format, render, cancel, register } from 'timeago.js'
import TextareaAutosize from 'react-textarea-autosize'
import CommentCheckWithUrl from './CommentCheckWithUrl'
import { closeModal, openModal } from '@/redux/slices/modal'
import { setActivePost } from '@/redux/slices/post'
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar'
import { showProfileError } from '@/redux/slices/user'
import styles from './PostCard.module.css'
import Comment from './Comment'
import CustomTooltip from '@/components/Tooltip/ToolTip'

type Props = {
  // styles: any
  data: any
  onMoreComments?: () => void
  showAllComments?: boolean
  getInput?: (x: string) => void
  hideSeeMore?: boolean
}

const PostComments = ({
  data,
  // styles,
  onMoreComments,
  showAllComments,
  getInput,
  hideSeeMore,
}: Props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const inputRef: any = useRef<HTMLTextAreaElement>(null)
  const { activeProfile, user, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  )
  const [openAction, setOpenAction] = useState(false)
  const [optionsActive, setOptionsActive] = useState(false)
  const [comments, setComments] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState(() => {
    const storedVal = sessionStorage.getItem('commentDraft')
    if (storedVal) {
      const parsed = JSON.parse(storedVal)
      return parsed.id === data._id ? parsed.content : ''
    }
    return ''
  })
  const [displayMoreComments, setDisplayMoreComments] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [deleteData, setDeleteData] = useState<{
    open: boolean
    _id: string | undefined
  }>({
    open: false,
    _id: undefined,
  })
  const [inputFocus, setInputFocus] = useState(false)
  const { activeModal, closable } = useSelector(
    (state: RootState) => state.modal,
  )
  const fetchComments = async () => {
    const { err, res } = await getPostComment(
      `_post=${data?._id}&populate=_author`,
    )
    if (err) return console.log(err)
    setComments(res?.data?.data?.comments)
  }

  const addComment = async (event: any) => {
    event.preventDefault()
    if (isLoggedIn) {
      event.preventDefault()
      if (user.is_onboarded === false) {
        // router.push(`/profile/${user.profile_url}`)
        // dispatch(showProfileError(true))
        // dispatch(closeModal())
        dispatch(
          openModal({
            type: 'SimpleOnboarding',
            closable: true,
            propData: { showError: true },
          }),
        )
        return
      }
      if (isEmptyField(inputValue.trim())) return
      const jsonData = {
        postId: data?._id,
        commentBy:
          activeProfile?.type === 'user'
            ? 'User'
            : activeProfile.type === 'listing'
            ? 'Listing'
            : '',
        commentById: activeProfile?.data?._id,
        content: inputValue.trim(),
        date: Date.now(),
      }
      if (!jsonData?.commentBy) return
      setLoading(true)
      const { err, res } = await addPostComment(jsonData)
      if (err) {
        console.log(err)
        setLoading(false)
        return
      }
      await fetchComments()
      setInputValue('')
      sessionStorage.removeItem('commentDraft')
      setLoading(false)
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }
  const editReportDeleteRef: any = useRef(null)
  // useEffect(() => {
  //   function handleClickOutside(event: Event) {
  //     if (
  //       editReportDeleteRef.current &&
  //       !editReportDeleteRef.current.contains(event.target)
  //     ) {
  //       setOpenAction(false)
  //     }
  //   }

  //   // Bind the event listener
  //   document.addEventListener('click', handleClickOutside)

  //   // Unbind the event listener on cleanup
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside)
  //   }
  // }, [])

  const handleShowDelete = (postid: string) => {
    setDeleteData({ open: true, _id: postid })
  }

  useEffect(() => {
    if (showAllComments !== null && showAllComments !== undefined) {
      setDisplayMoreComments(showAllComments)
    }
  }, [showAllComments])

  useEffect(() => {
    fetchComments()
  }, [])

  const showGoToTop = router.asPath.includes('/post/') || activeModal === 'post'

  return (
    <>
      <div>
        {/* Comment Input */}
        <section className={styles['inputContainer']}>
          {activeProfile?.data?.profile_image ? (
            <img
              className={styles['inputAuthorImage']}
              src={activeProfile?.data?.profile_image}
              alt="Author Profile"
              width={32}
              height={32}
            />
          ) : (
            <div
              className={`default-user-icon ${
                activeProfile?.data?.author_type === 'User'
                  ? styles['inputAuthorImage']
                  : styles['page-img-comments']
              }`}
            ></div>
          )}

          <div className={styles['comment-input-wrapper']}>
            <form onSubmit={addComment}>
              <TextareaAutosize
                value={inputValue}
                className={styles['input']}
                placeholder="Write a comment..."
                onChange={(e: any) => {
                  if (getInput) {
                    getInput(e.target.value)
                  }
                  setInputValue(e.target.value)
                  sessionStorage.setItem(
                    'commentDraft',
                    JSON.stringify({ id: data?._id, content: e.target.value }),
                  )
                }}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                ref={inputRef}
                maxRows={5}
                style={{ borderColor: inputFocus ? '#8064A2' : '#E0E0E0' }}
              />
              <CustomTooltip title="Send">
                <button
                  type="submit"
                  className={styles['submit-btn']}
                  disabled={loading}
                  onClick={addComment}
                >
                  <svg
                    className={styles['submit-btn-svg']}
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.26683 11.6003L12.9002 6.61367C13.4402 6.38034 13.4402 5.62034 12.9002 5.387L1.26683 0.400337C0.826829 0.207003 0.340163 0.53367 0.340163 1.007L0.333496 4.08034C0.333496 4.41367 0.580163 4.70034 0.913496 4.74034L10.3335 6.00034L0.913496 7.25367C0.580163 7.30034 0.333496 7.587 0.333496 7.92034L0.340163 10.9937C0.340163 11.467 0.826829 11.7937 1.26683 11.6003Z"
                      fill="#8064A2"
                    />
                  </svg>
                </button>
              </CustomTooltip>
            </form>
          </div>
        </section>

        {/* All Comments */}
        {comments.length > 0 && (
          <section className={styles['all-comment-container']}>
            {router.pathname === '/post/[post_id]' || displayMoreComments ? (
              [...comments].reverse().map((comment: any, idx: number) => {
                return (
                  <Comment
                    comment={comment}
                    data={data}
                    fetchComments={fetchComments}
                    key={idx}
                  />
                )
              })
            ) : (
              <>
                <Comment
                  comment={comments[comments.length - 1]}
                  data={data}
                  fetchComments={fetchComments}
                />
                {comments?.length > 1 && (
                  <p
                    className={styles['see-more-comments']}
                    onClick={() => {
                      if (activeModal === 'post') {
                        if (onMoreComments) {
                          onMoreComments()
                        }
                      } else {
                        dispatch(setActivePost({ ...data }))
                        dispatch(
                          openModal({
                            type: 'post',
                            closable: false,
                            propData: { showMoreComments: true },
                          }),
                        )
                      }
                    }}
                  >
                    See {comments?.length > 1 ? comments?.length - 1 : ''} more
                    comments
                  </p>
                )}
              </>
            )}
          </section>
        )}
        {showGoToTop && comments?.length > 0 && (
          <p
            className={styles['see-more-comments']}
            onClick={() => inputRef.current?.focus()}
            style={{ marginBottom: 12 }}
          >
            Go to Top
          </p>
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

export default PostComments
