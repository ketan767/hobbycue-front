import React, { useEffect, useState } from 'react'
import styles from './PostCard.module.css'
import { format, render, cancel, register } from 'timeago.js'
import CommentCheckWithUrl from './CommentCheckWithUrl'
import PostCommentVotes from './CommentVotes'
import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import DeletePrompt from '../DeletePrompt/DeletePrompt'
import { deletePostComment } from '@/services/post.service'
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar'

interface Props {
  comment: any
  data: any
  fetchComments: () => void
}

const Comment: React.FC<Props> = ({ comment, data, fetchComments }) => {
  const [openAction, setOpenAction] = useState(false)
  const [showDelModal, setShowDelModal] = useState(false)
  const dispatch = useDispatch()
  const { activeProfile, user, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  )
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  useEffect(() => {
    function handleClickOutside(event: Event) {
      setOpenAction(false)
    }

    // Bind the event listener
    document.addEventListener('click', handleClickOutside)

    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const postedByMe =
    (comment?.author_type === 'User' &&
      comment?._author?.email === user?.email) ||
    (comment?.author_type === 'Listing' && comment?._author?.admin === user._id)

  const handleDeleteComment = async () => {
    const { res, err } = await deletePostComment(comment._id)
    if (err) {
      console.log('Error in deletePostComment', err)
      setSnackbar({
        type: 'error',
        display: true,
        message: 'Error deleting comment.',
      })
    }

    fetchComments()
    setShowDelModal(false)
  }

  return (
    <div key={comment._id} className={styles['comment']}>
      {/* Profile Image */}
      <>
        {comment?._author?.profile_image ? (
          <img
            className={
              comment?.author_type === 'User'
                ? styles['inputAuthorImage']
                : styles['page-img-comments']
            }
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
            }  ${
              comment?.author_type === 'User'
                ? styles['inputAuthorImage']
                : styles['page-img-comments']
            }`}
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
        <CommentCheckWithUrl>{comment.content}</CommentCheckWithUrl>

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

          <div
            //   ref={editReportDeleteRef}
            className={styles.actionIcon}
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                // showFeatureUnderDevelopment()
                if (postedByMe) {
                  setOpenAction(!openAction)
                }
              }}
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

            {openAction === true && (
              <div className={styles.editReportDelete}>
                {postedByMe && (
                  <>
                    {/* <button
                      onClick={() => {
                        dispatch(
                          openModal({
                            type: 'update-post',
                            closable: true,
                            propData: data,
                          }),
                        )
                        setOpenAction(false)
                      }}
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => {
                        setShowDelModal(true)
                        setOpenAction(false)
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
                {/* <button
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
                </button> */}
              </div>
            )}
          </div>
        </footer>
      </section>
      {showDelModal && (
        <DeletePrompt
          triggerOpen={showDelModal}
          _id={comment._id}
          closeHandler={() => {
            setShowDelModal(false)
          }}
          noHandler={() => {
            setShowDelModal(false)
          }}
          yesHandler={handleDeleteComment}
          text="post"
        />
      )}
      <CustomSnackbar
        message={snackbar.message}
        triggerOpen={snackbar.display}
        type={snackbar.type === 'success' ? 'success' : 'error'}
        closeSnackbar={() => {
          setSnackbar((prevValue) => ({ ...prevValue, display: false }))
        }}
      />
    </div>
  )
}

export default Comment
