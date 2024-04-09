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

type Props = {
  styles: any
  data: any
  onMoreComments?: () => void
  showAllComments?: boolean
  getInput?: (x: string) => void
  hideSeeMore?: boolean
}

const PostComments = ({
  data,
  styles,
  onMoreComments,
  showAllComments,
  getInput,
  hideSeeMore,
}: Props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const inputRef: any = useRef<HTMLTextAreaElement>(null)
  const { activeProfile, user } = useSelector((state: RootState) => state.user)
  const [comments, setComments] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [displayMoreComments, setDisplayMoreComments] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
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
    if (user.is_onboarded === false) {
      dispatch(openModal({ type: 'user-onboarding', closable: true }))
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
    setLoading(false)
  }

  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
  useEffect(() => {
    if (showAllComments !== null && showAllComments !== undefined) {
      setDisplayMoreComments(showAllComments)
    }
  }, [showAllComments])

  useEffect(() => {
    fetchComments()
  }, [])

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
              width={40}
              height={40}
            />
          ) : (
            <div
              className={`default-user-icon ${styles['inputAuthorImage']}`}
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
                }}
                ref={inputRef}
                maxRows={5}
              />
              <button
                type="submit"
                className={styles['submit-btn']}
                disabled={loading}
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
            </form>
          </div>
        </section>

        {/* All Comments */}
        {comments.length > 0 && (
          <section className={styles['all-comment-container']}>
            {router.pathname === '/post/[post_id]' || displayMoreComments ? (
              comments.map((comment: any, idx: number) => {
                return (
                  <div key={comment._id} className={styles['comment']}>
                    {/* Profile Image */}
                    <>
                      {comment?._author?.profile_image ? (
                        <img
                          className={styles['inputAuthorImage']}
                          src={comment?._author?.profile_image}
                          alt="Author Profile"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div
                          className={` ${
                            comment?.author_type === 'Listing'
                              ? 'default-people-listing-icon'
                              : 'default-user-icon'
                          }  ${styles['inputAuthorImage']}`}
                        ></div>
                      )}
                    </>
                    {/* All Content  */}
                    <section className={styles['content-wrapper']}>
                      {/* Header */}
                      <header>
                        <p className={styles['author-name']}>
                          {comment?.author_type === 'Listing'
                            ? comment?._author?.title
                            : comment?._author?.full_name}
                        </p>
                        <p className={styles['date']}>
                          {comment?.date && format(new Date(comment.date))}
                        </p>
                      </header>

                      {/* Content */}
                      <CommentCheckWithUrl>
                        {comment.content}
                      </CommentCheckWithUrl>

                      {/* Footer */}
                      <footer>
                        {/* Upvote and Downvote */}
                        <PostCommentVotes
                          comment={comment}
                          postData={data}
                          styles={styles}
                          updateComments={fetchComments}
                        />

                        {/* More Action Button */}
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={showFeatureUnderDevelopment}
                          cursor={'pointer'}
                        >
                          <g clip-path="url(#clip0_173_72884)">
                            <path
                              d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                              fill="#6D747A"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_173_72884">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </footer>
                    </section>
                  </div>
                )
              })
            ) : (
              <>
                <div className={styles['comment']}>
                  {/* Profile Image */}
                  <>
                    {comments?.[0]?._author?.profile_image ? (
                      <img
                        className={styles['inputAuthorImage']}
                        src={comments?.[0]?._author?.profile_image}
                        alt="Author Profile"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div
                        className={` ${
                          comments?.[0]?.author_type === 'Listing'
                            ? 'default-people-listing-icon'
                            : 'default-user-icon'
                        }  ${styles['inputAuthorImage']}`}
                      ></div>
                    )}
                  </>
                  {/* All Content  */}
                  <section className={styles['content-wrapper']}>
                    {/* Header */}
                    <header>
                      <p className={styles['author-name']}>
                        {comments?.[0]?.author_type === 'Listing'
                          ? comments?.[0]?._author?.title
                          : comments?.[0]?._author?.full_name}
                      </p>
                      <p className={styles['date']}>
                        {comments?.[0]?.date &&
                          format(new Date(comments[0].date))}
                      </p>
                    </header>

                    {/* Content */}
                    {/* <p className={styles['content']}>{comments?.[0].content}</p> */}
                    <CommentCheckWithUrl>
                      {comments?.[0].content}
                    </CommentCheckWithUrl>

                    {/* Footer */}
                    <footer>
                      {/* Upvote and Downvote */}
                      <PostCommentVotes
                        comment={comments[0]}
                        postData={data}
                        styles={styles}
                        updateComments={fetchComments}
                      />

                      {/* More Action Button */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={showFeatureUnderDevelopment}
                        cursor={'pointer'}
                      >
                        <g clip-path="url(#clip0_173_72884)">
                          <path
                            d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                            fill="#6D747A"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_173_72884">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </footer>
                  </section>
                </div>
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
                    See more comments
                  </p>
                )}
              </>
            )}
          </section>
        )}
        {displayMoreComments && !hideSeeMore && (
          <p
            className={styles['see-more-comments']}
            onClick={() => {
              if (onMoreComments) onMoreComments()
            }}
          >
            See less comments
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
