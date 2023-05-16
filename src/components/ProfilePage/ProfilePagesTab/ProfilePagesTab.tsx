import React from 'react'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import styles from './ProfilePagesTab.module.css'
import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface Props {
  data: ProfilePageData
}

const ProfilePagesTab: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  console.log('🚀 ~ file: ProfilePagesTab.tsx:16 ~ data:', data.listingsData)
  return (
    <>
      <PageGridLayout column={2}>
        <aside>
          {/* User Hobbies */}
          <PageContentBox
            showEditButton={profileLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(openModal({ type: 'profile-hobby-edit', closable: true }))
            }
          >
            <h4 className={styles['heading']}>Hobbies</h4>
            <ul className={styles['hobby-list']}>
              {data.pageData._hobbies.map((item: any) => {
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
        </aside>

        <main>
          {data.listingsData.map((listing: any) => {
            return <li key={listing._id}>{listing?.title}</li>
          })}
        </main>
      </PageGridLayout>
    </>
  )
}

export default ProfilePagesTab
