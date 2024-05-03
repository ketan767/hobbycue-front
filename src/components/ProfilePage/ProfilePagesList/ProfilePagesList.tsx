import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { listingTypes } from '@/constants/constant'
import { listingData } from '@/components/_modals/EditListing/ListingRelated/data'
import { updatePagesOpenState } from '@/redux/slices/site'
import { profile } from 'console'

type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
}

const ProfilePagesList = ({ data, expandData }: Props) => {
  const { profileLayoutMode, pagesStates } = useSelector(
    (state: RootState) => state.site,
  )
  const { user } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const dispatch = useDispatch()
  const [displayData, setDisplayData] = useState(false)
  function getClassName(type: any) {
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

  useEffect(() => {
    if (pagesStates && typeof pagesStates[data?._id] === 'boolean') {
      setDisplayData(pagesStates[data?._id])
    } else if (data._id) {
      dispatch(updatePagesOpenState({ [data._id]: displayData }))
    }
  }, [data._id, pagesStates])

  useEffect(() => {
    if (expandData !== undefined) setDisplayData(expandData)
  }, [expandData])

  console.log('listingAdminid', data.listingsData)
  console.log('user_id', user._id)

  return (
    <PageContentBox
      setDisplayData={(arg0: boolean) => {
        setDisplayData((prev) => {
          dispatch(updatePagesOpenState({ [data._id]: !prev }))
          return !prev
        })
      }}
      expandData={displayData}
    >
      <h4 className={styles['heading']}>Pages</h4>
      <ul
        className={`${styles['pages-list']} ${
          pagesStates?.[data?._id] && styles['display-mobile-flex']
        } `}
      >
        {profileLayoutMode !== 'edit'
          ? data.listingsData
              ?.filter((item: any) => item?.is_published)
              .map((item: any) => {
                if (typeof item === 'string') return
                return (
                  <li
                    key={item._id}
                    onClick={() => router.push(`/page/${item.page_url}`)}
                  >
                    {item.profile_image ? (
                      <div className={styles.listingIcon}>
                        <img
                          alt="PageIcon"
                          height={32}
                          width={32}
                          src={item.profile_image}
                        />
                      </div>
                    ) : (
                      <div
                        className={`${styles.defaultImg} ${getClassName(
                          item.type,
                        )}`}
                      ></div>
                    )}
                    <p>{item?.title}</p>
                  </li>
                )
              })
          : data.listingsData?.map((item: any) => {
              if (typeof item === 'string') return
              return (
                <li
                  key={item._id}
                  onClick={() => router.push(`/page/${item.page_url}`)}
                >
                  {item.profile_image ? (
                    <div className={styles.listingIcon}>
                      <img
                        alt="PageIcon"
                        height={32}
                        width={32}
                        src={item.profile_image}
                      />
                    </div>
                  ) : (
                    <div
                      className={`${styles.defaultImg} ${getClassName(
                        item.type,
                      )}`}
                    ></div>
                  )}
                  <p
                    className={`${
                      item?.admin !== user?._id && profileLayoutMode === 'edit'
                        ? styles['unclaimed-page']
                        : styles['']
                    }`}
                  >
                    {item?.title}
                  </p>
                </li>
              )
            })}
        {!data?.listingsData || data?.listingsData.length == 0 ? (
          <p className={styles['color-light']}></p>
        ) : (
          <></>
        )}
      </ul>
    </PageContentBox>
  )
}

export default ProfilePagesList
