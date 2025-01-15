import React from 'react'
import styles from './TableMobile.module.css'
import StatusDropdown from '../status'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import { upadtePlaceMembership } from '@/services/listing.service'
type TableMobileProps = {
  pageData: ListingPageData['pageData']
  data: OrderType[]
  headerData: headerType
  pageName: string
  startDate: string
  notesCnt: number
  formatDate: (dateStr: string, removeDash?: boolean) => string
}

type headerType = {
  _id: string
  variant_tag: string
  membership_identifier: string
  variations: any[]
}

type OrderType = {
  _id: string
  createdAt: string
  user_id: {
    _id: string
    full_name: string
    profile_image: null | string
    profile_url: string
  }
  status: string
  variant_value: string
  member_identifier_value?: string
  note?: string
}

const TableMobile: React.FC<TableMobileProps> = ({
  pageData,
  data,
  headerData,
  pageName,
  startDate,
  notesCnt,
  formatDate,
}) => {
  return (
    <div className={styles['cards-container']}>
      <div className={styles['first-card']}>
        <div
          className={`${styles['flex-justify-between']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']} ${styles['padding-top-16px']} `}
        >
          <span>
            {'Since'} {startDate}
          </span>
          <span>{'Total'}</span>
        </div>
        <div>
          <span
            className={`${styles['flex-justify-between']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
          >
            {headerData?.variations?.length} {'Towers'}
          </span>
          <span
            className={`${styles['flex-justify-between']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
          >
            {data?.length} {'Members'}
          </span>
          <span
            className={`${styles['flex-justify-between']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
          >
            {notesCnt} {notesCnt === 1 ? 'Note' : 'Notes'}
          </span>
        </div>
      </div>
      {data.map((obj, i) => {
        return (
          <div
            key={i}
            className={`${
              (i + 1) % 2 == 0
                ? `${styles['even-row']}`
                : `${styles['odd-row']}`
            }`}
          >
            <div
              className={`${styles['flex-justify-between']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
            >
              <span
                className={`${styles['flex-align-center']} ${styles['dark-text']}`}
              >
                {formatDate(obj.createdAt)}
              </span>
              <StatusDropdown
                status={obj?.status}
                onStatusChange={async (newStatus) => {
                  const { err, res } = await upadtePlaceMembership(
                    obj?._id as string,
                    {
                      status: newStatus?.status,
                      place_page_name: pageName,
                      user_id: obj.user_id?._id,
                    },
                  )
                  if (err) {
                    console.log(err)
                  } else {
                    console.log(res)
                  }
                }}
                isOddRow={(i + 1) % 2 != 0}
              />
            </div>
            <div
              className={`${styles['flex-gap-10px']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
            >
              <img
                src={obj?.user_id?.profile_image ?? defaultUserImage.src}
                alt="user"
                className={styles['img']}
              />
              <span
                className={`${styles['flex-align-center']} ${styles['name']}`}
              >
                {obj.user_id?.full_name}
              </span>
            </div>
            <div
              className={`${styles['flex-justify-between']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
            >
              <span className={` ${styles['light-text']}`}>
                {headerData?.variant_tag}
                {':'}
              </span>
              <span className={` ${styles['dark-text']}`}>
                {obj.variant_value}
              </span>
            </div>
            <div
              className={`${styles['flex-justify-between']} ${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
            >
              <span className={` ${styles['light-text']}`}>
                {headerData?.membership_identifier}
                {':'}
              </span>
              <span className={` ${styles['dark-text']}`}>
                {obj.member_identifier_value}
              </span>
            </div>
            <div
              className={`${styles['padding-inline-16px']} ${styles['padding-block-8px']}`}
            >
              <span className={` ${styles['light-text']}`}>{'Note: '}</span>
              <span className={` ${styles['dark-text']}`}>{obj.note}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TableMobile
