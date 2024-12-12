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
  setSearchLoading,
  setHobbiesSearchResult,
  setResultPagination,
  appendHobbiesSearchResult,
  setCurrentPage,
  setHasMore,
  resetSearch,
  setExplore,
  setSearchString,
  setUserSearchResults,
  setTypeResultOne,
  setTypeResultTwo,
  setTypeResultThree,
  setTypeResultFour,
  setBlogsSearchResult,
  setUserName,
  setPostsSearchResult,
  setClassesResult,
  toggleShowAllClasses,
  toggleShowAllRentals,
  setRentalResult,
  SearchResults,
  hobbies,
} from '@/redux/slices/search'
import { RootState } from '@/redux/store'
import { MenuItem, Select, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import User from '../../assets/svg/Search/User.svg'
import styles from './styles.module.css'
import { SetLinkviaAuth } from '@/redux/slices/user'
import Link from 'next/link'
import SearchLoader from '@/components/SearchLoader'
import Dropdown from '@/assets/svg/exploreSearch/Down.svg'
import DropdownWhite from '@/assets/svg/exploreSearch/DownWhite.svg'

import { addSearchHistory, searchUsers } from '@/services/user.service'
import {
  getAllHobbies,
  getAllHobbiesWithoutPagi,
  searchAllHobbies,
} from '@/services/hobby.service'

import {
  convertDateToString,
  formatDateRange,
  formatDateTime,
  formatDateTimeThree,
  formatDateTimeTwo,
} from '@/utils'
import { setShowPageLoader } from '@/redux/slices/site'
import { searchPages } from '@/services/listing.service'
import { searchBlogs } from '@/services/blog.services'
import Head from 'next/head'
import NoResult from './NoResult'
import ExploreIcon from '@/assets/icons/ExploreIcon'
import QuestionIcon from '@/assets/icons/QuestionIcon'
import InterestedDiv from './InterestedDiv'
import DoubleDownArrow from '@/assets/icons/DoubleDownArrow'
import hobbycue from '../../assets/svg/Search/hobbycue.svg'
import People from '../../assets/svg/Search/People.svg'
import UserSvg from '../../assets/svg/Search/User.svg'
import Hobby from '../../assets/svg/Search/Hobbies.svg'
import Place from '../../assets/svg/Search/Place.svg'
import Program from '../../assets/svg/Search/Program.svg'
import Product from '../../assets/svg/Search/Product.svg'
import Blogs from '../../assets/svg/Search/blogs.svg'
import { searchPosts } from '@/services/post.service'
import { Inter } from 'next/font/google'
import UserExplore from './explore/UserExplore'
import PExplore from './explore/PExplore'
import PostExplore from './explore/PostExplore'
import UserHobbies from './searchComponents/user/UserHobbies'

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
  _hobbies: any[]
}
type PeopleData = {
  _hobbies: any
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
  _address: {
    society: string
    city: string
    locality: string
  }
  page_url: string
  page_type: []
}
type EventData = {
  profile_image: string
  title: string
  tagline: string
  _address: { society: string; city: string; locality: string }
  page_url: string
  page_type: []
  event_date_time: any
  event_weekdays: any
}
type ProductData = {
  _hobbies: any
  product_variant: any
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
  _genre: any
  _allHobbies: any
  _allGenres: any
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
  ClassesResults: EventData[]
  RentalResults: ProductData[]
  BlogsResults: BlogData[]
  PostsResults: PostData[]
}

type PropsExploreSidebarBtn = {
  href: string
  text: string
  icon?: React.ReactNode
}
type PropsExploreMoreBtn = {
  text: string
  icon?: React.ReactNode
}

const inter = Inter({
  subsets: ['latin'], // Choose subsets like 'latin' or others as per your needs
  weight: ['400', '500', '600', '700'], // Select the weights you want to use (optional)
})

const ExploreSidebarBtn: React.FC<PropsExploreSidebarBtn> = ({
  href,
  text,
  icon,
}) => {
  return (
    <div className={styles['explore-sidebar']}>
      <Link href={href}>
        <button className="modal-footer-btn">
          {icon}
          {text}
        </button>
      </Link>
    </div>
  )
}
const ExploreMoreBtn: React.FC<PropsExploreMoreBtn> = ({ text, icon }) => {
  const router = useRouter()
  const {
    keyword,
    hobby,
    category,
    page_type,
    location: currLocation,
  } = useSelector((state: RootState) => state.explore)

  const getLink = () => {
    let link = '/explore'
    if (page_type) {
      if (page_type === 'Place' || page_type === 'place') {
        link += '/places?'
      } else if (page_type === 'People' || page_type === 'people') {
        link += '/people?'
      } else if (page_type === 'Program' || page_type === 'program') {
        link += '/programs?'
      } else if (page_type === 'Product' || page_type === 'product') {
        link += '/products?'
      }
      link += `page-type=${page_type}`
    } else if (category) {
      link += `?category=${category}`
    }
    if (hobby) {
      if (category || page_type) {
        link += '&'
      } else {
        link += '?'
      }
      link += `hobby=${hobby}`
    }

    if (currLocation) {
      if (hobby || category || page_type) {
        link += '&'
      } else {
        link += '?'
      }
      link += `location=${currLocation}`
    }
    if (keyword) {
      if (hobby || category || page_type || currLocation) {
        link += '&'
      } else {
        link += '?'
      }
      link += `keyword=${keyword}`
    }

    return link
  }
  const handleExploreMore = () => {
    router.push(`${getLink()}`)
  }
  const filter = router.query?.filter || ''
  const btnDisabled = !filter || filter === 'users' ? true : false
  return (
    <div className={styles['explore-sidebar']}>
      <button
        onClick={handleExploreMore}
        className={
          'modal-footer-btn' + ' ' + (btnDisabled ? styles.btnDisabled : '')
        }
        disabled={btnDisabled}
      >
        {btnDisabled ? null : icon}
        {text}
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
  ClassesResults,
  RentalResults,
  PostsResults,
  BlogsResults,
}) => {
  // const showAll = useSelector((state: RootState) => state.search.showAll)
  // const showAllUsers = useSelector(
  //   (state: RootState) => state.search.showAllUsers,
  // )
  // const showAllPeople = useSelector(
  //   (state: RootState) => state.search.showAllPeople,
  // )
  // const showAllPlace = useSelector(
  //   (state: RootState) => state.search.showAllPlace,
  // )
  // const showAllEvent = useSelector(
  //   (state: RootState) => state.search.showAllEvent,
  // )
  // const showAllProducts = useSelector(
  //   (state: RootState) => state.search.showAllProducts,
  // )
  // const showAllPosts = useSelector(
  //   (state: RootState) => state.search.showAllPosts,
  // )
  // const showAllBlogs = useSelector(
  //   (state: RootState) => state.search.showAllBlogs,
  // )

  // const showAllhobbies = useSelector(
  //   (state: RootState) => state.search.showAllHobbies,
  // )
  const searchString = useSelector(
    (state: RootState) => state.search.searchString,
  )
  const isExplore = useSelector((state: RootState) => state.search.explore)
  const searchLoading = useSelector((state: RootState) => state.search.loading)
  const dispatch = useDispatch()
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const { hobbiesSearchResults, hasMore, currentPage, result_pagination } =
    useSelector((state: RootState) => state.search)

  const [HideUser, setHideUser] = useState(false)
  const [HidePeople, setHidePeople] = useState(false)
  const [HidePlace, setHidePlace] = useState(false)
  const [HideEvent, setHideEvent] = useState(false)
  const [HideClasses, setHideClasses] = useState(false)
  const [HideProduct, setHideProduct] = useState(false)
  const [HideRentals, setHideRentals] = useState(false)
  const [HidePosts, setHidePosts] = useState(false)
  const [HideBlogs, setHideBlogs] = useState(false)
  const [HideHobbies, setHideHobbies] = useState(false)
  const [moreLoading, setMoreLoading] = useState(false)
  const [page, setPage] = useState(1)

  const router = useRouter()

  const { q, filter, name, hobby, location, postedBy } = router.query

  const queryString = q?.toString() || ''

  const showAll = filter ? filter === '' : true
  const showAllUsers = filter === 'users'
  const showAllPeople = filter === 'people'
  const showAllPlace = filter === 'places'
  const showAllEvent = filter === 'programs'
  const showAllProducts = filter === 'products'
  const showAllPosts = filter === 'posts'
  const showAllBlogs = filter === 'blogs'
  const showAllhobbies = filter === 'hobby'
  const showAllClasses = filter === 'classes'
  const showAllRentals = filter === 'rentals'

  const observer = useRef<IntersectionObserver | null>(null)
  const [pageNum, setPageNum] = useState<number>(1)
  const [hobbyPageNum, setHobbyPageNum] = useState<number>(1)
  const [peoplePageNum, setPeoplePageNum] = useState<number>(1)
  const [placePageNum, setPlacePageNum] = useState<number>(1)
  const [programPageNum, setProgramPageNum] = useState<number>(1)
  const [productPageNum, setProductPageNum] = useState<number>(1)
  const [postsPageNum, setPostsPageNum] = useState<number>(1)
  const [blogsPageNum, setBlogsPageNum] = useState<number>(1)
  const [userPages, setUserPages] = useState<User[]>([])
  const [hobbyPages, setHobbyPages] = useState<hobby[]>([])
  const [peoplePages, setPeoplePages] = useState<PeopleData[]>([])
  const [placePages, setPlacePages] = useState<PlaceData[]>([])
  const [eventPages, setEventPages] = useState<EventData[]>([])
  const [productPages, setProductPages] = useState<ProductData[]>([])
  const [isSearchingMore, setIsSearchingMore] = useState<boolean>(false)
  const [hasNoMoreUsers, setHasNoMoreUsers] = useState<boolean>(false)
  const [hasNoMoreHobbies, setHasNoMoreHobbies] = useState<boolean>(false)
  const [hasNoMorePersonPages, setHasNoMorePersonPages] =
    useState<boolean>(false)
  const [hasNoMorePlacePages, setHasNoMorePlacePages] = useState<boolean>(false)
  const [hasNoMoreProgramPages, setHasNoMoreProgramPages] =
    useState<boolean>(false)
  const [hasNoMoreProductPages, setHasNoMoreProductPages] =
    useState<boolean>(false)
  const [hasNoMoreBlogsPages, setHasNoMoreBlogsPages] = useState<boolean>(false)
  const [hasNoMorePostsPages, setHasNoMorePostsPages] = useState<boolean>(false)
  const [openExploreClass, setOpenExploreClass] = useState<boolean>(false)
  const [exploreClassHoved, setExploreClassHoved] = useState<boolean>(false)
  const [openExploreUser, setOpenExploreUser] = useState<boolean>(false)
  const [exploreUserHoved, setExploreUserHoved] = useState<boolean>(false)
  const [openExplorePeople, setOpenExplorePeople] = useState<boolean>(false)
  const [explorePeopleHoved, setExplorePeopleHoved] = useState<boolean>(false)
  const [openExplorePlace, setOpenExplorePlace] = useState<boolean>(false)
  const [explorePlaceHoved, setExplorePlaceHoved] = useState<boolean>(false)
  const [openExploreProgram, setOpenExploreProgram] = useState<boolean>(false)
  const [exploreProgramHoved, setExploreProgramHoved] = useState<boolean>(false)
  const [openExploreProduct, setOpenExploreProduct] = useState<boolean>(false)
  const [exploreProductHoved, setExploreProductHoved] = useState<boolean>(false)
  const [openExploreRental, setOpenExploreRental] = useState<boolean>(false)
  const [exploreRentalHoved, setExploreRentalHoved] = useState<boolean>(false)
  const [openExplorePost, setOpenExplorePost] = useState<boolean>(false)
  const [explorePostHoved, setExplorePostHoved] = useState<boolean>(false)
  const [exploreHobbyHoved, setExploreHobbyHoved] = useState<boolean>(false)
  const [exploreBlogHoved, setExploreBlogHoved] = useState<boolean>(false)
  const [currUserName, setCurrUserName] = useState<string>('')
  const [currPostedBy, setCurrPostedBy] = useState<string>('')

  const [defaultPeopleCategory, setDefaultPeopleCategory] =
    useState<string>('People')
  const [defaultPlaceCategory, setDefaultPlaceCategory] =
    useState<string>('Place')
  const [defaultProgramCategory, setDefaultProgramCategory] =
    useState<string>('Program')
  const [defaultProductCategory, setDefaultProductCategory] =
    useState<string>('Product')
  const [defaultClassCategory, setDefaultClassCategory] =
    useState<string>('Classes')
  const [defaultRentalCategory, setDefaultRentalCategory] =
    useState<string>('Item Rental')
  // const callForData = async (page: number) => {
  //   if (page === 1) return
  //   setMoreLoading(true)
  //   try {
  //     // Hobbies
  //     const query = `level=1&level=2&level=3&level=4&level=5&search=${searchString}&page=${page}&limit=15`
  //     const { res: hobbyRes, err: hobbyErr } = await getAllHobbies(query)
  //     if (hobbyErr) {
  //       console.error('An error occurred during the page search:', hobbyErr)
  //     } else {
  //       const sortedHobbies = hobbyRes.data.hobbies.sort((a: any, b: any) => {
  //         const indexA = a.display
  //           .toLowerCase()
  //           .indexOf(searchString.toLowerCase())
  //         const indexB = b.display
  //           .toLowerCase()
  //           .indexOf(searchString.toLowerCase())

  //         if (indexA === 0 && indexB !== 0) {
  //           return -1
  //         } else if (indexB === 0 && indexA !== 0) {
  //           return 1
  //         }
  //         return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
  //       })
  //       dispatch(
  //         appendHobbiesSearchResult({
  //           data: sortedHobbies,
  //           message: 'Search completed successfully.',
  //           success: true,
  //         }),
  //       )
  //       dispatch(setHasMore(sortedHobbies.length === 15))
  //       dispatch(setCurrentPage(page))
  //     }
  //   } catch (error) {
  //   } finally {
  //     setMoreLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   callForData(result_pagination)
  // }, [result_pagination])

  // console.log('asifs hobbies', hobbiesSearchResults)
  // console.log('asifs page', page)

  // const lastPostElementRef = useCallback(
  //   (node: HTMLDivElement | null) => {
  //     if (searchLoading) return
  //     if (observer.current) observer.current.disconnect()
  //     observer.current = new IntersectionObserver(
  //       (entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           dispatch(setResultPagination(currentPage + 1))
  //         }
  //       },
  //       { rootMargin: '100px' },
  //     )
  //     if (node) observer.current.observe(node)
  //   },
  //   [searchLoading, hasMore, currentPage, dispatch],
  // )

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
      setHideClasses(false)
      setHideRentals(false)
    } else if (showAllUsers === true) {
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideUser(false)
      setHideClasses(true)
      setHideRentals(true)
    } else if (showAllhobbies === true) {
      setHideUser(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideHobbies(false)
      setHideClasses(true)
      setHideRentals(true)
    } else if (showAllPeople === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHidePeople(false)
      setHideClasses(true)
      setHideRentals(true)
    } else if (showAllPlace === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHideEvent(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHidePlace(false)
      setHideClasses(true)
      setHideRentals(true)
    } else if (showAllEvent === true) {
      setHideUser(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideHobbies(true)
      setHideProduct(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideEvent(false)
      setHideClasses(true)
      setHideRentals(true)
    } else if (showAllProducts === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideBlogs(true)
      setHidePosts(true)
      setHideProduct(false)
      setHideClasses(true)
      setHideRentals(true)
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
      setHideClasses(true)
      setHideRentals(true)
    } else if (showAllPosts === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideBlogs(true)
      setHideProduct(true)
      setHidePosts(false)
      setHideClasses(true)
      setHideRentals(true)
    } else if (showAllClasses === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideBlogs(true)
      setHideProduct(true)
      setHidePosts(true)
      setHideClasses(false)
      setHideRentals(true)
    } else if (showAllRentals === true) {
      setHideUser(true)
      setHideHobbies(true)
      setHidePeople(true)
      setHidePlace(true)
      setHideEvent(true)
      setHideBlogs(true)
      setHideProduct(true)
      setHidePosts(true)
      setHideClasses(true)
      setHideRentals(false)
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
    showAllClasses,
    showAllRentals,
  ])

  useEffect(() => {
    if (!q && !name && !postedBy && !hobby && !location) return
    const searchResult = async (page = 1) => {
      dispatch(resetSearch())
      dispatch(setExplore(false))
      dispatch(setSearchString(queryString))

      const searchValue = queryString || ''
      const taglineValue = ''
      const cityValue = ''
      const hobbyValue = ''
      const titleValue = ''

      if (
        !searchValue &&
        !taglineValue &&
        !cityValue &&
        !hobbyValue &&
        !filter &&
        !name &&
        !hobby &&
        !location &&
        !postedBy
      ) {
        console.log('Search fields are empty.')
        return
      }

      let searchCriteria = {
        full_name: searchValue,
        tagline: taglineValue,
        city: cityValue,
        hobby: hobbyValue,
        title: titleValue,
      }

      try {
        dispatch(setSearchLoading(true))
        let data = {}
        data = { ...data, is_onboarded: true }
        if (name || hobby || location) {
          if (name) {
            data = { ...data, name: name }
          }
          if (hobby) {
            data = { ...data, hobby: hobby }
          }
          if (location) {
            data = { ...data, location: location }
          }
        } else if (searchValue) {
          data = { ...data, searchValue: searchValue }
        }
        data = { ...data, page: 1, limit: 20 }
        setPageNum(1)

        let searchData = {}
        if (searchValue) {
          searchData = { ...searchData, searchValue: searchValue }
        }
        if (postedBy) {
          searchData = { ...searchData, postedBy: postedBy }
        }
        if (hobby) {
          searchData = { ...searchData, hobby: hobby }
        }
        if (location) {
          searchData = { ...searchData, location: location }
        }
        searchData = {
          ...searchData,
          page: 1,
          limit: 20,
        }

        const query2 = `show=true&searchValue=${searchValue}&page=1&limit=20`
        // dispatch(setShowPageLoader(true))

        const [
          titleRes,
          titleRes2,
          titleRes3,
          titleRes4,
          userRes,
          blogRes,
          PostRes,
          hobbyRes,
        ] = await Promise.all([
          searchPages({
            sort: '-createdAt',
            populate: '_hobbies,_address,product_variant,seller',
            searchValue: searchValue,
            title: searchValue,
            hobby: searchValue,
            location: searchValue,
            page: '1',
            limit: '20',
            type: '1',
          }),
          searchPages({
            sort: '-createdAt',
            populate: '_hobbies,_address,product_variant,seller',
            searchValue: searchValue,
            title: searchValue,
            hobby: searchValue,
            location: searchValue,
            page: '1',
            limit: '20',
            type: '2',
          }),
          searchPages({
            sort: '-createdAt',
            populate: '_hobbies,_address,product_variant,seller',
            searchValue: searchValue,
            title: searchValue,
            hobby: searchValue,
            location: searchValue,
            page: '1',
            limit: '20',
            type: '3',
          }),
          searchPages({
            sort: '-createdAt',
            populate: '_hobbies,_address,product_variant,seller',
            searchValue: searchValue,
            title: searchValue,
            hobby: searchValue,
            location: searchValue,
            page: '1',
            limit: '20',
            type: '4',
          }),
          searchUsers(data),
          searchBlogs({
            searchValue: searchValue,
            limit: 20,
            page: 1,
          }),
          searchPosts(searchData),
          searchAllHobbies(query2),
        ])
        // const { res: userRes, err: userErr } = await searchUsers(data)

        if (userRes.err) {
        } else {
          console.log('User result----------------->', userRes.res)
          dispatch(setUserSearchResults(userRes.res))
          setUserPages(userRes.res.data)
          if (userRes.res.data.length < 20) {
            setHasNoMoreUsers(true)
          } else {
            setHasNoMoreUsers(false)
          }
        }
        // Search by title
        // const { res: titleRes, err: titleErr } = await searchPages({
        //   title: searchValue,
        // })

        // const { res: titleRes, err: titleErr } = await searchPages({
        //   sort: '-createdAt',
        //   populate: '_hobbies,_address,product_variant,seller',
        //   searchValue: searchValue,
        //   title: searchValue,
        //   hobby: searchValue,
        //   location: searchValue,
        //   page: '1',
        //   limit: '20',
        //   type: '1',
        // })
        // const { res: titleRes2, err: titleErr2 } = await searchPages({
        //   sort: '-createdAt',
        //   populate: '_hobbies,_address,product_variant,seller',
        //   searchValue: searchValue,
        //   title: searchValue,
        //   hobby: searchValue,
        //   location: searchValue,
        //   page: '1',
        //   limit: '20',
        //   type: '2',
        // })
        // const { res: titleRes3, err: titleErr3 } = await searchPages({
        //   sort: '-createdAt',
        //   populate: '_hobbies,_address,product_variant,seller',
        //   searchValue: searchValue,
        //   title: searchValue,
        //   hobby: searchValue,
        //   location: searchValue,
        //   page: '1',
        //   limit: '20',
        //   type: '3',
        // })
        // const { res: titleRes4, err: titleErr4 } = await searchPages({
        //   sort: '-createdAt',
        //   populate: '_hobbies,_address,product_variant,seller',
        //   searchValue: searchValue,
        //   title: searchValue,
        //   hobby: searchValue,
        //   location: searchValue,
        //   page: '1',
        //   limit: '20',
        //   type: '4',
        // })
        setPeoplePageNum(1)
        if (titleRes.err) {
          console.error(
            'An error occurred during the title search:',
            titleRes.err,
          )
          dispatch(setSearchLoading(false))
          return
        }
        if (titleRes2.err) {
          console.error(
            'An error occurred during the title search:',
            titleRes2.err,
          )
          dispatch(setSearchLoading(false))
          return
        }
        if (titleRes3.err) {
          console.error(
            'An error occurred during the title search:',
            titleRes3.err,
          )
          dispatch(setSearchLoading(false))
          return
        }
        if (titleRes4.err) {
          console.error(
            'An error occurred during the title search:',
            titleRes4.err,
          )
          dispatch(setSearchLoading(false))
          return
        }

        // const titlePages = titleRes.data.slice(0, 100) // Get title search results
        const titlePages = titleRes.res.data // Get title search results
        const titlePages2 = titleRes2.res.data // Get title search results
        const titlePages3 = titleRes3.res.data // Get title search results
        const titlePages4 = titleRes4.res.data // Get title search results

        // Function to fetch tagline search results and process unique pages

        // dispatch(setShowPageLoader(true))
        // const { res: taglineRes, err: taglineErr } = await searchPages({
        //   tagline: searchValue,
        // })

        // const taglinePages = taglineRes.data.slice(0, 50) // Get tagline search results

        // Combine titlePages and taglinePages and filter out duplicate URLs
        const uniqueUrls = new Set<string>()
        const uniqueUrls2 = new Set<string>()
        const uniqueUrls3 = new Set<string>()
        const uniqueUrls4 = new Set<string>()
        // Use 'any[]' if you prefer not to define a specific type
        const uniquePages: any[] = []
        const uniquePages2: any[] = []
        const uniquePages3: any[] = []
        const uniquePages4: any[] = []
        ;[...titlePages].forEach((page) => {
          if (
            page &&
            page.page_url &&
            typeof page.page_url === 'string' &&
            !uniqueUrls.has(page.page_url)
          ) {
            uniqueUrls.add(page.page_url)
            uniquePages.push(page)
          }
        })
        ;[...titlePages2].forEach((page) => {
          if (
            page &&
            page.page_url &&
            typeof page.page_url === 'string' &&
            !uniqueUrls2.has(page.page_url)
          ) {
            uniqueUrls2.add(page.page_url)
            uniquePages2.push(page)
          }
        })
        ;[...titlePages3].forEach((page) => {
          if (
            page &&
            page.page_url &&
            typeof page.page_url === 'string' &&
            !uniqueUrls3.has(page.page_url)
          ) {
            uniqueUrls3.add(page.page_url)
            uniquePages3.push(page)
          }
        })
        ;[...titlePages4].forEach((page) => {
          if (
            page &&
            page.page_url &&
            typeof page.page_url === 'string' &&
            !uniqueUrls4.has(page.page_url)
          ) {
            uniqueUrls4.add(page.page_url)
            uniquePages4.push(page)
          }
        })

        const user_id = isLoggedIn ? user?._id : null
        console.log('sto')
        const { res, err } = await addSearchHistory({
          user_id: user_id,
          no_of_pages: uniquePages?.length,
          search_input: searchValue,
        })

        // Filter uniquePages by type and is_published
        const typeResultOne = uniquePages.filter(
          (page) => page.type === 1 && page.is_published,
        )
        const typeResultTwo = uniquePages2.filter(
          (page) => page.type === 2 && page.is_published,
        )
        const typeResultThree = uniquePages3.filter(
          (page) => page.type === 3 && page.is_published,
        )
        // console.log('Type 3------------------------------->', typeResultThree)

        const typeResultFour = uniquePages4.filter(
          (page) => page.type === 4 && page.is_published,
        )
        const filteredClasses1 = uniquePages3.filter(
          (page) =>
            page.is_published &&
            (page.page_type.includes('Classes') ||
              page.page_type.includes('Live Classes') ||
              (page.type === 3 &&
                page.event_date_time.from_date === null &&
                page.event_date_time.to_date === null)),
        )
        const filteredClasses2 = uniquePages4.filter(
          (page) =>
            page.is_published &&
            (page.page_type.includes('Classes') ||
              page.page_type.includes('Live Classes') ||
              (page.type === 3 &&
                page.event_date_time.from_date === null &&
                page.event_date_time.to_date === null)),
        )
        const filteredClasses = [...filteredClasses1, ...filteredClasses2]
        const filteredRentals1 = uniquePages.filter(
          (page) =>
            // page.is_published &&
            page.page_type.includes('Item Rental') ||
            page.page_type.includes('Space Rental'),
        )
        const filteredRentals2 = uniquePages2.filter(
          (page) =>
            // page.is_published &&
            page.page_type.includes('Item Rental') ||
            page.page_type.includes('Space Rental'),
        )
        const filteredRentals3 = uniquePages3.filter(
          (page) =>
            // page.is_published &&
            page.page_type.includes('Item Rental') ||
            page.page_type.includes('Space Rental'),
        )
        const filteredRentals4 = uniquePages4.filter(
          (page) =>
            // page.is_published &&
            page.page_type.includes('Item Rental') ||
            page.page_type.includes('Space Rental'),
        )
        const filteredRentals = [
          ...filteredRentals1,
          ...filteredRentals2,
          ...filteredRentals3,
          ...filteredRentals4,
        ]
        // console.log(
        //   'Type filteredClasses------------------------------->',
        //   filteredClasses,
        // )
        // console.log('Type 4------------------------------->', typeResultFour)

        // Dispatch the unique results to the appropriate actions
        dispatch(
          setTypeResultOne({
            data: typeResultOne,
            message: 'Search completed successfully.',
            success: true,
          }),
        )
        setPeoplePages(typeResultOne)
        if (typeResultOne.length < 20) {
          setHasNoMorePersonPages(true)
        } else {
          setHasNoMorePersonPages(false)
        }
        if (typeResultTwo.length < 20) {
          setHasNoMorePlacePages(true)
        } else {
          setHasNoMorePlacePages(false)
        }
        if (typeResultThree.length < 20) {
          setHasNoMoreProgramPages(true)
        } else {
          setHasNoMoreProgramPages(false)
        }
        if (typeResultFour.length < 20) {
          setHasNoMoreProductPages(true)
        } else {
          setHasNoMoreProductPages(false)
        }
        dispatch(
          setTypeResultTwo({
            data: typeResultTwo,
            message: 'Search completed successfully.',
            success: true,
          }),
        )
        dispatch(
          setTypeResultThree({
            data: typeResultThree,
            message: 'Search completed successfully.',
            success: true,
          }),
        )

        dispatch(
          setTypeResultFour({
            data: typeResultFour,
            message: 'Search completed successfully.',
            success: true,
          }),
        )
        dispatch(
          setClassesResult({
            data: filteredClasses,
            message: 'Search completed successfully.',
            success: true,
          }),
        )
        dispatch(
          setRentalResult({
            data: filteredRentals,
            message: 'Search completed successfully.',
            success: true,
          }),
        )

        // dispatch(setShowPageLoader(false))

        const query = `fields=display,genre&level=1&level=2&level=3&level=4&level=5&search=${searchValue}`
        // dispatch(setShowPageLoader(true))
        // const { res: hobbyRes, err: hobbyErr } = await getAllHobbiesWithoutPagi(
        //   query,
        // )
        // const query2 = `show=true&searchValue=${searchValue}&page=1&limit=20`
        setHobbyPageNum(1)
        // const { res: hobbyRes, err: hobbyErr } = await searchAllHobbies(query2)
        console.log('response----------->', hobbyRes.res)
        console.log('response----------->', hobbyRes.res.status)
        if (hobbyRes.res.status === 200) {
          console.log('SortedHobbies:--------------> ' + hobbyRes.res.data[0])
          dispatch(
            setHobbiesSearchResult({
              data: hobbyRes.res.data,
              message: 'Search completed successfully.',
              success: true,
            }),
          )
          setHobbyPages(hobbyRes.res.data)
          if (hobbyRes.res.data.length < 20) {
            setHasNoMoreHobbies(true)
          } else {
            setHasNoMoreHobbies(false)
          }
        }

        // dispatch(setShowPageLoader(true))
        // const { res: blogRes, err: BlogErr } = await searchBlogs({
        //   search: searchValue,
        // })

        if (blogRes.err) {
          console.error(
            'An error occurred during the page search:',
            blogRes.err,
          )
        } else {
          const blogs = blogRes.res.data

          console.log('blog search results:', blogs)
          dispatch(
            setBlogsSearchResult({
              data: blogs,
              message: 'Search completed successfully.',
              success: true,
            }),
          )
          if (blogs.length < 20) {
            setHasNoMoreBlogsPages(true)
          } else {
            setHasNoMoreBlogsPages(false)
          }
        }

        // const { res: PostRes, err: PostErr } = await searchPosts(searchData)
        if (PostRes.err) {
          console.error(
            'An error occurred during the page search:',
            PostRes.err,
          )
        } else {
          const posts = PostRes.res?.data
          console.log('posts search results:', PostRes?.res.data)
          dispatch(
            setPostsSearchResult({
              data: posts,
              message: 'Search completed successfully.',
              success: true,
            }),
          )
          if (posts.length < 20) {
            setHasNoMorePostsPages(true)
          } else {
            setHasNoMorePostsPages(false)
          }
        }

        dispatch(setSearchLoading(false))
        // dispatch(setShowPageLoader(false))
        dispatch(showAllTrue())
      } catch (error) {
        dispatch(setSearchLoading(false))
        // dispatch(setShowPageLoader(false))
        console.error('An error occurred during the combined search:', error)
      }
    }
    searchResult()
    // }, [queryString])
  }, [queryString, name, postedBy, hobby, location])
  // }, [queryString, filter, name, postedBy, hobby, location])

  const toggleShowAllusers = () => {
    dispatch(toggleShowAllUsers())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'users' },
    })
  }

  const toggleShowAllhobbies = () => {
    dispatch(toggleShowAllHobbies())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'hobby' },
    })
  }

  const toggleShowAllpeople = () => {
    dispatch(toggleShowAllPeople())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'people' },
    })
  }

  const toggleShowAllplace = () => {
    dispatch(toggleShowAllPlace())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'places' },
    })
  }

  const toggleShowAllevent = () => {
    dispatch(toggleShowAllEvent())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'events' },
    })
  }
  const toggleShowAllclasses = () => {
    dispatch(toggleShowAllClasses())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'classes' },
    })
  }
  const toggleShowAllrentals = () => {
    dispatch(toggleShowAllRentals())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'rentals' },
    })
  }

  const toggleShowAllproducts = () => {
    dispatch(toggleShowAllProducts())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'products' },
    })
  }
  const toggleShowAllblogs = () => {
    dispatch(toggleShowAllBlogs())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'blogs' },
    })
  }
  const toggleShowAllposts = () => {
    dispatch(toggleShowAllPosts())
    router.push({
      pathname: '/search',
      query: { ...router.query, filter: 'posts' },
    })
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
      ClassesResults.length === 0 &&
      RentalResults.length === 0 &&
      showAll) ||
    (searchResults.length === 0 && showAllUsers) ||
    (hobbyResults.length === 0 && showAllhobbies) ||
    (peopleResults.length === 0 && showAllPeople) ||
    (placeResults.length === 0 && showAllPlace) ||
    (EventResults.length === 0 && showAllEvent) ||
    (ProductResults.length === 0 && showAllProducts) ||
    (PostsResults.length === 0 && showAllPosts) ||
    (ClassesResults.length === 0 && showAllClasses) ||
    (RentalResults.length === 0 && showAllRentals) ||
    (BlogsResults.length === 0 && showAllBlogs && searchLoading === false)

  const isMobile = useMediaQuery('(max-width:1100px)')

  const fetchMoreUsers = async () => {
    if (isSearchingMore) return
    setIsSearchingMore(true)
    let data = {}
    data = { ...data, is_onboarded: true }
    if (name || hobby || location) {
      if (name) {
        data = { ...data, name: name }
      }
      if (hobby) {
        data = { ...data, hobby: hobby }
      }
      if (location) {
        data = { ...data, location: location }
      }
    } else if (queryString) {
      data = { ...data, searchValue: queryString }
    }

    data = { ...data, page: pageNum + 1, limit: 20 }

    const { res: userRes, err: userErr } = await searchUsers(data)
    if (userErr) {
      setIsSearchingMore(false)
    } else {
      console.log('User result----------------->', userRes)
      if (userRes.data.length === 0) {
        setHasNoMoreUsers(true)
      }
      const newSearchResult: SearchResults<User> = {
        data: [...searchResults, ...userRes.data],
        message: '',
        success: false,
      }
      setUserPages((prevPages) => [...prevPages, ...userRes.data])
      dispatch(setUserSearchResults(newSearchResult))
      setIsSearchingMore(false)
      setPageNum(pageNum + 1)
    }
  }
  const fetchMoreHobbies = async () => {
    const newHobbyPageNum = hobbyPageNum + 1
    console.log(newHobbyPageNum)
    if (isSearchingMore) return
    setIsSearchingMore(true)
    // const newHobbyPageNum = hobbyPageNum + 1
    // console.log(newHobbyPageNum)
    const query = `show=true&searchValue=${queryString}&page=${newHobbyPageNum}&limit=20`

    const { res: hobbyRes, err: hobbyErr } = await searchAllHobbies(query)
    if (hobbyErr) {
      setIsSearchingMore(false)
    } else {
      if (hobbyRes.data.length === 0) {
        setHasNoMoreHobbies(true)
        setIsSearchingMore(false)
        return
      }
      const newSearchResult: SearchResults<hobbies> = {
        data: [...searchResults, ...hobbyRes.data],
        message: 'Search completed successfully.',
        success: true,
      }
      dispatch(setHobbiesSearchResult(newSearchResult))
      setHobbyPages((prevPages) => [...prevPages, ...hobbyRes.data])
      setIsSearchingMore(false)
      setHobbyPageNum(hobbyPageNum + 1)
      console.log('hobbyPageNum', hobbyPageNum + 1)
    }
  }
  const fetchMorePeoplePages = async () => {
    if (isSearchingMore) return
    setIsSearchingMore(true)

    const { res: titleRes, err: titleErr } = await searchPages({
      sort: '-createdAt',
      populate: '_hobbies,_address,product_variant,seller',
      searchValue: queryString,
      title: queryString,
      hobby: queryString,
      location: queryString,
      page: peoplePageNum + 1,
      limit: '20',
      type: '1',
    })
    if (titleErr) {
      console.error('An error occurred during the title search:', titleErr)
      dispatch(setSearchLoading(false))
      return
    }
    const titlePages = titleRes.data // Get title search results
    const uniqueUrls = new Set<string>()
    const uniquePages: any[] = []

    ;[...titlePages].forEach((page) => {
      if (
        page &&
        page.page_url &&
        typeof page.page_url === 'string' &&
        !uniqueUrls.has(page.page_url)
      ) {
        uniqueUrls.add(page.page_url)
        uniquePages.push(page)
      }
    })

    if (titleRes.data.length === 0) {
      setHasNoMorePersonPages(true)
      setIsSearchingMore(false)
      return
    }
    dispatch(
      setTypeResultOne({
        data: [...peopleResults, ...uniquePages],
        message: 'Search completed successfully.',
        success: true,
      }),
    )
    setPeoplePages([...peopleResults, ...uniquePages])

    setIsSearchingMore(false)
    setPeoplePageNum(peoplePageNum + 1)
  }
  const fetchMorePlacePages = async () => {
    if (isSearchingMore) return
    setIsSearchingMore(true)

    const { res: titleRes, err: titleErr } = await searchPages({
      sort: '-createdAt',
      populate: '_hobbies,_address,product_variant,seller',
      searchValue: queryString,
      title: queryString,
      hobby: queryString,
      location: queryString,
      page: placePageNum + 1,
      limit: '20',
      type: '2',
    })
    if (titleErr) {
      console.error('An error occurred during the title search:', titleErr)
      dispatch(setSearchLoading(false))
      return
    }
    const titlePages = titleRes.data // Get title search results
    const uniqueUrls = new Set<string>()
    const uniquePages: any[] = []

    ;[...titlePages].forEach((page) => {
      if (
        page &&
        page.page_url &&
        typeof page.page_url === 'string' &&
        !uniqueUrls.has(page.page_url)
      ) {
        uniqueUrls.add(page.page_url)
        uniquePages.push(page)
      }
    })

    if (titleRes.data.length === 0) {
      setHasNoMorePlacePages(true)
      setIsSearchingMore(false)
      return
    }
    dispatch(
      setTypeResultTwo({
        data: [...placeResults, ...uniquePages],
        message: 'Search completed successfully.',
        success: true,
      }),
    )
    setPlacePages([...placeResults, ...uniquePages])

    setIsSearchingMore(false)
    setPlacePageNum(placePageNum + 1)
  }
  const fetchMoreProgramPages = async () => {
    if (isSearchingMore) return
    setIsSearchingMore(true)

    const { res: titleRes, err: titleErr } = await searchPages({
      sort: '-createdAt',
      populate: '_hobbies,_address,product_variant,seller',
      searchValue: queryString,
      title: queryString,
      hobby: queryString,
      location: queryString,
      page: programPageNum + 1,
      limit: '20',
      type: '3',
    })
    if (titleErr) {
      console.error('An error occurred during the title search:', titleErr)
      dispatch(setSearchLoading(false))
      return
    }
    const titlePages = titleRes.data // Get title search results
    const uniqueUrls = new Set<string>()
    const uniquePages: any[] = []

    ;[...titlePages].forEach((page) => {
      if (
        page &&
        page.page_url &&
        typeof page.page_url === 'string' &&
        !uniqueUrls.has(page.page_url)
      ) {
        uniqueUrls.add(page.page_url)
        uniquePages.push(page)
      }
    })

    if (titleRes.data.length === 0) {
      setHasNoMoreProgramPages(true)
      setIsSearchingMore(false)
      return
    }
    dispatch(
      setTypeResultThree({
        data: [...eventPages, ...uniquePages],
        message: 'Search completed successfully.',
        success: true,
      }),
    )
    setEventPages([...eventPages, ...uniquePages])

    setIsSearchingMore(false)
    setProgramPageNum(programPageNum + 1)
  }
  const fetchMoreProductPages = async () => {
    if (isSearchingMore) return
    setIsSearchingMore(true)

    const { res: titleRes, err: titleErr } = await searchPages({
      sort: '-createdAt',
      populate: '_hobbies,_address,product_variant,seller',
      searchValue: queryString,
      title: queryString,
      hobby: queryString,
      location: queryString,
      page: productPageNum + 1,
      limit: '20',
      type: '4',
    })
    if (titleErr) {
      console.error('An error occurred during the title search:', titleErr)
      dispatch(setSearchLoading(false))
      return
    }
    const titlePages = titleRes.data // Get title search results
    const uniqueUrls = new Set<string>()
    const uniquePages: any[] = []

    ;[...titlePages].forEach((page) => {
      if (
        page &&
        page.page_url &&
        typeof page.page_url === 'string' &&
        !uniqueUrls.has(page.page_url)
      ) {
        uniqueUrls.add(page.page_url)
        uniquePages.push(page)
      }
    })

    if (titleRes.data.length === 0) {
      setHasNoMoreProductPages(true)
      setIsSearchingMore(false)
      return
    }
    dispatch(
      setTypeResultFour({
        data: [...productPages, ...uniquePages],
        message: 'Search completed successfully.',
        success: true,
      }),
    )
    setProductPages([...productPages, ...uniquePages])

    setIsSearchingMore(false)
    setProductPageNum(productPageNum + 1)
  }

  const fetchMorePostsPages = async () => {
    if (isSearchingMore || hasNoMorePostsPages) return
    setIsSearchingMore(true)

    let searchData = {}
    if (queryString) {
      searchData = { ...searchData, searchValue: queryString }
    }
    if (postedBy) {
      searchData = { ...searchData, postedBy: postedBy }
    }
    if (hobby) {
      searchData = { ...searchData, hobby: hobby }
    }
    if (location) {
      searchData = { ...searchData, location: location }
    }
    searchData = {
      ...searchData,
      page: postsPageNum + 1,
      limit: 20,
    }
    const { res: PostRes, err: PostErr } = await searchPosts(searchData)
    if (PostErr) {
      console.error('An error occurred during the post search:', PostErr)
      dispatch(setSearchLoading(false))
      return
    }

    const posts = PostRes.data
    console.log('Posts,..............', posts)

    if (posts.length === 0) {
      // alert('empty')
      setHasNoMorePostsPages(true)
      setIsSearchingMore(false)
      return
    }
    dispatch(
      setPostsSearchResult({
        data: [...PostsResults, ...posts],
        message: 'Search completed successfully.',
        success: true,
      }),
    )
    setIsSearchingMore(false)
    setPostsPageNum(postsPageNum + 1)
  }
  const fetchMoreBlogPages = async () => {
    if (isSearchingMore || hasNoMoreBlogsPages) return
    setIsSearchingMore(true)

    let searchData = {}
    if (queryString) {
      searchData = { ...searchData, searchValue: queryString }
    }
    searchData = {
      ...searchData,
      page: blogsPageNum + 1,
      limit: 20,
    }
    const { res: BlogRes, err: BlogErr } = await searchBlogs(searchData)
    if (BlogErr) {
      console.error('An error occurred during the blog search:', BlogErr)
      dispatch(setSearchLoading(false))
      return
    }

    const blogs = BlogRes.data
    console.log('blogs..............', blogs)

    if (blogs.length === 0) {
      setHasNoMoreBlogsPages(true)
      setIsSearchingMore(false)
      return
    }

    dispatch(
      setBlogsSearchResult({
        data: [...BlogsResults, ...blogs],
        message: 'Search completed successfully.',
        success: true,
      }),
    )
    setIsSearchingMore(false)
    setBlogsPageNum(blogsPageNum + 1)
  }

  useEffect(() => {
    let lastCall = 0
    const handleScroll = () => {
      console.log('Searching more...', isSearchingMore)
      console.log('hobbyPageNum', hobbyPageNum)

      if (isSearchingMore) return
      console.log('Searching more...', isSearchingMore)

      const now = Date.now()

      if (now - lastCall >= 500) {
        // console.log('lastCall---------------->', lastCall)
        // console.log('now------------------------>', now)
        lastCall = now
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000
        ) {
          // if (!hasNoDataPerma) {
          // setHasMore(true)
          // }
          // alert('hiii...')
          console.log('hobbyPageNum', hobbyPageNum)
          // setIsSearchingMore(true)
          if (filter === 'users') {
            fetchMoreUsers()
          } else if (filter === 'hobby') {
            fetchMoreHobbies()
          } else if (filter === 'people') {
            fetchMorePeoplePages()
          } else if (filter === 'places') {
            fetchMorePlacePages()
          } else if (filter === 'programs') {
            fetchMoreProgramPages()
          } else if (filter === 'products') {
            fetchMoreProductPages()
          } else if (filter === 'posts') {
            fetchMorePostsPages()
          } else if (filter === 'blogs') {
            fetchMoreBlogPages()
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [
    fetchMoreUsers,
    fetchMoreHobbies,
    fetchMorePeoplePages,
    fetchMorePlacePages,
    fetchMoreProgramPages,
    fetchMoreProductPages,
  ])

  useEffect(() => {
    setOpenExploreUser(false)
    setOpenExplorePeople(false)
    setOpenExplorePlace(false)
    setOpenExploreProgram(false)
    setOpenExploreProduct(false)
    setOpenExploreClass(false)
    setOpenExploreRental(false)
    setOpenExplorePost(false)
    setCurrUserName('')
    setCurrPostedBy('')
  }, [q, filter])

  return (
    <main className={styles.searchResults}>
      {noResultsFound && searchLoading === false ? (
        // <div className={styles['no-results-wrapper']}>
        //   {queryString === '' ? (
        //     <p>
        //       Use the <strong> Search box</strong> at the top to look for
        //       anything on your hobbies. If you feel we are missing a listing,
        //       you may choose <strong>Add Listing Page</strong> from the menu at
        //       the top right corner. If you need further help, visit the Help
        //       Centre from the above menu.
        //     </p>
        //   ) : (
        //     <p>
        //       {`No results for query "${queryString}" ${
        //         filter ? `and filter "${filter}"` : ''
        //       }. `}
        //       Try shorter or alternate keywords. Or{' '}
        //       <Link href={'/contact'}>contact us</Link> if you feel we are
        //       missing something. For further help,{' '}
        //       <Link href={'/help'}>click here</Link>.
        //     </p>
        //   )}
        // </div>
        <NoResult />
      ) : (
        <div>
          {searchLoading === true && (
            <div className={styles.loaders}>
              <SearchLoader />
              <SearchLoader showBox />
            </div>
          )}

          {/* Hobbies */}
          {!HideHobbies && hobbyPages.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>Hobbies</div>
                {hobbyPages
                  .slice(0, showAllhobbies ? undefined : 3)
                  .map((hobby, index) => (
                    <div
                      className={styles.peopleItem}
                      key={index}
                      onClick={() => navigateToHobby(hobby.slug)}
                      // ref={
                      //   index === hobbyResults.length - 1
                      //     ? lastPostElementRef
                      //     : null

                      // }
                    >
                      <div className={styles.hobbyAvtar}>
                        {/* Render the image */}
                        {hobby.profile_image ? (
                          <div className={styles['border-div']}>
                            <img
                              src={hobby.profile_image}
                              alt={`${hobby.display}'s `}
                            />
                          </div>
                        ) : (
                          <>
                            <div className={`${styles['img-polygon']} `}></div>
                            <svg
                              className={styles.polygonOverlay}
                              viewBox="0 0 160 160"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M80 0L149.282 40V120L80 160L10.718 120V40L80 0Z"
                                fill="#969696"
                                fillOpacity="0.5"
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
                {showAllhobbies && (
                  <div className={styles.loaders}>
                    {!hasNoMoreHobbies ? <SearchLoader /> : ''}
                  </div>
                )}
                {showAllhobbies
                  ? undefined
                  : (hobbyResults.length > 3 ? (
                      <div className={styles['view-more-btn-container']}>
                        <button
                          onClick={toggleShowAllhobbies}
                          className={`${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                        <button
                          onClick={() => router.push('/hobby')}
                          onMouseEnter={() => setExploreHobbyHoved(true)}
                          onMouseLeave={() => setExploreHobbyHoved(false)}
                          className={`${styles['explore-btn']}`}
                        >
                          Explore{' '}
                          <Image
                            src={DropdownWhite}
                            width={16}
                            height={16}
                            alt="Dropdown"
                            className={`${styles.arrowRight}`}
                          />
                          {!exploreHobbyHoved && (
                            <Image
                              src={Dropdown}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrowRight}`}
                            />
                          )}
                        </button>
                      </div>
                    ) : (
                      ''
                    )) || ''}
              </div>
            </section>
          )}

          {/* User  */}
          {!HideUser && userPages.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                <div className={styles.resultHeading}>User Profiles</div>
                {userPages
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
                          {user?.tagline ? (
                            user?.tagline
                          ) : (
                            <UserHobbies user={user} />
                          )}
                        </div>
                        <div className={styles.userLocation}>
                          {user.primary_address?.city || '\u00a0'}
                          {user?.tagline &&
                          user.primary_address?.city &&
                          user?._hobbies?.length > 0
                            ? ' | '
                            : ''}
                          {/* {user?.tagline && <UserHobbies user={user}/>} */}
                          {user?.tagline && (
                            <span className={styles.truncate}>
                              {`${
                                user?._hobbies[0]?.hobby?.display
                                  ? user?._hobbies[0]?.hobby?.display
                                  : ''
                              }${
                                user?._hobbies[0]?.genre?.display
                                  ? ' - ' + user?._hobbies[0]?.genre?.display
                                  : ''
                              }`}
                              {user?._hobbies[1]?.hobby?.display ? ', ' : ''}
                              {`${
                                user?._hobbies[1]?.hobby?.display
                                  ? user?._hobbies[1]?.hobby?.display
                                  : ''
                              }${
                                user?._hobbies[1]?.genre?.display
                                  ? ' - ' + user?._hobbies[1]?.genre?.display
                                  : ''
                              }`}
                              {user?._hobbies[2]?.hobby?.display ? ', ' : ''}
                              {`${
                                user?._hobbies[2]?.hobby?.display
                                  ? user?._hobbies[2]?.hobby?.display
                                  : ''
                              }${
                                user?._hobbies[2]?.genre?.display
                                  ? ' - ' + user?._hobbies[2]?.genre?.display
                                  : ''
                              }${
                                user?._hobbies?.length > 3
                                  ? ' (+' + (user?._hobbies?.length - 3) + ')'
                                  : ''
                              }`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {showAllUsers && (
                  <div className={styles.loaders}>
                    {!hasNoMoreUsers ? <SearchLoader /> : ''}
                  </div>
                )}
                {showAllUsers
                  ? undefined
                  : (userPages.length > 3 ? (
                      <div className={styles['view-more-btn-container']}>
                        <button
                          onClick={toggleShowAllusers}
                          className={`${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                        <button
                          onClick={() => setOpenExploreUser(!openExploreUser)}
                          onMouseEnter={() => setExploreUserHoved(true)}
                          onMouseLeave={() => setExploreUserHoved(false)}
                          className={`${styles['explore-btn']}`}
                        >
                          Explore{' '}
                          <Image
                            src={DropdownWhite}
                            width={16}
                            height={16}
                            alt="Dropdown"
                            className={`${styles.arrow} ${
                              openExploreUser ? `${styles.arrowRotated}` : ''
                            }`}
                          />
                          {!exploreUserHoved && (
                            <Image
                              src={Dropdown}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExploreUser ? `${styles.arrowRotated}` : ''
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    ) : (
                      ''
                    )) || ''}
                <div
                  className={`${styles.userExploreContainer} ${
                    openExploreUser ? styles.visible : styles.hidden
                  }`}
                >
                  <UserExplore
                    currUserName={currUserName}
                    setCurrUserName={setCurrUserName}
                  />
                </div>
                <div
                  className={`${styles.userExploreContainer} ${
                    hasNoMoreUsers
                      ? `${styles.visible} ${styles.singlePageExplore}`
                      : styles.hidden
                  } ${!filter ? styles.hidden : ''}`}
                >
                  <UserExplore
                    currUserName={currUserName}
                    setCurrUserName={setCurrUserName}
                  />
                </div>
              </div>
            </section>
          )}
          {/* People */}
          {!HidePeople && peoplePages.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                {!isExplore && (
                  <div className={styles.resultHeading}>People</div>
                )}
                {peoplePages
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
                          {page?.tagline ? (
                            page?.tagline
                          ) : (
                            <>
                              <span>
                                {`${
                                  page?._hobbies[0]?.hobby?.display
                                    ? page?._hobbies[0]?.hobby?.display
                                    : ''
                                }${
                                  page?._hobbies[0]?.genre?.display
                                    ? ' - ' + page?._hobbies[0]?.genre?.display
                                    : ''
                                }`}
                                {page?._hobbies[1]?.hobby?.display ? ', ' : ''}
                                {`${
                                  page?._hobbies[1]?.hobby?.display
                                    ? page?._hobbies[1]?.hobby?.display
                                    : ''
                                }${
                                  page?._hobbies[1]?.genre?.display
                                    ? ' - ' + page?._hobbies[1]?.genre?.display
                                    : ''
                                }`}
                                {page?._hobbies[2]?.hobby?.display ? ', ' : ''}
                                {`${
                                  page?._hobbies[2]?.hobby?.display
                                    ? page?._hobbies[2]?.hobby?.display
                                    : ''
                                }${
                                  page?._hobbies[2]?.genre?.display
                                    ? ' - ' + page?._hobbies[2]?.genre?.display
                                    : ''
                                }${
                                  page?._hobbies?.length > 3
                                    ? ' (+' + (page?._hobbies?.length - 3) + ')'
                                    : ''
                                }`}
                              </span>
                            </>
                          )}
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
                {showAllPeople && (
                  <div className={styles.loaders}>
                    {!hasNoMorePersonPages ? <SearchLoader /> : ''}
                  </div>
                )}
                {showAllPeople
                  ? undefined
                  : (peopleResults.length > 3 ? (
                      <div className={styles['view-more-btn-container']}>
                        <button
                          onClick={toggleShowAllpeople}
                          className={`${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                        <button
                          onClick={() =>
                            setOpenExplorePeople(!openExplorePeople)
                          }
                          onMouseEnter={() => setExplorePeopleHoved(true)}
                          onMouseLeave={() => setExplorePeopleHoved(false)}
                          className={`${styles['explore-btn']}`}
                        >
                          Explore{' '}
                          <Image
                            src={DropdownWhite}
                            width={16}
                            height={16}
                            alt="Dropdown"
                            className={`${styles.arrow} ${
                              openExplorePeople ? `${styles.arrowRotated}` : ''
                            }`}
                          />
                          {!explorePeopleHoved && (
                            <Image
                              src={Dropdown}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExplorePeople
                                  ? `${styles.arrowRotated}`
                                  : ''
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    ) : (
                      ''
                    )) || ''}
                <div
                  className={`${styles.userExploreContainer} ${
                    openExplorePeople ? styles.visible : styles.hidden
                  }`}
                >
                  <PExplore
                    categoryValue={defaultPeopleCategory}
                    setCategoryValue={setDefaultPeopleCategory}
                  />
                </div>
                <div
                  className={`${styles.userExploreContainer} ${
                    hasNoMorePersonPages
                      ? `${styles.visible} ${styles.singlePageExplore}`
                      : styles.hidden
                  } ${!filter ? styles.hidden : ''}`}
                >
                  <PExplore
                    categoryValue={defaultPeopleCategory}
                    setCategoryValue={setDefaultPeopleCategory}
                  />
                </div>
              </div>
            </section>
          )}
          {/* Place  */}
          {!HidePlace && placeResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                {!isExplore && (
                  <div className={styles.resultHeading}>Places</div>
                )}
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
                          {page?.tagline ? (
                            page?.tagline
                          ) : (
                            <>
                              <span>
                                {`${
                                  page?._address?.society
                                    ? page?._address?.society
                                    : ''
                                }`}
                                {page?._address?.locality ? ', ' : ''}
                                {`${
                                  page?._address?.locality
                                    ? page?._address?.locality
                                    : ''
                                }`}
                                {page?._address?.city ? ', ' : ''}
                                {`${
                                  page?._address?.city
                                    ? page?._address?.city
                                    : ''
                                }`}
                              </span>
                            </>
                          )}
                        </div>
                        <div className={styles.userLocation}>
                          {page?.page_type?.map((pt: string, index: number) => {
                            return `${index > 0 ? ' ' : ''}${pt}`
                          }) +
                            (page._address?.city
                              ? ` | ${page._address?.city}`
                              : '') || '\u00a0'}
                        </div>
                      </div>
                    </div>
                  ))}
                {showAllPlace && (
                  <div className={styles.loaders}>
                    {!hasNoMorePlacePages ? <SearchLoader /> : ''}
                  </div>
                )}
                {showAllPlace
                  ? undefined
                  : (placeResults.length > 3 ? (
                      <div className={styles['view-more-btn-container']}>
                        <button
                          onClick={toggleShowAllplace}
                          className={`${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                        <button
                          onClick={() => setOpenExplorePlace(!openExplorePlace)}
                          onMouseEnter={() => setExplorePlaceHoved(true)}
                          onMouseLeave={() => setExplorePlaceHoved(false)}
                          className={`${styles['explore-btn']}`}
                        >
                          Explore{' '}
                          <Image
                            src={DropdownWhite}
                            width={16}
                            height={16}
                            alt="Dropdown"
                            className={`${styles.arrow} ${
                              openExplorePlace ? `${styles.arrowRotated}` : ''
                            }`}
                          />
                          {!explorePlaceHoved && (
                            <Image
                              src={Dropdown}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExplorePlace ? `${styles.arrowRotated}` : ''
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    ) : (
                      ''
                    )) || ''}
                <div
                  className={`${styles.userExploreContainer} ${
                    openExplorePlace ? styles.visible : styles.hidden
                  }`}
                >
                  <PExplore
                    categoryValue={defaultPlaceCategory}
                    setCategoryValue={setDefaultPlaceCategory}
                  />
                </div>
                <div
                  className={`${styles.userExploreContainer} ${
                    hasNoMorePlacePages
                      ? `${styles.visible} ${styles.singlePageExplore}`
                      : styles.hidden
                  } ${!filter ? styles.hidden : ''}`}
                >
                  <PExplore
                    categoryValue={defaultPlaceCategory}
                    setCategoryValue={setDefaultPlaceCategory}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Event  */}
          {!HideEvent && EventResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                {!isExplore && (
                  <div className={styles.resultHeading}>Programs</div>
                )}
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
                          {page?.tagline ? (
                            page?.tagline
                          ) : (
                            <>
                              <span>
                                {`${
                                  page?._address?.society
                                    ? page?._address?.society
                                    : ''
                                }`}
                                {page?._address?.society &&
                                page?._address?.locality
                                  ? ', '
                                  : ''}
                                {`${
                                  page?._address?.locality
                                    ? page?._address?.locality
                                    : ''
                                }`}
                                {page?._address?.locality &&
                                page?._address?.city
                                  ? ', '
                                  : ''}
                                {`${
                                  page?._address?.city
                                    ? page?._address?.city
                                    : ''
                                }`}
                              </span>
                            </>
                          )}
                        </div>
                        <div className={styles.programDetails}>
                          <div className={styles.address}>
                            {page?.page_type?.map(
                              (pt: string, index: number) => {
                                return `${index > 0 ? ' ' : ''}${pt}`
                              },
                            ) +
                              (page._address?.city
                                ? ` | ${page._address?.city}`
                                : '') || '\u00a0'}
                          </div>

                          <>
                            {page?.event_date_time &&
                              page?.event_date_time.length !== 0 && (
                                <span>
                                  {' | '}
                                  {formatDateRange(page?.event_date_time[0])}
                                  {/* {!isMobile && (
                                    <>
                                      {', '}
                                      {page?.event_date_time[0]?.from_time +
                                        ' - '}
                                      {page?.event_weekdays?.length > 0 ? (
                                        <>
                                          ...
                                          <span
                                            className={styles['purpleText']}
                                          >
                                            more
                                          </span>
                                        </>
                                      ) : (
                                        page?.event_date_time[0]?.to_time
                                      )}
                                    </>
                                  )} */}
                                </span>
                              )}
                          </>
                        </div>
                      </div>
                    </div>
                  ),
                )}
                {showAllEvent && (
                  <div className={styles.loaders}>
                    {!hasNoMoreProgramPages ? <SearchLoader /> : ''}
                  </div>
                )}
                <div
                  className={`${styles.userExploreContainer} ${
                    hasNoMoreProgramPages && filter
                      ? `${styles.visible} ${styles.singlePageExplore}`
                      : styles.hidden
                  } `}
                >
                  <PExplore
                    categoryValue={defaultProgramCategory}
                    setCategoryValue={setDefaultProgramCategory}
                  />
                </div>
                {showAllEvent
                  ? undefined
                  : (EventResults.length > 3 ? (
                      <div className={styles['view-more-btn-container']}>
                        <button
                          onClick={toggleShowAllevent}
                          className={`${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                        <button
                          onClick={() =>
                            setOpenExploreProgram(!openExploreProgram)
                          }
                          onMouseEnter={() => setExploreProgramHoved(true)}
                          onMouseLeave={() => setExploreProgramHoved(false)}
                          className={`${styles['explore-btn']}`}
                        >
                          Explore{' '}
                          <Image
                            src={DropdownWhite}
                            width={16}
                            height={16}
                            alt="Dropdown"
                            className={`${styles.arrow} ${
                              openExploreProgram ? `${styles.arrowRotated}` : ''
                            }`}
                          />
                          {!exploreProgramHoved && (
                            <Image
                              src={Dropdown}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExploreProgram
                                  ? `${styles.arrowRotated}`
                                  : ''
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    ) : (
                      ''
                    )) || ''}
                <div
                  className={`${styles.userExploreContainer} ${
                    openExploreProgram
                      ? styles.visible
                      : styles.hidden
                  } `}
                >
                  <PExplore
                    categoryValue={defaultProgramCategory}
                    setCategoryValue={setDefaultProgramCategory}
                  />
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
                  {!isExplore && (
                    <div className={styles.resultHeading}>Products</div>
                  )}

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
                            {page?.tagline ? (
                              page?.tagline
                            ) : (
                              <>
                                <span>
                                  {`${
                                    page?._hobbies[0]?.hobby?.display
                                      ? page?._hobbies[0]?.hobby?.display
                                      : ''
                                  }${
                                    page?._hobbies[0]?.genre?.display
                                      ? ' - ' +
                                        page?._hobbies[0]?.genre?.display
                                      : ''
                                  }`}
                                  {page?._hobbies[1]?.hobby?.display
                                    ? ', '
                                    : ''}
                                  {`${
                                    page?._hobbies[1]?.hobby?.display
                                      ? page?._hobbies[1]?.hobby?.display
                                      : ''
                                  }${
                                    page?._hobbies[1]?.genre?.display
                                      ? ' - ' +
                                        page?._hobbies[1]?.genre?.display
                                      : ''
                                  }`}
                                  {page?._hobbies[2]?.hobby?.display
                                    ? ', '
                                    : ''}
                                  {`${
                                    page?._hobbies[2]?.hobby?.display
                                      ? page?._hobbies[2]?.hobby?.display
                                      : ''
                                  }${
                                    page?._hobbies[2]?.genre?.display
                                      ? ' - ' +
                                        page?._hobbies[2]?.genre?.display
                                      : ''
                                  }${
                                    page?._hobbies?.length > 3
                                      ? ' (+' +
                                        (page?._hobbies?.length - 3) +
                                        ')'
                                      : ''
                                  }`}
                                </span>
                              </>
                            )}
                          </div>
                          <div
                            className={`${styles.userLocation} ${inter.className}`}
                          >
                            {page?.page_type?.map(
                              (pt: string, index: number) => {
                                return `${index > 0 ? ' ' : ''}${pt}`
                              },
                            ) +
                              (page?.product_variant?.variations[0]?.value
                                ? ` | ₹${page?.product_variant?.variations[0]?.value}`
                                : ` | ₹0`) || '\u00a0'}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  {showAllProducts && (
                    <div className={styles.loaders}>
                      {!hasNoMoreProductPages ? <SearchLoader /> : ''}
                    </div>
                  )}
                  {showAllProducts
                    ? undefined
                    : (ProductResults.length > 3 ? (
                        <div className={styles['view-more-btn-container']}>
                          <button
                            onClick={toggleShowAllproducts}
                            className={`${styles['view-more-btn']}`}
                          >
                            View More
                          </button>
                          <button
                            onClick={() =>
                              setOpenExploreProduct(!openExploreProduct)
                            }
                            onMouseEnter={() => setExploreProductHoved(true)}
                            onMouseLeave={() => setExploreProductHoved(false)}
                            className={`${styles['explore-btn']}`}
                          >
                            Explore{' '}
                            <Image
                              src={DropdownWhite}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExploreProduct
                                  ? `${styles.arrowRotated}`
                                  : ''
                              }`}
                            />
                            {!exploreProductHoved && (
                              <Image
                                src={Dropdown}
                                width={16}
                                height={16}
                                alt="Dropdown"
                                className={`${styles.arrow} ${
                                  openExploreProduct
                                    ? `${styles.arrowRotated}`
                                    : ''
                                }`}
                              />
                            )}
                          </button>
                        </div>
                      ) : (
                        ''
                      )) || ''}
                  <div
                    className={`${styles.userExploreContainer} ${
                      openExploreProduct ? styles.visible : styles.hidden
                    }`}
                  >
                    <PExplore
                      categoryValue={defaultProductCategory}
                      setCategoryValue={setDefaultProductCategory}
                    />
                  </div>
                  <div
                    className={`${styles.userExploreContainer} ${
                      hasNoMoreProductPages
                        ? `${styles.visible} ${styles.singlePageExplore}`
                        : styles.hidden
                    } ${!filter ? styles.hidden : ''}`}
                  >
                    <PExplore
                      categoryValue={defaultProductCategory}
                      setCategoryValue={setDefaultProductCategory}
                    />
                  </div>
                </div>
              </section>
            )}
          {/* Classes  */}
          {!HideClasses &&
            ClassesResults.length > 0 &&
            searchLoading === false && (
              <section className={styles.userSection}>
                <div className={styles.peopleItemsContainer}>
                  {!isExplore && (
                    <div className={styles.resultHeading}>Classes</div>
                  )}
                  {ClassesResults.slice(0, showAllClasses ? undefined : 3).map(
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
                            {page?.tagline ? (
                              page?.tagline
                            ) : (
                              <>
                                <span>
                                  {`${
                                    page?._address?.society
                                      ? page?._address?.society
                                      : ''
                                  }`}
                                  {page?._address?.society &&
                                  page?._address?.locality
                                    ? ', '
                                    : ''}
                                  {`${
                                    page?._address?.locality
                                      ? page?._address?.locality
                                      : ''
                                  }`}
                                  {page?._address?.locality &&
                                  page?._address?.city
                                    ? ', '
                                    : ''}
                                  {`${
                                    page?._address?.city
                                      ? page?._address?.city
                                      : ''
                                  }`}
                                </span>
                              </>
                            )}
                          </div>
                          <div className={styles.blogAuthor}>
                            <div className={styles.address}>
                              {page?.page_type?.map(
                                (pt: string, index: number) => {
                                  return `${index > 0 ? ' ' : ''}${pt}`
                                },
                              ) +
                                (page._address?.city
                                  ? ` | ${page._address?.city}`
                                  : '') || '\u00a0'}
                            </div>

                            <>
                              {page?.event_date_time &&
                                page?.event_date_time.length !== 0 && (
                                  <span>
                                    {' | '}
                                    {formatDateRange(page?.event_date_time[0])}
                                  </span>
                                )}
                            </>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  {showAllClasses
                    ? undefined
                    : (ClassesResults.length > 3 ? (
                        <div className={styles['view-more-btn-container']}>
                          <button
                            onClick={toggleShowAllclasses}
                            className={`${styles['view-more-btn']}`}
                          >
                            View More
                          </button>
                          <button
                            onClick={() =>
                              setOpenExploreClass(!openExploreClass)
                            }
                            onMouseEnter={() => setExploreClassHoved(true)}
                            onMouseLeave={() => setExploreClassHoved(false)}
                            className={`${styles['explore-btn']}`}
                          >
                            Explore{' '}
                            <Image
                              src={DropdownWhite}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExploreClass ? `${styles.arrowRotated}` : ''
                              }`}
                            />
                            {!exploreClassHoved && (
                              <Image
                                src={Dropdown}
                                width={16}
                                height={16}
                                alt="Dropdown"
                                className={`${styles.arrow} ${
                                  openExploreClass
                                    ? `${styles.arrowRotated}`
                                    : ''
                                }`}
                              />
                            )}
                          </button>
                        </div>
                      ) : (
                        ''
                      )) || ''}
                  <div
                    className={`${styles.userExploreContainer} ${
                      openExploreClass ? styles.visible : styles.hidden
                    }`}
                  >
                    <PExplore
                      categoryValue={defaultClassCategory}
                      setCategoryValue={setDefaultClassCategory}
                    />
                  </div>
                  {/* <div
                  className={`${styles.userExploreContainer} ${hasNoMoreProgramPages ? `${styles.visible} ${styles.singlePageExplore}`:styles.hidden} ${!filter ? styles.hidden : ''}`}
                >
                  <PExplore
                    categoryValue={defaultProgramCategory}
                    setCategoryValue={setDefaultProgramCategory}
                  />
                </div> */}
                </div>
              </section>
            )}
          {/* Rentals  */}
          {!HideRentals &&
            RentalResults.length > 0 &&
            searchLoading === false && (
              <section className={styles.userSection}>
                <div className={styles.peopleItemsContainer}>
                  {!isExplore && (
                    <div className={styles.resultHeading}>Rentals</div>
                  )}
                  {RentalResults.slice(0, showAllRentals ? undefined : 3).map(
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
                            {page?.tagline ? (
                              page?.tagline
                            ) : (
                              <>
                                <span>
                                  {`${
                                    page?._hobbies[0]?.hobby?.display
                                      ? page?._hobbies[0]?.hobby?.display
                                      : ''
                                  }${
                                    page?._hobbies[0]?.genre?.display
                                      ? ' - ' +
                                        page?._hobbies[0]?.genre?.display
                                      : ''
                                  }`}
                                  {page?._hobbies[1]?.hobby?.display
                                    ? ', '
                                    : ''}
                                  {`${
                                    page?._hobbies[1]?.hobby?.display
                                      ? page?._hobbies[1]?.hobby?.display
                                      : ''
                                  }${
                                    page?._hobbies[1]?.genre?.display
                                      ? ' - ' +
                                        page?._hobbies[1]?.genre?.display
                                      : ''
                                  }`}
                                  {page?._hobbies[2]?.hobby?.display
                                    ? ', '
                                    : ''}
                                  {`${
                                    page?._hobbies[2]?.hobby?.display
                                      ? page?._hobbies[2]?.hobby?.display
                                      : ''
                                  }${
                                    page?._hobbies[2]?.genre?.display
                                      ? ' - ' +
                                        page?._hobbies[2]?.genre?.display
                                      : ''
                                  }`}
                                </span>
                              </>
                            )}
                          </div>
                          <div className={styles.userLocation}>
                            {page?.page_type?.map(
                              (pt: string, index: number) => {
                                return `${index > 0 ? ' ' : ''}${pt}`
                              },
                            ) +
                              (page._address?.city
                                ? ` | ${page._address?.city}`
                                : '') || '\u00a0'}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  {showAllRentals
                    ? undefined
                    : (RentalResults.length > 3 ? (
                        <div className={styles['view-more-btn-container']}>
                          <button
                            onClick={toggleShowAllrentals}
                            className={`${styles['view-more-btn']}`}
                          >
                            View More
                          </button>
                          <button
                            onClick={() =>
                              setOpenExploreRental(!openExploreRental)
                            }
                            onMouseEnter={() => setExploreRentalHoved(true)}
                            onMouseLeave={() => setExploreRentalHoved(false)}
                            className={`${styles['explore-btn']}`}
                          >
                            Explore{' '}
                            <Image
                              src={DropdownWhite}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExploreRental
                                  ? `${styles.arrowRotated}`
                                  : ''
                              }`}
                            />
                            {!exploreRentalHoved && (
                              <Image
                                src={Dropdown}
                                width={16}
                                height={16}
                                alt="Dropdown"
                                className={`${styles.arrow} ${
                                  openExploreRental
                                    ? `${styles.arrowRotated}`
                                    : ''
                                }`}
                              />
                            )}
                          </button>
                        </div>
                      ) : (
                        ''
                      )) || ''}
                  <div
                    className={`${styles.userExploreContainer} ${
                      openExploreRental ? styles.visible : styles.hidden
                    }`}
                  >
                    <PExplore
                      categoryValue={defaultRentalCategory}
                      setCategoryValue={setDefaultRentalCategory}
                    />
                  </div>
                  {/* <div
                  className={`${styles.userExploreContainer} ${hasNoMoreProgramPages ? `${styles.visible} ${styles.singlePageExplore}`:styles.hidden} ${!filter ? styles.hidden : ''}`}
                >
                  <PExplore
                    categoryValue={defaultProgramCategory}
                    setCategoryValue={setDefaultProgramCategory}
                  />
                </div> */}
                </div>
              </section>
            )}
          {/* Posts  */}
          {!HidePosts && PostsResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                {!isExplore && (
                  <div className={styles.resultHeading}>Posts</div>
                )}
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
                          {page?.author_type === 'User'
                            ? page?._author?.full_name
                            : page?._author?.title}
                        </div>
                        <div className={styles.userTagline}>
                          {convertDateToString(page?.createdAt) || '\u00a0'}
                          {' | '}
                          {page?._allHobbies?._hobby1?.display ? (
                            <>
                              {`${page?._allHobbies?._hobby1?.display}${
                                page?._allHobbies?._genre1?.display
                                  ? ' - ' + page?._allHobbies?._genre1?.display
                                  : ''
                              }`}
                              {page?._allHobbies?._hobby2?.display ? ', ' : ''}
                              {`${
                                page?._allHobbies?._hobby2?.display
                                  ? page?._allHobbies?._hobby2?.display
                                  : ''
                              }${
                                page?._allHobbies?._genre2?.display
                                  ? ' - ' + page?._allHobbies?._genre2?.display
                                  : ''
                              }`}
                              {page?._allHobbies?._hobby3?.display ? ', ' : ''}
                              {`${
                                page?._allHobbies?._hobby3?.display
                                  ? page?._allHobbies?._hobby3?.display
                                  : ''
                              }${
                                page?._allHobbies?._genre3?.display
                                  ? ' - ' + page?._allHobbies?._genre3?.display
                                  : ''
                              }`}
                            </>
                          ) : (
                            <span>{`${page?._hobby?.display}${
                              page._genre ? ' - ' + page?._genre?.display : ''
                            }`}</span>
                          )}
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
                {showAllPosts && (
                  <div className={styles.loaders}>
                    {!hasNoMorePostsPages ? <SearchLoader /> : ''}
                  </div>
                )}
                {showAllPosts
                  ? undefined
                  : (PostsResults.length > 3 ? (
                      // toggleShowAllposts
                      <div className={styles['view-more-btn-container']}>
                        <button
                          onClick={toggleShowAllposts}
                          className={`${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                        <button
                          onClick={() => setOpenExplorePost(!openExplorePost)}
                          onMouseEnter={() => setExplorePostHoved(true)}
                          onMouseLeave={() => setExplorePostHoved(false)}
                          className={`${styles['explore-btn']}`}
                        >
                          Explore{' '}
                          <Image
                            src={DropdownWhite}
                            width={16}
                            height={16}
                            alt="Dropdown"
                            className={`${styles.arrow} ${
                              openExplorePost ? `${styles.arrowRotated}` : ''
                            }`}
                          />
                          {!explorePostHoved && (
                            <Image
                              src={Dropdown}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrow} ${
                                openExplorePost ? `${styles.arrowRotated}` : ''
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    ) : (
                      ''
                    )) || ''}
                <div
                  className={`${styles.userExploreContainer} ${
                    openExplorePost ? styles.visible : styles.hidden
                  }`}
                >
                  <PostExplore
                    currPostedBy={currPostedBy}
                    setCurrPostedBy={setCurrPostedBy}
                  />
                </div>
                <div
                  className={`${styles.userExploreContainer} ${
                    hasNoMorePostsPages
                      ? `${styles.visible} ${styles.singlePageExplore}`
                      : styles.hidden
                  } ${!filter ? styles.hidden : ''}`}
                >
                  <PostExplore
                    currPostedBy={currPostedBy}
                    setCurrPostedBy={setCurrPostedBy}
                  />
                </div>
              </div>
            </section>
          )}
          {/* Blogs  */}
          {!HideBlogs && BlogsResults.length > 0 && searchLoading === false && (
            <section className={styles.userSection}>
              <div className={styles.peopleItemsContainer}>
                {!isExplore && (
                  <div className={styles.resultHeading}>Blogs</div>
                )}
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
                        <div className={styles.blogAuthor}>
                          <div className={styles.full_name}>
                            {page?.author?.full_name}{' '}
                          </div>
                          <div>
                            {page.createdAt
                              ? ' | ' + formatDateTimeThree(page.createdAt)
                              : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
                {showAllBlogs && (
                  <div className={styles.loaders}>
                    {!hasNoMoreBlogsPages ? <SearchLoader /> : ''}
                  </div>
                )}
                {showAllBlogs
                  ? undefined
                  : (BlogsResults.length > 3 ? (
                      <div className={styles['view-more-btn-container']}>
                        <button
                          onClick={toggleShowAllblogs}
                          className={`${styles['view-more-btn']}`}
                        >
                          View More
                        </button>
                        <button
                          onClick={() => router.push('/blog')}
                          onMouseEnter={() => setExploreBlogHoved(true)}
                          onMouseLeave={() => setExploreBlogHoved(false)}
                          className={`${styles['explore-btn']}`}
                        >
                          Explore{' '}
                          <Image
                            src={DropdownWhite}
                            width={16}
                            height={16}
                            alt="Dropdown"
                            className={`${styles.arrowRight}`}
                          />
                          {!exploreBlogHoved && (
                            <Image
                              src={Dropdown}
                              width={16}
                              height={16}
                              alt="Dropdown"
                              className={`${styles.arrowRight}`}
                            />
                          )}
                        </button>
                      </div>
                    ) : (
                      ''
                    )) || ''}
              </div>
            </section>
          )}
          {/* More Loading */}
          {moreLoading && (
            <div className={styles.loaders}>
              <SearchLoader />
              <SearchLoader showBox />
            </div>
          )}
        </div>
      )}
    </main>
  )
}

const FilterDropdown: React.FC<Props> = () => {
  const router = useRouter()
  const { q, filter } = router.query
  const [activeFilter, setActiveFilter] = useState('all')
  const dispatch = useDispatch()
  const isExplore = useSelector((state: RootState) => state.search.explore)
  // const showAll = useSelector((state: any) => state.search.showAll)
  // const showAllUsers = useSelector((state: any) => state.search.showAllUsers)
  // const showAllhobbies = useSelector(
  //   (state: any) => state.search.showAllhobbies,
  // )
  // const showAllPeople = useSelector((state: any) => state.search.showAllPeople)
  // const showAllPlace = useSelector((state: any) => state.search.showAllPlace)
  // const showAllEvent = useSelector((state: any) => state.search.showAllEvent)
  // const showAllProducts = useSelector(!
  //   (state: any) => state.search.showAllProducts,
  // )
  // const showAllPosts = useSelector((state: any) => state.search.showAllPosts)
  // const showAllBlogs = useSelector((state: any) => state.search.showAllBlogs)

  const showAll = !filter || filter === 'all' || filter === ''
  const showAllUsers = filter === 'users'
  const showAllPeople = filter === 'people'
  const showAllPlace = filter === 'places'
  const showAllEvent = filter === 'programs'
  const showAllProducts = filter === 'products'
  const showAllPosts = filter === 'posts'
  const showAllBlogs = filter === 'blogs'
  const showAllHobbies = filter === 'hobby'

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
    if (showAllHobbies) {
      setActiveFilter('hobby')
    }
  }, [showAllHobbies])
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

  useEffect(() => {
    if (showAll === true) {
      setActiveFilter('all')
    } else if (showAllUsers === true) {
      setActiveFilter('users')
    } else if (showAllHobbies === true) {
      setActiveFilter('hobby')
    } else if (showAllPeople === true) {
      setActiveFilter('people')
    } else if (showAllPlace === true) {
      setActiveFilter('places')
    } else if (showAllEvent === true) {
      setActiveFilter('events')
    } else if (showAllProducts === true) {
      setActiveFilter('products')
    } else if (showAllBlogs === true) {
      setActiveFilter('blogs')
    } else if (showAllPosts === true) {
      setActiveFilter('posts')
    }
  }, [
    showAll,
    showAllEvent,
    showAllPeople,
    showAllPlace,
    showAllProducts,
    showAllUsers,
    showAllHobbies,
    showAllBlogs,
    showAllPosts,
  ])

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
    if (filterType === 'all') {
      const { filter, ...rest } = router.query
      router.push({
        pathname: '/search',
        query: {
          ...rest,
        },
      })
    } else {
      router.push({
        pathname: '/search',
        query: {
          ...router.query,
          filter: filterType,
        },
      })
    }
  }

  return (
    <Select
      disabled={isExplore}
      className={styles.filterDropdown}
      value={activeFilter}
    >
      <MenuItem
        onClick={() => handleFilterClick('all')}
        value="all"
        // style={{ display: 'flex', alignItems: 'center', gap: 16 }}
      >
        <div className={styles.responsiveMenuItem}>
          <Image src={hobbycue} alt="hobbycue" />
          <span>All of HobbyCue</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('users')} value="users">
        <div className={styles.responsiveMenuItem}>
          <Image src={UserSvg} alt="User" />
          <span>Users</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('hobby')} value="hobby">
        <div className={styles.responsiveMenuItem}>
          <Image src={Hobby} alt="hobby" />
          <span>Hobbies</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('people')} value="people">
        <div className={styles.responsiveMenuItem}>
          <Image src={People} alt="People" />
          <span>People Pages</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('places')} value="places">
        <div className={styles.responsiveMenuItem}>
          <Image src={Place} alt="Place" />
          <span>Places</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('events')} value="events">
        <div className={styles.responsiveMenuItem}>
          <Image src={Program} alt="Program" />
          <span>Programs</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('products')} value="products">
        <div className={styles.responsiveMenuItem}>
          <Image src={Product} alt="Product" />
          <span>Products</span>
        </div>
      </MenuItem>
      {/* <MenuItem onClick={() => handleFilterClick('posts')} value="posts">
        Posts
      </MenuItem> */}
      <MenuItem onClick={() => handleFilterClick('blogs')} value="blogs">
        <div className={styles.responsiveMenuItem}>
          <Image src={Blogs} alt="Blogs" />
          <span>Blogs</span>
        </div>
      </MenuItem>
    </Select>
  )
}

const Search: React.FC<Props> = ({ data, children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [showExploreMoreMobile, setShowExploreMoreMobile] = useState(false)
  const [seeMoreWhatsNew, setSeeMoreWhatsNew] = useState(true)
  const exploreMoreRef = useRef<HTMLDivElement | null>(null)
  const mainContentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (exploreMoreRef.current && mainContentRef.current) {
      if (showExploreMoreMobile) {
        exploreMoreRef.current.style.height = `${mainContentRef.current.scrollHeight}px`
      } else {
        exploreMoreRef.current.style.height = '0px'
      }
    }
  }, [showExploreMoreMobile, seeMoreWhatsNew])

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
  const ClassesSearch = useSelector(
    (state: RootState) => state.search.classesResult.data,
  )
  const RentalSearch = useSelector(
    (state: RootState) => state.search.rentalResult.data,
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const searchLoading = useSelector((state: RootState) => state.search.loading)

  const router = useRouter()

  const { q, filter } = router.query

  const queryString = q?.toString() || ''

  const showAll = filter ? filter === '' : true
  const showAllUsers = filter === 'users'
  const showAllPeople = filter === 'people'
  const showAllPlace = filter === 'places'
  const showAllEvent = filter === 'programs'
  const showAllProducts = filter === 'products'
  const showAllPosts = filter === 'posts'
  const showAllBlogs = filter === 'blogs'
  const showAllHobbies = filter === 'hobby'
  const showAllClasses = filter === 'classes'
  const showAllRentals = filter === 'rentals'

  const noResultsFound =
    (userSearchResults.length === 0 &&
      hobbySearchResults.length === 0 &&
      PeopleSearch.length === 0 &&
      PlaceSearch.length === 0 &&
      EventSearch.length === 0 &&
      ProductSearch.length === 0 &&
      PostsSearch.length === 0 &&
      BlogsSearch.length === 0 &&
      ClassesSearch.length === 0 &&
      RentalSearch.length === 0 &&
      showAll) ||
    (userSearchResults.length === 0 && showAllUsers) ||
    (hobbySearchResults.length === 0 && showAllHobbies) ||
    (PeopleSearch.length === 0 && showAllPeople) ||
    (PlaceSearch.length === 0 && showAllPlace) ||
    (EventSearch.length === 0 && showAllEvent) ||
    (ProductSearch.length === 0 && showAllProducts) ||
    (PostsSearch.length === 0 && showAllPosts) ||
    (ClassesSearch.length === 0 && showAllClasses) ||
    (RentalSearch.length === 0 && showAllRentals) ||
    (BlogsSearch.length === 0 && showAllBlogs && searchLoading === false)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - Search</title>
      </Head>
      <PageGridLayout column={3} customStyles={styles['pageGridSearch']}>
        {isMobile ? (
          <aside className={`custom-scrollbar ${styles['profile-left-aside']}`}>
            <FilterDropdown />
            <span
              style={{ display: 'flex' }}
              onClick={() => setShowExploreMoreMobile(!showExploreMoreMobile)}
              className={
                showExploreMoreMobile
                  ? styles.doubleArrowDown
                  : styles.doubleArrowUp
              }
            >
              <DoubleDownArrow />
            </span>
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
            ClassesResults={ClassesSearch || []}
            RentalResults={RentalSearch || []}
            PostsResults={PostsSearch || []}
            BlogsResults={BlogsSearch || []}
          />
        </main>
        {isMobile ? (
          <div
            className={
              showExploreMoreMobile ? styles['visible'] : styles['not-visible']
            }
            ref={exploreMoreRef}
          >
            <aside className={styles['aside-two']} ref={mainContentRef}>
              <ExploreMoreBtn
                text="Explore More"
                // href="/explore"
                icon={<ExploreIcon />}
              />
              <InterestedDiv
                seeMoreWhatsNew={seeMoreWhatsNew}
                setSeeMoreWhatsNew={setSeeMoreWhatsNew}
              />
              <ExploreSidebarBtn
                text="Help Center"
                href="/help"
                icon={<QuestionIcon />}
              />
            </aside>
          </div>
        ) : (
          <aside className={styles['aside-two']}>
            <ExploreMoreBtn text="Explore More" icon={<ExploreIcon />} />
            <InterestedDiv
              seeMoreWhatsNew={seeMoreWhatsNew}
              setSeeMoreWhatsNew={setSeeMoreWhatsNew}
            />
            <ExploreSidebarBtn
              text="Help Center"
              href="/help"
              icon={<QuestionIcon />}
            />
          </aside>
        )}
      </PageGridLayout>
    </>
  )
}

export default Search
