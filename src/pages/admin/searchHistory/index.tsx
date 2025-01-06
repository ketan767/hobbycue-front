import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { searchUsers } from '../../../services/user.service'
import styles from './styles.module.css'
import Image from 'next/image'
import DefaultProfile from '@/assets/svg/default-images/default-user-icon.svg'
import Link from 'next/link'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import DeletePrompt from '@/components/DeletePrompt/DeletePrompt'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { deleteUserByAdmin, getsearchHistory } from '@/services/admin.service'
import { formatDateTime } from '@/utils'
import sortAscending from '@/assets/icons/Sort-Ascending-On.png'
import sortDescending from '@/assets/icons/Sort-Ascending-Off.png'
import { setShowPageLoader } from '@/redux/slices/site'
import { filterIcon, filterSvg, pencilSvg, searchSvg } from '../users'
import SearchFilter from '@/components/AdminPage/Filters/SearchPageFilter/SearchFilter'

type SearchInput = {
  search: InputData<string>
}
export interface FilterStateValue {
  keyword: String
  user: any
  filterValue: String
}
interface MyContextProps {
  filterState: FilterStateValue
  setFilterState: React.Dispatch<React.SetStateAction<FilterStateValue>>
}
export const SearchPageContext = createContext<MyContextProps | undefined>(
  undefined,
)
// Custom hook to use the context safely
export const useSearchPageContext = () => {
  const context = useContext(SearchPageContext)
  if (!context) {
    throw new Error(
      'useSearchPageContext must be used within a SearchPageProvider',
    )
  }
  return context
}
const SearchHistory: React.FC = () => {
  const router = useRouter()
  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [applyFilter, setApplyFilter] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [TimeSort, setTimeSort] = useState<boolean>(true);
  const [count, setCount] = useState(0);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [pageNumber, setPageNumber] = useState<number[]>([])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }
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

  const [filterState, setFilterState] = useState<FilterStateValue>({
    keyword: '',
    user: '',
    filterValue: '',
  })

  const dispatch = useDispatch()
  const handleSearch = async (event: any) => {
    dispatch(setShowPageLoader(true))
    const searchValue = data.search.value.trim()
    event.preventDefault()
    let searchCriteria = {
      full_name: searchValue,
    }

    const { res, err } = await searchUsers(searchCriteria)
    if (err) {
      console.log('An error', err)
      dispatch(setShowPageLoader(false))
    } else {
      setSearchResults(res.data)
      dispatch(setShowPageLoader(false))
    }
  }

  const fetchSearchResults = useCallback(async () => {
    setLoading(true)
    const searchValue = data.search.value.trim()
    let searchCriteria = `search=${searchValue}&populate=user_id&sort=-createdAt&limit=100&skip=3`

    const { res, err } = await getsearchHistory(searchCriteria)
    if (err) {
      console.log('An error', err)
    } else {
      console.log('fetchUsers by search', res.data)
      setSearchResults(res.data.data.search_history)

      // Calculate total number of pages based on search results length
      const totalPages = Math.ceil(res.data.length / 50)
      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      setPageNumber(pages)
    }
    setLoading(false)
  }, [data.search.value])

  const fetchUsers = useCallback(async () => {
    setLoading(true)

    const { res, err } = await getsearchHistory(
      `${
        filterState.user
          ? `filter=${JSON.stringify({
              'user_details.full_name': filterState.user?.full_name,
            })}&`
          : ''
      }populate=user_id&limit=100&skip=0&&sort=-createdAt`,
    )
    if (err) {
      console.log('An error', err)
    } else {
      console.log('fetchUsers', res.data)
      const sortedData = res.data.data.search_history.sort((a: any, b: any) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA; 
      });
      setCount(res.data.data.no_of_histories);
      setSearchResults(sortedData)
    }
    setLoading(false)
  }, [filterState.user])

  useEffect(() => {
    if (filterState?.user) {
      setData((prev) => ({ ...prev, search: { value: '', error: null } }))
      fetchUsers()
    }

    if (data.search.value) {
      fetchSearchResults()
    } else {
      fetchUsers()
    }
  }, [
    data.search.value,
    page,
    filterState?.user,
    fetchSearchResults,
    fetchUsers,
  ])

  const goToPreviousPage = () => {
    setPage(page - 1)
  }

  const goToNextPage = () => {
    setPage(page + 1)
  }

  const handleDelete = (user_id: string) => {
    setDeleteData({ open: true, _id: user_id })
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

  const handleTimeSort = () => {
    setTimeSort((prev) => !prev);
    const sortedResults = [...filteredResults].sort((a : any, b : any) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return TimeSort ? timeA - timeB : timeB - timeA;
    });
    setFilteredResults(sortedResults);
  };

  useEffect(() => {
    const results = searchResults.filter((x) => {
      if (filterState.keyword) {
        return x.search_input.includes(filterState.keyword);
      }
      return true;
    });
    setCount(results?.length || 0);
    setFilteredResults(results);
  }, [searchResults, filterState.keyword]);

  const contextValue = { filterState, setFilterState }
  return (
    <SearchPageContext.Provider value={contextValue}>
      <AdminLayout>
        <div className={styles.searchContainer}>
          <div className={styles.searchAndFilter}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                autoComplete="new"
                value={data.search.value}
                onChange={handleInputChange}
                placeholder="Search by user name, mail ID, phone, keyword..."
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                {searchSvg}
              </button>
            </form>
            <span className={styles.countText}>Count: <span style={{ color:"#0096c8", fontWeight:"500"}}>{count}</span></span>
            <button
              className={styles.filterBtn}
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              {filterSvg}
            </button>
            {isModalOpen && (
              <SearchFilter
                setIsModalOpen={setIsModalOpen}
                setApplyFilter={setApplyFilter}
              />
            )}
          </div>

          <div className={styles.resultsContainer}>
            {!loading && (
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th style={{width:"20%"}}>Keyword</th>
                    <th>
                    <div className={styles.sortButtonWrapper}>  
                    Time
                    <button
                        className={styles.sortButton}
                        onClick={handleTimeSort}
                      >
                        {TimeSort ? (
                          <Image
                            src={sortAscending}
                            width={15}
                            height={15}
                            alt="sort"
                            style={{  marginTop: '3px', transform: 'rotate(180deg)' }}
                          />
                        ) : (
                          <Image
                            src={sortDescending}
                            width={15}
                            height={15}
                            alt="sort"
                           style={{  marginTop: '3px', transform: 'rotate(180deg)' }}
                          />
                        )}
                      </button>
                      </div>
                    </th>

                    <th >4P Count</th>

                    {/* <th style={{ textAlign: 'center' }}>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredResults?.map((user, index) => (
                    <tr key={index}>
                      <td>
                      <Link
                              href={`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${user.user_id?.profile_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.userName}
                            >
                        <div className={styles.resultItem}>
                          <div className={styles.avatarContainer}>
                          
                            {user?.user_id?.profile_image ? (
                              <Image
                                src={user?.user_id?.profile_image}
                                alt={`${user?.user_id?.full_name}'s profile`}
                                width={32}
                                height={32}
                                className={styles.avatarImage}
                              />
                            ) : (
                              <Image
                                className={styles['img']}
                                src={DefaultProfile}
                                alt="profile"
                                width={32}
                                height={32}
                              />
                            )}
                          </div>
                          <div
                            className={styles.detailsContainer}
                            title={
                              user?.user_id?.full_name?.length > 60
                                ? user?.user_id?.full_name.slice(0, 40)
                                : ''
                            }
                          >
                           
                              {user?.user_id?.full_name?.length > 60
                                ? user?.user_id?.full_name.slice(0, 40)
                                : user?.user_id?.full_name ?? 'anonymous user'}
                            
                          </div>
                       
                        </div>
                        </Link>
                      </td>
                      <td className={styles.userName}>
                        <div>{user?.search_input.slice(0, 60)}</div>
                      </td>
                      <td className={styles.userName}>
                        <div>{formatDateTime(user?.createdAt)}</div>
                      </td>

                      <td className={styles.userName}>
                        <div>{user?.no_of_pages}</div>
                      </td>

                     
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {loading && <p>Loading</p>}
          </div>
          <div className={styles.pagination}>
            {/* Previous Page Button */}
            {page > 1 ? (
              <button className="admin-next-btn" onClick={goToPreviousPage}>
                Previous
              </button>
            ) : (
              ''
            )}
            {searchResults?.length === pagelimit ? (
              <button className="admin-next-btn" onClick={goToNextPage}>
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
    </SearchPageContext.Provider>
  )
}

export default SearchHistory
