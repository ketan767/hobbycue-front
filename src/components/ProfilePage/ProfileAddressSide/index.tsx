import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { updateLocationOpenStates } from '@/redux/slices/site'

type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
  addressError?: boolean
}

const getVisibleLocation = (
  address: any,
  visibilityLevel: 'My City' | 'My Locality' | 'My Society',
): string => {
  let addressText = ''

  switch (visibilityLevel) {
    case 'My Society':
      if (address.society) addressText += `${address.society}, `
    case 'My Locality':
      if (address.street) addressText += `${address.street}, `
      if (address.city) addressText += `${address.city}, `
      break
    case 'My City':
      if (address.city) addressText += `${address.city}, `
      break
    default:
      return ''
  }

  // Always include state and country for any visibility level
  if (address.state) addressText += `${address.state}, `
  if (address.country) addressText += `${address.country}`

  return addressText.trim().replace(/,\s*$/, '') // Remove trailing comma
}

const ProfileAddressSide = ({ data, expandData, addressError }: Props) => {
  const { profileLayoutMode, locationStates } = useSelector(
    (state: RootState) => state.site,
  )
  const dispatch = useDispatch()
  const [displayData, setDisplayData] = useState(false)
  let addressText = ''
  if (
    data?.primary_address?.street &&
    (data?.preferences
      ? data?.preferences?.location_visibility === 'My Society'
      : false)
  ) {
    addressText += `${data?.primary_address?.street}, `
  }
  if (
    data?.primary_address?.society &&
    (data?.preferences
      ? data?.preferences?.location_visibility === 'My Society' ||
        data?.preferences?.location_visibility === 'My Locality'
      : false)
  ) {
    addressText += `${data?.primary_address?.society}, `
  }
  if (data?.primary_address?.city) {
    addressText += `${data?.primary_address?.city}, `
  }
  if (data?.primary_address?.state) {
    addressText += `${data?.primary_address?.state}, `
  }
  if (data?.primary_address?.country) {
    addressText += `${data?.primary_address?.country}, `
  }

  useEffect(() => {
    if (locationStates && typeof locationStates[data?._id] === 'boolean') {
      setDisplayData(locationStates[data?._id])
    } else if (data._id) {
      dispatch(updateLocationOpenStates({ [data._id]: displayData }))
    }
  }, [data._id, locationStates])

  useEffect(() => {
    if (expandData !== undefined) setDisplayData(expandData)
  }, [expandData])

  return (
    <>
      {data?.primary_address?.city || profileLayoutMode === 'edit' ? (
        <>
          <PageContentBox
            showEditButton={profileLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'profile-address-edit', closable: true }),
              )
            }
            setDisplayData={(arg0: boolean) => {
              setDisplayData((prev) => {
                dispatch(updateLocationOpenStates({ [data._id]: !prev }))
                return !prev
              })
            }}
            setExpandData={addressError ? true : false}
            expandData={displayData}
            className={addressError === true ? styles['error'] : ''}
          >
            <h4
              className={
                styles['heading'] + ` ${addressError && styles['error-text']}`
              }
            >
              Location
            </h4>
            {addressError && displayData && (
              <p
                className={styles['error-text'] + ` ${styles['absolute-text']}`}
              >
                At least city is required
              </p>
            )}
            <ul
              className={`${styles['location-wrapper']} ${
                displayData && styles['display-mobile-flex']
              }`}
            >
              <li>
                {!addressError && (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_173_51417)">
                      <path
                        d="M12 2C7.8 2 4 5.22 4 10.2C4 13.38 6.45 17.12 11.34 21.43C11.72 21.76 12.29 21.76 12.67 21.43C17.55 17.12 20 13.38 20 10.2C20 5.22 16.2 2 12 2ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_173_51417">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                <span>
                  {profileLayoutMode === 'edit' ? (
                    <span className={styles.textGray}>
                      {addressText.replace(/,\s*$/, '')}
                    </span>
                  ) : (
                    <span className={styles.textGray}>
                      {getVisibleLocation(
                        data?.primary_address,
                        data?.preferences?.location_visibility || 'My City',
                      )}
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </PageContentBox>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default ProfileAddressSide
