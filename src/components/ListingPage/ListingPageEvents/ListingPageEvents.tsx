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
  const isMobile = useMediaQuery("(max-width:1100px)");

  return (
    <>
      <main>
        {!eventData?.res ? (
          <section className={styles['data-container']}>
            <div className={styles['no-data-div']}>
              <p className={styles['no-data-text']}>No events available</p>
            </div>
            {!isMobile&&<div className={styles['no-data-div']}></div>}
          </section>
        ) : (
          <div className={styles['card-container']}>
            {/* For artists and venues */}
            {eventData?.res?.data?.result.map((listings: any) => {
              return (
                <ListingCard
                  key={listings.listings._id}
                  data={listings.listings}
                />
              )
            })}
            {/* For page events */}
            {eventData?.res?.data?.listingMap?.map((listings: any) => {
              const listingId = listings._id

              return <ListingCard key={listingId} data={listings.listings} />
            })}
          </div>
        )}
      </main>
    </>
  )
}

export default ListingEventsTab
