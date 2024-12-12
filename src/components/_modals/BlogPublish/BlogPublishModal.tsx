import React, { useEffect, useState } from 'react'
import EditBlog from '../EditBlog/EditBlog'
import styles from './BlogPublish.module.css'
import SaveModal from '../SaveModal/saveModal'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import axiosInstance from '@/services/_axios'
import { setRefetch } from '@/redux/slices/blog'
import { closeModal, setHasChanges } from '@/redux/slices/modal'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { CircularProgress } from '@mui/material'
import EditBlogHobbyModal from './Components/EditBlogHobbyModal'
import Link from 'next/link'
import BlogCard from '@/components/BlogCard/BlogCard'
import { BlogHobby } from '@/types/blog'
import FilledButton from '@/components/_buttons/FilledButton'

const penIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
  >
    <g clipPath="url(#clip0_22968_35813)">
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
function formatDate(isoDate: any) {
  const date = new Date(isoDate)

  // Format the date to '26 NOV 2024'
  const day = date.getDate().toString().padStart(2, '0') // Ensure 2 digits for day
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase() // Abbreviated month in uppercase
  const year = date.getFullYear() // Full year

  return `${day} ${month} ${year}`
}

const BlogPublish = (props: any) => {
  const router = useRouter()
  const { blog, refetch } = useSelector((state: RootState) => state.blog)
  const { hasChanges } = useSelector((state: RootState) => state.modal)
  const author = blog?.author
  const [editHobby, setEditHobby] = useState(false)
  const [urlText, setUrlText] = useState('')
  const [urlError, setUrlError] = useState('')
  const [keywords, setKeywords] = useState('')
  const [saveBtnLoading, setSaveBtnLoading] = useState(false)
  const [publishBtnLoading, setPublishBtnLoading] = useState(false)
  const dispatch = useDispatch()

  const handleURLUpdate = (e: any) => {
    setUrlError('')
    let value = e.target.value

    // Replace spaces with hyphens
    value = value.replace(/\s+/g, '-')

    // Remove unwanted characters (anything other than alphanumerics, hyphens, and slashes)
    value = value.replace(/[^a-zA-Z0-9-\/]/g, '')

    // Convert to lowercase
    value = value.toLowerCase()

    // Replace multiple consecutive hyphens with a single hyphen
    value = value.replace(/-{2,}/g, '-')

    // Update the state
    setUrlText(value)
  }

  const updateBlog = async (blogId: String) => {
    try {
      setSaveBtnLoading(true)
      let updatedFields = {
        url: urlText?.trim(),
        keywords: keywords
          ?.trim()
          .split(/[\s,]+/)
          .map((item: any) => item.trim())
          .filter((el: any) => el !== ''),
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
      setUrlError('')
      router.push(`/blog/${urlText}`)
      console.log('Blog updated successfully:', data)
      dispatch(closeModal())
    } catch (err: any) {
      if (err?.response?.data?.message === 'Blog with this url already exists!')
        setUrlError('Blog with this url already exists!')
      console.log('Error while updating meta data!', err)
    } finally {
      setSaveBtnLoading(false)
    }
  }

  // utils/api.ts

  const updateBlogStatus = async (
    blogId: string,
    status: 'Draft' | 'Pending' | 'Published',
  ): Promise<void> => {
    try {
      setPublishBtnLoading(true)
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
      setPublishBtnLoading(false)
      if (data) {
        // refetch
        dispatch(setRefetch(refetch + 1))
        console.log(data)
      }
    } catch (err) {
      console.log('Error in Publising Blog', err)
    }
  }

  useEffect(() => {
    if (blog) {
      setUrlText(blog?.url)
      setKeywords(blog.keywords?.join(', '))
    }
  }, [blog])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editHobby) {
        setEditHobby(false)
        e.stopPropagation()
      }
    }
    document.body.addEventListener('keydown', handleKeyDown)
    return () => document.body.removeEventListener('keydown', handleKeyDown)
  }, [editHobby])

  useEffect(() => {
    const initialData = {
      url: blog?.url,
      keywords: blog?.keywords?.join(', '),
    }
    const newData = {
      url: urlText,
      keywords: keywords,
    }

    if (JSON.stringify(initialData) !== JSON.stringify(newData)) {
      dispatch(setHasChanges(true))
    } else {
      dispatch(setHasChanges(false))
    }
  }, [urlText, keywords, blog])

  if (props?.confirmationModal) {
    return (
      <SaveModal
        handleClose={props?.handleClose}
        handleSubmit={() => updateBlog(blog._id)}
        setConfirmationModal={props?.setConfirmationModal}
      />
    )
  }
  return (
    <div className={styles.modalWrapper}>
      <section className={styles.mainContainer}>
        <div className={styles.containerWrapper}>
          <header className={styles.header}>
            <h2 className={styles.status}>
              Status: <span className={styles.statusSpan}>{blog?.status}</span>
            </h2>
            <div className={styles.actionButtons}>
              <Link href={`/blog/${urlText}?preview=true`} target="_blank">
                <OutlinedButton className={styles.previewButton}>
                  Preview
                </OutlinedButton>
              </Link>
              <OutlinedButton
                onClick={() => updateBlogStatus(blog._id, 'Pending')}
                className={styles.publishButton}
                disabled={publishBtnLoading || blog?.status !== 'Draft'}
              >
                {publishBtnLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  'Publish'
                )}
              </OutlinedButton>
            </div>
          </header>
          {editHobby ? (
            <EditBlogHobbyModal setEditHobby={setEditHobby} />
          ) : (
            <>
              {/* blogURL */}
              <div className={styles.blogUrlWrapper}>
                <label className={styles.blogLabel} htmlFor="URL">
                  Blog URL <span className={styles.Star}>*</span>{' '}
                  <span className={styles.urlSpan}>
                    {process.env.NEXT_PUBLIC_BASE_URL}/blog/{urlText}
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
                {urlError && <p className={styles.urlError}>{urlError}</p>}
              </div>

              {/* search pic */}
              <div className={styles.searchPicWrapper}>
                <div className={styles.searchPicContent}>
                  <figure className={styles.searchPicFigure}>
                    <img
                      className={styles.searchPicImage}
                      src={author?.profile_image}
                      alt="Author Pic"
                    />
                  </figure>
                  <div className={styles.searchPicDetails}>
                    <h3 className={`${styles.searchPicTitle} truncateOneLine`}>
                      {blog?.title}
                    </h3>
                    <h4
                      className={`${styles.searchPicSubtitle} truncateOneLine`}
                    >
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
                <BlogCard data={blog} />

                {/* right */}
                <div className={styles.rightContent}>
                  <h3 className={styles.keywordsHeader}>Keywords</h3>
                  <textarea
                    className={styles.keywordsTextarea}
                    rows={10}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
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
            </>
          )}
        </div>

        <div className={styles.footerButtons}>
          <OutlinedButton
            className={styles.backButton}
            onClick={() =>
              editHobby ? setEditHobby(false) : props?.handleClose()
            }
          >
            {editHobby ? `Back` : `Cancel`}
          </OutlinedButton>
          <FilledButton
            onClick={() =>
              editHobby ? setEditHobby(false) : updateBlog(blog._id)
            }
            className={styles.saveButton}
            disabled={saveBtnLoading}
          >
            {saveBtnLoading ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              'Save'
            )}
          </FilledButton>
        </div>
      </section>
    </div>
  )
}

export default BlogPublish
