import React, { useRef, useState } from 'react'
import styles from './ProfileSwitcher.module.css'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'

import { updateActiveProfile } from '@/redux/slices/user'
import { updateListingModalData } from '@/redux/slices/site'
import { setFilters } from '@/redux/slices/post'

type Props = {
  className?: string
  dropdownClass?:string
}

const ProfileSwitcher: React.FC<Props> = (props) => {
  const { className, dropdownClass } = props
  const { user, listing, activeProfile } = useSelector(
    (state: RootState) => state.user,
  )
  const dispatch = useDispatch()
  const filteredListing = listing.filter((item: any) => item.is_published)

  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const dropdownRef = useRef(null)

  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))

  const handleUpdateActiveProfile = (type: 'user' | 'listing', data: any) => {
    dispatch(updateActiveProfile({ type, data }));
    dispatch(setFilters({
      location:null,
      hobby:"",
      genre:"",
      seeMoreHobbies:false
    }))
    if (type === 'listing') {
      dispatch(updateListingModalData(data))
    }
    setShowDropdown(false)
    // window.location.reload()
  }

  return (
    <>
      <section
        className={`content-box-wrapper ${styles['profile-switcher']} ${
          showDropdown ? styles['show-dropdown'] : ''
        }
        ${className}
        `}
        ref={dropdownRef}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {activeProfile?.data?.profile_image ? (
          <img
            className={styles['profile-image']}
            data-profile-type={activeProfile.type}
            src={activeProfile.data?.profile_image}
            alt=""
            width={40}
            height={40}
          />
        ) : (
          <div
            className={`${styles['profile-image']}  
            ${activeProfile.type === 'user' && 'default-user-icon'}
            ${
              activeProfile.type === 'listing' && activeProfile?.data?.type == 1
                ? `default-people-listing-icon ${styles['img']}`
                : activeProfile?.data?.type == 2
                ? `${styles['img']} default-place-listing-icon`
                : activeProfile?.data?.type == 3
                ? `${styles['img']} default-program-listing-icon`
                : activeProfile?.data?.type == 4
                ? `${styles['img']} default-product-listing-icon`
                : `${styles['img']} default-user-icon`
            }
            `}
            data-profile-type={activeProfile.type}
          ></div>
        )}
        <p className={styles['name']}>
          {activeProfile.type === 'listing'
            ? activeProfile.data.title
            : activeProfile.data?.full_name}
        </p>

        <svg style={{rotate:showDropdown?'180deg':'0deg'}} width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_25_51286)">
            <path
              d="M15.88 9.29055L12 13.1705L8.11998 9.29055C7.72998 8.90055 7.09998 8.90055 6.70998 9.29055C6.31998 9.68055 6.31998 10.3105 6.70998 10.7005L11.3 15.2905C11.69 15.6805 12.32 15.6805 12.71 15.2905L17.3 10.7005C17.69 10.3105 17.69 9.68055 17.3 9.29055C16.91 8.91055 16.27 8.90055 15.88 9.29055Z"
              fill="#08090A"
            />
          </g>
          <defs>
            <clipPath id="clip0_25_51286">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>

        {showDropdown && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${styles['dropdown']} ${dropdownClass??''}`}
          >
            <ul className={styles['dd-list']}>
              <li
                onClick={() => handleUpdateActiveProfile('user', user)}
                className={`${styles['dd-item']} ${
                  activeProfile.type === 'user' && styles['active']
                }`}
              >
                {user?.profile_image ? (
                  <img
                    className={styles['img']}
                    src={user?.profile_image}
                    alt=""
                    width={24}
                    height={24}
                    data-profile-type="user"
                  />
                ) : (
                  <div
                    className={`default-user-icon ${styles['img']}`}
                    data-profile-type="user"
                  ></div>
                )}
                <p>{user.full_name}</p>
              </li>

              {filteredListing.map((page: any) => {
                return (
                  <li
                    key={page._id}
                    onClick={() => handleUpdateActiveProfile('listing', page)}
                    className={`${styles['dd-item']} ${
                      activeProfile.type === 'listing' &&
                      activeProfile.data._id === page._id &&
                      styles['active']
                    }`}
                  >
                    {page?.profile_image ? (
                      <img
                        className={styles['img']}
                        src={page?.profile_image}
                        alt=""
                        width={24}
                        height={24}
                        data-profile-type="listing"
                      />
                    ) : (
                      <div
                        className={
                          page?.type == 1
                            ? `default-people-listing-icon ${styles['img']}`
                            : page.type == 2
                            ? `${styles['img']} default-place-listing-icon`
                            : page.type == 3
                            ? `${styles['img']} default-program-listing-icon`
                            : page.type == 4
                            ? `${styles['img']} default-product-listing-icon`
                            : `${styles['contentImage']} default-people-listing-icon`
                        }
                        data-profile-type="listing"
                      ></div>
                    )}

                    <p>{page.title}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>
    </>
  )
}

export default ProfileSwitcher
