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
import { useRouter } from 'next/router'
import RedCartIcon from '@/assets/icons/RedCartIcon'
import HobbyIconHexagon from '@/assets/icons/HobbyIconHexagon'

export const rupeesIcon = (
  <svg
    width="16"
    height="16"
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

// export const redCartIcon = (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="25"
//     height="25"
//     viewBox="0 0 25 25"
//     fill="none"
//   >
//     <path
//       d="M22.5011 7.63479V7.76479L21.0411 13.1648C20.8685 13.8057 20.4883 14.3713 19.9599 14.773C19.4315 15.1748 18.7848 15.3899 18.1211 15.3848H10.4711C9.72006 15.3878 8.99522 15.1091 8.43977 14.6036C7.88431 14.0982 7.53865 13.4028 7.47106 12.6548L6.82106 5.29479C6.79853 5.04547 6.68331 4.81366 6.49816 4.64518C6.31301 4.47669 6.0714 4.38377 5.82106 4.38479H3.65106C3.38585 4.38479 3.13149 4.27943 2.94396 4.0919C2.75642 3.90436 2.65106 3.65001 2.65106 3.38479C2.65106 3.11957 2.75642 2.86522 2.94396 2.67768C3.13149 2.49015 3.38585 2.38479 3.65106 2.38479H5.82106C6.57207 2.38174 7.2969 2.66049 7.85236 3.16595C8.40781 3.67141 8.75348 4.36682 8.82106 5.11479V5.38479H20.5111C20.7961 5.38255 21.0784 5.44128 21.3389 5.55705C21.5994 5.67281 21.8322 5.84293 22.0216 6.056C22.211 6.26907 22.3526 6.52017 22.437 6.79246C22.5215 7.06475 22.5467 7.35195 22.5111 7.63479H22.5011Z"
//       fill="#C0504D"
//     />
//     <path
//       d="M9.65106 22.3848C11.0318 22.3848 12.1511 21.2655 12.1511 19.8848C12.1511 18.5041 11.0318 17.3848 9.65106 17.3848C8.27035 17.3848 7.15106 18.5041 7.15106 19.8848C7.15106 21.2655 8.27035 22.3848 9.65106 22.3848Z"
//       fill="#C0504D"
//     />
//     <path
//       d="M17.6511 22.3848C19.0318 22.3848 20.1511 21.2655 20.1511 19.8848C20.1511 18.5041 19.0318 17.3848 17.6511 17.3848C16.2704 17.3848 15.1511 18.5041 15.1511 19.8848C15.1511 21.2655 16.2704 22.3848 17.6511 22.3848Z"
//       fill="#C0504D"
//     />
//   </svg>
// )

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
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)
  console.log('asifs productt', data)
  console.log('router', router.pathname)

  return (
    <>
      <Link
        key={data?._id}
        href={`/${pageType(data?.type)}/${data?.page_url}`}
        className={styles.container}
        style={style}
      >
        {itsMe && router.pathname.endsWith(`/[profile_url]/pages`) ? (
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
                paddingRight: 8,
              }}
            >
              <div className="">
                <p className={styles.soldBy}>
                  <span style={{ color: 'black' }}>Sold by:</span>{' '}
                  {data?.seller?.title}
                </p>

                <div className={styles.pageType}>
                  <RedCartIcon />
                  {data?.page_type[0]}
                </div>

                {data?.product_variant?.variations?.[0]?.value ? (
                  <p className={styles.price}>
                    {rupeesIcon}
                    {data?.product_variant?.variations?.[0]?.value}
                  </p>
                ) : (
                  <p className={styles.price}>{rupeesIcon}0</p>
                )}

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
              <span>
                <HobbyIconHexagon />
              </span>
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
