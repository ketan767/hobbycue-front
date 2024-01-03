import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { listingTypes } from '@/constants/constant'

type Props = {
  data: ProfilePageData['pageData']
  expandData?:boolean
}

const ProfilePagesList = ({ data, expandData }: Props) => {
  const router = useRouter()
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
    if (expandData !== undefined) setDisplayData(expandData)
  }, [expandData])

  return (
    <PageContentBox
    setDisplayData={setDisplayData}
    expandData={expandData}
    >
      <h4 className={styles['heading']}>Pages</h4>
      <ul className={`${styles['pages-list']} ${displayData&&styles['display-mobile-flex']}`}>

        {data.listingsData?.map((item: any) => {
          if (typeof item === 'string') return
          return (
            <li
              key={item._id}
              onClick={() => router.push(`/page/${item.page_url}`)}
            >
              {item.profile_image ? (
                <div className={styles.listingIcon}>
                  <Image
                    alt="PageIcon"
                    height={32}
                    width={32}
                    src={item.profile_image}
                  />
                </div>
              ) : (
                <div
                  className={`${styles.defaultImg} ${getClassName(item.type)}`}
                ></div>
              )}
              <p>{item?.title}</p>
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
