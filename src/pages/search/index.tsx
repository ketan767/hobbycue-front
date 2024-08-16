import SearchPageFilter from '@/components/SearchPageFilters'
import PageGridLayout from '@/layouts/PageGridLayout'
import { openModal } from '@/redux/slices/modal'
import {
  showAllTrue,
  toggleShowAllEvent,
  toggleShowAllPeople,
  toggleShowAllPlace,
  toggleShowAllUsers,
  toggleShowAllProducts,
  toggleShowAllHobbies,
  toggleShowAllPosts,
  toggleShowAllBlogs,
} from '@/redux/slices/search'
import { RootState } from '@/redux/store'
import { MenuItem, Select, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import User from '../../assets/svg/Search/User.svg'
import styles from './styles.module.css'
import { SetLinkviaAuth } from '@/redux/slices/user'
import Link from 'next/link'
import SearchLoader from '@/components/SearchLoader'
import { convertDateToString, formatDateRange } from '@/utils'

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
  event_date_time: any
  event_weekdays: any
}
type ProductData = {
  profile_image: string
  title: string
  tagline: string
  _address: { city: string }
  page_url: string
  page_type: []
}

type BlogData = {
  _id: string
  url: string
  title: string
  tagline: string
  author: any
  cover_pic: string
  createdAt: any
}
type PostData = {
  _id: string
  _author: any
  author_type: string
  createdAt: any
  _hobby: any
  visibility: any
  content: any
}
type hobby = {
  _id: string
  profile_image: string | null
  genre: string[]
  slug: string
  display: string
  category: { display: string }
  sub_category: { display: string }
  description: string
}
type SearchResultsProps = {
  searchResults: User[]

  peopleResults: PeopleData[]
  placeResults: PlaceData[]
  EventResults: EventData[]
  hobbyResults: hobby[]
  ProductResults: ProductData[]
  BlogsResults: BlogData[]
  PostsResults: PostData[]
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
  ProductResults,
  PostsResults,
  BlogsResults,
}) => {
  const showAll = useSelector((state: RootState) => state.search.showAll)
  const showAllUsers = useSelector(
    (state: RootState) => state.search.showAllUsers,
  )
  const showAllPeople = useSelector(
    (state: RootState) => state.search.showAllPeople,
  )
  const showAllPlace = useSelector(
    (state: RootState) => state.search.showAllPlace,
  )
  const showAllEvent = useSelector(
    (state: RootState) => state.search.showAllEvent,
  )
  const showAllProducts = useSelector(
    (state: RootState) => state.search.showAllProducts,
  )
  const showAllPosts = useSelector(
    (state: RootState) => state.search.showAllPosts,
  )
  const showAllBlogs = useSelector(
    (state: RootState) => state.search.showAllBlogs,
  )

  const showAllhobbies = useSelector(
    (state: RootState) => state.search.showAllHobbies,
  )
  const searchString = useSelector(
    (state: RootState) => state.search.searchString,
  )
  const isExplore = useSelector((state: RootState) => state.search.explore)
  const searchLoading = useSelector((state: RootState) => state.search.loading)
  const dispatch = useDispatch()
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )

  const [HideUser, setHideUser] = useState(false)
  const [HidePeople, setHidePeople] = useState(false)
  const [HidePlace, setHidePlace] = useState(false)
  const [HideEvent, setHideEvent] = useState(false)
  const [HideProduct, setHideProduct] = useState(false)
  const [HidePosts, setHidePosts] = useState(false)
  const [HideBlogs, setHideBlogs] = useState(false)
  const [HideHobbies, setHideHobbies] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (showAll === true) {
      setHideUser(false)
      setHidePeople(false)
      setHidePlace(false)
      setHideEvent(false)
      setHideHobbies(false)
      setHideProduct(false)
      setHideBlogs(false)
      setHidePosts(false)
    } else if (showAllUsers === true) {
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideUser(false)
    } else if (showAllhobbies === true) {
      setHideUser(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideHobbies(false)
    } else if (showAllPeople === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHidePeople(false)
    } else if (showAllPlace === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHidePlace(false)
    } else if (showAllEvent === true) {
      setHideUser(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideHobbies(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideEvent(false)
    } else if (showAllProducts === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideProduct(false)
    } else if (showAllBlogs === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideProduct(true)
      setHideBlogs(false)
    } else if (showAllPosts === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideBlogs(true)
      setHideProduct(true)
      setHidePosts(false)
    }
  }, [
    showAll,
    showAllEvent,
    showAllPeople,
    showAllPlace,
    showAllProducts,
    showAllUsers,
    showAllhobbies,
    showAllProducts,
    showAllBlogs,
    showAllPosts,
  ])

  const toggleShowAllusers = () => {
    dispatch(toggleShowAllUsers())
  }

  const toggleShowAllhobbies = () => {
    dispatch(toggleShowAllHobbies())
  }

  const toggleShowAllpeople = () => {
    dispatch(toggleShowAllPeople())
  }

  const toggleShowAllplace = () => {
    dispatch(toggleShowAllPlace())
  }

  const toggleShowAllevent = () => {
    dispatch(toggleShowAllEvent())
  }

  const toggleShowAllproducts = () => {
    dispatch(toggleShowAllProducts())
  }
  const toggleShowAllblogs = () => {
    dispatch(toggleShowAllBlogs())
  }
  const toggleShowAllposts = () => {
    dispatch(toggleShowAllPosts())
  }

  const navigateToHobby = (slug: string) => {
    router.push(`hobby/${slug}`)
  }

  const navigateToProfile = (profileUrl: string) => {
    if (isLoggedIn) {
      router.push(`profile/${profileUrl}`)
    } else {
      dispatch(SetLinkviaAuth(`profile/${profileUrl}`))
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }
  const navigateToPeoplePage = (pageUrl: string) => {
    router.push(`people/${pageUrl}`)
  }
  const navigateToPlacePage = (pageUrl: string) => {
    router.push(`place/${pageUrl}`)
  }
  const navigateToProgramPage = (pageUrl: string) => {
    router.push(`program/${pageUrl}`)
  }
  const navigateToProductPage = (pageUrl: string) => {
    router.push(`product/${pageUrl}`)
  }
  const navigateToBlog = (pageUrl: string) => {
    router.push(`blog/${pageUrl}`)
  }

  const navigateToPosts = (pageUrl: string) => {
    router.push(`post/${pageUrl}`)
  }

  const noResultsFound =
    (searchResults.length === 0 &&
      hobbyResults.length === 0 &&
      peopleResults.length === 0 &&
      placeResults.length === 0 &&
      EventResults.length === 0 &&
      ProductResults.length === 0 &&
      PostsResults.length === 0 &&
      BlogsResults.length === 0 &&
      showAll) ||
    (searchResults.length === 0 && showAllUsers) ||
    (hobbyResults.length === 0 && showAllhobbies) ||
    (peopleResults.length === 0 && showAllPeople) ||
    (placeResults.length === 0 && showAllPlace) ||
    (EventResults.length === 0 && showAllEvent) ||
    (ProductResults.length === 0 && showAllProducts) ||
    (PostsResults.length === 0 && showAllPosts) ||
    (BlogsResults.length === 0 && showAllBlogs && searchLoading === false)

  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <main className={styles.searchResults}>
      {noResultsFound ? (
        <div className={styles['no-results-wrapper']}>
          {searchString === '' ? (
            <p>
              Use the <strong> Search box</strong> at the top to look for
              anything on your hobbies. If you feel we are missing a listing,
              you may choose <strong>Add Listing Page</strong> from the menu at
              the top right corner. If you need further help, visit the Help
              Centre from the above menu.
            </p>
          ) : (
            <p>
              {`No results for "${searchString}". `}Try shorter or alternate
              keywords. Or <Link href={'/contact'}>contact us</Link> if you feel
              we are missing something. For further help,{' '}
              <Link href={'/help'}>click here</Link>.
            </p>
          )}
        </div>
      ) : (
        <div>
          {searchLoading === true && (
            <div className={styles.loaders}>
              <SearchLoader />
              <SearchLoader showBox />
            </div>
          )}
          {!HideHobbies &&
            hobbyResults.length > 0 &&
            searchLoading === false && (
              <section className={styles.userSection}>
                <div className={styles.peopleItemsContainer}>
                  <div className={styles.resultHeading}>Hobbies</div>
                  {hobbyResults
                    .slice(0, showAllhobbies ? undefined : 3)
                    .map((hobby, index) => (
                      <div
                        className={styles.peopleItem}
                        key={index}
                        onClick={() => navigateToHobby(hobby.slug)}
                      >
                        <div className={styles.hobbyAvtar}>
                          {/* Render the image */}
                          {hobby.profile_image ? (
                            <img
                              src={hobby.profile_image}
                              alt={`${hobby.display}'s `}
                              width={64}
                              height={64}
                            />
                          ) : (
                            <>
                              <div
                                className={`${styles['img-polygon']} `}
                              ></div>
                              <svg
                                className={styles.polygonOverlay}
                                viewBox="0 0 160 160"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M80 0L149.282 40V120L80 160L10.718 120V40L80 0Z"
                                  fill="#969696"
                                  fill-opacity="0.5"
                                />
                                <path
                                  d="M79.6206 46.1372C79.7422 45.7727 80.2578 45.7727 80.3794 46.1372L87.9122 68.7141C87.9663 68.8763 88.1176 68.9861 88.2885 68.9875L112.088 69.175C112.472 69.178 112.632 69.6684 112.323 69.8967L93.1785 84.0374C93.041 84.139 92.9833 84.3168 93.0348 84.4798L100.211 107.173C100.327 107.539 99.9097 107.842 99.5971 107.619L80.2326 93.7812C80.0935 93.6818 79.9065 93.6818 79.7674 93.7812L60.4029 107.619C60.0903 107.842 59.6731 107.539 59.789 107.173L66.9652 84.4798C67.0167 84.3168 66.959 84.139 66.8215 84.0374L47.6773 69.8967C47.3682 69.6684 47.5276 69.178 47.9118 69.175L71.7115 68.9875C71.8824 68.9861 72.0337 68.8763 72.0878 68.7141L79.6206 46.1372Z"
                                  fill="white"
                                />
                              </svg>
                            </>
                          )}
                        </div>

                        <div className={styles.userDetails}>
                          <div className={styles.userName}>{hobby.display}</div>
                          <div className={styles.userTagline}>
                            {`${
                              hobby?.category?.display
                                ? hobby.category.display
                                : ''
                            }${
                              hobby?.sub_category?.display
                                ? ' | ' + hobby.sub_category.display
                                : ''
                            }`}
                            &nbsp;
                          </div>
                          <div className={styles.hobbydescription}>
                            {hobby?.description}
                          </div>
                        </div>
                      </div>
                    ))}

                  <div className={styles['view-more-btn-container']}>
                    {showAllhobbies
                      ? undefined
                      : (hobbyResults.length > 3 ? (
                          <button
                            onClick={toggleShowAllhobbies}
                            className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                          >
                            View More
                          </button>
                        ) : (
                          ''
                        )) || ''}
                  </div>
                </div>
              </section>
            )}
          {/* User  */}

          {!HideUser && searchResults.length > 0 && searchLoading === false && (
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
                          <img
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
                <div className={styles['view-more-btn-container']}>
                  {showAllUsers
                    ? undefined
                    : (searchResults.length > 3 ? (
                        <button
                          onClick={toggleShowAllusers}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) : (
                        ''
                      )) || ''}
                </div>
              </div>
            </section>
          )}
          {/* People */}
          {!HidePeople &&
            peopleResults.length > 0 &&
            searchLoading === false && (
              <section className={styles.userSection}>
                <div className={styles.peopleItemsContainer}>
                  <div className={styles.resultHeading}>People</div>
                  {peopleResults
                    .slice(0, showAllPeople ? undefined : 3)
                    .map((page, index) => (
                      <div
                        className={styles.peopleItem}
                        key={index}
                        onClick={() => navigateToPeoplePage(page.page_url)}
                      >
                        <div className={styles.peopleAvatar}>
                          {page.profile_image ? (
                            <img
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
                              (page._address?.city
                                ? ` | ${page._address?.city}`
                                : '') || '\u00a0'}
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className={styles['view-more-btn-container']}>
                    {showAllPeople
                      ? undefined
                      : (peopleResults.length > 3 ? (
                          <button
                            onClick={toggleShowAllpeople}
                            className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                          >
                            View More
                          </button>
                        ) : (
                          ''
                        )) || ''}
                  </div>
                </div>
              </section>
            )}
          {/* Place  */}
          {!HidePlace && placeResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>Places</div>
                {placeResults
                  .slice(0, showAllPlace ? undefined : 3)
                  .map((page, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToPlacePage(page.page_url)}
                    >
                      <div className={styles.peopleAvatar}>
                        {page.profile_image ? (
                          <img
                            src={page.profile_image}
                            alt={`${page.title}'s `}
                            width={64}
                            height={64}
                            className={styles.peopleavatarImage}
                          />
                        ) : (
                          <div
                            className={`${styles['people-img']} default-place-listing-icon`}
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{page?.title}</div>
                        <div className={styles.userTagline}>
                          {page?.tagline || '\u00a0'}
                        </div>
                        <div className={styles.userLocation}>
                          {page.page_type +
                            (page._address?.city
                              ? ` | ${page._address?.city}`
                              : '') || '\u00a0'}
                        </div>
                      </div>
                    </div>
                  ))}
                <div className={styles['view-more-btn-container']}>
                  {showAllPlace
                    ? undefined
                    : (placeResults.length > 3 ? (
                        <button
                          onClick={toggleShowAllplace}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) : (
                        ''
                      )) || ''}
                </div>
              </div>
            </section>
          )}

          {/* Event  */}
          {!HideEvent && EventResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>Programs</div>
                {EventResults.slice(0, showAllEvent ? undefined : 3).map(
                  (page, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToProgramPage(page.page_url)}
                    >
                      <div className={styles.peopleAvatar}>
                        {page.profile_image ? (
                          <img
                            src={page.profile_image}
                            alt={`${page.title}'s `}
                            width={64}
                            height={64}
                            className={styles.peopleavatarImage}
                          />
                        ) : (
                          <div
                            className={`${styles['people-img']} default-program-listing-icon`}
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{page?.title}</div>
                        <div className={styles.userTagline}>
                          {page?.tagline || '\u00a0'}
                        </div>
                        <div className={styles.userLocation}>
                          {page.page_type +
                            (page._address?.city
                              ? ` | ${page._address?.city}`
                              : '') || '\u00a0'}
                          {page?.event_date_time &&
                            page?.event_date_time.length !== 0 && (
                              <>
                                {' | '}
                                {formatDateRange(page?.event_date_time[0])}
                                {!isMobile && (
                                  <>
                                    {', '}
                                    {page?.event_date_time[0]?.from_time +
                                      ' - '}
                                    {page?.event_weekdays?.length > 0 ? (
                                      <>
                                        ...
                                        <span className={styles['purpleText']}>
                                          more
                                        </span>
                                      </>
                                    ) : (
                                      page?.event_date_time[0]?.to_time
                                    )}
                                  </>
                                )}
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
                <div className={styles['view-more-btn-container']}>
                  {showAllEvent
                    ? undefined
                    : (EventResults.length > 3 ? (
                        <button
                          onClick={toggleShowAllevent}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) : (
                        ''
                      )) || ''}
                </div>
              </div>
            </section>
          )}
          {/* Product  */}
          {!HideProduct &&
            ProductResults.length > 0 &&
            searchLoading === false && (
              <section className={styles.userSection}>
                <div className={styles.peopleItemsContainer}>
                  <div className={styles.resultHeading}>products</div>
                  {ProductResults.slice(0, showAllProducts ? undefined : 3).map(
                    (page, index) => (
                      <div
                        className={styles.peopleItem}
                        key={index}
                        onClick={() => navigateToProductPage(page.page_url)}
                      >
                        <div className={styles.peopleAvatar}>
                          {page.profile_image ? (
                            <img
                              src={page.profile_image}
                              alt={`${page.title}'s `}
                              width={64}
                              height={64}
                              className={styles.peopleavatarImage}
                            />
                          ) : (
                            <div
                              className={`${styles['people-img']} default-product-listing-icon`}
                            ></div>
                          )}
                        </div>
                        <div className={styles.userDetails}>
                          <div className={styles.userName}>{page?.title}</div>
                          <div className={styles.userTagline}>
                            {page?.tagline || '\u00a0'}
                          </div>
                          <div className={styles.userLocation}>
                            {page.page_type +
                              (page._address?.city
                                ? ` | ${page._address?.city}`
                                : '') || '\u00a0'}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  <div className={styles['view-more-btn-container']}>
                    {showAllProducts
                      ? undefined
                      : (ProductResults.length > 3 ? (
                          <button
                            onClick={toggleShowAllproducts}
                            className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                          >
                            View More
                          </button>
                        ) : (
                          ''
                        )) || ''}
                  </div>
                </div>
              </section>
            )}
          {/* Posts  */}
          {!HidePosts && PostsResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>Posts</div>
                {PostsResults.slice(0, showAllPosts ? undefined : 3).map(
                  (page, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToPosts(page._id)}
                    >
                      <div
                        className={
                          page?.author_type === 'User'
                            ? styles.userAvatar
                            : styles.peopleAvatarImage
                        }
                      >
                        {page?._author?.profile_image ? (
                          <img
                            src={page._author?.profile_image}
                            alt={`${page._author?.full_name}'s `}
                            width={64}
                            height={64}
                            className={
                              page?.author_type === 'User'
                                ? styles.avatarImage
                                : styles.peopleavatarImage
                            }
                          />
                        ) : (
                          <div
                            className={
                              page?._author?.type == 1
                                ? `${styles['people-img']} default-people-listing-icon`
                                : page?._author?.type == 2
                                ? `${styles['people-img']} default-place-listing-icon`
                                : page?._author?.type == 3
                                ? `${styles['people-img']} default-program-listing-icon`
                                : page?._author?.type == 4
                                ? `${styles['people-img']} default-product-listing-icon`
                                : `${styles.avatarImage} default-user-icon`
                            }
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>
                          {page?.author_type === 'Listing'
                            ? page?._author?.title
                            : page?._author?.full_name}
                        </div>
                        <div className={styles.userTagline}>
                          {convertDateToString(page?.createdAt) || '\u00a0'}{' '}
                          {' | ' + page?._hobby.display || '\u00a0'}{' '}
                          {' | ' + page.visibility}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: page?.content.replace(/<img[^>]*>/g, ''),
                          }}
                          className={styles.userLocation}
                        ></div>
                      </div>
                    </div>
                  ),
                )}
                <div className={styles['view-more-btn-container']}>
                  {showAllPosts
                    ? undefined
                    : (PostsResults.length > 3 ? (
                        <button
                          onClick={toggleShowAllposts}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) : (
                        ''
                      )) || ''}
                </div>
              </div>
            </section>
          )}
          {/* Blogs  */}
          {!HideBlogs && BlogsResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>Blogs</div>
                {BlogsResults.slice(0, showAllBlogs ? undefined : 3).map(
                  (page, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToBlog(page.url)}
                    >
                      <div className={styles.peopleAvatar}>
                        {page.cover_pic ? (
                          <img
                            src={page.cover_pic}
                            alt={`${page.title}'s `}
                            width={64}
                            height={64}
                            className={styles.peopleavatarImage}
                          />
                        ) : (
                          <div
                            className={`${styles['people-img']} default-user-icon`}
                          ></div>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userName}>{page?.title}</div>
                        <div className={styles.userTagline}>
                          {page?.tagline || '\u00a0'}
                        </div>
                        <div className={styles.userLocation}>
                          {page?.author?.full_name}{' '}
                          {page.createdAt ? ' | ' + page.createdAt : ''}
                        </div>
                      </div>
                    </div>
                  ),
                )}
                <div className={styles['view-more-btn-container']}>
                  {showAllBlogs
                    ? undefined
                    : (BlogsResults.length > 3 ? (
                        <button
                          onClick={toggleShowAllblogs}
                          className={`"modal-footer-btn submit" ${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                      ) : (
                        ''
                      )) || ''}
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
  const isExplore = useSelector((state: RootState) => state.search.explore)
  const showAll = useSelector((state: any) => state.search.showAll)
  const showAllUsers = useSelector((state: any) => state.search.showAllUsers)
  const showAllhobbies = useSelector(
    (state: any) => state.search.showAllhobbies,
  )
  const showAllPeople = useSelector((state: any) => state.search.showAllPeople)
  const showAllPlace = useSelector((state: any) => state.search.showAllPlace)
  const showAllEvent = useSelector((state: any) => state.search.showAllEvent)
  const showAllProducts = useSelector(
    (state: any) => state.search.showAllProducts,
  )
  const showAllPosts = useSelector((state: any) => state.search.showAllPosts)
  const showAllBlogs = useSelector((state: any) => state.search.showAllBlogs)
  useEffect(() => {
    if (showAll) {
      setActiveFilter('all')
    }
  }, [showAll])
  useEffect(() => {
    if (showAllUsers) {
      setActiveFilter('users')
    }
  }, [showAllUsers])
  useEffect(() => {
    if (showAllhobbies) {
      setActiveFilter('hobby')
    }
  }, [showAllhobbies])
  useEffect(() => {
    if (showAllPeople) {
      setActiveFilter('people')
    }
  }, [showAllPeople])
  useEffect(() => {
    if (showAllPlace) {
      setActiveFilter('places')
    }
  }, [showAllPlace])
  useEffect(() => {
    if (showAllEvent) {
      setActiveFilter('events')
    }
  }, [showAllEvent])
  useEffect(() => {
    if (showAllProducts) {
      setActiveFilter('products')
    }
  }, [showAllProducts])
  useEffect(() => {
    if (showAllPosts) {
      setActiveFilter('posts')
    }
  }, [showAllPosts])
  useEffect(() => {
    if (showAllBlogs) {
      setActiveFilter('blogs')
    }
  }, [showAllBlogs])
  const handleFilterClick = (filterType: any) => {
    if (activeFilter === filterType) {
      setActiveFilter('all')
      dispatch(showAllTrue())
    } else {
      setActiveFilter(filterType)
      switch (filterType) {
        case 'all':
          dispatch(showAllTrue())
          break
        case 'users':
          dispatch(toggleShowAllUsers())
          break
        case 'hobby':
          dispatch(toggleShowAllHobbies())
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
        case 'posts':
          dispatch(toggleShowAllPosts())
          break
        case 'blogs':
          dispatch(toggleShowAllBlogs())
          break
        default:
          break
      }
    }
  }

  return (
    <Select
      disabled={isExplore}
      className={styles.filterDropdown}
      value={activeFilter}
    >
      <MenuItem onClick={() => handleFilterClick('all')} value="all">
        All of HobbyCue
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('users')} value="users">
        Users
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('hobby')} value="hobby">
        Hobbies
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
      <MenuItem onClick={() => handleFilterClick('posts')} value="posts">
        Posts
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('blogs')} value="blogs">
        Blogs
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
  const ProductSearch = useSelector(
    (state: RootState) => state.search.typeResultFour.data,
  )
  const PostsSearch = useSelector(
    (state: RootState) => state.search.postsSearchResults.data,
  )
  const BlogsSearch = useSelector(
    (state: RootState) => state.search.blogsSearchResults.data,
  )
  const searchString = useSelector(
    (state: RootState) => state.search.searchString,
  )
  const hobbySearchResults = useSelector(
    (state: RootState) => state.search.hobbiesSearchResults.data,
  )

  console.log('bloggggg', BlogsSearch)
  console.log('placeee', PlaceSearch)

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
      <main className={styles['search-result']}>
        <MainContent
          searchResults={userSearchResults || []}
          peopleResults={PeopleSearch || []}
          placeResults={PlaceSearch || []}
          EventResults={EventSearch || []}
          hobbyResults={hobbySearchResults || []}
          ProductResults={ProductSearch || []}
          PostsResults={PostsSearch || []}
          BlogsResults={BlogsSearch || []}
        />
      </main>
      <aside className={styles['aside-two']}>
        {' '}
        <ExploreSidebar />
      </aside>
    </PageGridLayout>
  )
}

export default Search
