import React from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { useRouter } from 'next/router'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfilePagesList = ({ data }: Props) => {
  const router = useRouter()
  return (
    <PageContentBox>
      <h4 className={styles['heading']}>Pages</h4>
      <ul className={styles['pages-list']}>
        {data.listingsData?.map((item: any) => {
          if (typeof item === 'string') return
          return (
            <li
              key={item._id}
              onClick={() => router.push(`/page/${item.page_url}`)}
            >
              {item.profile_image ? (
                <img src={item.profile_image} />
              ) : (
                <div
                  className={`${styles.defaultImg} default-people-listing-icon`}
                ></div>
              )}
              <p>{item?.title}</p>
            </li>
          )
        })}
        {!data?.listingsData || data?.listingsData.length == 0 ? (
          <p className={styles['color-light']}>No pages</p>
        ) : (
          <></>
        )}
      </ul>
    </PageContentBox>
  )
}

export default ProfilePagesList
