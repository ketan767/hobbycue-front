import { FC, useEffect, useState } from 'react'
import styles from './ListingMembersTab.module.css'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import StatusDropdown from './status'
import { upadtePlaceMembership } from '@/services/listing.service'

interface ListingMembersTabProps {
  pageData: ListingPageData['pageData']
  data: OrderType[]
  headerData: headerType
  pageName: string
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

function formatDate(dateStr: string, removeDash?: boolean): string {
  const date = new Date(dateStr)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const day = date.getUTCDate()
  const month = monthNames[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  if (removeDash) return `${day.toString().padStart(2, '0')} ${month} ${year}`
  const formattedDate = `${day.toString().padStart(2, '0')}-${month}-${year}`
  return formattedDate
}

const ListingMembersTab: FC<ListingMembersTabProps> = ({
  pageData,
  data,
  headerData,
  pageName,
}) => {
  const { listingLayoutMode } = useSelector((state: RootState) => state.site)

  const [notesCnt, setNotesCnt] = useState<number>(
    data.filter((order) => {
      if (!order?.note?.length) return false
      return order?.note?.length > 0
    }).length,
  )
  const [startDate, setStartDate] = useState<string>('')
  useEffect(() => {
    if (pageData) {
      console.log(
        'Craeted at----------------------------------->',
        pageData.createdAt,
      )
      setStartDate(formatDate(pageData.createdAt, true))
    }
  }, [pageData])
  return (
    <div className={styles['container']}>
      {listingLayoutMode === 'edit' ? (
        <table className={styles['orders-table']}>
          <thead>
            <tr>
              <th>
                <div>
                  <p>Join Date</p>
                </div>
              </th>
              <th>
                <div>
                  <p>User</p>
                </div>
              </th>
              <th>
                <div>
                  <p>{headerData?.variant_tag}</p>
                </div>
              </th>
              <th>
                <div>
                  <p className={styles['minimum-padding']}>
                    {headerData?.membership_identifier}
                  </p>
                </div>
              </th>
              <th>
                <div>
                  <p>Notes</p>
                </div>
              </th>
              <th>
                <div>
                  <p>Status</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles['first-row']}>
              <td>
                <div>
                  <p className={styles['first-row-text']}>
                    {'Since'} {startDate}
                  </p>
                </div>
              </td>
              <td>
                <div>
                  <p className={styles['first-row-text']}>{'Total'}</p>
                </div>
              </td>
              <td>
                <div>
                  <p className={styles['first-row-text']}>
                    {headerData?.variations?.length}
                  </p>
                </div>
              </td>
              <td>
                <div>
                  <p className={styles['first-row-text']}>
                    {data?.length}
                    {' Members'}
                  </p>
                </div>
              </td>
              <td>
                <div>
                  <p className={styles['first-row-text']}>
                    {notesCnt}
                    {' Notes'}
                  </p>
                </div>
              </td>
              <td>
                <div></div>
              </td>
            </tr>
            {data.map((obj, i) => (
              <tr
                key={i}
                className={`${
                  (i + 1) % 2 == 0
                    ? `${styles['even-row']}`
                    : `${styles['odd-row']}`
                }`}
              >
                <td>
                  <div>
                    <p>{formatDate(obj.createdAt)}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <img
                      src={obj?.user_id?.profile_image ?? defaultUserImage.src}
                      alt="user"
                    />
                    <p>{obj.user_id?.full_name}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p>{obj.variant_value}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p>{obj.member_identifier_value}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p>{obj.note}</p>
                  </div>
                </td>
                <td>
                  <div>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ListingMembersTab
