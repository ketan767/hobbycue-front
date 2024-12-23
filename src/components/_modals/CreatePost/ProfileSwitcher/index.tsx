import React, { useRef, useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'

import { updateActiveProfile } from '@/redux/slices/user'
import { listingTypes } from '@/constants/constant'
import { isMobile } from '@/utils'
import { useMediaQuery } from '@mui/material'

type Props = {
  data: any
  setData: any
  setHobbies: any
  classForShowDropdown?: string
  className?: string
}

const ProfileSwitcher: React.FC<Props> = ({
  data: activeProfile,
  setData,
  setHobbies,
  classForShowDropdown,
  className,
}) => {
  const { user, listing } = useSelector((state: RootState) => state.user)
  const filteredListing = listing.filter((item: any) => item.is_published)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const dropdownRef = useRef(null)

  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))
  const isMobile = useMediaQuery('(max-width:1100px)')
  const handleUpdateActiveProfile = (type: 'user' | 'listing', data: any) => {
    setData((prev: any) => {
      return { ...prev, type, data }
    })
    setHobbies(data?._hobbies)
    setShowDropdown(false)
  }

  const getClass = (type: any) => {
    if (type === 'user') {
      return 'default-user-icon'
    } else if (type === listingTypes.PEOPLE) {
      return 'default-people-listing-icon'
    } else if (type === listingTypes.PLACE) {
      return 'default-place-listing-icon'
    } else if (type === listingTypes.PROGRAM) {
      return 'default-program-listing-icon'
    } else if (type === listingTypes.PRODUCT) {
      return 'default-product-listing-icon'
    } else if (type === 'listing') {
      return 'default-people-listing-icon'
    }
  }
  return (
    <>
      <section
        className={`${styles['profile-switcher']} ${
          showDropdown ? styles['show-dropdown'] : ''
        } ${classForShowDropdown ?? ''} ${className ?? ''}`}
        ref={dropdownRef}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {isMobile &&
          (activeProfile?.data?.profile_image ? (
            <img
              data-profile-type={activeProfile.type}
              src={activeProfile.data?.profile_image}
              alt=""
              width={32}
              height={32}
            />
          ) : (
            <div
              className={`${styles['profile-image']}  
            ${activeProfile.type === 'user' && 'default-user-icon'}
            ${
              activeProfile.type === 'listing' && activeProfile?.data?.type == 1
                ? `default-people-listing-icon ${styles['default-img']}`
                : activeProfile?.data?.type == 2
                ? `${styles['default-img']} default-place-listing-icon`
                : activeProfile?.data?.type == 3
                ? `${styles['default-img']} default-program-listing-icon`
                : activeProfile?.data?.type == 4
                ? `${styles['default-img']} default-product-listing-icon`
                : `${styles['default-img']} default-user-icon`
            }
            `}
              data-profile-type={activeProfile.type}
            ></div>
          ))}
        <p className={styles['name']}>
          {activeProfile.type === 'listing'
            ? activeProfile.data.title
            : activeProfile.data?.full_name}
        </p>
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ rotate: showDropdown ? '180deg' : '0deg' }}
        >
          <g id="expand_more_black_24dp 1" clip-path="url(#clip0_173_70421)">
            <path
              id="Vector"
              d="M10.5867 6.195L7.99999 8.78167L5.41332 6.195C5.15332 5.935 4.73332 5.935 4.47332 6.195C4.21332 6.455 4.21332 6.875 4.47332 7.135L7.53332 10.195C7.79332 10.455 8.21332 10.455 8.47332 10.195L11.5333 7.135C11.7933 6.875 11.7933 6.455 11.5333 6.195C11.2733 5.94167 10.8467 5.935 10.5867 6.195Z"
              fill="#6D747A"
            />
          </g>
          <defs>
            <clipPath id="clip0_173_70421">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>

        {showDropdown && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${styles['dropdown']} `}
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
                    src={user?.profile_image}
                    alt=""
                    width={24}
                    height={24}
                    data-profile-type="user"
                  />
                ) : (
                  <div
                    className={`${styles['user-default-img']} default-user-icon`}
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
                      styles['dd-item-listing']
                    } ${
                      activeProfile.type === 'listing' &&
                      activeProfile.data._id === page._id &&
                      styles['active']
                    }`}
                  >
                    {page?.profile_image ? (
                      <img
                        src={page?.profile_image}
                        alt=""
                        width={24}
                        height={24}
                        data-profile-type="listing"
                      />
                    ) : (
                      <div
                        className={`${styles['default-img']} ${getClass(
                          page.type,
                        )} `}
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
