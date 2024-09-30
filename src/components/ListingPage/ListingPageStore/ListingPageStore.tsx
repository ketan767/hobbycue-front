import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useMediaQuery } from '@mui/material'
import { getAllUserDetail } from '@/services/user.service'
import { getListingPages } from '@/services/listing.service'
import { GetServerSideProps } from 'next'
import ListingCard from '@/components/ListingCard/ListingCard'
interface Props {
  data?: ListingPageData['storeData']
}
const ListingStoreTab: React.FC<Props> = ({ data }) => {
  const isMobile = useMediaQuery('(max-width:1100px)')
  console.warn('listingdataa', data)
  return (
    <>
      <main>
        <section className={styles['data-container']}>
          {data?.length !== 0 ? (
            data?.map((product: any) => {
              return (
                <ListingCard
                  style={{ minWidth: 271, maxWidth: 700 }}
                  key={product?._id}
                  data={product}
                />
              )
            })
          ) : (
            <>
              <div className={styles['no-data-div']}>
                <p className={styles['no-data-text']}>No products available</p>
              </div>
              {!isMobile && (
                <>
                  <div className={styles['no-data-div']}>
                    <p className={styles['no-data-text']}></p>
                  </div>
                  <div className={styles['no-data-div']}>
                    <p className={styles['no-data-text']}></p>
                  </div>
                </>
              )}
            </>
          )}

          {/* {isMobile ? null : (
            <>
              {' '}
              <div className={styles['no-data-div']}></div>
              <div className={styles['no-data-div']}></div>
            </>
          )} */}
        </section>{' '}
      </main>
    </>
  )
}

export default ListingStoreTab
