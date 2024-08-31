import { FC } from 'react'
import styles from './ListingOrdersTab.module.css'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import ListingPageLayout from '@/layouts/ListingPageLayout'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface ListingOrdersTabProps {
  data: OrderType[]
}

type OrderType = {
  createdAt: string
  user_id: {
    full_name: string
    profile_image: null | string
    profile_url: string
  }
  variations: { name: string; quantity: string }[]
  note?: string
}

function formatDate(dateStr: string): string {
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
  const formattedDate = `${day.toString().padStart(2, '0')}-${month}-${year}`
  return formattedDate
}

const ListingOrdersTab: FC<ListingOrdersTabProps> = ({ data }) => {
  console.warn('ordertabdata', data)

  const { listingLayoutMode } = useSelector((state: RootState) => state.site)
  return (
    <div className={styles['container']}>
      {listingLayoutMode === 'edit' ? (
        <table className={styles['orders-table']}>
          <thead>
            <tr>
              <th>
                <div>
                  <p>Order Date</p>
                </div>
              </th>
              <th>
                <div>
                  <p>User</p>
                </div>
              </th>
              <th>
                <div>
                  <p>Variants</p>
                </div>
              </th>
              <th>
                <div>
                  <p>Quantity</p>
                </div>
              </th>
              <th>
                <div>
                  <p>Notes</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((obj, i) => (
              <tr key={i}>
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
                    {obj?.variations?.map((variant, i) => (
                      <p key={i}>
                        {variant.name === 'No value' ? '' : variant.name}
                      </p>
                    ))}
                  </div>
                </td>
                <td>
                  <div>
                    {obj?.variations?.map((variant, i) => (
                      <p key={i}>{variant.quantity}</p>
                    ))}
                  </div>
                </td>
                <td>
                  <div>
                    <p>{obj.note || 'No notes'}</p>
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

export default ListingOrdersTab
