import React, { useState } from 'react'
import Image from 'next/image'
import styles from './PostCard.module.css'
import { dateFormat } from '@/utils'
import Link from 'next/link'
import BarsIcon from '../../assets/svg/vertical-bars.svg'
import PostVotes from './Votes'
import { getAllPosts } from '@/services/post.service'

type Props = {
  postData: any
}

const comments = [
  {
    id: 1,
    comment:
      'Every work deserves its respect, not only delivery. Do we respect the cook who is standing in the heat all day to prepare the food they take….lets not talk more or less of any job….every job has its own good and bad associated.',
    author: 'Author auth',
    createdAt: 'Sep 6, 2021',
  },
]
const PostCard: React.FC<Props> = (props) => {
  // const [type, setType] = useState<'User' | 'Listing'>()

  const [postData, setPostData] = useState(props.postData)

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

  return (
    <>
      <div className={styles['post-card-wrapper']}>
        {/* Card Header */}
        <header>
          {postData?._author?.profile_image ? (
            <Image
              className={styles['author-profile']}
              src={postData?._author?.profile_image}
              alt="Author Profile"
              width={40}
              height={40}
            />
          ) : (
            <div className={styles['default-user-icon ']}></div>
          )}
          <div>
            <Link href={`/profile/${postData?._author?.profile_url}`}>
              <p className={styles['author-name']}>
                {postData?.author_type === 'User'
                  ? postData?._author?.display_name
                  : postData?.author_type === 'Listing'
                  ? postData?._author?.title
                  : ''}
              </p>
            </Link>
            <p className={styles['post-other-info']}>{`${dateFormat.format(
              new Date('2023-05-07T20:09:37.986Z'),
            )} | ${postData?._hobby?.display} ${
              postData?._genre?.display ? `| ${postData?._genre?.display}` : ''
            }`}</p>
          </div>
          <svg
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
          </svg>
        </header>

        {/* Card Body */}
        <section className={styles['body']}>
          <div
            className={styles['content']}
            dangerouslySetInnerHTML={{ __html: postData?.content }}
          ></div>
        </section>

        {/* Card Footer */}
        <footer>
          <section className={styles['footer-actions-wrapper']}>
            <PostVotes
              data={postData}
              styles={styles}
              updatePost={updatePost}
            />

            {/* Comment Icon */}
            <svg
              className={styles['comment-icon']}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_173_72893)">
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                  fill="#8064A2"
                />
              </g>
              <defs>
                <clipPath id="clip0_173_72893">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

            {/* Share Icon */}
            <svg
              className={styles['share-icon']}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            <svg
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
          </section>

          {/* Comments Section */}
          <div>
            {/* Comment Input */}
            <section className={styles['inputContainer']}>
              {postData?._author?.profile_image ? (
                <Image
                  className={styles['inputAuthorImage']}
                  src={postData?._author?.profile_image}
                  alt="Author Profile"
                  width={40}
                  height={40}
                />
              ) : (
                <div className={styles['default-user-icon ']}></div>
              )}
              <input
                className={styles['input']}
                placeholder="Write a comment..."
              />
            </section>

            {/* Comments */}
            {/* <section className={styles['commentsContainer']}>
              {comments.map((comment: any, idx) => {
                return (
                  <div key={idx} className={styles['comment']}>
                    <Image
                      className={styles['inputAuthorImage']}
                      src={postData?._author?.profile_image}
                      alt="Author Profile"
                      width={40}
                      height={40}
                    />
                    <div className={styles['commentContent']}>
                      <div className={styles['commentHeader']}>
                        <p className={styles['commentAuthor']}>
                          {comment.author}
                        </p>
                        <p className={styles['commentDate']}>
                          {comment.createdAt}
                        </p>
                      </div>
                      <p className={styles['commentText']}>{comment.comment}</p>
                      <div className={styles['commentFooter']}>
                        <div className={styles['votes']}>
                          <svg
                            className={styles['icon']}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_173_72899)">
                              <path
                                d="M17.1236 22L6.60083 22C6.51081 22 6.42447 21.9642 6.36081 21.9006C6.29715 21.8369 6.26139 21.7506 6.26139 21.6606L6.26139 15.89H1.33947C1.27458 15.89 1.21105 15.8714 1.1564 15.8364C1.10175 15.8014 1.05828 15.7515 1.03113 15.6926C1.00399 15.6337 0.994301 15.5682 1.00323 15.5039C1.01215 15.4396 1.03931 15.3793 1.08149 15.3299L11.6042 3.10999C11.6369 3.07526 11.6764 3.04759 11.7201 3.02867C11.7639 3.00976 11.8111 3 11.8588 3C11.9065 3 11.9537 3.00976 11.9975 3.02867C12.0413 3.04759 12.0807 3.07526 12.1134 3.10999L22.6361 15.3299C22.678 15.3788 22.705 15.4386 22.7142 15.5022C22.7234 15.5659 22.7143 15.6309 22.688 15.6896C22.6616 15.7482 22.6192 15.7982 22.5655 15.8337C22.5119 15.8692 22.4493 15.8888 22.3849 15.89H17.463L17.463 21.6606C17.463 21.7506 17.4273 21.8369 17.3636 21.9006C17.2999 21.9642 17.2136 22 17.1236 22ZM6.94028 21.3211L16.7841 21.3211V15.5506C16.7841 15.4606 16.8199 15.3742 16.8835 15.3106C16.9472 15.2469 17.0335 15.2111 17.1236 15.2111H21.645L11.8622 3.85167L2.07945 15.2111H6.60083C6.69086 15.2111 6.7772 15.2469 6.84086 15.3106C6.90452 15.3742 6.94028 15.4606 6.94028 15.5506L6.94028 21.3211Z"
                                fill="#8064A2"
                                stroke="#8064A2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_173_72899">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <svg
                            className={styles['downVote']}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_173_72898)">
                              <path
                                d="M6.87643 2L17.3992 2C17.4892 2 17.5755 2.03576 17.6392 2.09942C17.7028 2.16308 17.7386 2.24942 17.7386 2.33944L17.7386 8.10998L22.6605 8.10998C22.7254 8.10997 22.789 8.12857 22.8436 8.16356C22.8982 8.19855 22.9417 8.24847 22.9689 8.30741C22.996 8.36635 23.0057 8.43183 22.9968 8.4961C22.9879 8.56038 22.9607 8.62075 22.9185 8.67006L12.3958 20.89C12.3631 20.9247 12.3236 20.9524 12.2799 20.9713C12.2361 20.9902 12.1889 21 12.1412 21C12.0935 21 12.0463 20.9902 12.0025 20.9713C11.9587 20.9524 11.9193 20.9247 11.8866 20.89L1.36387 8.67006C1.32205 8.62118 1.29497 8.56144 1.2858 8.49777C1.27662 8.4341 1.28573 8.36914 1.31205 8.31045C1.33837 8.25176 1.38083 8.20175 1.43447 8.16626C1.48812 8.13076 1.55075 8.11125 1.61506 8.10997L6.53698 8.10998L6.53699 2.33944C6.53699 2.24942 6.57275 2.16308 6.63641 2.09942C6.70006 2.03576 6.7864 2 6.87643 2ZM17.0597 2.67889L7.21587 2.67889L7.21587 8.44942C7.21587 8.53944 7.18011 8.62578 7.11645 8.68944C7.05279 8.7531 6.96645 8.78886 6.87643 8.78886L2.35505 8.78886L12.1378 20.1483L21.9205 8.78886L17.3992 8.78886C17.3091 8.78886 17.2228 8.7531 17.1591 8.68944C17.0955 8.62578 17.0597 8.53945 17.0597 8.44942L17.0597 2.67889Z"
                                fill="#8064A2"
                                stroke="#8064A2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_173_72898">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                  transform="translate(24 24) rotate(-180)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <Image
                          className={styles['inputAuthorImage']}
                          src={BarsIcon}
                          alt="Author Profile"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>
            <p className={styles['moreComments']}>See more comments</p> */}
          </div>
        </footer>
      </div>
    </>
  )
}

export default PostCard
