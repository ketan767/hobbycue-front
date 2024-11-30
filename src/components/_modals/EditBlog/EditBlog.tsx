import React, { useEffect, useState } from 'react'
import styles from './EditBlog.module.css'
import Image from 'next/image'
import EditBlogHobbyModal from './EditHobby'
import { useRouter } from 'next/router'
import { useGetBlogById } from '@/services/blog.services'
import { BlogHobby } from '@/types/blog'
import axiosInstance from '@/services/_axios'

interface Props {
  setIsModalOpen: any
  data: any
}

const penIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
  >
    <g clip-path="url(#clip0_22968_35813)">
      <path
        d="M2.35547 12.0017V14.5017H4.85547L12.2288 7.12833L9.7288 4.62833L2.35547 12.0017ZM14.1621 5.195C14.4221 4.935 14.4221 4.515 14.1621 4.255L12.6021 2.695C12.3421 2.435 11.9221 2.435 11.6621 2.695L10.4421 3.915L12.9421 6.415L14.1621 5.195Z"
        fill="#8064A2"
      />
    </g>
    <defs>
      <clipPath id="clip0_22968_35813">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0.355469 0.501953)"
        />
      </clipPath>
    </defs>
  </svg>
)
const starIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
  >
    <path
      d="M9.3554 1.72949L16.0867 5.61586V13.3886L9.3554 17.2749L2.62402 13.3886V5.61586L9.3554 1.72949Z"
      fill="#939CA3"
    />
    <path
      d="M9.04514 5.5235C9.14463 5.22524 9.56649 5.22524 9.66598 5.5235L10.404 7.73536C10.4482 7.86806 10.5719 7.95794 10.7119 7.95905L13.0435 7.97741C13.3579 7.97989 13.4883 8.38111 13.2354 8.56792L11.3599 9.95328C11.2474 10.0364 11.2001 10.1819 11.2422 10.3152L11.9453 12.5384C12.0401 12.8382 11.6988 13.0862 11.443 12.9034L9.54587 11.5477C9.43206 11.4664 9.27906 11.4664 9.16525 11.5477L7.26814 12.9034C7.01232 13.0862 6.67101 12.8382 6.76582 12.5384L7.46887 10.3152C7.51105 10.1819 7.4638 10.0364 7.35128 9.95328L5.47572 8.56792C5.22282 8.38111 5.35318 7.97989 5.66759 7.97741L7.99925 7.95905C8.13913 7.95794 8.26284 7.86806 8.30712 7.73536L9.04514 5.5235Z"
      fill="white"
    />
  </svg>
)
let baseURL = 'https://hobbycue.com/blog/'
function formatDate(isoDate: any) {
  const date = new Date(isoDate)

  // Format the date to '26 NOV 2024'
  const day = date.getDate().toString().padStart(2, '0') // Ensure 2 digits for day
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase() // Abbreviated month in uppercase
  const year = date.getFullYear() // Full year

  return `${day} ${month} ${year}`
}
const EditBlog: React.FC<Props> = ({ setIsModalOpen }) => {
  const router = useRouter()

  const {
    data: Singleblog,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBlogById(`url=${router.query.url}&populate=author,_hobbies`)
  const data = {
    blog_url: Singleblog?.data?.blog[0],
  }

  const blog = data?.blog_url || {}
  const author = blog?.author
  const [editHobby, setEditHobby] = useState(false)
  const [urlText, setUrlText] = useState('')
  const [keyWords, setKeyWords] = useState('')

  useEffect(() => {
    if (blog) {
      setUrlText(blog?.url)
      setKeyWords(blog.keywords)
    }
  }, [blog])

  const handleClose = () => {
    setEditHobby(false)
  }

  const handleURLUpdate = (e: any) => {
    let value = e.target.value
    setUrlText(value)
    console.log(value.length)
  }
  const updateBlog = async (blogId: String) => {
    let updatedFields = {
      url: urlText,
      keywords: keyWords,
    }
    const token = localStorage.getItem('token')

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    const { data } = await axiosInstance.patch(
      `blogs/${blogId}`,
      updatedFields,
      headers,
    )

    if (!data) {
      console.error('Error updating blog:', data.error)
      return null
    }
    refetch()
    router.push(`/blog/${urlText}`)
    console.log('Blog updated successfully:', data)
    return data
  }

  // utils/api.ts

  const updateBlogStatus = async (
    blogId: string,
    status: 'Draft' | 'Pending' | 'Published',
  ): Promise<void> => {
    const token = localStorage.getItem('token') // Retrieve token from local storage
    if (!token) throw new Error('User is not authenticated')

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    const { data } = await axiosInstance.patch(
      `blogs/${blogId}/status`,
      { status },
      { headers },
    )
    if (data) {
      refetch()
      console.log(data)
    }
  }

  console.log(blog)
  let props = { setEditHobby, handleClose, data, refetch }

  return (
    <>
      {Singleblog && !isLoading && !isError && (
        <>
          {editHobby ? (
            <>
              <EditBlogHobbyModal {...props} />
            </>
          ) : (
            <section className={styles.mainContainer}>
              <div className={styles.closeButtonContainer}>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  x
                </button>
              </div>

              <div className={styles.containerWrapper}>
                <header className={styles.header}>
                  <h2 className={styles.status}>
                    Status:{' '}
                    <span className={styles.statusSpan}>{blog?.status}</span>
                  </h2>
                  <div className={styles.actionButtons}>
                    <button className={styles.previewButton}>Preview</button>
                    <button
                      onClick={() => updateBlogStatus(blog._id, 'Pending')}
                      className={styles.publishButton}
                    >
                      Publish
                    </button>
                  </div>
                </header>

                {/* blogURL */}
                <div className={styles.blogUrlWrapper}>
                  <label className={styles.blogLabel} htmlFor="URL">
                    Blog URL <span className={styles.Star}>*</span>{' '}
                    <span className={styles.urlSpan}>
                      {baseURL}
                      {urlText}{' '}
                    </span>
                  </label>
                  <input
                    className={styles.urlInput}
                    type="text"
                    value={urlText}
                    placeholder="URL"
                    maxLength={48}
                    onChange={handleURLUpdate}
                  />
                </div>

                {/* search pic */}
                <div className={styles.searchPicWrapper}>
                  {/* <p className={styles.searchPicText}>
                    <span className={styles.searchSpan}>Search Pic:</span>
                    <span className={styles.authorSpan}>Author</span>
                  </p> */}
                  <div className={styles.searchPicContent}>
                    <figure className={styles.searchPicFigure}>
                      <Image
                        className={styles.searchPicImage}
                        height={400}
                        width={400}
                        src={author?.profile_image}
                        alt=""
                      />
                    </figure>
                    <div className={styles.searchPicDetails}>
                      <h3 className={styles.searchPicTitle}>{blog?.title}</h3>
                      <h4 className={styles.searchPicSubtitle}>
                        {blog?.tagline}
                      </h4>
                      <p className={styles.searchPicAuthor}>
                        {author?.full_name} | {formatDate(blog?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className={styles.hr} />
                {/* middle content */}
                <div className={styles.middleWrapper}>
                  {/* left */}
                  <div className={styles.leftContent}>
                    <figure className={styles.leftFigure}>
                      <Image
                        className={styles.leftImage}
                        width={300}
                        height={300}
                        src={data?.blog_url?.cover_pic}
                        alt="profile cover"
                      />
                    </figure>
                    <h3 className={styles.leftTitle}>{blog?.title}</h3>
                    <p className={styles.leftSubtitle}>{blog?.tagline}</p>
                    <div className={styles.leftDetails}>
                      <p className={styles.leftAuthorInfo}>
                        <span className={styles.leftAuthor}>
                          {author?.full_name}
                        </span>
                        <span className={styles.leftDate}>
                          {formatDate(blog?.createdAt)}
                        </span>
                      </p>
                      <p className={styles.leftTags}>
                        <span className={styles.leftStarIcon}>{starIcon}</span>

                        {blog?._hobbies?.map((h: BlogHobby, i: React.Key) => (
                          <span key={i} className={styles.leftTag}>
                            {h.hobby?.display}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>

                  {/* right */}
                  <div className={styles.rightContent}>
                    {/* <h4 className={styles.blogCardHeader}>
                      <span className={styles.blogCardText}>Blog Card pic</span>
                      :<span className={styles.blogCardType}>Cover</span>
                    </h4> */}
                    <h3 className={styles.keywordsHeader}>KeyWords</h3>
                    <textarea
                      className={styles.keywordsTextarea}
                      rows={10}
                      value={keyWords}
                      onChange={(e) => setKeyWords(e.target.value)}
                    ></textarea>
                    <div className={styles.hobbiesSection}>
                      <h2 className={styles.hobbiesHeader}>
                        Hobbies{' '}
                        <span
                          className={styles.penIcon}
                          onClick={() => setEditHobby(true)}
                        >
                          {penIcon}
                        </span>
                      </h2>
                      <p className={styles.hobbiesButtons}>
                        {blog?._hobbies?.map((h: BlogHobby, i: React.Key) => (
                          <button key={i} className={styles.hobbyButton}>
                            {h.hobby?.display}
                          </button>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.footerButtons}>
                  <button
                    className={styles.backButton}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => updateBlog(blog._id)}
                    className={styles.saveButton}
                  >
                    Save
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {isLoading && <p>Loading</p>}
    </>
  )
}

export default EditBlog
