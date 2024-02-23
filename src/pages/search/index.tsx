import SearchPageFilter from '@/components/SearchPageFilters'
import PageGridLayout from '@/layouts/PageGridLayout'
import { openModal } from '@/redux/slices/modal'
import {
  toggleShowAll,
  toggleShowAllEvent,
  toggleShowAllPeople,
  toggleShowAllPlace,
  toggleShowAllUsers,
  toggleShowAllProducts,
} from '@/redux/slices/search'
import { RootState } from '@/redux/store'
import { MenuItem, Select } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import User from '../../assets/svg/Search/User.svg'
import styles from './styles.module.css'

type Props = {
  data?: any
  children?: any
  onChange?: any
}
type User = {
  profile_image: string
  full_name: string
  tagline: string
  primary_address: { city: string }
  profile_url: string
}
type PeopleData = {
  profile_image: string
  title: string
  tagline: string
  _address: { city: string }
  page_url: string
  page_type: []
}
type PlaceData = {
  profile_image: string
  title: string
  tagline: string
  _address: { city: string }
  page_url: string
  page_type: []
}
type EventData = {
  profile_image: string
  title: string
  tagline: string
  _address: { city: string }
  page_url: string
  page_type: []
}
type hobby = {
  _id: string
  profile_image: string | null
  genre: string[]
  slug: string
  display: string
}
type SearchResultsProps = {
  searchResults: User[]

  peopleResults: PeopleData[]
  placeResults: PlaceData[]
  EventResults: EventData[]
  hobbyResults: hobby[]
}

const ExploreSidebar = () => {
  return (
    <div className={styles['explore-sidebar']}>
      <button disabled className="modal-footer-btn">
        Explore More
      </button>
    </div>
  )
}

const MainContent: React.FC<SearchResultsProps> = ({
  searchResults,
  peopleResults,
  placeResults,
  EventResults,
  hobbyResults,
}) => {
  const showAll = useSelector((state: any) => state.search.showAll)
  const showAllUsers = useSelector((state: any) => state.search.showAllUsers)
  const showAllPeople = useSelector((state: any) => state.search.showAllPeople)
  const showAllPlace = useSelector((state: any) => state.search.showAllPlace)
  const showAllEvent = useSelector((state: any) => state.search.showAllEvent)
  const showAllProducts = useSelector(
    (state: any) => state.search.showAllProducts,
  )
  const searchString = useSelector((state: any) => state.search.searchString)

  const dispatch = useDispatch()
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )

  const [HideUser, setHideUser] = useState(false)
  const [HidePeople, setHidePeople] = useState(false)
  const [HidePlace, setHidePlace] = useState(false)
  const [HideEvent, setHideEvent] = useState(false)
  const [HideProduct, setHideProduct] = useState(false)
  const [HideHobbies, setHideHobbies] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (showAll) {
      setHideUser(false)
      setHidePeople(false)
      setHidePlace(false)
      setHideEvent(false)
      setHideHobbies(false)
    }
  }, [showAll])

  const toggleShowAllusers = () => {
    dispatch(toggleShowAllUsers())
  }
  useEffect(() => {
    if (showAllUsers) {
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideHobbies(true)
      setHideProduct(true)
    } else {
      setHidePeople(false)
      setHidePlace(false)
      setHideEvent(false)
      setHideHobbies(false)
      setHideProduct(true)
    }
  }, [showAllUsers])

  const toggleShowAllpeople = () => {
    dispatch(toggleShowAllPeople())
  }

  useEffect(() => {
    if (showAllPeople) {
      setHideUser(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideHobbies(true)
      setHideProduct(true)
    } else {
      setHideUser(false)
      setHidePlace(false)
      setHideEvent(false)
      setHideHobbies(false)
      setHideProduct(false)
    }
  }, [showAllPeople])

  const toggleShowAllplace = () => {
    dispatch(toggleShowAllPlace())
  }

  useEffect(() => {
    if (showAllPlace) {
      setHideUser(true)
      setHidePeople(true)
      setHideEvent(true)
      setHideHobbies(true)
      setHideProduct(true)
    } else {
      setHideUser(false)
      setHidePeople(false)
      setHideEvent(false)
      setHideHobbies(false)
      setHideProduct(false)
    }
  }, [showAllPlace])

  const toggleShowAllevent = () => {
    dispatch(toggleShowAllEvent())
  }

  useEffect(() => {
    if (showAllEvent) {
      setHideUser(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideHobbies(true)
      setHideProduct(true)
    } else {
      setHideUser(false)
      setHidePeople(false)
      setHidePlace(false)
      setHideHobbies(false)
      setHideProduct(false)
    }
  }, [showAllEvent])

  const toggleShowAllproducts = () => {
    dispatch(toggleShowAllProducts())
  }

  useEffect(() => {
    if (showAllProducts) {
      setHideUser(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideHobbies(true)
      setHideProduct(true)
    } else {
      setHideUser(false)
      setHidePeople(false)
      setHidePlace(false)
      setHideHobbies(false)
      setHideProduct(false)
    }
  }, [showAllProducts])

  const navigateToProfile = (profileUrl: string) => {
    if (isLoggedIn) {
      router.push(`profile/${profileUrl}`)
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }
  const navigateToPage = (pageUrl: string) => {
    router.push(`page/${pageUrl}`)
  }

  const noResultsFound =
    searchResults.length === 0 &&
    peopleResults.length === 0 &&
    placeResults.length === 0 &&
    EventResults.length === 0 &&
    hobbyResults.length === 0

  return (
    <main className={styles.searchResults}>
      {noResultsFound ? (
        <div className={styles['no-results-wrapper']}>
          {searchString === '' ? (
            <p>
              Use the Search box at the top to look up pages on your hobby or an
              existing user. If you don&apos;t find any pages, you may Add
              Listing Page from the menu at top right corner
            </p>
          ) : (
            <p>No results for {searchString}</p>
          )}
        </div>
      ) : (
        <div>
          {/* <section className={styles.userSection}>
        <div className={styles.peopleItemsContainer}>
          <div className={styles.resultHeading}>Hobbies</div>
          {hobbyResults
            .slice(0, showAllhobbies ? undefined : 3)
            .map((hobby, index) => (
              <div className={styles.peopleItem} key={index}>
                <div className={styles.userAvatar}>
                  {hobby.profile_image ? (
                    <Image
                      src={hobby.profile_image}
                      alt={`${hobby.display}'s `}
                      width={64}
                      height={64}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div
                      className={`${styles['img']} default-people-listing-icon`}
                    ></div>
                  )}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{hobby.display}</div>
                  <div className={styles.userTagline}>{'hobby'}</div>
                  <div className={styles.userLocation}></div>
                </div>
              </div>
            ))}
        </div>
        <div>
          {showAllhobbies
            ? undefined
            : (
                <button
                  onClick={toggleShowAllhobbies}
                  className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                >
                  View More
                </button>
              ) || ''}
        </div>
      </section> */}

          {/* User  */}

          {!HideUser && searchResults.length > 0 && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>User Profiles</div>
                {searchResults
                  .slice(0, showAllUsers ? undefined : 3)
                  .map((user, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToProfile(user.profile_url)}
                    >
                      <div className={styles.userAvatar}>
                        {user?.profile_image ? (
                          <Image
                            src={user?.profile_image}
                            alt={`${user.full_name}'s profile`}
                            width={64}
                            height={64}
                            className={styles.avatarImage}
                          />
                        ) : (
                          <div
                            className={`${styles['img']} default-user-icon`}
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{user?.full_name}</div>
                        <div className={styles.userTagline}>
                          {user?.tagline || '\u00a0'}
                        </div>
                        <div className={styles.userLocation}>
                          {user.primary_address?.city || '\u00a0'}
                        </div>
                      </div>
                    </div>
                  ))}
                <div>
                  {showAllUsers
                    ? undefined
                    : (
                        <button
                          onClick={toggleShowAllusers}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) || ''}
                </div>
              </div>
            </section>
          )}
          {/* People */}
          {!HidePeople && peopleResults.length > 0 && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>People</div>
                {peopleResults
                  .slice(0, showAllPeople ? undefined : 3)
                  .map((page, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToPage(page.page_url)}
                    >
                      <div className={styles.peopleAvatar}>
                        {page.profile_image ? (
                          <Image
                            src={page.profile_image}
                            alt={`${page.title}'s `}
                            width={64}
                            height={64}
                            className={styles.peopleavatarImage}
                          />
                        ) : (
                          <div
                            className={`${styles['people-img']} default-people-listing-icon`}
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{page?.title}</div>
                        <div className={styles.userTagline}>
                          {page?.tagline || '\u00a0'}
                        </div>
                        <div className={styles.userLocation}>
                          {page.page_type.map((item, idx) => {
                            if (idx === 0) {
                              return item
                            } else {
                              return ' ' + item
                            }
                          }) +
                            ' | ' +
                            page._address?.city || '\u00a0'}
                        </div>
                      </div>
                    </div>
                  ))}
                <div>
                  {showAllPeople
                    ? undefined
                    : (
                        <button
                          onClick={toggleShowAllpeople}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) || ''}
                </div>
              </div>
            </section>
          )}
          {/* Place  */}
          {!HidePlace && placeResults.length > 0 && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>Places</div>
                {placeResults
                  .slice(0, showAllPlace ? undefined : 3)
                  .map((page, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToPage(page.page_url)}
                    >
                      <div className={styles.peopleAvatar}>
                        {page.profile_image ? (
                          <Image
                            src={page.profile_image}
                            alt={`${page.title}'s `}
                            width={64}
                            height={64}
                            className={styles.peopleavatarImage}
                          />
                        ) : (
                          <div
                            className={`${styles['people-img']} default-people-listing-icon`}
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{page?.title}</div>
                        <div className={styles.userTagline}>
                          {page?.tagline || '\u00a0'}
                        </div>
                        <div className={styles.userLocation}>
                          {page.page_type + ' | ' + page._address?.city ||
                            '\u00a0'}
                        </div>
                      </div>
                    </div>
                  ))}
                <div>
                  {showAllPlace
                    ? undefined
                    : (
                        <button
                          onClick={toggleShowAllplace}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) || ''}
                </div>
              </div>
            </section>
          )}

          {/* Event  */}
          {!HideEvent && EventResults.length > 0 && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>Programs</div>
                {EventResults.slice(0, showAllEvent ? undefined : 3).map(
                  (page, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToPage(page.page_url)}
                    >
                      <div className={styles.peopleAvatar}>
                        {page.profile_image ? (
                          <Image
                            src={page.profile_image}
                            alt={`${page.title}'s `}
                            width={64}
                            height={64}
                            className={styles.peopleavatarImage}
                          />
                        ) : (
                          <div
                            className={`${styles['people-img']} default-people-listing-icon`}
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{page?.title}</div>
                        <div className={styles.userTagline}>
                          {page?.tagline || '\u00a0'}
                        </div>
                        <div className={styles.userLocation}>
                          {page.page_type + ' | ' + page._address?.city ||
                            '\u00a0'}
                        </div>
                      </div>
                    </div>
                  ),
                )}
                <div>
                  {showAllEvent
                    ? undefined
                    : (
                        <button
                          onClick={toggleShowAllevent}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) || ''}
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  )
}

const FilterDropdown: React.FC<Props> = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const dispatch = useDispatch()
  const handleFilterClick = (filterType: any) => {
    if (activeFilter === filterType) {
      setActiveFilter('')
      dispatch(toggleShowAll())
    } else {
      setActiveFilter(filterType)
      switch (filterType) {
        case 'all':
          dispatch(toggleShowAll())
          break
        case 'users':
          dispatch(toggleShowAllUsers())
          break
        case 'people':
          dispatch(toggleShowAllPeople())
          break
        case 'places':
          dispatch(toggleShowAllPlace())
          break
        case 'events':
          dispatch(toggleShowAllEvent())
          break
        case 'products':
          dispatch(toggleShowAllProducts())
          break
        default:
          break
      }
    }
  }

  return (
    <Select className={styles.filterDropdown} value={activeFilter}>
      <MenuItem onClick={() => handleFilterClick('all')} value="all">
        All of HobbyCue
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('users')} value="users">
        Users
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('people')} value="people">
        People Pages
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('places')} value="places">
        Places
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('events')} value="events">
        Programs
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('products')} value="products">
        Products
      </MenuItem>
    </Select>
  )
}

const Search: React.FC<Props> = ({ data, children }) => {
  const [isMobile, setIsMobile] = useState(false)

  const userSearchResults = useSelector(
    (state: RootState) => state.search.userSearchResults.data,
  )
  const PeopleSearch = useSelector(
    (state: RootState) => state.search.typeResultOne.data,
  )
  const PlaceSearch = useSelector(
    (state: RootState) => state.search.typeResultTwo.data,
  )
  const EventSearch = useSelector(
    (state: RootState) => state.search.typeResultThree.data,
  )
  const searchString = useSelector(
    (state: RootState) => state.search.searchString,
  )
  const hobbySearchResults = useSelector(
    (state: RootState) => state.search.hobbiesSearchResults.data,
  )

  useEffect(() => {
    console.log('userresultt', userSearchResults)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <PageGridLayout column={3} customStyles={styles['pageGridSearch']}>
      {isMobile ? (
        <aside className={`custom-scrollbar ${styles['profile-left-aside']}`}>
          <FilterDropdown />
        </aside>
      ) : (
        <SearchPageFilter />
      )}
      <main>
        <MainContent
          searchResults={userSearchResults || []}
          peopleResults={PeopleSearch || []}
          placeResults={PlaceSearch || []}
          EventResults={EventSearch || []}
          hobbyResults={hobbySearchResults || []}
        />
      </main>
      <aside>
        {' '}
        <ExploreSidebar />
      </aside>
    </PageGridLayout>
  )
}

export default Search
