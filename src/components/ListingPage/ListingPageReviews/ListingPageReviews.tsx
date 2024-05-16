import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useMediaQuery } from '@mui/material'

const ListingReviewsTab = ({ pageData }: { pageData: any }) => {
  const isMobile = useMediaQuery('(max-width:1100px)')
  console.warn('listingreivew', pageData)
  const sampleReviews = [
    {
      username: 'Manjesh',
      date: '2024-04-24T09:58:27.719Z',
      review:
        'I was hesitant to hire a music teacher because I had never played an instrument before, but the beginner lessons were perfect for me.',
      userimg:
        'https://s3.ap-south-1.amazonaws.com/hobby.cue/user-profile-1715350937390',
      user_id: '6628d7c31f38de303538fbb7',
      published: true,
    },
    {
      username: 'Manjesh',
      date: '2024-04-24T09:58:27.719Z',
      review:
        'I was hesitant to hire a music teacher because I had never played an instrument before, but the beginner lessons were perfect for me.',
      userimg:
        'https://s3.ap-south-1.amazonaws.com/hobby.cue/user-profile-1715350937390',
      user_id: '6628d7c31f38de303538fbb7',
      published: false,
    },
    {
      username: 'Manjesh',
      date: '2024-04-24T09:58:27.719Z',
      review:
        'I was hesitant to hire a music teacher because I had never played an instrument before, but the beginner lessons were perfect for me.',
      userimg:
        'https://s3.ap-south-1.amazonaws.com/hobby.cue/user-profile-1715350937390',
      user_id: '6628d7c31f38de303538fbb7',
      published: true,
    },
  ]

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

  return (
    <>
      <main>
        {pageData?._reviews.length == 0 ? (
          <section className={styles['data-container']}>
            <div className={styles['no-data-div']}>
              <p className={styles['no-data-text']}>No reviews</p>
            </div>

            {!isMobile && <div className={styles['no-data-div']}></div>}
          </section>
        ) : (
          <div className={styles['review-wrapper']}>
            {pageData?._reviews.map((review: any, i: any) => (
              <div key={i} className={styles['review-container']}>
                <img
                  src={review.user_id.profile_image}
                  alt={review.user_id.full_name}
                />
                <div className={styles['review-content']}>
                  <div className={styles['review-content-top']}>
                    <p className={styles['review-username']}>
                      {review.user_id?.full_name}{' '}
                    </p>
                    <p className={styles['review-date']}>
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <p className={styles['review']}>{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default ListingReviewsTab
