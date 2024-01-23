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
        {eventData?.res?.data?.length === 0 ? (
          <section className={styles['data-container']}>
            <div className={styles['no-data-div']}>
              <p className={styles['no-data-text']}>No events</p>
            </div>
            <div className={styles['no-data-div']}></div>
          </section>
        ) : (
          <div className={styles['card-container']}>
            {eventData?.res?.data?.map((listings: any) => {
              return (
                <ListingCard key={listings.listings} data={listings.listings} />
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}

export default ListingEventsTab
