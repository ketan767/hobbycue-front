import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import styles from './styles.module.css'
import Image from 'next/image'
import DefaultProfile from '@/assets/svg/default-images/default-user-icon.svg'
import HobbiesFilter, { HobbyModalState } from '@/components/AdminPage/Modal/HobbiesFilterModal/HobbiesFilter'

import Link from 'next/link'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import DeletePrompt from '@/components/DeletePrompt/DeletePrompt'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import {
  UpdateHobbyreq,
  deleteUserByAdmin,
  getHobbyRequests,
} from '@/services/admin.service'
import { pageType } from '@/utils'

import AdminActionModal from '@/components/_modals/AdminModals/ActionModal'
import { Fade, Modal } from '@mui/material'

import { formatDate } from '@/utils/Date'
import StatusDropdown from '@/components/_formElements/AdminStatusDropdown'
import PreLoader from '@/components/PreLoader'
import { setShowPageLoader } from '@/redux/slices/site'
import ToggleButton from '@/components/_buttons/ToggleButton'

import HobbiesNotesModal from '@/components/AdminPage/Modal/HobbiesFilterModal/HobbiesNotesModal'
import DisplayState from '@/components/AdminPage/Users/DisplayState/DisplayState'
import { filterIcon } from '../users'
import sortAscending from '@/assets/icons/Sort-Ascending-On.png'
import sortDescending from '@/assets/icons/Sort-Ascending-Off.png'
import UserFilter from '@/components/AdminPage/Filters/UserFilter/UserFilter'
type SearchInput = {
  search: InputData<string>
}

export interface AdminNoteModalData {
  adminNotes: String
  status: String
  emailUser: boolean
  userId: string
}

export interface ModalState {
  onboarded: string
  joined: { start: string; end: string }
  loginModes: string[]
  pageCount: { min: string; max: string }
  status: string
}
const HobbiesRequest: React.FC = () => {
  const router = useRouter();
  const [showPreLoader, setShowPreLoader] = useState(true);
  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [email, setEmail] = useState('')
  const [count, setCount] = useState(0)
   const [isModalOpen, setIsModalOpen] = useState(false)
  const [notes, setNotes] = useState<{ [key: string]: string }>({})
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [singleData, setSingleData] = useState({})
  const [pageNumber, setPageNumber] = useState<number[]>([])
  const [showAdminActionModal, setShowAdminActionModal] = useState(false)
  const dispatch = useDispatch()
  const [createdAtSort, setCreatedAtSort] = useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }
  const [modalState, setModalState] = useState<HobbyModalState>({
    hobby: '',
    genre: '',
    requestedBy: '',
    requestedOn: { start: '', end: '' },
    status: '',
    })
const [adminNoteModal, setAdminNoteModal] = useState<boolean>(false)
     const [adminNoteModalData, setAdminNoteModalData] =
        useState<AdminNoteModalData>({
          adminNotes: 'Admin Note',
          status: 'in_progress',
          emailUser: false,
          userId: '',
        })

  const [applyFilter, setApplyFilter] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [pagelimit, setPagelimit] = useState(25)
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
  const [hobbyData, setHobbydata] = useState({
    hobby: '',
    description: '',
    status: '',
    user_id: '',
    listing_id: '',
  })
  // const [createdAtSort, setCreatedAtSort] = useState(false);

  

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault(); 
    const searchValue = data.search.value.trim();
  
    if (!searchValue) {
      setSearchResults([]);
      setPageNumber([]);
      setCount(0);
      return;
    }
  };

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

  const pencilSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
    >
      <g clip-path="url(#clip0_11582_192095)">
        <path
          d="M4 16.9588V20.5H7.54117L17.9853 10.0559L14.4441 6.51472L4 16.9588ZM20.7238 7.31739C21.0921 6.9491 21.0921 6.35419 20.7238 5.9859L18.5141 3.77621C18.1458 3.40793 17.5509 3.40793 17.1826 3.77621L15.4545 5.5043L18.9957 9.04548L20.7238 7.31739Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_11582_192095">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const deleteSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
    >
      <path
        d="M17.1726 5.01579L17.1839 5.05H17.22H20.5C20.752 5.05 20.9936 5.15009 21.1718 5.32825C21.3499 5.50641 21.45 5.74804 21.45 6C21.45 6.25196 21.3499 6.49359 21.1718 6.67175C20.9936 6.84991 20.752 6.95 20.5 6.95H20.4521L20.45 6.99789L20.4471 7.06744L20.447 7.06889L19.5801 19.2104C19.5269 19.9544 19.1938 20.6507 18.648 21.159C18.1021 21.6673 17.3839 21.9499 16.638 21.95H8.362C7.61611 21.9499 6.89793 21.6673 6.35204 21.159C5.80615 20.6507 5.47308 19.9544 5.41987 19.2104L4.55287 7.06644L4.55285 7.06613C4.55113 7.04399 4.55018 7.0218 4.55 6.99959L4.54959 6.95H4.5C4.24804 6.95 4.00641 6.84991 3.82825 6.67175C3.65009 6.49359 3.55 6.25196 3.55 6C3.55 5.74804 3.65009 5.50641 3.82825 5.32825C4.00641 5.15009 4.24804 5.05 4.5 5.05H7.78H7.81606L7.82744 5.01579L8.37044 3.3838C8.49982 2.99535 8.74819 2.65748 9.08033 2.41808C9.41248 2.17868 9.81156 2.0499 10.221 2.05H10.221L14.78 2.05C14.78 2.05 14.78 2.05 14.78 2.05C15.1893 2.05011 15.5881 2.17898 15.9201 2.41836C16.252 2.65775 16.5002 2.99551 16.6296 3.3838L17.1726 5.01579ZM18.5469 7.00356L18.5507 6.95H18.497H6.503H6.4493L6.45313 7.00356L7.31513 19.0746C7.33398 19.3394 7.45244 19.5872 7.64667 19.7682C7.84091 19.9492 8.09649 20.0499 8.36198 20.05H16.638C16.9035 20.0499 17.1591 19.9492 17.3533 19.7682C17.5476 19.5872 17.666 19.3394 17.6849 19.0745L18.5469 7.00356ZM14.8274 3.9842L14.816 3.95H14.78H10.22H10.184L10.1726 3.9842L9.83956 4.9842L9.81765 5.05H9.887H15.113H15.1823L15.1604 4.9842L14.8274 3.9842ZM10.5 10.05C10.7327 10.05 10.9573 10.1355 11.1311 10.2901C11.3047 10.4444 11.4157 10.6569 11.4432 10.8874L11.45 11.0015V15.9999C11.4497 16.2421 11.357 16.475 11.1908 16.651C11.0246 16.8271 10.7974 16.9331 10.5557 16.9473C10.314 16.9614 10.0759 16.8828 9.89026 16.7274C9.70495 16.5723 9.58572 16.3524 9.55682 16.1125L9.55 15.9985V11C9.55 10.748 9.65009 10.5064 9.82825 10.3282C10.0064 10.1501 10.248 10.05 10.5 10.05ZM14.5 10.05C14.752 10.05 14.9936 10.1501 15.1718 10.3282C15.3499 10.5064 15.45 10.748 15.45 11V16C15.45 16.252 15.3499 16.4936 15.1718 16.6718C14.9936 16.8499 14.752 16.95 14.5 16.95C14.248 16.95 14.0064 16.8499 13.8282 16.6718C13.6501 16.4936 13.55 16.252 13.55 16V11C13.55 10.748 13.6501 10.5064 13.8282 10.3282C14.0064 10.1501 14.248 10.05 14.5 10.05Z"
        fill="#B42318"
        stroke="white"
        stroke-width="0.1"
      />
    </svg>
  )
  console.warn({ searchResults })
  // const fullNumber = (user: any) => {
  //   if (user?.phone?.prefix && user?.phone?.number) {
  //     return user?.phone?.prefix + user?.phone?.number
  //   } else {
  //     return 'No number'
  //   }
  // }

  const fetchSearchResults = async () => {
    const searchValue = data.search.value.trim();
    if (!searchValue) return;
  
    const queryString = `limit=${pagelimit}&sort=-createdAt&page=${page}&populate=user_id,listing_id&search=${encodeURIComponent(searchValue)}`;
    const { res, err } = await getHobbyRequests(queryString);
    if (err) {
      console.error('Error fetching search results:', err);
    } else {
      setSearchResults(res.data.data.hobbyreq || []);
      setCount(res.data.data.no_of_requests || 0);
  
      const totalPages = Math.ceil(res.data.data.no_of_requests / 50);
      setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  };

  const handleCreatedAtSort = () => {
    setCreatedAtSort((prev) => !prev);
  };


  
  const FetchHobbyReq = async () => {
    dispatch(setShowPageLoader(true))
    const { res, err } = await getHobbyRequests(
      `limit=${pagelimit}&sort=-createdAt&page=${page}&populate=user_id,listing_id`,
    )
    if (err) {
      console.log('An error', err)
      dispatch(setShowPageLoader(false))
    } else {
      console.log('FetchHobbyReq', res.data)
      let filteredResults = res.data.data.hobbyreq;

      if (modalState.hobby) {
        filteredResults = filteredResults.filter(
          (hobbyreq: any) => hobbyreq?.hobby?.toLowerCase().includes(modalState.hobby.toLowerCase())
        );
      }
      
      if (modalState.genre) {
        filteredResults = filteredResults.filter(
          (hobbyreq: any) => hobbyreq?.genre?.toLowerCase().includes(modalState.genre.toLowerCase())
        );
      }
      
      if (modalState.requestedBy) {
        filteredResults = filteredResults.filter(
          (hobbyreq: any) => hobbyreq?.user_id?.full_name?.toLowerCase().includes(modalState.requestedBy.toLowerCase())
        );
      }
      
      if (modalState.requestedOn.start && modalState.requestedOn.end) {
        filteredResults = filteredResults.filter(
          (hobbyreq: any) =>
            new Date(hobbyreq?.createdAt) >= new Date(modalState.requestedOn.start) &&
            new Date(hobbyreq?.createdAt) <= new Date(modalState.requestedOn.end)
        );
      }
      
      if (modalState.status) {
        filteredResults = filteredResults.filter(
          (hobbyreq: any) => hobbyreq?.status===modalState.status
        );
      }
      
      
      
      
      
      setSearchResults(filteredResults);
      setCount(filteredResults.length);
      dispatch(setShowPageLoader(false))
    }
  }
  const handleModalSubmit = async (updatedData: any) => {
    await FetchHobbyReq();
    setAdminNoteModal(false);
  };


  useEffect(() => {
    setShowPreLoader(true)
    if (data.search.value) {
      fetchSearchResults()
    } else if (page) {
      FetchHobbyReq()
    }
    setShowPreLoader(false)
  }, [data.search.value, page, modalState])

  useEffect(() => {
    const initialNotes: { [key: string]: string } = {}
    searchResults.forEach((hobbyreq) => {
      if (hobbyreq?._id) {
        initialNotes[hobbyreq._id] = hobbyreq.admin_notes || ''
      }
    })
    setNotes(initialNotes)
  }, [searchResults, page])



  
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

  // Function to handle note updates
  const handleNoteChange = (Id: string, value: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [Id]: value,
    }))
  }

  // Function to handle submit logic
  const handleNoteSubmit = async (hobbyreq: any, note: string) => {
    console.log({
      user_id: hobbyreq?.user_id?._id,
      //listing_id: hobbyreq?.listing_id?._id,
      hobby: hobbyreq?.hobby,
      description: note,
      status: hobbyreq?.status,
    });
    
    try {
      const { err, res } = await UpdateHobbyreq({
        user_id: hobbyreq?.user_id?._id,
        listing_id: hobbyreq?.listing_id?._id,
        hobby: hobbyreq?.hobby,
        description: note,
        status: hobbyreq?.status,
      })

      if (err) throw new Error('Update failed')
      window.location.reload()
      console.log('Update successful', res)
    } catch (error) {
      console.error(error)
    }
  }

  

  const handleSubmit = async () => {
    let jsondata = {
      user_id: hobbyData?.user_id,
      listing_id: hobbyData?.listing_id,
      hobby: hobbyData?.hobby,
      status: hobbyData?.status,
      description: hobbyData?.description,
    }
    console.log("jsonData",jsondata)
    const { err, res } = await UpdateHobbyreq(jsondata)
    if (err) {
      console.log(err.response.data);
      
      throw new Error()
    } else {
      window.location.reload()
    }
  }

  const handleStatusChange = async (hobbyreq: any, newStatus: any) => {
    setHobbydata({
      user_id: hobbyreq?.user_id?._id,
      listing_id: hobbyreq?.listing_id?._id,
      hobby: hobbyreq?.hobby,
      description: hobbyreq?.description,
      status: newStatus?.status,
    })
    console.log('status changed')
    await handleSubmit()
  }

  const handleAction = async (hobbyreq: any) => {
    setHobbydata({
      user_id: hobbyreq?.user_id?._id,
      listing_id: hobbyreq?.listing_id?._id,
      hobby: hobbyreq?.hobby,
      description: hobbyreq?.description,
      status: hobbyreq?.status,
    })
    
    setSingleData(hobbyreq)
    // setAdminNoteModal(true)

    //setShowAdminActionModal(true)
  }

  const CustomBackdrop: React.FC = () => {
    return <div className={styles['custom-backdrop']}></div>
  }

  // const handleCreatedAtSort = () => {
  //   setCreatedAtSort((prev) => !prev);
  // };

  const sortedResults = searchResults
    ?.slice() 
    ?.sort((a, b) => {
      return createdAtSort
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  
  // const sortedResults = searchResults
  //   ?.slice() 
  //   ?.sort((a, b) => {
  //     return createdAtSort
  //       ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //       : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  //   });

  const hasNonEmptyValues = (state: HobbyModalState) => {
      return !Object.entries(state).every(
        ([_, value]) =>
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'object' &&
            Object.values(value).every((v) => v === '')),
      )
    }


  return (
    <>
    {showPreLoader && <PreLoader />}
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
                  data={hobbyData}
                  setData={setHobbydata}
                  handleSubmit={handleSubmit}
                  handleClose={() => setShowAdminActionModal(false)}
                />
              </main>
            </div>
          </Fade>
        </Modal>
      )}

      <AdminLayout>
        <div className={styles.searchContainer}>
          {/* <div className={styles.admintitle}>Admin Search</div> */}
          <div className={styles.searchAndFilter}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                autoComplete="new"
                value={data.search.value}
                onChange={handleInputChange}
                placeholder="Search by Hobby, Genre/Style, Requested By, Matching or Similar"
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                {searchSvg}
              </button>
            </form>
            <span className={styles.countText}>Count: <span style={{ color:"#0096c8", fontWeight:"500"}}>{count}</span></span>
            {hasNonEmptyValues(modalState) && (
              <DisplayState modalState={modalState} />
            )}
           
            {hasNonEmptyValues(modalState) ? (
              <button
                className={styles.filterBtn}
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                <Image src={filterIcon} width={40} height={40} alt="filter" />
              </button>
            ) : (
              <button
                className={styles.filterBtn}
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                {filterSvg}
              </button>
            )}

            {isModalOpen && (
              <HobbiesFilter
                modalState={modalState}
                setModalState={setModalState}
                setIsModalOpen={setIsModalOpen}
                setApplyFilter={setApplyFilter}
              />
            )}
          </div>
          <div className={styles.resultsContainer}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th >Hobby</th>
                  <th >Genre/Style</th>

                  <th >Requested By</th>
                  <th >
                    <div className={styles.sortButtonWrapper}>
                      Created At
                      <button
                        className={styles.sortButton}
                        onClick={handleCreatedAtSort}
                      >
                        {createdAtSort ? (
                          <Image
                            src={sortAscending}
                            width={15}
                            height={15}
                            alt="sort"
                            style={{ transform: 'rotate(180deg)' }}
                          />
                        ) : (
                          <Image
                            src={sortDescending}
                            width={15}
                            height={15}
                            alt="sort"
                           style={{ transform: 'rotate(180deg)' }}
                          />
                        )}
                      </button>
                    </div>
                  </th>
                  <th
                    
                  >
                    Matching or Similar
                  </th>

                  <th >
                    Admin Notes
                  </th>
                  <th >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedResults?.map((hobbyreq, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.resultItem}>
                        <div className={styles.detailsContainer}>
                          <Link
                            // className={styles.userName}
                            href={`/hobby/${hobbyreq?.hobby}`}
                          >
                            {hobbyreq?.hobby}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{hobbyreq?.genre}</div>
                    </td>

                    <td>
                    <Link
                           href={
                            hobbyreq.user_type == 'user'
                              ? `/profile/${hobbyreq.user_id?.profile_url}`
                              : `/${pageType(hobbyreq?.listing_id?.type)}/${
                                  hobbyreq.listing_id?.page_url
                                }`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={styles.resultItem}>
                            <div className={styles.avatarContainer}>
                              {hobbyreq?.user_id?.profile_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={hobbyreq?.user_id?.profile_image}
                                  alt={`${hobbyreq?.user_id?.full_name}'s profile`}
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
                            </div>
                            <div
                              className={styles.detailsContainer}
                              title={
                                // hobbyreq?.user_id?.full_name?.length > 25
                                //   ? hobbyreq?.user_id?.full_name
                                //   : ''
                                hobbyreq.user_type == 'user' && hobbyreq.user_id?.full_name
                          ? hobbyreq.user_id?.full_name.slice(0,25)
                          : hobbyreq.listing_id?.title
                              }
                              // style={{whiteSpace: 'nowrap'}}
                            >
                              {hobbyreq.user_type == 'user' && hobbyreq.user_id?.full_name
                          ? hobbyreq.user_id?.full_name.slice(0,25)
                          : hobbyreq.listing_id?.title}
                            </div>
                          </div>
                        </Link>
                      </td>
                    <td>
                      <div>{formatDate(hobbyreq?.createdAt)}</div>
                    </td>
                    <td >
                      <div>{hobbyreq?.similar}</div>
                      </td>

                    <td >
                      <input
                        className={styles.notesInput}
                        type="text"
                        value={notes[hobbyreq?._id || ''] || ''}
                        onChange={(e) =>
                          handleNoteChange(hobbyreq?._id || '', e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNoteSubmit(
                              hobbyreq,
                              notes[hobbyreq?._id || ''] || '',
                            )
                          }
                        }}
                      />
                    </td>
                    <td>
                      <div
                        
                        className={styles.actions}
                      >
                        <div onClick={()=>{
                          handleAction(hobbyreq);
                          setShowAdminActionModal(true)
                        }}>{pencilSvg}</div>
                          <StatusDropdown
                            status={hobbyreq?.status}
                            onStatusChange={async (newStatus) => {
                              console.log(newStatus, hobbyreq, 100);
                              const { err, res } = await UpdateHobbyreq({
                                user_id: hobbyreq?.user_id?._id,
                                listing_id: hobbyreq?.listing_id?._id,
                                hobby: hobbyreq?.hobby,
                                description: hobbyreq?.description,
                                status: newStatus?.status,
                              })
                              if (err) {
                                console.log(err);
                                
                              }
                            }}
                          />
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            {/* Previous Page Button */}
            {page > 1 ? (
              <button className={styles.PaginationButton} onClick={goToPreviousPage}>Prev</button>
            ) : (
              ''
            )}
            {searchResults.length === pagelimit ? (
              <button
                className={styles.PaginationButton}
                onClick={goToNextPage}
              >
                Next
              </button>
            ) : (
              ''
            )}
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
      <HobbiesNotesModal
        data={singleData}
        pageName={'HobbyRequest'}
        setAdminNoteModalData={handleModalSubmit}
        setIsModalOpen={setAdminNoteModal}
        isModalOpen={adminNoteModal}
      />
    </>
  )
}

export default HobbiesRequest