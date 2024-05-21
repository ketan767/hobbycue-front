'use client'
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
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <g clip-path="url(#clip0_13885_12079)">
        <path
          d="M13.6565 9.60714H9.37081V13.8929C9.37081 14.3643 8.9851 14.75 8.51367 14.75C8.04224 14.75 7.65653 14.3643 7.65653 13.8929V9.60714H3.37081C2.89939 9.60714 2.51367 9.22143 2.51367 8.75C2.51367 8.27857 2.89939 7.89286 3.37081 7.89286H7.65653V3.60714C7.65653 3.13571 8.04224 2.75 8.51367 2.75C8.9851 2.75 9.37081 3.13571 9.37081 3.60714V7.89286H13.6565C14.128 7.89286 14.5137 8.27857 14.5137 8.75C14.5137 9.22143 14.128 9.60714 13.6565 9.60714Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_13885_12079">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0.513672 0.75)"
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
          {listingLayoutMode === 'view' && (
            <div onClick={addReview} className={styles['add-review-btn']}>
              {plusSvg}
              <p>Add Review</p>
            </div>
          )}
          {pageData?._reviews.length == 0 ? (
            <>
              <div className={styles['no-data-div']}>
                <p className={styles['no-data-text']}>No reviews</p>
              </div>

              {!isMobile && <div className={styles['no-data-div']}></div>}
            </>
          ) : (
            <>
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
