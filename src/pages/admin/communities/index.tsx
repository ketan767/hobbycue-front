import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUserDetail, searchUsers } from '../../../services/user.service'
import styles from './styles.module.css'
import sortAscending from '@/assets/icons/Sort-Ascending-On.png'
import sortDescending from '@/assets/icons/Sort-Ascending-Off.png'
import Image from 'next/image'
import Link from 'next/link'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import DeletePrompt from '@/components/DeletePrompt/DeletePrompt'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import {
  deleteUserByAdmin,
  getCommunities,
  getFilteredCommunities,
  getsearchHistory,
} from '@/services/admin.service'

import { setShowPageLoader } from '@/redux/slices/site'
import { filterIcon } from '../users'
import DisplayState from '@/components/AdminPage/Users/DisplayState/DisplayState'
import PreLoader from '@/components/PreLoader'
import { Fade, Modal } from '@mui/material'
import { CustomBackdrop } from '../posts'
import AdminActionModal from '@/components/_modals/AdminModals/ActionModal'
import CommunityFilter, { CommunitiesModalState } from '@/components/AdminPage/Filters/CommunityFilter/CommunityFilter'

type SearchInput = {
  search: InputData<string>
}

const AdminCommunities: React.FC = () => {
  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [pageLimit,setpageLimit] = useState(11);
  const [count, setCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyFilter, setApplyFilter] = useState<boolean>(false)
  const [totalData, setTotalData] = useState([]);
  const [email, setEmail] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }
  const [page, setPage] = useState(1)

  const [modalState, setModalState] = useState<CommunitiesModalState>({
    hobby: '',
    Location: '',
    userCount: { min: '', max: '' },
    pageCount: { min: '', max: '' }
  })

  const [sortBy, setSortBy] = useState<"post_count" | "user_count" | null>("post_count");

  const handleSort = (field: "post_count" | "user_count") => {
    if(field===sortBy){
      setSortBy(null)
    }
    setSortBy(field);
  };
  const dispatch = useDispatch()
  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    fetchUsers();
    // Update search results and count
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

  const buildQueryParams = () => {
    const params = new URLSearchParams();
  
    // Add hobby filter if provided
    if (modalState.hobby) {
      params.append('hobby', modalState.hobby);
    }
  
    // Add location filter if provided
    if (modalState.Location) {
      params.append('location', modalState.Location);
    }
  
    // Add user count range filters if provided
    if (modalState.userCount.min) {
      params.append('userCountMin', modalState.userCount.min);
    }
    if (modalState.userCount.max) {
      params.append('userCountMax', modalState.userCount.max);
    }
  
    // Add page count range filters if provided
    if (modalState.pageCount.min) {
      params.append('postCountMin', modalState.pageCount.min);
    }
    if (modalState.pageCount.max) {
      params.append('postCountMax', modalState.pageCount.max);
    }

    if(data.search.value!==''){
      params.append('search', data.search.value);
    }
  
    // Add pagination and sorting
    params.append('limit', pageLimit.toString());
    if(sortBy!==null){
      params.append('sort', `-${sortBy}`); // Sort by postCount
    }
    params.append('page', page.toString());
  
    return params.toString();
  };
  

  const fetchUsers = async () => {
    const queryParams = buildQueryParams();
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    dispatch(setShowPageLoader(true))
    const { res, err } = await getFilteredCommunities(queryParams);
    if (err) {
      console.log('An error', err)
      dispatch(setShowPageLoader(false))
    } else {
      console.log('fetchUsers', res.data);
      setSearchResults(res.data.data);
      setCount(res.data.totalCount);
      dispatch(setShowPageLoader(false));
    }
  }
  useEffect(() => {
    if (data.search.value === '' && !hasNonEmptyValues(modalState)) {
      fetchUsers()
    }
  }, [data.search.value, modalState, page,sortBy])

  useEffect(()=>{
    if(page){
      fetchUsers()
    }
  },[page,sortBy])


  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
      setPage(page + 1);
  };

  const ApplyFilter = (): void => {
    setPage(1);
    fetchUsers();
  };


  const hasNonEmptyValues = (state: CommunitiesModalState) => {
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
                placeholder="Search by Hobby, Location, Most Active"
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                {searchSvg}
              </button>
            </form>
            <span className={styles.countText}>Count: <span style={{ color: "#0096c8", fontWeight: "500" }}>{count}</span></span>
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
              <CommunityFilter
                modalState={modalState}
                setModalState={setModalState}
                setIsModalOpen={setIsModalOpen}
                setApplyFilter={setApplyFilter}
                onApplyFilter={ApplyFilter}
              />
            )}
          </div>
          <div className={styles.resultsContainer}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th >Hobby</th>
                  <th >Location</th>
                  <th >
                    <div className={styles.sortButtonWrapper}>
                      Members
                      <button
                        className={styles.sortButton}
                        onClick={() => handleSort('user_count')}
                      >
                        <Image
                          src={sortBy == 'user_count' ? sortAscending : sortDescending}
                          width={15}
                          height={15}
                          alt="sort"
                          style={{ transform: 'rotate(180deg)' }}
                        />

                      </button>
                    </div>
                  </th>
                  <th >
                    <div className={styles.sortButtonWrapper}>
                      Posts
                      <button
                        className={styles.sortButton}
                        onClick={() => handleSort('post_count')}
                      >
                        <Image
                          src={sortBy == 'post_count' ? sortAscending : sortDescending}
                          width={15}
                          height={15}
                          alt="sort"
                          style={{ transform: 'rotate(180deg)' }}
                        />
                      </button>
                    </div>
                  </th>
                  <th>
                    Most Active
                  </th>
                </tr>
              </thead>
              <tbody >
                {searchResults?.map((hobbyreq, index) => (
                  <tr key={index} style={{ height: '48px' }}>
                    <td>
                      <div className={styles.resultItem}>
                        <div className={styles.detailsContainer}>
                          <Link
                            // className={styles.userName}
                            href={`/hobby/${hobbyreq?.hobby.slug}`}
                          >
                            {hobbyreq?.hobby?.display}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{hobbyreq?._id?.city}</div>
                    </td>
                    <td>
                      <div>{hobbyreq?.user_count}</div>
                    </td>
                    <td >
                      <div>{hobbyreq?.post_count}</div>
                    </td>
                    <td >
                      <div>{hobbyreq?.post_count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            {/* Page Selection with Text */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: '16px' }}>
              <span className={styles.userName}>Page</span>
              <select
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className={styles["page-select-dropdown"]}
              >
                {Array.from({ length: Math.ceil(count / pageLimit) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className={styles.userName}>of {Math.ceil(count / pageLimit)}</span>
            </div>

            {/* Previous Page Button */}
            <button
              disabled={page <= 1}
              className="users-next-btn"
              onClick={goToPreviousPage}
            >
              Prev
            </button>

            {/* Next Page Button */}

            <button className="users-next-btn" onClick={goToNextPage} disabled={page >= Math.ceil(count/ pageLimit)}>
              Next
            </button>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default AdminCommunities
