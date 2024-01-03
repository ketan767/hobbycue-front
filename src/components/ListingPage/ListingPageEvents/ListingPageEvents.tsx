import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'

const ListingEventsTab = ({}) => {
  return (
    <>
      <main>
        <section className={styles['data-container']}>
          <div className={styles['no-data-div']}>
            <p className={styles['no-data-text']}>
              This feature is under development. Come back soon to view this
            </p>
          </div>
          <div className={styles['no-data-div']}></div>
        </section>{' '}
      </main>
    </>
  )
}

export default ListingEventsTab
