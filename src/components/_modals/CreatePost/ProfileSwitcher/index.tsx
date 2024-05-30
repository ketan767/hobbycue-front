import React, { useRef, useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'

import { updateActiveProfile } from '@/redux/slices/user'
import { listingTypes } from '@/constants/constant'

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
        {/* {activeProfile?.data?.profile_image ? (
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
        )} */}
        <p className={styles['name']}>
          {activeProfile.type === 'listing'
            ? activeProfile.data.title
            : activeProfile.data?.full_name}
        </p>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ rotate: showDropdown ? '180deg' : '0deg' }}
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
        >
          <g clip-path="url(#clip0_14316_102457)">
            <path
              d="M11.0876 6.695L8.50096 9.28167L5.9143 6.695C5.6543 6.435 5.2343 6.435 4.9743 6.695C4.7143 6.955 4.7143 7.375 4.9743 7.635L8.0343 10.695C8.2943 10.955 8.7143 10.955 8.9743 10.695L12.0343 7.635C12.2943 7.375 12.2943 6.955 12.0343 6.695C11.7743 6.44167 11.3476 6.435 11.0876 6.695Z"
              fill="#6D747A"
            />
          </g>
          <defs>
            <clipPath id="clip0_14316_102457">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.5 0.5)"
              />
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
