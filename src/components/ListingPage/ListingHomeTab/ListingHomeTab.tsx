import React from 'react'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'

import styles from './ListingHomeTab.module.css'
import { RootState } from '@/redux/store'

interface Props {
  data: ListingPageData['pageData']
}

const ListingHomeTab: React.FC<Props> = ({ data }) => {
  console.log('🚀 ~ file: ListingHomeTab.tsx:17 ~ data:', data)
  const dispatch = useDispatch()

  const { listingLayoutMode } = useSelector((state: RootState) => state.site)

  return (
    <>
      <PageGridLayout column={3}>
        <aside>
          {/* TODO: Listing Page Type */}
          <div></div>

          {/* Listing Hobbies */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(openModal({ type: 'listing-hobby-edit', closable: true }))
            }
          >
            <h4 className={styles['heading']}>Hobbies</h4>
            {!data || data._hobbies.length === 0 ? (
              <span>{'No Hobbies!'}</span>
            ) : (
              <ul className={styles['hobby-list']}>
                {data?._hobbies?.map((item: any) => {
                  if (typeof item === 'string') return
                  return (
                    <li key={item._id}>
                      {item?.hobby?.display}
                      {item?.genre && ` - ${item?.genre?.display} `}
                    </li>
                  )
                })}
              </ul>
            )}
          </PageContentBox>

          {/* Tags */}
          <PageContentBox showEditButton={listingLayoutMode === 'edit'} onEditBtnClick={() => {}}>
            <h4 className={styles['heading']}>Tags</h4>
            {!data || data._hobbies.length === 0 ? (
              <span>{'No tags!'}</span>
            ) : (
              <ul className={styles['hobby-list']}>
                {data?._hobbies?.map((item: any) => {
                  if (typeof item === 'string') return
                  return (
                    <li key={item._id}>
                      {item?.hobby?.display}
                      {item?.genre && ` - ${item?.genre?.display} `}
                    </li>
                  )
                })}
              </ul>
            )}
          </PageContentBox>

          {/* Related Listing */}
          <PageContentBox showEditButton={listingLayoutMode === 'edit'} onEditBtnClick={() => {}}>
            <h4 className={styles['heading']}>Related Listing</h4>
            {!data || data._hobbies.length === 0 ? (
              <span>{'No data!'}</span>
            ) : (
              <ul className={styles['hobby-list']}>
                {data?._hobbies?.map((item: any) => {
                  if (typeof item === 'string') return
                  return (
                    <li key={item._id}>
                      {item?.hobby?.display}
                      {item?.genre && ` - ${item?.genre?.display} `}
                    </li>
                  )
                })}
              </ul>
            )}
          </PageContentBox>
        </aside>

        <main>
          {/* User About */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(openModal({ type: 'listing-about-edit', closable: true }))
            }
          >
            <h4>About</h4>
            <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
          </PageContentBox>

          {/* User Information */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(openModal({ type: 'listing-general-edit', closable: true }))
            }
          >
            <h4>Profile URL</h4>
            <div>{data?.page_url}</div>
            <h4>Gender</h4>
            <div>{data?.gender}</div>
            <h4>Year</h4>
            <div>{data?.year}</div>
            <h4>Notes</h4>
            <div>{data?.admin_note}</div>
          </PageContentBox>
        </main>

        <aside>
          {/* User Contact Details */}
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(openModal({ type: 'listing-contact-edit', closable: true }))
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

                  <span>{data?.phone} </span>
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

                  <span>{data?.whatsapp_number} </span>
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

                  <span>{data?.public_email} </span>
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

                  <span>{data?.website} </span>
                </li>
              )}
            </ul>
          </PageContentBox>
        </aside>
      </PageGridLayout>
    </>
  )
}

export default ListingHomeTab
