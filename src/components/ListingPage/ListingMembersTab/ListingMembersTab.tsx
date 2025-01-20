import { FC, useEffect, useState } from 'react'
import styles from './ListingMembersTab.module.css'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import StatusDropdown from './status'
import { upadtePlaceMembership } from '@/services/listing.service'
import TableMobile from './mobile/TableMobile'
import { isMobile } from '@/utils'
import { Fade, Modal } from '@mui/material'
import AdminActionModal from '@/components/_modals/AdminModals/ActionModal'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

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
  listing_id: {
    _id: string
  }
  status: string
  variant_value: string
  description: string
  updatedAt: Date
  purchase_date: Date
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
  const [showAdminActionModal, setShowAdminActionModal] = useState(false)

  const [notesCnt, setNotesCnt] = useState<number>(
    data.filter((order) => {
      if (!order?.note?.length) return false
      return order?.note?.length > 0
    }).length,
  )
  const [startDate, setStartDate] = useState<string>('')

  const isMob = isMobile()
  const [memberData, setMemberdata] = useState({
    order_id: '',
    description: '',
    status: '',
    user_id: '',
    listing_id: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {},
  })

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const CustomBackdrop: React.FC = () => {
    return <div className={styles['custom-backdrop']}></div>
  }

  useEffect(() => {
    if (pageData) {
      setStartDate(formatDate(pageData.createdAt, true))
    }
  }, [pageData])

  const handleSubmit = async () => {
    try {
      const { err, res } = await upadtePlaceMembership(
        memberData.order_id as string,
        {
          status: memberData.status,
          place_page_name: pageName,
          user_id: memberData.user_id,
          description: memberData.description,
          updatedAt: memberData.updatedAt,
        },
      )
      if (res.status == 200) {
        setSnackbar({
          display: true,
          message: 'Membership updated successfully',
          type: 'success',
        })
      }
    } catch (err: any) {
      console.log(err)
      setSnackbar({
        display: true,
        message: 'Error updating membership',
        type: 'error',
      })
    } finally {
      setShowAdminActionModal(false)
    }
  }
  const handleStatusChange = (obj: OrderType, newStatus: any) => {
    setMemberdata({
      order_id: obj?._id,
      user_id: obj?.user_id?._id,
      listing_id: obj?.listing_id?._id,
      description: obj?.description,
      status: newStatus?.status,
      createdAt: new Date(obj?.purchase_date),
      updatedAt: new Date(obj?.updatedAt || obj?.purchase_date),
      user: obj?.user_id,
    })
    setShowAdminActionModal(true)
  }

  if (isMob) {
    return (
      <TableMobile
        pageData={pageData}
        data={data}
        headerData={headerData}
        pageName={pageName}
        startDate={startDate}
        notesCnt={notesCnt}
        formatDate={formatDate}
        showAdminActionModal={showAdminActionModal}
        setShowAdminActionModal={setShowAdminActionModal}
        memberData={memberData}
        setMemberdata={setMemberdata}
        handleSubmit={handleSubmit}
        handleStatusChange={handleStatusChange}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
    )
  }
  return (
    <>
      {showAdminActionModal && (
        <Modal
          open
          onClose={() => {
            setShowAdminActionModal(false)
          }}
          slots={{ backdrop: CustomBackdrop }}
          disableEscapeKeyDown
          closeAfterTransition
        >
          <Fade>
            <div className={styles['modal-wrapper']}>
              <main className={styles['pos-relative']}>
                <AdminActionModal
                  data={memberData}
                  setData={setMemberdata}
                  handleSubmit={handleSubmit}
                  handleClose={() => setShowAdminActionModal(false)}
                />
              </main>
            </div>
          </Fade>
        </Modal>
      )}
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
                        src={
                          obj?.user_id?.profile_image ?? defaultUserImage.src
                        }
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
                      <p>
                        {obj.note?.substring(0, 160)}
                        {obj?.note && obj.note?.length > 160 ? '...' : ''}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <StatusDropdown
                        status={obj?.status}
                        onStatusChange={(newStatus) => {
                          handleStatusChange(obj, newStatus)
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
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default ListingMembersTab
