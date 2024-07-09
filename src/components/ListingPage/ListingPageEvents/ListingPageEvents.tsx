import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { GetListingEvents, createNewListing } from '@/services/listing.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useMediaQuery } from '@mui/material'
import { openModal } from '@/redux/slices/modal'
import {
  updateEventFlow,
  updateListingModalData,
  updateListingTypeModalMode,
  updatePageDataForEvent,
} from '@/redux/slices/site'
import { useRouter } from 'next/router'

interface Props {
  data: ListingPageData['pageData']
}

const ListingEventsTab: React.FC<Props> = ({ data }) => {
  const [eventData, setEventData] = useState<any>(null)
  console.warn({ data })
  const dispatch = useDispatch()

  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const itsMe = user?._id === data?.admin
  console.warn({ itsMe })
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

  const router = useRouter()

  const handleAddEvent = () => {
    if (isLoggedIn) {
      dispatch(
        openModal({
          type: 'add-event',
          closable: true,
          propData: {
            handleSubmit: async (str: string, side: string) => {
              const jsonData =
                side === 'Right'
                  ? {
                      related_listings_right: {
                        relation: str,
                        listings: [data?._id],
                      },
                      type: 3,
                    }
                  : {
                      related_listings_left: {
                        relation: str,
                        listings: [data?._id],
                      },
                      type: 3,
                    }

              // await create program page
              const { err, res } = await createNewListing(jsonData)
              if (err) {
                throw new Error()
              } else {
                dispatch(updatePageDataForEvent(res?.data?.data?.listing))
                dispatch(updateEventFlow(true))
                router.push('/add-listing')
              }
              // set state of listing modal type and listing modal data with eventFlowRunning true
              // redirect to add-listing
            },
            data: data,
          },
        }),
      )
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const allListings = [
    ...(eventData?.res?.data?.result ?? []).map(
      (listings: any) => listings.listings,
    ),
    ...(eventData?.res?.data?.listingMap ?? []),
  ];
  

  // Filter out duplicates based on the _id
  const uniqueListings = allListings.filter(
    (listing, index, self) =>
      index === self.findIndex((t) => t._id === listing._id),
  )

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
    >
      <g clip-path="url(#clip0_15499_3164)">
        <path
          d="M26.5289 17.7933H17.9574V26.3647C17.9574 27.3076 17.186 28.079 16.2432 28.079C15.3003 28.079 14.5289 27.3076 14.5289 26.3647V17.7933H5.95745C5.01459 17.7933 4.24316 17.0219 4.24316 16.079C4.24316 15.1362 5.01459 14.3647 5.95745 14.3647H14.5289V5.7933C14.5289 4.85044 15.3003 4.07901 16.2432 4.07901C17.186 4.07901 17.9574 4.85044 17.9574 5.7933V14.3647H26.5289C27.4717 14.3647 28.2432 15.1362 28.2432 16.079C28.2432 17.0219 27.4717 17.7933 26.5289 17.7933Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_15499_3164">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(0.243164 0.0783691)"
          />
        </clipPath>
      </defs>
    </svg>
  )
  return (
    <>
      <main>
        {!eventData?.res ? (
          <section className={styles['data-container']}>
            <div onClick={handleAddEvent} className={styles['add-event']}>
              <div className={styles['new-tag']}>ADD NEW</div>
              <button>{plusIcon}</button>
            </div>

            <div className={styles['no-data-div']}>
              <p className={styles['no-data-text']}>No events available</p>
            </div>
          </section>
        ) : (
          <div className={styles['card-container']}>
            <div onClick={handleAddEvent} className={styles['add-event']}>
              <div className={styles['new-tag']}>ADD NEW</div>
              <button>{plusIcon}</button>
            </div>

            {/* Combine both data sources */}
            {uniqueListings.map((listing) => (
                <ListingCard key={listing._id} data={listing} />
              ))
            }
          </div>
        )}
      </main>
    </>
  )
}

export default ListingEventsTab
