import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { GetListingEvents } from '@/services/listing.service'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useMediaQuery } from '@mui/material'

interface Props {
  data: ListingPageData['pageData']
}

const ListingEventsTab: React.FC<Props> = ({ data }) => {
  const [eventData, setEventData] = useState<any>(null)
  console.warn({ eventData })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data && data._id) {
          const params = {
            search_id: data._id.toString(),
          }

          const res = await GetListingEvents(params.search_id)

          setEventData(res)
          console.log('eventres', res)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [data])
  console.log('eventdata', eventData?.res?.data)
  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <>
      <main>
        {!eventData?.res ? (
          <section className={styles['data-container']}>
            <div className={styles['no-data-div']}>
              <p className={styles['no-data-text']}>No events available</p>
            </div>
            {!isMobile && <div className={styles['no-data-div']}></div>}
          </section>
        ) : (
          <div className={styles['card-container']}>
            {/* Combine both data sources */}
            {(() => {
              const allListings = [
                ...eventData?.res?.data?.result.map(
                  (listings: any) => listings.listings,
                ),
                ...eventData?.res?.data?.listingMap.map(
                  (listings: any) => listings,
                ),
              ]

              // Filter out duplicates based on the _id
              const uniqueListings = allListings.filter(
                (listing, index, self) =>
                  index === self.findIndex((t) => t._id === listing._id),
              )

              // Map unique listings to ListingCard components
              return uniqueListings.map((listing) => (
                <ListingCard key={listing._id} data={listing} />
              ))
            })()}
          </div>
        )}
      </main>
    </>
  )
}

export default ListingEventsTab
