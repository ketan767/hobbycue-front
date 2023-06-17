import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './PostCard.module.css'
import { dateFormat } from '@/utils'
import Link from 'next/link'
import BarsIcon from '../../assets/svg/vertical-bars.svg'
import PostVotes from './Votes'
import PostComments from './Comments'
import { getAllPosts, getMetadata } from '@/services/post.service'
import { useRouter } from 'next/router'
import useCheckIfClickedOutside from '@/hooks/useCheckIfClickedOutside'

type Props = {
  postData: any
  fromProfile?: boolean
  onPinPost?: any
}

const PostCard: React.FC<Props> = (props) => {
  // const [type, setType] = useState<'User' | 'Listing'>()

  const router = useRouter()
  // console.log('🚀 ~ file: PostCard.tsx:20 ~ router:', router)
  const { fromProfile, onPinPost } = props
  const optionRef: any = useRef(null)
  const [showComments, setShowComments] = useState(false)
  const [postData, setPostData] = useState(props.postData)
  const [url, setUrl] = useState('')
  const [optionsActive, setOptionsActive] = useState(false)
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
  })
  useCheckIfClickedOutside(optionRef, () => setOptionsActive(false))

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
    if (postData.has_link) {
      const regex =
        /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
      const url = postData.content.match(regex)
      if (url) {
        setUrl(url[0])
      }
      if (url) {
        getMetadata(url[0])
          .then((res: any) => {
            setMetaData(res.res.data.data.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }, [postData])


  return (
    <>
      <div className={styles['post-card-wrapper']}>
        {/* Card Header */}
        <header>
          <Link href={`/profile/${postData?._author?.profile_url}`}>
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
          </Link>
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
            <p className={styles['post-other-info']}>
              <span>
                {dateFormat.format(new Date(postData.createdAt))}
                {' | '}
              </span>
              <span>
                <Link href={`/hobby/${postData?._hobby?.slug}`}>
                  {postData?._hobby?.display}
                </Link>
              </span>
              <span>
                {postData?._author?.state
                  ? ` | ${postData?._author?.state}`
                  : ''}
              </span>
            </p>
          </div>
          <div className={styles.actionIcon}>
            <svg
              ref={optionRef}
              className={styles['more-actions-icon']}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              onClick={() => setOptionsActive(true)}
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
                <li onClick={onPinPost !== undefined ? () => onPinPost(postData._id) : () => {}}>Pin post</li>
                <li>Delete</li>
              </ul>
            )}
          </div>
        </header>

        {/* Card Body */}
        <Link href={`/post/${postData._id}`}>
          <section className={styles['body']}>
            <div
              className={styles['content']}
              dangerouslySetInnerHTML={{
                __html: postData?.content.replace(/<img .*?>/g, ''),
              }}
            ></div>
            {postData.video_url && (
              <video width="320" height="240" controls className={styles.video}>
                <source src={postData.video_url} type="video/mp4"></source>
              </video>
            )}
            {postData.media ? (
              <div className={styles.postImages}>
                {postData.media.map((item: any, idx: number) => {
                  return (
                    <div key={item} style={{ width: '100%' }}>
                      <img src={item} alt="img" className={styles.postImage} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <></>
            )}
            {postData.has_link && (
              <a href={url} className={styles.postMetadata}>
                <div className={styles.metaImgContainer}>
                  <img
                    src={metaData.image ? metaData.image : metaData.icon}
                    alt="link-image"
                    width={200}
                    height={130}
                  />
                </div>
                <div className={styles.metaContent}>
                  <p className={styles.contentHead}> {metaData.title} </p>
                  <p className={styles.metaContentText}>
                    {' '}
                    {metaData.description}{' '}
                  </p>
                </div>
              </a>
            )}
          </section>
        </Link>

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
              onClick={() => setShowComments(!showComments)}
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
          {showComments && <PostComments data={postData} styles={styles} />}
        </footer>
      </div>
    </>
  )
}

export default PostCard
