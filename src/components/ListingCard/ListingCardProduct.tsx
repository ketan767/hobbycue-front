import React from 'react'
import styles from './ListingCardProduct.module.css'
import Link from 'next/link'
import Image from 'next/image'
import LocationIcon from '../../assets/svg/location.svg'
import HobbyIcon from '../../assets/svg/hobby.svg'
import { getListingTypeName, pageType } from '@/utils'
import People from '@/assets/svg/People.svg'
import Place from '@/assets/svg/Place.svg'
import Program from '@/assets/svg/Program.svg'
import { useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Height } from '@mui/icons-material'
import { updateListingLayoutMode } from '@/redux/slices/site'

export const rupeesIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.9545 6.40909L15.1477 9.38636H0.0681819L0.886364 6.40909H15.9545ZM8.375 24L0.420455 14.4318L0.409091 11.9091H4.34091C5.2803 11.9091 6.06439 11.7538 6.69318 11.4432C7.32955 11.125 7.81061 10.6818 8.13636 10.1136C8.4697 9.53788 8.63636 8.86364 8.63636 8.09091C8.63636 6.93182 8.29545 6 7.61364 5.29545C6.93182 4.59091 5.84091 4.23864 4.34091 4.23864H0.0681819L0.954545 0.727272H4.34091C6.25 0.727272 7.82955 1.02273 9.07955 1.61364C10.3371 2.19697 11.2765 3.02273 11.8977 4.09091C12.5265 5.15909 12.8409 6.40909 12.8409 7.84091C12.8409 9.10606 12.6098 10.2348 12.1477 11.2273C11.6856 12.2197 10.9583 13.0341 9.96591 13.6705C8.97348 14.3068 7.67424 14.7311 6.06818 14.9432L5.93182 14.9886L13.1136 23.7955V24H8.375ZM15.9773 0.727272L15.1477 3.75L2.92045 3.70454L3.75 0.727272H15"
      fill="#08090A"
    />
  </svg>
)

type Props = {
  data: any
  itsMe: boolean
  calendarIcon?: JSX.Element
  clockIcon?: JSX.Element
  isMobile?: boolean
  style?: React.CSSProperties
}

const ListingCardProduct: React.FC<Props> = ({
  data,
  itsMe,
  calendarIcon,
  clockIcon,
  isMobile,
  style,
}) => {
  return (
    <>
      <Link
        key={data?._id}
        href={`/${pageType(data?.type)}/${data?.page_url}`}
        className={styles.container}
        style={style}
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

        <div className={styles.content}>
          <div className={styles.contentHead}>
            {data?.profile_image ? (
              <div className={styles.contentImageContainer}>
                <img
                  src={data?.profile_image}
                  width={48}
                  height={48}
                  alt="profile-image"
                  className={styles.contentImage}
                />
              </div>
            ) : (
              <div
                className={`${styles['contentImageContainer']} default-product-listing-icon`}
              ></div>
            )}
            <div
              className={styles.contentTitle}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div className="">
                {data?.product_variant?.variations?.[0]?.value ? (
                  <p className={styles.price}>
                    {rupeesIcon}
                    {data?.product_variant?.variations?.[0]?.value}
                  </p>
                ) : (
                  <p
                    style={{
                      whiteSpace: 'normal',
                      marginBottom: '1rem',
                    }}
                  >
                    Currently Unavailable
                  </p>
                )}
                <p className={styles.soldBy}>
                  <span style={{ color: 'black' }}>Sold by:</span>{' '}
                  {data?.seller?.title}
                </p>
                {/* Add cart icon here */}
              </div>
              {/* <div className={styles['time-and-title']}>
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
                    {data?.event_date_time.length !== 0 && (
                      <section>
                        {calendarIcon}{' '}
                        <p>{formatDateRange(data?.event_date_time[0])}</p>
                      </section>
                    )}
                    {!isMobile && (
                      <>
                        {data?.event_date_time.length !== 0 && (
                          <section>
                            {clockIcon}{' '}
                            <p>
                              {data?.event_date_time[0]?.from_time + ' - '}
                              {data?.event_weekdays?.length > 0 ? (
                                <>
                                  ...
                                  <span className={styles['purpleText']}>
                                    more
                                  </span>
                                </>
                              ) : (
                                data?.event_date_time[0]?.to_time
                              )}
                            </p>
                          </section>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div> */}
              <div className="">
                <button className={styles.cta_button}>{data?.cta_text}</button>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className="">
              <p className={styles.title}>{data.title}</p>
              <p className={styles.tagline}> {data?.tagline} </p>
            </div>

            <div className={styles.bottomFooter}>
              <Image src={HobbyIcon} width={16} height={16} alt="hobby" />
              <div className={styles.hobbies}>
                {data?._hobbies?.map((item: any) => {
                  return (
                    <div className={styles.hobby} key={item._id}>
                      {item.hobby?.display}{' '}
                      {item.genre?.display ? ' - ' + item.genre.display : ''}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default ListingCardProduct
