import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'

import styles from './styles.module.css'
import { RootState } from '@/redux/store'
import TimeIcon from '@/assets/svg/time.svg'
import FacebookIcon from '@/assets/svg/Facebook.svg'
import TwitterIcon from '@/assets/svg/Twitter.svg'
import InstagramIcon from '@/assets/svg/Instagram.svg'
import { getListingPages, getListingTags } from '@/services/listing.service'
import { dateFormat } from '@/utils'
import { getAllUserDetail } from '@/services/user.service'
import { updateListingTypeModalMode } from '@/redux/slices/site'

interface Props {
  data: ListingPageData['pageData']
  children: any
}

const ListingPageMain: React.FC<Props> = ({ data, children }) => {
  const dispatch = useDispatch()
  const [tags, setTags] = useState([])
  const { listingLayoutMode } = useSelector((state: any) => state.site)
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
    getListingPages(``)
      .then((res: any) => {
        // console.log('all--' ,res.res.data.data.listings)
        let listings = res.res.data.data.listings
        let selectedListings: any = []

        listings.forEach((item: any) => {
          if (data?.related_listings_left?.listings.includes(item._id)) {
            selectedListings.push(item)
          }
        })
        setListingPagesLeft(selectedListings)
      })
      .catch((err: any) => {
        console.log(err)
      })

    getAllUserDetail(``)
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

  return (
    <>
      <PageGridLayout column={3}>
        <aside>
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() => {
              dispatch(openModal({ type: 'listing-type-edit', closable: true }))
              dispatch(updateListingTypeModalMode({ mode: 'edit' }))
            }}
          >
            <div className={styles['listing-page-type']}>
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
              <p>{data.page_type[0]}</p>
            </div>
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
                    <li key={item._id} className={styles.textGray}>
                      {item?.hobby?.display}
                      {item?.genre && ` - ${item?.genre?.display} `}
                    </li>
                  )
                })}
              </ul>
            )}
          </PageContentBox>

          {/* Tags */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(openModal({ type: 'listing-tags-edit', closable: true }))
            }
          >
            <h4 className={styles['heading']}>Tags</h4>
            {!data || selectedTags.length === 0 ? (
              <span className={styles.textGray}>{'No tags!'}</span>
            ) : (
              <ul className={styles['hobby-list']}>
                {selectedTags?.map((item: any) => {
                  if (typeof item === 'string') return
                  return (
                    <li key={item._id} className={styles.textGray}>
                      {item?.name} {` - `}
                      {item?.description}
                    </li>
                  )
                })}
              </ul>
            )}
          </PageContentBox>

          {/* Related Listing */}
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
            <h4 className={styles['heading']}>Related Listing</h4>
            {!listingPagesLeft || listingPagesLeft.length === 0 ? (
              <span className={styles.textGray}>{'No data!'}</span>
            ) : (
              <ul className={styles['hobby-list']}>
                {listingPagesLeft?.map((item: any) => {
                  if (typeof item === 'string') return
                  return (
                    <li key={item._id} className={styles.textGray}>
                      {item?.title}
                      {/* {item?.genre && ` - ${item?.genre?.display} `} */}
                    </li>
                  )
                })}
              </ul>
            )}
          </PageContentBox>
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
              {data?.phone && (
                <li>
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
                </li>
              )}

              {/* WhatsApp Number */}
              {data?.whatsapp_number && (
                <li>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.92063 7.40766L9.92093 7.40832C10.0522 7.70083 10.2696 8.23024 10.443 8.65259L10.4464 8.66095C10.5149 8.82774 10.5767 8.97816 10.6249 9.09391C10.649 9.15184 10.6691 9.19974 10.6846 9.23596C10.6984 9.26807 10.7054 9.2835 10.7074 9.28795C10.708 9.28911 10.7082 9.28952 10.708 9.28931C10.8082 9.48871 10.9104 9.81184 10.7303 10.1808L9.92063 7.40766ZM9.92063 7.40766C9.79987 7.13959 9.64317 6.92805 9.42234 6.80005M9.92063 7.40766L9.42234 6.80005M13.2541 13.965C13.1998 13.938 13.1319 13.9087 13.0693 13.8817L13.0603 13.8778L13.0591 13.8773C12.7138 13.7283 12.0552 13.4441 11.2912 12.7639L11.2903 12.7631C10.644 12.1904 10.1812 11.4832 10.0002 11.1828C10.0874 11.0945 10.1808 10.9816 10.2564 10.8903L10.2653 10.8795C10.3146 10.8199 10.359 10.7663 10.4007 10.7184L10.4008 10.7183C10.5586 10.5371 10.6308 10.3871 10.6992 10.2451L10.7031 10.2371L10.7031 10.2371L10.7303 10.1809L9.95448 11.1104L9.92575 11.127L9.92549 11.1272L9.52404 11.3599M13.2541 13.965L13.2449 13.9834C13.2494 13.9782 13.254 13.9728 13.2588 13.9673M13.2541 13.965C13.2541 13.965 13.2541 13.9649 13.254 13.9649L13.2447 13.9836C13.2325 13.9978 13.2214 14.0108 13.2115 14.0223L13.2115 14.0223C13.1987 14.0372 13.199 14.0333 13.2135 14.0241C13.2135 14.0241 13.2135 14.0241 13.2135 14.0241C13.2141 14.0237 13.2146 14.0234 13.2152 14.023C13.2191 14.0207 13.2237 14.0181 13.2289 14.0155L13.2213 14.0307L13.2213 14.0308L13.0313 14.4126M13.2541 13.965C13.2557 13.9658 13.2572 13.9665 13.2588 13.9673M13.2588 13.9673C13.2994 13.9872 13.3217 13.9942 13.3297 13.9963C13.3308 13.9966 13.3314 13.9967 13.3314 13.9967C13.3314 13.9967 13.3172 13.9938 13.2933 13.9966C13.2792 13.9983 13.2644 14.0016 13.2498 14.0068C13.242 14.0095 13.2351 14.0125 13.229 14.0155L13.2213 14.0308L13.2213 14.0308L13.0313 14.4126M13.2588 13.9673C13.4478 13.747 13.8501 13.2736 13.991 13.0662M13.0313 14.4126C13.2886 14.5406 13.4419 14.5209 13.5903 14.3486C13.7388 14.1762 14.2334 13.6001 14.4066 13.3441M13.0313 14.4126C12.9895 14.3918 12.9325 14.3672 12.8622 14.3368C12.4998 14.1805 11.783 13.8712 10.9587 13.1373C10.1919 12.4579 9.67252 11.6159 9.52404 11.3599M13.991 13.0662C13.9902 13.0673 13.9895 13.0685 13.9887 13.0696L14.4066 13.3441M13.991 13.0662C13.9915 13.0654 13.992 13.0647 13.9925 13.064L14.4066 13.3441M13.991 13.0662C14.1287 12.858 14.3291 12.6876 14.6115 12.6544C14.8385 12.6276 15.0466 12.7053 15.1557 12.746L15.1602 12.7477L15.1602 12.7477C15.3063 12.8022 15.7096 12.9933 16.0753 13.1693C16.4555 13.3523 16.8383 13.5404 16.9692 13.6055L16.9692 13.6055C17.0163 13.629 17.0607 13.6502 17.1051 13.6715L16.8889 14.1224M14.4066 13.3441C14.5748 13.0881 14.7479 13.1275 14.9854 13.2161C15.2228 13.3047 16.4892 13.9251 16.7464 14.0531C16.7972 14.0784 16.8448 14.1012 16.8889 14.1224M9.52404 11.3599L9.92541 11.1271L9.92567 11.127L9.95445 11.1103L10.0237 10.3899C9.9771 10.4435 9.92851 10.5022 9.8801 10.5607C9.79496 10.6636 9.71037 10.7658 9.63786 10.838C9.50926 10.9659 9.37565 11.1039 9.52404 11.3599ZM16.8889 14.1224L17.1051 13.6715L17.1173 13.6774C17.1966 13.7154 17.292 13.7611 17.3734 13.8108C17.4584 13.8627 17.5836 13.9509 17.6711 14.0984M16.8889 14.1224C17.0678 14.2082 17.1895 14.2665 17.2411 14.3535M17.6711 14.0984L17.0927 15.5746C17.3054 14.9739 17.3054 14.4618 17.2411 14.3535M17.6711 14.0984C17.7507 14.2325 17.7671 14.387 17.7734 14.4663C17.7817 14.5722 17.78 14.6933 17.7689 14.822C17.7468 15.0806 17.6847 15.4006 17.564 15.7415L17.5628 15.7449C17.396 16.2053 16.9607 16.5749 16.5893 16.8141C16.2115 17.0574 15.7512 17.2604 15.3983 17.2934M17.6711 14.0984C17.6711 14.0983 17.671 14.0983 17.671 14.0982L17.2411 14.3535M17.2411 14.3535L15.3983 17.2934M15.3983 17.2934C15.361 17.2969 15.3229 17.3015 15.2757 17.3072L15.2156 16.8108L15.2757 17.3072C15.0358 17.3362 14.7354 17.3714 14.2299 17.2866C13.7428 17.2049 13.0762 17.0143 12.0765 16.6208C9.5064 15.61 7.83487 13.139 7.50107 12.6455L7.49542 12.6371L7.90955 12.357L7.49542 12.6371L7.46474 12.5919L7.45639 12.5799C7.45588 12.5791 7.45551 12.5786 7.45526 12.5783L7.45101 12.5726L7.45097 12.5725L7.45092 12.5725C7.37179 12.4666 7.08931 12.0886 6.82605 11.5683C6.56617 11.0548 6.3033 10.3608 6.3033 9.62685C6.3033 8.24151 6.99962 7.50184 7.29372 7.19102L7.29372 7.19102C7.3111 7.17265 7.32494 7.15802 7.33706 7.14495C7.33706 7.14495 7.33706 7.14495 7.33707 7.14494L15.3983 17.2934ZM9.42234 6.80005C9.21139 6.67777 9.00442 6.67264 8.90974 6.67029M9.42234 6.80005L8.90974 6.67029M8.90974 6.67029C8.90664 6.67022 8.90365 6.67014 8.90079 6.67007L8.90974 6.67029ZM7.51638 20.1816C7.40487 20.1212 7.27458 20.1054 7.15188 20.1375L2.71226 21.2971L3.89683 16.9973C3.93244 16.868 3.91465 16.7299 3.84746 16.6139C3.01915 15.1837 2.58352 13.562 2.58411 11.9115V11.9114C2.58411 6.72456 6.82984 2.5 12.042 2.5C14.5762 2.5 16.9476 3.48164 18.7336 5.25928C20.519 7.03641 21.5 9.40027 21.5 11.9163C21.5 17.103 17.2543 21.3275 12.0421 21.3275H12.0371C10.4535 21.3275 8.89794 20.93 7.51638 20.1816Z"
                      fill="#8064A2"
                      stroke="#8064A2"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <span className={styles.textGray}>
                    {data?.whatsapp_number}{' '}
                  </span>
                </li>
              )}

              {/* Email */}
              {data?.public_email && (
                <li>
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
                </li>
              )}

              {/* Website */}
              {data?.website && (
                <li>
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
                </li>
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
            <h4 className={styles['heading']}>Location</h4>
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
                      {`${data?._address.city}`}
                    </span>
                  )}
                </li>
              )}
            </ul>
          </PageContentBox>
          {data?.type === 2 && (
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
                  if (typeof item === 'string') return
                  return (
                    <li key={item._id} className={styles.textGray}>
                      {item?.title}
                      {/* {item?.genre && ` - ${item?.genre?.display} `} */}
                    </li>
                  )
                })}
              </ul>
            )}
          </PageContentBox>

          {data?.type === 4 && (
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
                {/* Working Hours  */}
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
          )}
          {data?.type === 4 || data?.type === 3 ? (
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
              <div className={styles.socialIcons}>
                <Image src={FacebookIcon} alt="Facebook" />
                <Image src={TwitterIcon} alt="Twitter" />
                <Image src={InstagramIcon} alt="Instagram" />
              </div>
            </PageContentBox>
          ) : (
            <></>
          )}
          {data?.type === 4 || data?.type === 3 ? (
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
              <h4 className={styles['heading']}> Related Listing </h4>
              {!listingPagesRight || listingPagesRight.length === 0 ? (
                <span className={styles.textGray}>{'No data!'}</span>
              ) : (
                <ul className={styles['hobby-list']}>
                  {listingPagesRight?.map((item: any) => {
                    if (typeof item === 'string') return
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
          ) : (
            <></>
          )}
        </aside>
      </PageGridLayout>
    </>
  )
}

export default ListingPageMain
