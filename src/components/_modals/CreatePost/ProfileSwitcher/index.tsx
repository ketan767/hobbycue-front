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
}

const ProfileSwitcher: React.FC<Props> = ({
  data: activeProfile,
  setData,
  setHobbies,
}) => {
  const { user, listing } = useSelector((state: RootState) => state.user)

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
    if (type === listingTypes.PEOPLE) {
      return 'default-people-listing-icon'
    } else if (type === listingTypes.PLACE) {
      return 'default-place-listing-icon'
    } else if (type === listingTypes.PROGRAM) {
      return 'default-program-listing-cover'
    } else if (type === listingTypes.PRODUCT) {
      return 'default-product-listing-icon'
    } else if (type === 'listing') {
      return 'default-people-listing-icon'
    }
  }
  return (
    <>
      <section
        className={`content-box-wrapper ${styles['profile-switcher']} ${
          showDropdown ? styles['show-dropdown'] : ''
        }`}
        ref={dropdownRef}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {activeProfile?.data?.profile_image ? (
          <Image
            data-profile-type={activeProfile.type}
            src={activeProfile.data?.profile_image}
            alt=""
            width={32}
            height={32}
          />
        ) : (
          <div
            data-profile-type={activeProfile.type}
            className={`${styles['default-img']} ${getClass(
              activeProfile.type,
            )} `}
          ></div>
        )}
        <p className={styles['name']}>
          {activeProfile.type === 'listing'
            ? activeProfile.data.title
            : activeProfile.data?.full_name}
        </p>

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                  <Image
                    src={user?.profile_image}
                    alt=""
                    width={24}
                    height={24}
                    data-profile-type="user"
                  />
                ) : (
                  <div
                    className={`${styles['default-img']} default-user-icon`}
                  ></div>
                )}

                <p>{user.full_name}</p>
              </li>

              {listing.map((page: any) => {
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
                      <Image
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
