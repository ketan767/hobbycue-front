import React from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfileHobbySideList = ({ data }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const dispatch = useDispatch()
  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'profile-hobby-edit', closable: true }))
        }
      >
        <h4 className={styles['heading']}>Hobbies</h4>
        <ul className={styles['hobby-list']}>
          {data._hobbies.map((item: any) => {
            if (typeof item === 'string') return
            return (
              <li key={item._id}>
                {item?.hobby?.display}
                {item?.genre && ` - ${item?.genre?.display} `}
              </li>
            )
          })}
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileHobbySideList
