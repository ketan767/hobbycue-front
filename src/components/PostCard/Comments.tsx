import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { addPostComment, getPostComment } from '@/services/post.service'
import { dateFormatShort, isEmptyField } from '@/utils'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostCommentVotes from './CommentVotes'

type Props = {
  styles: any
  data: any
  // updatePost: () => void
}

const PostComments = ({ data, styles }: Props) => {
  const router = useRouter()
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const [comments, setComments] = useState<any>([])

  const [inputValue, setInputValue] = useState('')

  const fetchComments = async () => {
    const { err, res } = await getPostComment(
      `_post=${data._id}&populate=_author`,
    )
    if (err) return console.log(err)
    setComments(res?.data?.data?.comments)
  }

  const addComment = async (event: any) => {
    event.preventDefault()
    if (isEmptyField(inputValue)) return
    const jsonData = {
      postId: data._id,
      commentBy:
        activeProfile.type === 'user'
          ? 'User'
          : activeProfile.type === 'listing'
          ? 'Listing'
          : '',
      commentById: activeProfile.data._id,
      content: inputValue,
      date: Date.now(),
    }
    if (!jsonData.commentBy) return
    const { err, res } = await addPostComment(jsonData)
    if (err) return console.log(err)
    await fetchComments()
    setInputValue('')
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <>
      <div>
        {/* Comment Input */}
        <section className={styles['inputContainer']}>
          {activeProfile?.data?.profile_image ? (
            <Image
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
              <input
                value={inputValue}
                className={styles['input']}
                placeholder="Write a comment..."
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className={styles['submit-btn']}>
                <svg
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
            {router.pathname === '/post/[post_id]' ? (
              comments.map((comment: any, idx: number) => {
                return (
                  <div key={comment._id} className={styles['comment']}>
                    {/* Profile Image */}
                    <>
                      {comment?._author?.profile_image ? (
                        <Image
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
                          {comment?.date &&
                            dateFormatShort.format(new Date(comment.date))}
                        </p>
                      </header>

                      {/* Content */}
                      <p className={styles['content']}>{comment.content}</p>

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
                      <Image
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
                          dateFormatShort.format(new Date(comments[0].date))}
                      </p>
                    </header>

                    {/* Content */}
                    <p className={styles['content']}>{comments?.[0].content}</p>

                    {/* Footer */}
                    <footer>
                      {/* Upvote and Downvote */}
                      <div className={styles['upvote-downvote']}>
                        <div className={styles['upvote']}>
                          <svg
                            width="24"
                            height="21"
                            viewBox="0 0 24 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.60083 20H17.1236C17.2136 20 17.2999 19.9642 17.3636 19.9006C17.4273 19.8369 17.463 19.7506 17.463 19.6606V13.89H22.3849C22.4493 13.8888 22.5119 13.8692 22.5655 13.8337C22.6192 13.7982 22.6616 13.7482 22.688 13.6896C22.7143 13.6309 22.7234 13.5659 22.7142 13.5022C22.705 13.4386 22.678 13.3788 22.6361 13.3299L12.1134 1.10999C12.0807 1.07526 12.0413 1.04759 11.9975 1.02867C11.9537 1.00976 11.9065 1 11.8588 1C11.8111 1 11.7639 1.00976 11.7201 1.02867C11.6764 1.04759 11.6369 1.07526 11.6042 1.10999L1.08149 13.3299C1.03931 13.3793 1.01215 13.4396 1.00323 13.5039C0.994301 13.5682 1.00399 13.6337 1.03113 13.6926C1.05828 13.7515 1.10175 13.8014 1.1564 13.8364C1.21105 13.8714 1.27458 13.89 1.33947 13.89H6.26139V19.6606C6.26139 19.7506 6.29715 19.8369 6.36081 19.9006C6.42447 19.9642 6.51081 20 6.60083 20Z"
                              stroke="#8064A2"
                              stroke-width="2"
                              fill={false ? '#8064A2' : ''}
                            />
                          </svg>
                          <p className={styles['count']}>
                            {comments?.[0]?.up_votes?.count}
                          </p>
                        </div>
                        <span className={styles['divider']}></span>
                        <svg
                          width="24"
                          height="22"
                          viewBox="0 0 24 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.65317 1.9375L17.1759 1.9375C17.2659 1.9375 17.3523 1.97326 17.4159 2.03692C17.4796 2.10058 17.5153 2.18692 17.5153 2.27694V8.04748L22.4373 8.04748C22.5021 8.04747 22.5657 8.06607 22.6203 8.10106C22.675 8.13605 22.7184 8.18597 22.7456 8.24491C22.7727 8.30385 22.7824 8.36933 22.7735 8.43361C22.7646 8.49788 22.7374 8.55825 22.6952 8.60756L12.1725 20.8275C12.1398 20.8622 12.1004 20.8899 12.0566 20.9088C12.0128 20.9277 11.9656 20.9375 11.9179 20.9375C11.8702 20.9375 11.823 20.9277 11.7793 20.9088C11.7355 20.8899 11.696 20.8622 11.6633 20.8275L1.14063 8.60756C1.0988 8.55869 1.07173 8.49894 1.06255 8.43527C1.05338 8.3716 1.06248 8.30664 1.0888 8.24795C1.11513 8.18926 1.15758 8.13925 1.21123 8.10376C1.26488 8.06827 1.3275 8.04875 1.39181 8.04748H6.31373V2.27694C6.31373 2.18692 6.34949 2.10058 6.41315 2.03692C6.47681 1.97326 6.56315 1.9375 6.65317 1.9375Z"
                            stroke="#8064A2"
                            stroke-width="2"
                            fill={false ? '#8064A2' : ''}
                          />
                        </svg>
                      </div>

                      {/* More Action Button */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
                <Link href={`/post/${data._id}?comments=show`}>
                  <p className={styles['see-more-comments']}>
                    See more comments
                  </p>
                </Link>
              </>
            )}
          </section>
        )}
      </div>
    </>
  )
}

export default PostComments
