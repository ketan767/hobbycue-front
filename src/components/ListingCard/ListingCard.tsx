import React from 'react'
import styles from './ListingCard.module.css'
import Link from 'next/link'
import Image from 'next/image'
import LocationIcon from '../../assets/svg/location.svg'
import HobbyIcon from '../../assets/svg/hobby.svg'
import { getListingTypeName } from '@/utils'
import People from '@/assets/svg/People.svg'
import Place from '@/assets/svg/Place.svg'
import Program from '@/assets/svg/Program.svg'
import { useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Height } from '@mui/icons-material'
import { updateListingLayoutMode } from '@/redux/slices/site'

type Props = {
  data: any
}

const ListingCard: React.FC<Props> = ({ data }) => {
  // console.log('🚀 ~ file: ListingCard.tsx:13 ~ data:', data)
  // console.log('Carddata', data)

  const { user } = useSelector((state: RootState) => state.user)
  const type = getListingTypeName(data?.type)

  console.warn({ data })
  function formatDateRange(prop: {
    from_date: string
    to_date: string
  }): string {
    // Helper function to format date to "DD MMM YYYY"
    function formatDate(date: Date): string {
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
      return date.toLocaleDateString('en-US', options).replace(',', '')
    }

    // Parse the dates and remove time component
    const fromDateObj = new Date(prop.from_date.split('T')[0])
    const toDateObj = new Date(prop.to_date.split('T')[0])

    // Format the dates
    const formattedFromDate = formatDate(fromDateObj)
    const formattedToDate = formatDate(toDateObj)

    // Format the result
    let result = `${formattedFromDate}`
    if (prop.from_date !== prop.to_date) {
      result += ` - ${formattedToDate}`
    }

    return result
  }
  const calendarIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <g clip-path="url(#clip0_15560_3639)">
        <path
          d="M6.24316 7.91171H4.90983V9.24505H6.24316V7.91171ZM8.90983 7.91171H7.5765V9.24505H8.90983V7.91171ZM11.5765 7.91171H10.2432V9.24505H11.5765V7.91171ZM12.9098 3.24505H12.2432V1.91171H10.9098V3.24505H5.5765V1.91171H4.24316V3.24505H3.5765C2.8365 3.24505 2.24983 3.84505 2.24983 4.57838L2.24316 13.9117C2.24316 14.645 2.8365 15.245 3.5765 15.245H12.9098C13.6432 15.245 14.2432 14.645 14.2432 13.9117V4.57838C14.2432 3.84505 13.6432 3.24505 12.9098 3.24505ZM12.9098 13.9117H3.5765V6.57838H12.9098V13.9117Z"
          fill="#939CA3"
        />
      </g>
      <defs>
        <clipPath id="clip0_15560_3639">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0.243164 0.578369)"
          />
        </clipPath>
      </defs>
    </svg>
  )
  const clockIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
    >
      <path
        d="M7.24284 0.911713C3.57617 0.911713 0.576172 3.91171 0.576172 7.57838C0.576172 11.245 3.57617 14.245 7.24284 14.245C10.9095 14.245 13.9095 11.245 13.9095 7.57838C13.9095 3.91171 10.9095 0.911713 7.24284 0.911713ZM9.60951 10.1117L6.88951 8.43838C6.68951 8.31838 6.56951 8.10505 6.56951 7.87171V4.74505C6.57617 4.47171 6.80284 4.24505 7.07617 4.24505C7.34951 4.24505 7.57617 4.47171 7.57617 4.74505V7.71171L10.1362 9.25171C10.3762 9.39838 10.4562 9.71171 10.3095 9.95171C10.1628 10.185 9.84951 10.2584 9.60951 10.1117Z"
        fill="#939CA3"
      />
    </svg>
  )

  const itsMe = data?.admin === user?._id
  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <>
      <Link
        key={data?._id}
        href={`/page/${data?.page_url}`}
        className={styles.container}
      >
        {itsMe ? (
          <div
            className={`${
              data.is_published
                ? styles['published-mark']
                : styles['unpublished-mark']
            }`}
          >
            <p>{data.is_published ? 'PUBLISHED' : 'UNPUBLISHED'}</p>
          </div>
        ) : (
          ''
        )}

        <div className={styles.imgContainer}>
          <div
            className={styles['background']}
            style={{ backgroundImage: `url(${data?.cover_image})` }}
          ></div>

          {data?.cover_image ? (
            <img
              src={data?.cover_image}
              width={300}
              height={100}
              alt="cover"
              className={styles.coverImage}
            />
          ) : (
            <div
              className={
                data?.type == 1
                  ? `${styles['coverImage']} default-people-listing-cover`
                  : data?.type == 2
                  ? `${styles['coverImage']} default-place-listing-cover`
                  : data?.type == 3
                  ? `${styles['coverImage']} default-program-listing-cover`
                  : data?.type == 4
                  ? `${styles['coverImage']} default-product-listing-cover`
                  : `${styles['coverImage']} default-people-listing-cover`
              }
            ></div>
          )}
        </div>

        <div
          style={{ width: '100%', height: '1px', background: '#939ca3' }}
        ></div>

        <div className={styles.content}>
          <div className={styles.contentHead}>
            {data?.profile_image ? (
              <div className={styles.contentImageContainer}>
                <img
                  src={data?.profile_image}
                  width={48}
                  height={48}
                  alt="cover"
                  className={styles.contentImage}
                />
              </div>
            ) : (
              <div
                className={
                  data?.type == 1
                    ? `${styles['contentImage']} default-people-listing-icon`
                    : data?.type == 2
                    ? `${styles['contentImage']} default-place-listing-icon`
                    : data?.type == 3
                    ? `${styles['contentImage']} default-program-listing-icon`
                    : data?.type == 4
                    ? `${styles['contentImage']} default-product-listing-icon`
                    : `${styles['contentImage']} default-people-listing-icon`
                }
              ></div>
            )}
            <div className={styles.contentTitle}>
              <p className={styles.title}> {data?.title} </p>
              <div className={styles['time-and-title']}>
                <p
                  className={
                    styles.titleType +
                    `
                ${
                  data?.type === 1
                    ? styles['purpleText']
                    : data?.type === 2
                    ? styles['greenText']
                    : styles['blueText']
                }
              `
                  }
                >
                  <Image
                    src={
                      data?.type === 1
                        ? People
                        : data?.type === 2
                        ? Place
                        : Program
                    }
                    alt="type"
                  />
                  <span>
                    {' '}
                    {data?.page_type?.map((item: string, idx: number) => {
                      if (idx === 0) {
                        return item
                      } else return ', ' + item
                    })}{' '}
                  </span>
                </p>
                {data?.event_date_time ? (
                  <div className={styles['date-time']}>
                    <section>
                      {calendarIcon}{' '}
                      <p>{formatDateRange(data?.event_date_time)}</p>
                    </section>
                    {!isMobile && (
                      <section>
                        {clockIcon}{' '}
                        <p>
                          {data?.event_date_time?.from_time +
                            ' - ' +
                            data?.event_date_time?.to_time}
                        </p>
                      </section>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          <p className={styles.tagline}> {data?.tagline} </p>

          <div className={styles.bottom}>
            <Image src={LocationIcon} width={16} height={16} alt="location" />

            <p className={styles.location}>
              {data?._address?.society ? data?._address?.society + ', ' : ''}
              {data?._address?.locality ? data?._address?.locality + ', ' : ''}
              {data?._address?.city ? data?._address?.city : ''}
            </p>
          </div>
          <div className={styles.bottom}>
            <Image src={HobbyIcon} width={16} height={16} alt="hobby" />
            <div className={styles.location}>
              {data?._hobbies?.map((item: any) => {
                return (
                  <span className={styles.hobby} key={item._id}>
                    {item.hobby?.display}{' '}
                    {item.genre?.display ? ' - ' + item.genre.display : ''}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default ListingCard
