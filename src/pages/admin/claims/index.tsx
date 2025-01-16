import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { searchUsers } from '../../../services/user.service'
import styles from './styles.module.css'
import Image from 'next/image'
import phoneIcon from '@/assets/svg/admin_phone.svg'
import MailIcon from '@/assets/svg/admin_email.svg'
import Link from 'next/link'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import DeletePrompt from '@/components/DeletePrompt/DeletePrompt'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import {
  UpdateClaim,
  deleteUserByAdmin,
  getClaimRequests,
} from '@/services/admin.service'
import { pageType } from '@/utils'
import AdminActionModal from '@/components/_modals/AdminModals/ActionModal'

import { setShowPageLoader } from '@/redux/slices/site'
import AdminNote from '@/components/AdminPage/Modal/AdminNote/AdminNote'
import DefaultProfile from '@/assets/svg/default-images/default-user-icon.svg'
import StatusDropdown from '@/components/_formElements/AdminStatusDropdown'
type SearchInput = {
  search: InputData<string>
}
export interface AdminNoteModalData {
  adminNotes: String
  status: String
  emailUser: boolean
  userId: string
}

const filterSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#0096C8" />
    <path
      d="M18.3229 9.44869C21.4454 9.44751 24.5527 9.44616 27.66 9.44531C28.4633 9.44509 29.0952 9.95788 29.2425 10.7434C29.3165 11.1385 29.2281 11.5113 29.0024 11.8418C28.1406 13.1034 27.2734 14.3612 26.4083 15.6205C25.4029 17.084 24.3977 18.5478 23.3922 20.0113C23.0713 20.4783 22.7518 20.9464 22.4271 21.4107C22.3243 21.5576 22.2762 21.7122 22.2764 21.8923C22.2789 24.2709 22.2796 26.6494 22.2768 29.028C22.2758 29.8911 21.5699 30.5741 20.7056 30.5561C20.3938 30.5496 20.1088 30.4526 19.8541 30.273C19.3497 29.9173 18.8423 29.5655 18.3448 29.2003C17.9261 28.893 17.7158 28.4677 17.7152 27.9481C17.7127 25.9289 17.7134 23.9096 17.7158 21.8904C17.716 21.7053 17.6633 21.5469 17.5587 21.3949C15.7124 18.71 13.8686 16.0235 12.0238 13.3377C11.7059 12.8748 11.3882 12.4117 11.0661 11.9517C10.8762 11.6804 10.7367 11.3867 10.7321 11.0545C10.7202 10.1962 11.3284 9.45158 12.3259 9.44862C14.3198 9.44269 16.3138 9.44802 18.3229 9.44869ZM14.516 15.1241C14.678 15.3626 14.8387 15.6018 15.0022 15.8393C16.049 17.3601 17.0956 18.881 18.144 20.4008C18.7858 21.3312 18.7603 21.297 18.7582 22.3338C18.7546 24.1755 18.7592 26.0172 18.7574 27.8589C18.7571 28.0695 18.8097 28.2455 18.9897 28.3728C19.4647 28.7085 19.9358 29.0499 20.4125 29.3831C20.532 29.4666 20.6631 29.537 20.8229 29.4958C21.0936 29.4261 21.2305 29.2482 21.2306 28.9541C21.2314 26.576 21.2328 24.198 21.2313 21.82C21.2311 21.4743 21.3279 21.1613 21.5211 20.8789C22.2751 19.7767 23.0314 18.6762 23.7873 17.5754C25.2191 15.4905 26.6508 13.4056 28.0842 11.3218C28.2089 11.1404 28.2562 10.9571 28.1429 10.7552C28.0362 10.5652 27.8632 10.5087 27.6565 10.5087C22.5716 10.5094 17.4867 10.5088 12.4017 10.5086C12.3411 10.5086 12.2801 10.5075 12.2197 10.5126C11.9996 10.5311 11.8385 10.6852 11.797 10.9027C11.7602 11.0958 11.8482 11.2433 11.9509 11.3924C12.8029 12.6295 13.6528 13.8681 14.516 15.1241Z"
      fill="#0096C8"
    />
  </svg>
)

const searchSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
  >
    <path
      d="M8.04102 2.25C5.04685 2.25 2.60352 4.69334 2.60352 7.6875C2.60352 10.6817 5.04685 13.125 8.04102 13.125C9.26845 13.125 10.3994 12.7099 11.3113 12.019L14.8232 15.5303C14.8924 15.6023 14.9751 15.6597 15.0667 15.6993C15.1583 15.7389 15.2569 15.7598 15.3567 15.7608C15.4565 15.7618 15.5554 15.7429 15.6478 15.7052C15.7402 15.6675 15.8241 15.6117 15.8947 15.5412C15.9653 15.4706 16.021 15.3867 16.0587 15.2943C16.0965 15.2019 16.1154 15.1029 16.1143 15.0032C16.1133 14.9034 16.0924 14.8048 16.0528 14.7132C16.0132 14.6216 15.9558 14.5388 15.8838 14.4697L12.3726 10.9578C13.0634 10.0458 13.4785 8.91493 13.4785 7.6875C13.4785 4.69334 11.0352 2.25 8.04102 2.25ZM8.04102 3.75C10.2245 3.75 11.9785 5.50399 11.9785 7.6875C11.9785 8.73589 11.5713 9.68273 10.9092 10.3865C10.8447 10.4331 10.7881 10.4897 10.7415 10.5542C10.0376 11.2172 9.09016 11.625 8.04102 11.625C5.85751 11.625 4.10352 9.87101 4.10352 7.6875C4.10352 5.50399 5.85751 3.75 8.04102 3.75Z"
      fill="white"
    />
  </svg>
)

const ClaimsPage: React.FC<{}> = () => {

  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [showAdminActionModal, setShowAdminActionModal] = useState(false)
 
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [pageNumber, setPageNumber] = useState<number[]>([])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }
  const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
  const [pagelimit, setPagelimit] = useState(10)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [deleteData, setDeleteData] = useState<{
    open: boolean
    _id: string | undefined
  }>({
    open: false,
    _id: undefined,
  })
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const [claimdata, setClaimData] = useState({
    pageUrl: '',
    description: '',
    status: '',
    title: '',
  })
  const [adminNoteModal, setAdminNoteModal] = useState<boolean>(false)
  const [count, setCount] = useState(0)
  const [adminNoteModalData, setAdminNoteModalData] =
    useState<AdminNoteModalData>({
      adminNotes: 'Admin Note',
      status: 'Inprogress',
      emailUser: false,
      userId: '',
    })
  const [isEditAdminNote, setEditAdminNote] = useState<boolean>(false)
  const [singleData, setSingleData] = useState({})
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle click events
  const handleClickOutside = (event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setEditAdminNote(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const dispatch = useDispatch()
  const handleSearch = async (event: any) => {
    dispatch(setShowPageLoader(true))
    const searchValue = data.search.value.trim()
    event.preventDefault()
    let searchCriteria = {
      full_name: searchValue,
    }

    const { res, err } = await getClaimRequests(searchCriteria)

    if (err) {
      dispatch(setShowPageLoader(false))
      console.log('An error', err)
    } else {
      dispatch(setShowPageLoader(false))
      setSearchResults(res.data)
      console.log('res', res)
    }
  }

  console.log({ searchResults })

  const fetchSearchResults = async () => {
    const searchValue = data.search.value.trim()
    let searchCriteria = {
      full_name: searchValue,
    }

    const { res, err } = await searchUsers(searchCriteria)
    if (err) {
      console.log('An error', err)
    } else {
      setSearchResults(res.data)

      // Calculate total number of pages based on search results length
      const totalPages = Math.ceil(res.data.length / 50)
      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      setPageNumber(pages)
    }
  }
  const FetchClaimReq = async () => {
    const { res, err } = await getClaimRequests(
      `limit=${pagelimit}&sort=-createdAt&page=${page}&populate=user_id`,
    )
      const claimreq = await getClaimRequests(`limit=2500000&sort=-createdAt`)
    if (err) {
      console.log('An error', err)
    } else {
      console.log('FetchClaimReq', res.data)
      const totalRequests = claimreq.res.data.data.no_of_requests;
      const totalPages = Math.ceil(totalRequests / pagelimit);
      setCount(totalRequests);
      setTotalPages(totalPages);
      setSearchResults(res.data.data.claimreq)
    }
  }
  useEffect(() => {
    if (data.search.value) {
      fetchSearchResults()
    } else if (page) {
      FetchClaimReq()
    }
  }, [data.search.value, page, pagelimit])

 useEffect(() => {
    const minHeight = 600; 
    const minNumber = 8; 

    const updatePageLimit = () => {
      const height = window.innerHeight;
      const additionalEntries = Math.max(0, Math.floor((height - minHeight) / 52.9));
      setPagelimit(minNumber + additionalEntries);
    };

    // Set initial page limit
    updatePageLimit();

    // Update on resize
    window.addEventListener('resize', updatePageLimit);
    return () => {
      window.removeEventListener('resize', updatePageLimit);
    };
  }, []);

  const handleStatusChange = async (hobbyreq: any, newStatus: any) => {
    console.log(hobbyreq);
    
    // setHobbydata({
    //   user_id: hobbyreq?.user_id?._id,
    //   listing_id: hobbyreq?.listing_id?._id,
    //   hobby: hobbyreq?.hobby,
    //   description: hobbyreq?.description,
    //   status: newStatus?.status,
    // })
    // console.log('status changed',hobbyData)
    setAdminNoteModal(true);
    
  }

  const goToPreviousPage = () => {
    setPage(page - 1)
  }

  const goToNextPage = () => {
    setPage(page + 1)
  }

  const deleteFunc = async (user_id: string) => {
    const { err, res } = await deleteUserByAdmin(user_id)
    if (err) {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    } else if (res) {
      setSnackbar({
        type: 'success',
        display: true,
        message: 'User deleted successfully',
      })
      window.location.reload()
    } else {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    }
  }

  const handleSubmit = async () => {
    let jsondata = {
      pageUrl: claimdata?.pageUrl,
      status: claimdata?.status,
      description: claimdata?.description,
    }

    const { err, res } = await UpdateClaim(jsondata)
  }

  
  const handleEditAdminNoteData = (e: any, x: any) => {
    setAdminNoteModalData((pre) => {
      return { ...pre, adminNotes: e.target.value, userId: x._id }
    })
  }

  console.log(adminNoteModalData)

  if (showAdminActionModal) {
    return (
      <>
        <AdminActionModal
          data={claimdata}
          setData={setClaimData}
          handleSubmit={handleSubmit}
          handleClose={() => setShowAdminActionModal(false)}
        />
      </>
    )
  }

  return (
    <>
      <AdminLayout>
        <div className={styles.searchContainer}>
          <div className={styles.searchAndFilter}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                autoComplete="new"
                value={data.search.value}
                onChange={handleInputChange}
                placeholder="Search User Name, MailID, Page Number, Page URL..."
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                {searchSvg}
              </button>
            </form>
            <span className={styles.countText}>Count: <span style={{ color: "#0096c8", fontWeight: "500" }}>{count}</span></span>
            <button className={styles.filterBtn}>{filterSvg}</button>
          </div>

          <div className={styles.resultsContainer}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Page</th>
                  <th>Current Admin</th>
                  <th>Relation to Page</th>
                  <th >
                    Web Link
                  </th>
                  <th style={{ paddingRight: '16px' }}>Admin Note</th>
                  <th style={{ paddingRight: '16px', textAlign: 'center' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchResults?.map((hobbyreq, index) => (
                  <tr key={index}>
                    <td>
                    <div className={styles.resultItem}>
                      <div className={styles.avatarContainer}>
                      <Link
                            href={`/profile/${hobbyreq?.user_id?.profile_url}`}>
                        {hobbyreq?.user_id?.profile_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={hobbyreq?.user_id?.profile_image}
                            alt={`${hobbyreq?.user_id?.name}'s profile`}
                            width={40}
                            height={40}
                            className={styles.avatarImage}
                          />
                        ) : (
                          <Image
                            className={styles.avatarImage}
                            src={DefaultProfile}
                            alt="profile"
                            width={40}
                            height={40}
                          />  
                        )}
                        </Link>
                      </div>
                      <div className={styles.detailsContainer}>
                        {hobbyreq?.user_id?.profile_url ? (
                          <Link
                            href={`/profile/${hobbyreq?.user_id?.profile_url}`}
                            className={styles.userName}
                          >
                            {hobbyreq?.name}
                          </Link>
                        ) : (
                          <p className={styles.userName}>{hobbyreq?.name}</p>
                        )}
                      </div>
                    </div>
                  </td>

                    <td className={styles.LoginType}>
                          <div className={styles.loginIcon}>
                            {hobbyreq?.phone?.number && (
                              <Link
                                href={`tel:${
                                  hobbyreq.phone.prefix + hobbyreq.phone.number
                                }`}
                              >
                                <Image
                                  alt={hobbyreq?.full_name}
                                  src={phoneIcon}
                                  width={24}
                                  height={24}
                                />
                              </Link>
                            )}
                            {hobbyreq?.user_id?.email && (
                              <Link href={`mailto:${hobbyreq?.user_id?.public_email}`}>
                                <Image
                                  alt={hobbyreq?.full_name}
                                  src={MailIcon}
                                  width={24}
                                  height={24}
                                />
                              </Link>
                            )}
                          </div>
                        </td>
                       
                    <td className={styles.userName}>
                      <Link
                        href={`/${pageType(hobbyreq?.type)}/${
                          hobbyreq?.pageUrl
                        }`}
                      >
                        {hobbyreq?.pageUrl}
                      </Link>
                    </td>
                    <td>
                          Hobbycue
                        </td>
                    <td className={styles.lastLoggedIn}>
                      {hobbyreq?.HowRelated.slice(0, 60)}
                    </td>
                    <td className={styles.pagesLength}>{hobbyreq?.link}</td>
                    <td>
                      <div className={styles.adminNote}>
                        {isEditAdminNote &&
                        hobbyreq._id === adminNoteModalData.userId ? (
                          <input
                            type="text"
                            value={
                              adminNoteModalData.adminNotes?.toString() || ''
                            }
                            onChange={(e: any) =>
                              handleEditAdminNoteData(e, hobbyreq)
                            }
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditAdminNote(true)
                              setAdminNoteModalData((pre) => {
                                return { ...pre, userId: hobbyreq._id }
                              })
                            }}
                            ref={buttonRef}
                          >
                            {adminNoteModalData.adminNotes}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div

                        className={styles.actions}
                      >
                        <div></div>
                        <StatusDropdown
                          key={index}
                          status={hobbyreq?.status}
                          onStatusChange={(status)=>handleStatusChange(hobbyreq,status)}
                          isOpen={openDropdownIndex === index}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: '16px' }}>
              <span className={styles.userName}>Page</span>
              <select
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className={styles["page-select-dropdown"]}
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className={styles.userName}>of {totalPages}</span>
            </div>
            <button
              disabled={page <= 1 || totalPages<=1}
              className="users-next-btn"
              onClick={goToPreviousPage}
            >
              Prev
            </button>
            <button
              disabled={searchResults.length !== pagelimit}
              className="users-next-btn"
              onClick={goToNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </AdminLayout>
      {deleteData.open && (
        <DeletePrompt
          triggerOpen={deleteData.open}
          _id={deleteData._id}
          closeHandler={() => {
            setDeleteData({ open: false, _id: undefined })
          }}
          noHandler={() => {
            setDeleteData({ open: false, _id: undefined })
          }}
          yesHandler={deleteFunc}
          text="user"
        />
      )}
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

      <AdminNote
        data={singleData}
        pageName={'Claim'}
        setAdminNoteModalData={setAdminNoteModalData}
        setIsModalOpen={setAdminNoteModal}
        isModalOpen={adminNoteModal}
      />
    </>
  )
}

export default ClaimsPage
