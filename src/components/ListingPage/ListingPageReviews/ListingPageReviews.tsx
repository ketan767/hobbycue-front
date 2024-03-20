import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useMediaQuery } from '@mui/material';

const ListingReviewsTab = ({}) => {
  const isMobile = useMediaQuery("(max-width:1100px)");

  return (
    <>
      <main>
        <section className={styles['data-container']}>
          <div className={styles['no-data-div']}>
            <p className={styles['no-data-text']}>
              This feature is under development. Come back soon to view this
            </p>
          </div>
          {!isMobile&&<div className={styles['no-data-div']}></div>}
        </section>{' '}
      </main>
    </>
  )
}

export default ListingReviewsTab
