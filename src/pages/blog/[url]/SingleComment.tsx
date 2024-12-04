import React, { useEffect, useState } from 'react'
import styles from './BlogCard.module.css'
import { format } from 'timeago.js'
import CommentCheckWithUrl from './CommentCheckWithUrl'
import PostCommentVotes from './CommentVotes'
import BookmarkIcon from '@/assets/icons/BookmarkIcon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'

interface Props {
  comment: any
  setRefetch: React.Dispatch<React.SetStateAction<number>>
  showFeatureUnderDevelopment: () => void
}

const SingleComment: React.FC<Props> = ({
  comment,
  setRefetch,
  showFeatureUnderDevelopment,
}) => {
  const [showMoreDiv, setShowMoreDiv] = useState(false)
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const isAuthor = comment?._author?._id === user?._id

  const dispatch = useDispatch()

  const handleActions = (action: string) => {
    if (!isLoggedIn)
      return dispatch(openModal({ type: 'auth', closable: true }))
    if (!user?.is_onboarded)
      return dispatch(openModal({ type: 'SimpleOnboarding', closable: true }))

    switch (action) {
      case 'report':
        dispatch(
          openModal({
            type: 'PostReportModal',
            closable: true,
            propData: comment._id,
          }),
        )
        break

      case 'edit':
        showFeatureUnderDevelopment()
        break

      case 'delete':
        showFeatureUnderDevelopment()
        break

      default:
        break
    }
  }

  useEffect(() => {
    const outsideClick = () => {
      setShowMoreDiv(false)
    }
    window.addEventListener('click', outsideClick)
    return () => window.removeEventListener('click', outsideClick)
  }, [])

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
          <p className={`${styles['author-name']} truncateOneLine`}>
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
          {comment?.content ? (
            comment.content
              .split('\n')
              .map((line: any, index: number) => <div key={index}>{line}</div>)
          ) : (
            <div>""</div>
          )}
        </CommentCheckWithUrl>

        {/* Footer */}
        <footer>
          {/* Upvote and Downvote */}
          <PostCommentVotes setRefetch={setRefetch} comment={comment} />

          {/* More Action Button */}
          <div className={styles.bookmarkMore}>
            <div
              style={{ display: 'flex' }}
              onClick={showFeatureUnderDevelopment}
            >
              <BookmarkIcon />
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={(e) => {
                e.stopPropagation()
                setShowMoreDiv(!showMoreDiv)
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
            {showMoreDiv && (
              <div className={styles.more} onClick={(e) => e.stopPropagation()}>
                {!isAuthor && (
                  <button onClick={() => handleActions('report')}>
                    Report
                  </button>
                )}
                {isAuthor && (
                  <>
                    <button onClick={() => handleActions('edit')}>Edit</button>
                    <button onClick={() => handleActions('delete')}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </footer>
      </section>
    </div>
  )
}

export default SingleComment
