import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import { useMediaQuery } from '@mui/material'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import { closeModal, openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { FC } from 'react'
import { RootState } from '@/redux/store'
import { updateListingLayoutMode } from '@/redux/slices/site'
import {
  deleteListingReview,
  editListingReview,
  getListingPages,
} from '@/services/listing.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
// import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
const ResponsiveMasonry = dynamic(
  () => import('react-responsive-masonry').then((mod) => mod.ResponsiveMasonry),
  { ssr: false },
)
const Masonry = dynamic(
  () => import('react-responsive-masonry').then((Masonry) => Masonry),
  { ssr: false },
)

const ListingReviewsTab: FC<{ pageData: any }> = ({ pageData }) => {
  const isMobile = useMediaQuery('(max-width:1100px)')
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const { listingLayoutMode } = useSelector((state: any) => state.site)
  const optionRef: any = useRef(null)
  const dispatch = useDispatch()
  const addReview = () => {
    if (isLoggedIn) {
      dispatch(openModal({ type: 'ListingReviewModal', closable: true }))
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }
  const [optionsActive, setOptionsActive] = useState(false)
  const [activeReview, setActiveReview] = useState(null)
  const router = useRouter()

  function formatDate(inputDate: string): string {
    const months: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const date = new Date(inputDate)
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes

    return `${day} ${month} ${year} at ${formattedHours}:${formattedMinutes} ${ampm}`
  }

  const plusSvg = (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="31.5" fill="white" stroke="#8064A2" />
      <g clip-path="url(#clip0_13842_168936)">
        <path
          d="M42.2857 33.7148H33.7143V42.2862C33.7143 43.2291 32.9429 44.0005 32 44.0005C31.0571 44.0005 30.2857 43.2291 30.2857 42.2862V33.7148H21.7143C20.7714 33.7148 20 32.9433 20 32.0005C20 31.0576 20.7714 30.2862 21.7143 30.2862H30.2857V21.7148C30.2857 20.7719 31.0571 20.0005 32 20.0005C32.9429 20.0005 33.7143 20.7719 33.7143 21.7148V30.2862H42.2857C43.2286 30.2862 44 31.0576 44 32.0005C44 32.9433 43.2286 33.7148 42.2857 33.7148Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_13842_168936">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(16 16)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const iamAdmin = pageData?.admin === user?._id

  const [reviews, setReviews] = useState([])

  const reviewList = async () => {
    const { err, res } = await getListingPages(
      `_id=${pageData._id}&populate=_reviews`,
    )
    console.log('res', res)
    if (res?.data.success) {
      if (listingLayoutMode === 'edit') {
        setReviews(res?.data.data?.listings[0]?._reviews)
      } else {
        setReviews(
          res?.data.data?.listings[0]?._reviews?.filter(
            (review: any) =>
              review.is_published || review.user_id._id === user._id,
          ),
        )
      }
    }
  }
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  useEffect(() => {
    reviewList()
  }, [])
  const handlePublish = async (reviewId: any, pub_status: any) => {
    let jsonData = { is_published: pub_status }
    const { err, res } = await editListingReview(reviewId, jsonData)

    if (res?.data.success) {
      reviewList()
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Review updated',
      })
    } else if (err) {
      setSnackbar({
        display: true,
        type: 'warning',
        message: 'Something went wrong',
      })
      console.log(err)
    }
  }

  const handleDelete = async (reviewid: any) => {
    const { err, res } = await deleteListingReview(reviewid)
    if (res?.data.success) {
      reviewList()
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Review Deleted',
      })
    } else if (err) {
      setSnackbar({
        display: true,
        type: 'warning',
        message: 'Something went wrong',
      })
      console.log(err)
    }
  }

  useEffect(() => {
    reviewList()
  }, [])
  console.log('optionsActive', optionsActive)

  return (
    <>
      <main>
        <section className={styles['data-container']}>
          <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 1100: 2 }}>
            <Masonry
              gutter={isMobile ? '8px' : '12px'}
              style={{ columnGap: '24px', rowGap: isMobile ? '8px' : '12px' }}
            >
              {listingLayoutMode === 'view' && (
                <div
                  onClick={addReview}
                  className={styles.uploadButtonDescktop}
                >
                  <div className={styles.newTag}>ADD NEW</div>
                  {plusSvg}
                </div>
              )}
              {reviews?.map((review: any, i: any) => (
                <div key={i} className={styles['review-container']}>
                  <img
                    src={review?.user_id?.profile_image ?? defaultUserImage.src}
                    alt={review?.user_id?.full_name}
                  />
                  <div className={styles['review-content']}>
                    <div className={styles['review-content-top']}>
                      <div className={styles['review-name-status']}>
                        <p className={styles['review-username']}>
                          {review.user_id?.full_name}{' '}
                        </p>
                        <p className={styles['review-status']}>
                          {listingLayoutMode === 'edit'
                            ? review.is_published
                              ? 'Published'
                              : 'Unpublished'
                            : ''}
                        </p>
                      </div>
                      <p className={styles['review-date']}>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <p className={styles['review']}>{review.text}</p>
                  </div>
                  {iamAdmin && (
                    <svg
                      ref={optionRef}
                      className={styles['more-actions-icon']}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      onClick={() =>
                        setActiveReview(activeReview === i ? null : i)
                      }
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
                  )}
                  <div>
                    {activeReview === i && iamAdmin && (
                      <ul className={styles.optionsContainer}>
                        <li
                          onClick={() => {
                            handlePublish(review._id, !review?.is_published)
                            setActiveReview(null)
                          }}
                        >
                          {review?.is_published ? 'Unpublish' : 'Publish'}
                        </li>
                        <li
                          onClick={() => {
                            handleDelete(review._id)
                            setActiveReview(null)
                          }}
                        >
                          Delete
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>

          {pageData?._reviews.length == 0 && (
            <>
              <div className={styles['no-data-div']}>
                <p className={styles['no-data-text']}>No reviews</p>
              </div>

              {!isMobile && <div className={styles['no-data-div']}></div>}
            </>
          )}
        </section>
      </main>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default ListingReviewsTab
