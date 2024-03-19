import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { GetListingEvents } from '@/services/listing.service'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingCard from '@/components/ListingCard/ListingCard'

interface Props {
  data: ListingPageData['pageData']
}

const ListingEventsTab: React.FC<Props> = ({ data }) => {
  const [eventData, setEventData] = useState<any>(null)
console.warn({eventData});

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

  return (
    <>
      <main>
        {eventData?.res?.data?.result.length === 0 ? (
          <section className={styles['data-container']}>
            <div className={styles['no-data-div']}>
              <p className={styles['no-data-text']}>No events</p>
            </div>
            <div className={styles['no-data-div']}></div>
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
        {!eventData?.res &&(
                  <main
                  className={`${styles['display-desktop']} ${styles['dual-section-wrapper']}`}
                >
                  <div className={styles['no-posts-container']}>
                    <p>
                      This feature is under development. Come back soon to view this
                    </p>
                  </div>
                  <div className={styles['no-posts-container']}></div>
                </main>
        )}
      </main>
    </>
  )
}

export default ListingEventsTab
