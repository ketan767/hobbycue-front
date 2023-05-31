import React, { useState } from 'react'
import Image from 'next/image'
import styles from './PostCard.module.css'
import { dateFormat } from '@/utils'
import Link from 'next/link'
import BarsIcon from '../../assets/svg/vertical-bars.svg'
import PostVotes from './Votes'
import { getAllPosts } from '@/services/post.service'
import PostComments from './Comments'

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
            <div
              className={`default-user-icon  ${styles['author-profile']}`}
            ></div>
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
          <PostComments data={postData} styles={styles} />
        </footer>
      </div>
    </>
  )
}

export default PostCard
