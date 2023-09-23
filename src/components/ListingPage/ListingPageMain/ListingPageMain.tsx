import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import Tooltip from '@/components/Tooltip/ToolTip'
import styles from './styles.module.css'
import { RootState } from '@/redux/store'
import TimeIcon from '@/assets/svg/time.svg'
import FacebookIcon from '@/assets/svg/Facebook.svg'
import TwitterIcon from '@/assets/svg/Twitter.svg'
import InstagramIcon from '@/assets/svg/Instagram.svg'
import BehanceIcon from '@/assets/svg/Behance.svg'
import BGGIcon from '@/assets/svg/BGG.svg'
import ChessIcon from '@/assets/svg/Chess.com.svg'
import DeviantArtIcon from '@/assets/svg/DeviantArt.svg'
import GoodreadsIcon from '@/assets/svg/GoodReads.svg'
import PinterestIcon from '@/assets/svg/Pinterest.svg'
import SmuleIcon from '@/assets/svg/Smule.svg'
import SoundCloudIcon from '@/assets/svg/Soundcloud.svg'
import StravaIcon from '@/assets/svg/Strava.svg'
import TripAdvisorIcon from '@/assets/svg/Tripadvisor.svg'
import UltimateGuitarIcon from '@/assets/svg/Ultimate-Guitar.svg'
import YouTubeIcon from '@/assets/svg/Youtube.svg'

import { getListingPages, getListingTags } from '@/services/listing.service'
import { dateFormat } from '@/utils'
import { updateListingTypeModalMode } from '@/redux/slices/site'
import WhatsappIcon from '@/assets/svg/whatsapp.svg'
import { listingTypes } from '@/constants/constant'
import Link from 'next/link'
import DirectionIcon from '@/assets/svg/direction.svg'

interface Props {
  data: ListingPageData['pageData']
  children: any
}

const ListingPageMain: React.FC<Props> = ({ data, children }) => {
  const dispatch = useDispatch()
  const [tags, setTags] = useState([])
  const { listingLayoutMode } = useSelector((state: any) => state.site)
  console.log('page', data)
  const [selectedTags, setSelectedTags] = useState([])
  const [listingPagesLeft, setListingPagesLeft] = useState([])
  const [listingPagesRight, setListingPagesRight] = useState([])

  useEffect(() => {
    getListingTags()
      .then((res: any) => {
        const temp = res.res.data.data.tags
        let selected: any = []
        temp.forEach((item: any) => {
          if (data._tags.includes(item._id)) {
            selected.push(item)
          }
        })
        setSelectedTags(selected)
        setTags(temp)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [data._tags])

  useEffect(() => {
    setListingPagesLeft([])
    data.related_listings_left.listings.map((listing: any) => {
      getListingPages(`_id=${listing}`)
        .then((res: any) => {
          const listingData = res.res.data.data.listings[0]
          setListingPagesLeft((prevArray: any) => {
            const updated: any = [...prevArray, listingData]
            const ids = prevArray.map((item: any) => item._id)
            if (!ids.includes(listingData._id)) {
              return updated
            } else {
              return prevArray
            }
          })
        })
        .catch((err: any) => {
          console.log(err)
        })
    })

    getListingPages(``)
      .then((res: any) => {
        // console.log('all users', res.res.data.data.users)
        let users = res.res.data.data.users
        let selectedListingsRight: any = []
        users.forEach((item: any) => {
          if (data?.related_listings_right?.listings.includes(item._id)) {
            selectedListingsRight.push(item)
          }
        })
        setListingPagesRight(selectedListingsRight)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [data?.related_listings_left?.listings])

  const openGoogleMaps = () => {
    let addressText = ''
    if (data?._address.street) {
      addressText += `${data?._address.street}, `
    }
    if (data?._address.society) {
      addressText += `${data?._address.society}, `
    }
    if (data?._address.city) {
      addressText += `${data?._address.city}, `
    }
    if (data?._address.state) {
      addressText += `${data?._address.state}, `
    }
    if (data?._address.country) {
      addressText += `${data?._address.country}, `
    }
    console.log('addressText', addressText)
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      addressText,
    )}`
    window.open(mapsUrl, '_blank')
  }
  console.log('data', data)
  return (
    <>
      <PageGridLayout column={3}>
        <aside className={`custom-scrollbar ${styles['page-left-aside']}`}>
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() => {
              dispatch(openModal({ type: 'listing-type-edit', closable: true }))
              dispatch(updateListingTypeModalMode({ mode: 'edit' }))
            }}
            className={styles['page-type-container']}
          >
            {data.page_type.map((type: any, idx: any) => {
              return (
                <div className={styles['listing-page-type']} key={idx}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_173_56244)">
                      <path
                        d="M17 10.43V2H7V10.43C7 10.78 7.18 11.11 7.49 11.29L11.67 13.8L10.68 16.14L7.27 16.43L9.86 18.67L9.07 22L12 20.23L14.93 22L14.15 18.67L16.74 16.43L13.33 16.14L12.34 13.8L16.52 11.29C16.82 11.11 17 10.79 17 10.43ZM13 12.23L12 12.83L11 12.23V3H13V12.23Z"
                        fill="#0096C8"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_173_56244">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p>{type}</p>
                </div>
              )
            })}
          </PageContentBox>

          {/* Listing Hobbies */}

          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'listing-hobby-edit', closable: true }),
              )
            }
          >
            <h4 className={styles['heading']}>Hobbies</h4>
            {!data || data._hobbies.length === 0 ? (
              <span className={styles.textGray}>{'No Hobbies!'}</span>
            ) : (
              <ul className={styles['hobby-list']}>
                {data?._hobbies?.map((item: any) => {
                  if (typeof item === 'string') return
                  return (
                    <Link
                      href={`/hobby/${item?.genre?.slug}`}
                      className={styles.textGray}
                      key={item._id}
                    >
                      {item?.hobby?.display}
                      {item?.genre && ` - ${item?.genre?.display} `}
                    </Link>
                  )
                })}
              </ul>
            )}
          </PageContentBox>

          {/* Tags */}
          {listingLayoutMode !== 'edit' &&
          (!listingPagesRight || listingPagesRight.length === 0) ? null : (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({ type: 'listing-tags-edit', closable: true }),
                )
              }
            >
              <h4 className={styles['heading']}>Tags</h4>
              <ul className={styles['hobby-list']}>
                {selectedTags?.map((item: any) => {
                  if (typeof item === 'string') return null
                  return (
                    <li key={item._id} className={styles.textGray}>
                      {item?.name} - {item?.description}
                    </li>
                  )
                })}
              </ul>
            </PageContentBox>
          )}

          {/* Related Listing */}
          {listingLayoutMode !== 'edit' &&
          (!listingPagesRight || listingPagesRight.length === 0) ? null : (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'related-listing-left-edit',
                    closable: true,
                  }),
                )
              }
            >
              <h4 className={styles['heading']}>
                {' '}
                {data?.related_listings_left.relation
                  ? data?.related_listings_left.relation
                  : 'Related Listing'}{' '}
              </h4>
              {!listingPagesLeft || listingPagesLeft.length === 0 ? (
                <span className={styles.textGray}>{'No data!'}</span>
              ) : (
                <ul className={styles['hobby-list']}>
                  {listingPagesLeft?.map((item: any) => {
                    if (typeof item === 'string') return null
                    return (
                      <Link
                        key={item._id}
                        className={styles.textGray}
                        href={`/page/${item.page_url}`}
                      >
                        {item?.title}
                        {/* {item?.genre && ` - ${item?.genre?.display} `} */}
                      </Link>
                    )
                  })}
                </ul>
              )}
            </PageContentBox>
          )}
        </aside>

        {children}

        <aside>
          {/* User Contact Details */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'listing-contact-edit', closable: true }),
              )
            }
          >
            <h4 className={styles['heading']}>Contact Information</h4>
            <ul className={styles['contact-wrapper']}>
              {/* Phone */}
              {data?.name && (
                <Link href={`tel:${data?.name}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_230_34018)">
                      <path
                        d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_230_34018">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className={styles.textGray}>{data?.name} </span>
                </Link>
              )}
              {data?.phone && (
                <Link href={`tel:${data?.phone}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_230_34018)">
                      <path
                        d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_230_34018">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className={styles.textGray}>{data?.phone} </span>
                </Link>
              )}

              {/* WhatsApp Number */}
              {data?.whatsapp_number && (
                <Link href={`https://wa.me/${data?.whatsapp_number}`}>
                  <Image
                    src={WhatsappIcon}
                    alt="whatsapp11"
                    width={24}
                    height={24}
                  />
                  <span className={styles.textGray}>
                    {data?.whatsapp_number}{' '}
                  </span>
                </Link>
              )}

              {/* Email */}
              {data?.public_email && (
                <Link href={`mailto:${data?.public_email}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_230_34011)">
                      <path
                        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_230_34011">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className={styles.textGray}>{data?.public_email} </span>
                </Link>
              )}

              {/* Website */}
              {data?.website && (
                <Link href={data.website}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="12" fill="#8064A2" />
                    <path
                      d="M17.3333 15.9974C18.0667 15.9974 18.6667 15.3974 18.6667 14.6641V7.9974C18.6667 7.26406 18.0667 6.66406 17.3333 6.66406H6.66667C5.93333 6.66406 5.33333 7.26406 5.33333 7.9974V14.6641C5.33333 15.3974 5.93333 15.9974 6.66667 15.9974H4.66667C4.3 15.9974 4 16.2974 4 16.6641C4 17.0307 4.3 17.3307 4.66667 17.3307H19.3333C19.7 17.3307 20 17.0307 20 16.6641C20 16.2974 19.7 15.9974 19.3333 15.9974H17.3333ZM7.33333 7.9974H16.6667C17.0333 7.9974 17.3333 8.2974 17.3333 8.66406V13.9974C17.3333 14.3641 17.0333 14.6641 16.6667 14.6641H7.33333C6.96667 14.6641 6.66667 14.3641 6.66667 13.9974V8.66406C6.66667 8.2974 6.96667 7.9974 7.33333 7.9974Z"
                      fill="white"
                    />
                  </svg>

                  <span className={styles.textGray}>{data?.website} </span>
                </Link>
              )}
            </ul>
          </PageContentBox>

          {/* Seller Details */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'listing-contact-edit', closable: true }),
              )
            }
          >
            <h4 className={styles['heading']}>Seller Information</h4>
            <ul className={styles['seller-info-wrapper']}>
              {/* KYC */}
              <li>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_173_56271)">
                    <rect width="24" height="24" fill="#8064A2" />
                    <path
                      d="M10 12C12.21 12 14 10.21 14 8C14 5.79 12.21 4 10 4C7.79 4 6 5.79 6 8C6 10.21 7.79 12 10 12ZM10 6C11.1 6 12 6.9 12 8C12 9.1 11.1 10 10 10C8.9 10 8 9.1 8 8C8 6.9 8.9 6 10 6Z"
                      fill="white"
                    />
                    <path
                      d="M4 18.003C4.22 17.283 7.31 16.003 10 16.003C10 15.303 10.13 14.633 10.35 14.013C7.62 13.913 2 15.273 2 18.003V20.003H11.54C11.02 19.423 10.61 18.753 10.35 18.003H4Z"
                      fill="white"
                    />
                    <path
                      d="M19.43 18.02C19.79 17.43 20 16.74 20 16C20 13.79 18.21 12 16 12C13.79 12 12 13.79 12 16C12 18.21 13.79 20 16 20C16.74 20 17.43 19.78 18.02 19.43C18.95 20.36 19.64 21.05 20.59 22L22 20.59C20.5 19.09 21.21 19.79 19.43 18.02ZM16 18C14.9 18 14 17.1 14 16C14 14.9 14.9 14 16 14C17.1 14 18 14.9 18 16C18 17.1 17.1 18 16 18Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_173_56271">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p>KYC</p>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="15"
                    height="15"
                    rx="1.5"
                    fill="white"
                    stroke="#8064A2"
                  />
                </svg>
              </li>

              {/* Bank */}
              <li>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" fill="#8064A2" />
                  <path
                    d="M12.37 2.15375L21.37 5.75373C21.72 5.89373 22 6.31372 22 6.68372V10.0037C22 10.5537 21.55 11.0037 21 11.0037H3C2.45 11.0037 2 10.5537 2 10.0037V6.68372C2 6.31372 2.28 5.89373 2.63 5.75373L11.63 2.15375C11.83 2.07375 12.17 2.07375 12.37 2.15375Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22 22H2V19C2 18.45 2.45 18 3 18H21C21.55 18 22 18.45 22 19V22Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4 18V11"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 18V11"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 18V11"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 18V11"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20 18V11"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 22H23"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <p>Bank</p>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="15"
                    height="15"
                    rx="1.5"
                    fill="white"
                    stroke="#8064A2"
                  />
                </svg>
              </li>
            </ul>
          </PageContentBox>

          {/* User Location Details */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'listing-address-edit', closable: true }),
              )
            }
          >
            <div
              className={`${styles['heading']} ${styles['location-heading']} `}
            >
              <h4>Location</h4>
              {listingLayoutMode === 'view' && (
                <div
                  className={styles['direction-container']}
                  onClick={openGoogleMaps}
                >
                  <Image src={DirectionIcon} alt="direction" />
                  <p> Get Direction </p>
                </div>
              )}
            </div>
            <ul className={styles['location-wrapper']}>
              {/* Address */}
              {data?._address && (
                <li>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_173_56226)">
                      <path
                        d="M12 2C7.8 2 4 5.22 4 10.2C4 13.38 6.45 17.12 11.34 21.43C11.72 21.76 12.29 21.76 12.67 21.43C17.55 17.12 20 13.38 20 10.2C20 5.22 16.2 2 12 2ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_173_56226">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  {listingLayoutMode === 'edit' ? (
                    <span className={styles.textGray}>
                      {`${data?._address.street},
                      ${data?._address.society},
                      ${data?._address.city},
                      ${data?._address.state},
                      ${data?._address.country}`}
                    </span>
                  ) : (
                    <span className={styles.textGray}>
                      {`
                      ${data?._address.street},
                      ${data?._address.society},
                      ${data?._address.city},
                      ${data?._address.state},
                      ${data?._address.country}`}
                    </span>
                  )}
                </li>
              )}
            </ul>
          </PageContentBox>
          {data?.type === listingTypes.PLACE && (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'listing-working-hours-edit',
                    closable: true,
                  }),
                )
              }
            >
              <h4 className={styles['heading']}>Working Hours</h4>
              <div className={styles['working-hours-wrapper']}>
                {/* Working Hours  */}
                {data?.work_hours && (
                  <ul>
                    {data?.work_hours.map((item: any, idx: number) => {
                      return (
                        <li key={idx} className={styles.workingListItem}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_173_56222)">
                              <path
                                d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM15.55 15.8L11.47 13.29C11.17 13.11 10.99 12.79 10.99 12.44V7.75C11 7.34 11.34 7 11.75 7C12.16 7 12.5 7.34 12.5 7.75V12.2L16.34 14.51C16.7 14.73 16.82 15.2 16.6 15.56C16.38 15.91 15.91 16.02 15.55 15.8Z"
                                fill="#8064A2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_173_56222">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <p className={styles.workingHour}>
                            {item.from_time} - {item.to_time}, {item.from_day} -{' '}
                            {item.to_day}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </PageContentBox>
          )}

          {/* Related Listing */}
          {listingLayoutMode !== 'edit' &&
          (!listingPagesRight || listingPagesRight.length === 0) ? null : (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'related-listing-right-edit',
                    closable: true,
                  }),
                )
              }
            >
              <h4 className={styles['heading']}>Related Listing</h4>
              {!listingPagesRight || listingPagesRight.length === 0 ? (
                <span className={styles.textGray}>{'No data!'}</span>
              ) : (
                <ul className={styles['hobby-list']}>
                  {listingPagesRight?.map((item: any) => {
                    if (typeof item === 'string') return null
                    return (
                      <li key={item._id} className={styles.textGray}>
                        {item?.full_name}
                        {/* {item?.genre && ` - ${item?.genre?.display} `} */}
                      </li>
                    )
                  })}
                </ul>
              )}
            </PageContentBox>
          )}

          {/* {data?.type === 4 && (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'listing-event-hours-edit',
                    closable: true,
                  }),
                )
              }
            >
              <h4 className={styles['heading']}>Event Hours</h4>
              <div className={styles['working-hours-wrapper']}>
                {data?.event_date_time && (
                  <div>
                    <li className={styles.workingListItem}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_173_56222)">
                          <path
                            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM15.55 15.8L11.47 13.29C11.17 13.11 10.99 12.79 10.99 12.44V7.75C11 7.34 11.34 7 11.75 7C12.16 7 12.5 7.34 12.5 7.75V12.2L16.34 14.51C16.7 14.73 16.82 15.2 16.6 15.56C16.38 15.91 15.91 16.02 15.55 15.8Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_173_56222">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <p className={styles.workingHour}>
                        {dateFormat.format(
                          new Date(data?.event_date_time.from_date),
                        )}{' '}
                        -{' '}
                        {dateFormat.format(
                          new Date(data?.event_date_time.to_date),
                        )}
                        , {data?.event_date_time.from_time} -{' '}
                        {data?.event_date_time.to_time}
                      </p>
                    </li>
                  </div>
                )}
              </div>
            </PageContentBox>
          )} */}

          {listingLayoutMode !== 'edit' &&
          (!listingPagesRight ||
            listingPagesRight.length === 0) ? null : data?.type ===
              listingTypes.PROGRAM ||
            data?.type === listingTypes.PRODUCT ||
            data?.type === listingTypes.PLACE ||
            data?.type === listingTypes.PEOPLE ? (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'listing-social-media-edit',
                    closable: true,
                  }),
                )
              }
            >
              <h4 className={styles['heading']}>Social Media</h4>

              <ul className={styles['social-contact-wrapper']}>
                {data?.social_media_urls?.facebook_url && (
                  <Tooltip title="Facebook">
                    <Link href={data?.social_media_urls?.facebook_url}>
                      <Image src={FacebookIcon} alt="Facebook" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.twitter_url && (
                  <Tooltip title="Twitter">
                    <Link href={data?.social_media_urls?.twitter_url}>
                      <Image src={TwitterIcon} alt="Twitter" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.instagram_url && (
                  <Tooltip title="Instagram">
                    <Link href={data?.social_media_urls?.instagram_url}>
                      <Image src={InstagramIcon} alt="Instagram" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.behance_url && (
                  <Tooltip title="Behance">
                    <Link href={data?.social_media_urls?.behance_url}>
                      <Image src={BehanceIcon} alt="Behance" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.bgg_url && (
                  <Tooltip title="BoardGameGeek">
                    <Link href={data?.social_media_urls?.bgg_url}>
                      <Image src={BGGIcon} alt="BoardGameGeek" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.chess_url && (
                  <Tooltip title="Chess">
                    <Link href={data?.social_media_urls?.chess_url}>
                      <Image src={ChessIcon} alt="Chess" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.deviantarts_url && (
                  <Tooltip title="DeviantArt">
                    <Link href={data?.social_media_urls?.deviantarts_url}>
                      <Image src={DeviantArtIcon} alt="DeviantArt" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.goodreads_url && (
                  <Tooltip title="Goodreads">
                    <Link href={data?.social_media_urls?.goodreads_url}>
                      <Image src={GoodreadsIcon} alt="Goodreads" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.pinterest_url && (
                  <Tooltip title="Pinterest">
                    <Link href={data?.social_media_urls?.pinterest_url}>
                      <Image src={PinterestIcon} alt="Pinterest" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.smule_url && (
                  <Tooltip title="Smule">
                    <Link href={data?.social_media_urls?.smule_url}>
                      <Image src={SmuleIcon} alt="Smule" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.soundcloud_url && (
                  <Tooltip title="SoundCloud">
                    <Link href={data?.social_media_urls?.soundcloud_url}>
                      <Image src={SoundCloudIcon} alt="SoundCloud" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.strava_url && (
                  <Tooltip title="Strava">
                    <Link href={data?.social_media_urls?.strava_url}>
                      <Image src={StravaIcon} alt="Strava" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.tripadvisor_url && (
                  <Tooltip title="TripAdvisor">
                    <Link href={data?.social_media_urls?.tripadvisor_url}>
                      <Image src={TripAdvisorIcon} alt="TripAdvisor" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.ultimate_guitar_url && (
                  <Tooltip title="Ultimate Guitar">
                    <Link href={data?.social_media_urls?.ultimate_guitar_url}>
                      <Image src={UltimateGuitarIcon} alt="Ultimate Guitar" />
                    </Link>
                  </Tooltip>
                )}
                {data?.social_media_urls?.youtube_url && (
                  <Tooltip title="YouTube">
                    <Link href={data?.social_media_urls?.youtube_url}>
                      <Image src={YouTubeIcon} alt="YouTube" />
                    </Link>
                  </Tooltip>
                )}
              </ul>
            </PageContentBox>
          ) : (
            <></>
          )}
        </aside>
      </PageGridLayout>
    </>
  )
}

export default ListingPageMain
