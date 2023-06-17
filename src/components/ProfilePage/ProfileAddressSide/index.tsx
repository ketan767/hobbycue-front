import React from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfileAddressSide = ({ data }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const dispatch = useDispatch()
  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'profile-address-edit', closable: true }))
        }
      >
        <h4 className={styles['heading']}>Location</h4>
        <ul className={styles['location-wrapper']}>
          <li>
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
            <span>
              {typeof data._addresses[0] === 'object' &&
                data.primary_address?.city}
            </span>
          </li>
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileAddressSide
