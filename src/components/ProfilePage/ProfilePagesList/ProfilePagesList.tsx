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
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <PageContentBox>
      <h4 className={styles['heading']}>Pages</h4>
      <ul className={styles['pages-list']}>
        {data.pageData?._listings?.map((item: any) => {
          if (typeof item === 'string') return
          return (
            <li
              key={item._id}
              onClick={() => router.push(`/page/${item.page_url}`)}
            >
              <img src={item.cover_photo} />
              <p>{item?.title}</p>
            </li>
          )
        })}
      </ul>
    </PageContentBox>
  )
}

export default ProfilePagesList
