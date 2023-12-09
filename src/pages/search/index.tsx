import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { searchUsers } from '@/services/user.service'
import Image from 'next/image'
import hobbycue from '../../assets/svg/Search/hobbycue.png'
import history from '../../assets/svg/Search/history.svg'
import People from '../../assets/svg/Search/People.svg'
import Place from '../../assets/svg/Search/Place.svg'
import Product from '../../assets/svg/Search/Product.svg'
import Hobbies from '../../assets/svg/Search/Hobbies.svg'
import Program from '../../assets/svg/Search/Program.svg'
import User from '../../assets/svg/Search/User.svg'
import blogs from '../../assets/svg/Search/blogs.svg'
import classes from '../../assets/svg/Search/classes.svg'
import posts from '../../assets/svg/Search/posts.svg'
import rentals from '../../assets/svg/Search/rentals.svg'
import {
  SearchResults,
  toggleShowAll,
  toggleShowAllEvent,
  toggleShowAllPeople,
  toggleShowAllPlace,
  toggleShowAllUsers,
} from '@/redux/slices/search'
import { RootState } from '@/redux/store'
import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './styles.module.css'

import { useSelector } from 'react-redux'
import {
  setHobbiesSearchResult,
  setUserSearchResults,
  setTypeResultOne,
  setTypeResultTwo,
  setTypeResultThree,
} from '@/redux/slices/search'
import { Preview } from '@mui/icons-material'
import { Select } from '@mui/material'

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

const FilterSidebar = ({}) => {
  const dispatch = useDispatch()

  const handleShowAll = () => {
    dispatch(toggleShowAll())
  }

  const handleShowAllUsersClick = () => {
    dispatch(toggleShowAllUsers())
  }
  const handleShowAllPeopleClick = () => {
    dispatch(toggleShowAllPeople())
  }
  const handleShowAllPlaceClick = () => {
    dispatch(toggleShowAllPlace())
  }
  const handleShowAllEventClick = () => {
    dispatch(toggleShowAllEvent())
  }
  return (
    <>
      <section
        className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
      >
        <header>
          <div className={styles['heading']}>
            <h1>Search Results</h1>
          </div>
        </header>
        <div>
          <h2 className={styles['filter-sidebar']}>Filters</h2>
          <div className={styles['filters-container']}>
            {/* <div className={styles['filter-item']} onClick={handleShowAll}>
              <Image src={hobbycue} alt="hobbycue" />
              All of Hobbycue
            </div> */}

            {/* <div className={styles['filter-item']}>
              <Image src={Hobbies} alt="Hobbies" />
              Hobbies
            </div> */}

            <div
              className={styles['filter-item']}
              onClick={handleShowAllPeopleClick}
            >
              <Image src={People} alt="People" />
              People Pages
            </div>
            {/* <div
              className={styles['filter-item']}
              onClick={handleShowAllUsersClick}
            >
              <Image src={User} alt="User" />
              User Profiles
            </div> */}
            <div
              className={styles['filter-item']}
              onClick={handleShowAllPlaceClick}
            >
              <Image src={Place} alt="Place" />
              Places
            </div>
            {/* <div className={styles['filter-item']}>
              <Image src={Product} alt="Product" />
              Products
            </div> */}
            {/* <div className={styles['filter-item']}>
              <Image src={rentals} alt="rentals" />
              Rentals
            </div> */}
            <div
              className={styles['filter-item']}
              onClick={handleShowAllEventClick}
            >
              <Image src={Program} alt="Program" />
              Programs
            </div>
            {/* <div className={styles['filter-item']}>
              <Image src={classes} alt="classes" />
              Classes
            </div> */}
            {/* <div className={styles['filter-item']}>
              <Image src={posts} alt="posts" />
              Posts
            </div> */}
            {/* <div className={styles['filter-item']}>
              <Image src={blogs} alt="blogs" />
              Blogs
            </div> */}
          </div>
        </div>
      </section>
    </>
  )
}

const ExploreSidebar = () => {
  return (
    <div className={styles['explore-sidebar']}>
      <button className="modal-footer-btn">Explore More</button>
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

  const dispatch = useDispatch()

  const [HideUser, setHideUser] = useState(false)
  const [HidePeople, setHidePeople] = useState(false)
  const [HidePlace, setHidePlace] = useState(false)
  const [HideEvent, setHideEvent] = useState(false)
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
    } else {
      setHidePeople(false)
      setHidePlace(false)
      setHideEvent(false)
      setHideHobbies(false)
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
    } else {
      setHideUser(false)
      setHidePlace(false)
      setHideEvent(false)
      setHideHobbies(false)
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
    } else {
      setHideUser(false)
      setHidePeople(false)
      setHideEvent(false)
      setHideHobbies(false)
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
    } else {
      setHideUser(false)
      setHidePeople(false)
      setHidePlace(false)
      setHideHobbies(false)
    }
  }, [showAllEvent])

  const navigateToProfile = (profileUrl: string) => {
    router.push(`profile/${profileUrl}`)
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
    //hobby
    <main className={styles.searchResults}>
      {noResultsFound ? (
        <div className="no-results-message">No results found.</div>
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

          {/* {!HideUser && searchResults.length > 0 && (
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
      )} */}
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
                          {page.page_type + ' | ' + page._address?.city ||
                            '\u00a0'}
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
console.log()

const FilterDropdown: React.FC<Props> = ({ onChange }) => {
  const dispatch = useDispatch()

  const handleShowAllPeopleClick = () => {
    dispatch(toggleShowAllPeople())
  }
  const handleShowAllPlaceClick = () => {
    dispatch(toggleShowAllPlace())
  }
  const handleShowAllEventClick = () => {
    dispatch(toggleShowAllEvent())
  }
  return (
    <Select onChange={onChange} className={styles.filterDropdown}>
      <option onClick={handleShowAllPeopleClick} value="people">
        People Pages
      </option>
      <option onClick={handleShowAllPlaceClick} value="places">
        Places
      </option>
      <option onClick={handleShowAllEventClick} value="programs">
        Programs
      </option>
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

  const dispatch = useDispatch()

  const handleDropdownChange = (event: any) => {
    const filterValue = event.target.value
    switch (filterValue) {
      case 'all':
        dispatch(toggleShowAll())
        break
      case 'people':
        dispatch(toggleShowAllPeople())
        break
      case 'places':
        dispatch(toggleShowAllPlace())
        break
      case 'programs':
        dispatch(toggleShowAllEvent())
        break
      default:
        break
    }
  }
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
          <FilterDropdown onChange={handleDropdownChange} />
        </aside>
      ) : (
        <FilterSidebar />
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
