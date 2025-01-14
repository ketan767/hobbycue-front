import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.css'
import Image from 'next/image'
import DefaultProfile from '@/assets/svg/default-images/default-user-icon.svg'
import { forgotPassword } from '@/services/auth.service'
import {
  closeModal,
  openModal,
  updateForgotPasswordEmail,
} from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import AdminNavbar from '@/components/AdminNavbar/AdminNavbar'
import Link from 'next/link'
import { getListingPages, searchPages } from '@/services/listing.service'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import { deleteListingByAdmin } from '@/services/admin.service'
import DeletePrompt from '@/components/DeletePrompt/DeletePrompt'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { formatDateTime, pageType } from '@/utils'
import { setShowPageLoader } from '@/redux/slices/site'
import sortAscending from '@/assets/icons/Sort-Ascending-On.png'
import sortDescending from '@/assets/icons/Sort-Ascending-Off.png'
import PagesFilter from '@/components/AdminPage/Filters/PagesFilter/PagesFilter'
import filterIcon from '@/assets/icons/Filter-On.png'
import ToggleButton from '@/components/_buttons/ToggleButton'
type PagesProps = {
  _id: string
  type: string
  title: string
  public_email: string
  page_url: string
  profile_image: string
  full_name: string
  tagline: string
  _address: { city: string }
  user_url: string
  facebook: any
  google: any
  email: string
  cta_text: string
  last_loggedIn_via: string
  is_password: string
  profile_url: string
  admin: any
  is_published: any
  is_claimed: any
  createdAt: any
}
type SearchInput = {
  search: InputData<string>
}
export interface ModalState {
  postedat: { start: string; end: string }
  edited: string
  upcount: { min: string; max: string }
  downcount: { min: string; max: string }
  updowncount: { min: string; max: string }
  commcount: { min: string; max: string }
  sharecount: { min: string; max: string }
  bookmarkcount: { min: string; max: string }
}
const AdminPages: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [email, setEmail] = useState('')
  const [searchResults, setSearchResults] = useState<PagesProps[]>([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagelimit, setPagelimit] = useState(25)
  const [PageSort, setPageSort] = useState<boolean>(true)
  const [LastSort, setLastSort] = useState<boolean>(true)
  const [activeSort, setActiveSort] = useState('')
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
  const [modalState, setModalState] = useState<ModalState>({
    postedat: { start: '', end: '' },
    edited: '',
    upcount: { min: '', max: '' },
    downcount: { min: '', max: '' },
    updowncount: { min: '', max: '' },
    commcount: { min: '', max: '' },
    sharecount: { min: '', max: '' },
    bookmarkcount: { min: '', max: '' },
  })
  const [applyFilter, setApplyFilter] = useState<boolean>(false)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
    setPage(1)
  }

  const fetchSearchResults = async () => {
    const searchValue = data.search.value.trim()
    let searchCriteria = {
      title: searchValue,
      limit: pagelimit,
      sort: '-createdAt',
      page: page,
    }

    const { res, err } = await searchPages(searchCriteria)
    if (err) {
      console.log('An error', err)
    } else {
      setSearchResults(res.data)
      console.log('res', res)
    }
  }

  const fetchPages = async () => {
    dispatch(setShowPageLoader(true))
    const { res, err } = await getListingPages(
      `limit=${pagelimit}&sort=-createdAt&page=${page}&populate=admin`,
    )
    if (err) {
      console.log('An error', err)
      dispatch(setShowPageLoader(false))
    } else {
      console.log('fetchPages', res?.data)
      setSearchResults(res?.data?.data?.listings)
      dispatch(setShowPageLoader(false))
    }
  }

  const goToPreviousPage = () => {
    setPage(page - 1)
  }

  const goToNextPage = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    if (data.search.value) {
      fetchSearchResults()
    } else if (page) {
      fetchPages()
    }
  }, [data.search.value, page])

  const resetbtn = async () => {
    const { err, res } = await forgotPassword({
      email,
    })
    dispatch(openModal({ type: 'reset-password', closable: true }))
    dispatch(updateForgotPasswordEmail(email))
  }

  const handlePageSort = () => {
    if (activeSort === 'Page') {
      setPageSort((prev) => !prev)
    } else {
      setActiveSort('Page')
      setPageSort(true)
      setLastSort(true)
    }
  }

  const handleLastSort = () => {
    if (activeSort === 'Last') {
      setLastSort((prev) => !prev)
    } else {
      setActiveSort('Last')
      setLastSort(true)
      setPageSort(true)
    }
  }

  useEffect(() => {
    setActiveSort('First')
    setPageSort(true)
    setLastSort(true)
  }, [])

  const fetchAllUsersCount = useCallback(async () => {
    try {
      const { res, err } = await getListingPages(`limit=150&populate=admin`)
      if (err) {
        console.error('An error occurred:', err)
      } else {
        setCount(res?.data?.data?.no_of_listings)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }, [])

  useEffect(() => {
    fetchAllUsersCount()
  }, [])

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
  console.log({ searchResults })

  const hasNonEmptyValues = (state: ModalState) => {
    return !Object.entries(state).every(
      ([_, value]) =>
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' &&
          Object.values(value).every((v) => v === '')),
    )
  }

  const handleEdit = (page_url: any) => {
    router.push(`/admin/pages/edit/${page_url}`)
  }

  const handleDelete = (listing_id: string) => {
    setDeleteData({ open: true, _id: listing_id })
  }

  const deleteFunc = async (listing_id: string) => {
    const { err, res } = await deleteListingByAdmin(listing_id)
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
  return (
    <>
      <AdminLayout>
        <div className={styles.searchContainer}>
          {/* <div className={styles.admintitle}>Admin Search</div> */}
          <div className={styles.searchAndFilter}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className={styles.searchForm}
            >
              <input
                type="text"
                autoComplete="new"
                value={data.search.value}
                onChange={handleInputChange}
                placeholder="Search by Page Title, Page Admin, Tagline, Hobby, Category..."
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                {searchSvg}
              </button>
            </form>
            <span className={styles.countText}>
              Count:{' '}
              <span style={{ color: '#0096c8', fontWeight: '500' }}>
                {count}
              </span>
            </span>
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
              <PagesFilter
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
                  <th style={{ width: '22.06%' }}>
                    <div className={styles.sortButtonWrapper}>
                      <span>Page Title</span>
                      <button
                        className={styles.sortButton}
                        onClick={handlePageSort}
                      >
                        {activeSort === 'Page' ? (
                          <Image
                            src={sortAscending}
                            width={15}
                            height={15}
                            alt="sort"
                          />
                        ) : (
                          <Image
                            src={sortDescending}
                            width={15}
                            height={15}
                            alt="sort"
                          />
                        )}
                      </button>
                    </div>
                  </th>
                  <th style={{ width: '19.48%' }}>Page Admin</th>
                  <th style={{ width: '12.87%' }}>Status</th>
                  <th style={{ width: '8.163%' }}>Claimed</th>
                  <th style={{ width: '8.163%', textAlign: 'center' }}>CTA</th>
                  <th
                    style={{
                      width: '25%',
                      paddingRight: '16px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div className={styles.sortButtonWrapper}>
                      <span>Last update</span>
                      <button
                        className={styles.sortButton}
                        onClick={handleLastSort}
                      >
                        {activeSort !== 'Last' ? (
                          <Image
                            src={sortDescending}
                            width={15}
                            height={15}
                            alt="sort"
                            style={{ transform: 'rotate(180deg)' }}
                          />
                        ) : (
                          <Image
                            src={sortAscending}
                            width={15}
                            height={15}
                            alt="sort"
                            style={{ transform: 'rotate(180deg)' }}
                          />
                        )}
                      </button>
                    </div>
                  </th>
                  <th style={{ width: '4%' }}>
                    <svg
                      width="18"
                      height="16"
                      viewBox="0 0 18 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.5433 14.3338L5.52857 14.3338C5.46856 14.3338 5.411 14.31 5.36856 14.2675C5.32613 14.2251 5.30229 14.1675 5.30229 14.1075V10.2608H2.02122C1.97796 10.2608 1.93561 10.2484 1.89918 10.225C1.86275 10.2017 1.83377 10.1684 1.81568 10.1291C1.79758 10.0899 1.79112 10.0462 1.79707 10.0034C1.80302 9.96051 1.82113 9.92027 1.84924 9.8874L8.86395 1.74129C8.88574 1.71814 8.91204 1.69969 8.94122 1.68708C8.97041 1.67447 9.00187 1.66797 9.03366 1.66797C9.06545 1.66797 9.09691 1.67447 9.12609 1.68708C9.15528 1.69969 9.18158 1.71814 9.20337 1.74129L16.2181 9.8874C16.246 9.91997 16.264 9.95981 16.2701 10.0022C16.2762 10.0447 16.2702 10.088 16.2526 10.1271C16.2351 10.1662 16.2068 10.1996 16.171 10.2232C16.1352 10.2469 16.0935 10.2599 16.0506 10.2608H12.7696V14.1075C12.7696 14.1675 12.7457 14.2251 12.7033 14.2675C12.6608 14.31 12.6033 14.3338 12.5433 14.3338ZM5.75485 13.8813L12.317 13.8813V10.0345C12.317 9.97447 12.3408 9.91691 12.3833 9.87447C12.4257 9.83204 12.4833 9.8082 12.5433 9.8082H15.5573L9.03592 2.23571L2.51451 9.8082H5.52857C5.58858 9.8082 5.64614 9.83204 5.68857 9.87447C5.73101 9.91691 5.75485 9.97447 5.75485 10.0345V13.8813Z"
                        fill="white"
                        stroke="white"
                        stroke-width="0.8"
                      />
                    </svg>
                  </th>
                  <th style={{ width: '4%' }}>
                    <svg
                      width="18"
                      height="16"
                      viewBox="0 0 18 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_18418_292454)">
                        <path
                          d="M5.45966 2.00212L12.4744 2.00212C12.5344 2.00212 12.5919 2.02597 12.6344 2.0684C12.6768 2.11084 12.7006 2.16839 12.7006 2.22841L12.7006 6.07518L15.9817 6.07518C16.025 6.07518 16.0673 6.08757 16.1037 6.1109C16.1402 6.13422 16.1692 6.1675 16.1873 6.20679C16.2054 6.24608 16.2118 6.28973 16.2059 6.33258C16.1999 6.37543 16.1818 6.41567 16.1537 6.44854L9.13898 14.5946C9.11719 14.6178 9.09089 14.6362 9.06171 14.6489C9.03252 14.6615 9.00106 14.668 8.96927 14.668C8.93748 14.668 8.90602 14.6615 8.87684 14.6489C8.84765 14.6362 8.82135 14.6178 8.79956 14.5946L1.78486 6.44854C1.75698 6.41596 1.73893 6.37613 1.73281 6.33369C1.7267 6.29125 1.73277 6.24794 1.75031 6.20882C1.76786 6.16969 1.79616 6.13636 1.83192 6.1127C1.86769 6.08904 1.90943 6.07602 1.95231 6.07518L5.23338 6.07518L5.23338 2.22841C5.23338 2.16839 5.25722 2.11084 5.29965 2.0684C5.34209 2.02596 5.39964 2.00212 5.45966 2.00212ZM12.2481 2.45469L5.68594 2.45469L5.68594 6.30146C5.68594 6.36147 5.6621 6.41903 5.61966 6.46146C5.57723 6.5039 5.51967 6.52774 5.45966 6.52774L2.4456 6.52774L8.96701 14.1002L15.4884 6.52774L12.4744 6.52774C12.4143 6.52774 12.3568 6.5039 12.3144 6.46146C12.2719 6.41903 12.2481 6.36147 12.2481 6.30146L12.2481 2.45469Z"
                          fill="white"
                          stroke="white"
                          stroke-width="0.8"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_18418_292454">
                          <rect
                            width="17.9681"
                            height="15.999"
                            fill="white"
                            transform="translate(17.9697 16) rotate(-180)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </th>
                  <th style={{ width: '4%' }}>
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_18418_292450)">
                        <path
                          d="M4.9702 12.4813H4.94878L4.934 12.4968L2.35371 15.2061V2.73194C2.35371 1.98728 2.93356 1.38203 3.63696 1.38203H14.3029C15.0063 1.38203 15.5862 1.98728 15.5862 2.73194V11.1314C15.5862 11.8761 15.0063 12.4813 14.3029 12.4813H4.9702ZM14.3029 11.1814H14.3529V11.1314V2.73194V2.68194H14.3029H3.63696H3.58696V2.73194V12.5313V12.6563L3.67316 12.5658L4.99163 11.1814H14.3029Z"
                          fill="white"
                          stroke="white"
                          stroke-width="0.0999935"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_18418_292450">
                          <rect
                            width="15.999"
                            height="15.999"
                            fill="white"
                            transform="translate(0.969727)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </th>
                  <th style={{ width: '4%' }}>
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.05062 14.5112L2.19345 14.9929L2.33808 14.5118L2.64734 13.4829L2.64746 13.4825C3.42034 10.8849 5.7071 9.14108 8.33209 9.14108C8.42955 9.14108 8.58699 9.14479 8.77087 9.14932V11.1202C8.77087 11.383 8.85068 11.5904 8.98586 11.7333C9.12037 11.8755 9.29911 11.9423 9.47397 11.9423C9.67 11.9423 9.8568 11.8661 10.0318 11.7248C10.0319 11.7248 10.032 11.7247 10.0321 11.7246L15.402 7.43108L15.402 7.43106C15.6425 7.23865 15.7854 6.95906 15.7854 6.66567C15.7854 6.37228 15.6425 6.09268 15.402 5.90028L15.402 5.90025L10.0315 1.60627L10.0316 1.60625L10.0293 1.60454C9.85861 1.47322 9.67253 1.38906 9.47397 1.38906C9.29911 1.38906 9.12037 1.45585 8.98586 1.59805C8.85068 1.74095 8.77087 1.94835 8.77087 2.21111V4.29122C8.58665 4.28542 8.42594 4.28542 8.33258 4.28542H8.33209C4.52761 4.28542 1.44375 7.47954 1.44375 11.3938C1.44375 12.1042 1.54697 12.8084 1.74723 13.488L1.74731 13.4883L2.05062 14.5112ZM9.70129 5.10747V2.54699L14.8102 6.63411L14.81 6.63435L14.8179 6.63987C14.8326 6.65019 14.8391 6.65875 14.8415 6.66292C14.8423 6.66422 14.8427 6.66516 14.8429 6.66576C14.8426 6.6667 14.842 6.66835 14.8406 6.67079C14.8369 6.6772 14.8283 6.68864 14.8102 6.70317L9.70129 10.7903V8.39634V8.25211L9.55717 8.24646L9.25473 8.2346C8.90104 8.21664 8.51236 8.21066 8.33209 8.21066C5.83028 8.21066 3.601 9.57134 2.38782 11.7128C2.38268 11.6071 2.38012 11.5009 2.38012 11.3938C2.38012 7.9866 5.05356 5.22773 8.33209 5.22773C8.50255 5.22773 8.87546 5.23364 9.21298 5.24548L9.54594 5.25737L9.70129 5.26292V5.10747Z"
                        fill="white"
                        stroke="white"
                        stroke-width="0.3"
                      />
                    </svg>
                  </th>
                  <th style={{ width: '4%' }}>
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_18418_292460)">
                        <path
                          d="M8.88817 11.7902L8.63444 11.6718L8.38071 11.7902L4.23477 13.7249V2.22342C4.23477 1.65017 4.65603 1.26797 5.06324 1.26797H12.2056C12.6129 1.26797 13.0341 1.65017 13.0341 2.22342V13.7249L8.88817 11.7902Z"
                          stroke="white"
                          stroke-width="1.2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_18418_292460">
                          <rect
                            width="15.999"
                            height="15.999"
                            fill="white"
                            transform="translate(0.96875)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </th>
                  <th style={{ width: '4.939%' }}>Spam</th>
                  <th style={{ width: '9.252%', textAlign: 'center' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0 &&
                  searchResults
                    ?.sort((a, b) => {
                      if (activeSort === 'Page') {
                        return PageSort
                          ? (a.title || '').localeCompare(b.title || '') // Ascending
                          : (b.title || '').localeCompare(a.title || '') // Descending
                      }
                      if (activeSort === 'Last') {
                        return LastSort
                          ? new Date(a.createdAt).getTime() -
                              new Date(b.createdAt).getTime() // Ascending
                          : new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime() // Descending
                      }
                      return 0
                    })
                    ?.map((page, index) => (
                      <tr key={index}>
                        <td>
                          <div className={styles.resultItem}>
                            <div className={styles.avatarContainer}>
                              {page.profile_image ? (
                                <img
                                  src={page.profile_image}
                                  alt={`${page.full_name}'s profile`}
                                  width={40}
                                  height={40}
                                  className={styles.avatarImage}
                                />
                              ) : (
                                <Image
                                  className={styles['img']}
                                  src={DefaultProfile}
                                  alt="profile"
                                  width={40}
                                  height={40}
                                />
                              )}
                            </div>
                            <div className={styles.detailsContainer}>
                              <Link
                                href={`/${pageType(page?.type)}/${
                                  page?.page_url
                                }`}
                                className={styles.userName}
                              >
                                {page?.title}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className={styles.userName}>
                          <Link href={`/profile/${page?.admin?.profile_url}`}>
                            {page?.admin?.full_name}
                          </Link>
                        </td>
                        <td className={styles.userPhone}>
                          {page.is_published ? 'Published' : 'Unpublished'}
                        </td>
                        <td className={styles.pageType}>
                          {page?.is_claimed ? 'Yes' : 'No'}
                        </td>
                        <td className={styles.lastLoggedIn}>
                          {page?.cta_text}
                        </td>
                        <td className={styles.lastLoggedIn}>
                          {formatDateTime(page?.createdAt)}
                        </td>
                        <td>1</td>
                        <td>5</td>
                        <td>3</td>
                        <td>7</td>
                        <td>2</td>
                        <td className={styles.pagesLength}>
                          <div>
                            <ToggleButton />
                          </div>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <div onClick={() => handleEdit(page.page_url)}>
                              {pencilSvg}
                            </div>
                            <div onClick={() => handleDelete(page._id)}>
                              {deleteSvg}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            {/* Previous Page Button */}

            <button
              disabled={page <= 1}
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
          text="page"
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
    </>
  )
}

export default AdminPages
