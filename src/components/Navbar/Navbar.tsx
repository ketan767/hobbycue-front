'use client'

import React, { useRef, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
// import SearchIcon from '@mui/icons-material/Search'

import Image from 'next/image'
import {
  getAllEvents,
  getListingPages,
  searchPages,
} from '@/services/listing.service'
import {
  setUserSearchResults,
  setTypeResultOne,
  setTypeResultTwo,
  setTypeResultThree,
  setSearchString,
  setHobbiesSearchResult,
  Page,
  showAllProductsTrue,
  showAllPeopleTrue,
  showAllPlaceTrue,
  showAllEventTrue,
  showAllUsersTrue,
  showAllTrue,
  resetSearch,
  setExplore,
  setSearchLoading,
  setTypeResultFour,
  setPostsSearchResult,
  setBlogsSearchResult,
  showAllBlogsTrue,
  showAllPostsTrue,
  toggleShowAllBlogs,
  toggleShowAllPosts,
  toggleShowAllProducts,
  toggleShowAllEvent,
  toggleShowAllPlace,
  toggleShowAllPeople,
  toggleShowAll,
} from '@/redux/slices/search'
import LogoFull from '@/assets/image/logo-full.svg'
import LogoSmall from '@/assets/image/logo-small.png'
import HomeIcon from '@/assets/image/navbar-home-icon.png'
import ExploreIcon from '@/assets/image/navbar-explore-icon.png'
import HobbyIcon from '@/assets/image/navbar-hobby-icon.png'
import BookmarksIcon from '@/assets/image/navbar-bookmark-icon.png'
import Search from '@/assets/svg/search.svg'
import SearchIcon from '@/assets/svg/search-small.svg'
import BellIcon from '@/assets/svg/bell.svg'
import CartIcon from '@/assets/image/navbar-cart-icon.png'
import NotificationIcon from '@/assets/image/navbar-notification-icon.png'
import BarsIcon from '@/assets/svg/bars.svg'
import { addSearchHistory, searchUsers } from '@/services/user.service'
import styles from './Navbar.module.css'
import OutlinedButton from '../_buttons/OutlinedButton'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import { updateIsLoggedIn } from '@/redux/slices/user'
import Link from 'next/link'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import store, { RootState } from '@/redux/store'
import { getAllHobbies } from '@/services/hobby.service'
import { useRouter } from 'next/router'
import { logout } from '@/helper'
import SideMenu from './SideMenu/SideMenu'
import CustomizedTooltips from './../Tooltip/ToolTip'
import pages from '@/pages/community/pages'

import PreLoader from '@/components/PreLoader'

import hobbycueLogo from '@/assets/svg/Search/hobbycue.svg'
import { setShowPageLoader } from '@/redux/slices/site'
import { usePathname } from 'next/navigation'
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar'
import { useMediaQuery } from '@mui/material'
import { getAllPosts, searchPosts } from '@/services/post.service'
import { getAllBlogs, searchBlogs } from '@/services/blog.services'
import {
  setCategory,
  setHobby,
  setKeyword,
  setLocation,
  setPageType,
  setSearching,
} from '@/redux/slices/explore'
import { setFilters } from '@/redux/slices/post'
import BookmarkIcon from '@/assets/icons/BookmarkIcon'

type Props = {}

interface SearchCriteria {
  full_name?: string
  tagline?: string
  city?: string
  title?: string
}

type SearchInput = {
  search: InputData<string>
}

export const Navbar: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { q, filter } = router.query
  const [menuActive, setMenuActive] = useState(false)
  const [isWriting, setIsWriting] = useState(false)
  const [hasShadow, setHasShadow] = useState(true)

  const pathname = usePathname()

  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const { activeModal } = useSelector((state: RootState) => state.modal)
  const { sidemenuRefresh, searchToggleRefresh } = useSelector(
    (state: RootState) => state.site,
  )

  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [showDropdown, setShowDropdown] = useState<
    'user-menu' | 'hobby-list' | 'explore-list' | null
  >(null)
  useEffect(() => {
    if (!router.pathname.includes('search')) {
      setData((prev) => ({
        ...prev,
        search: { value: '', error: null },
      }))
    } else {
      if (q) {
        setData((prev) => ({
          ...prev,
          search: { value: q.toString(), error: null },
        }))
      } else {
        setData((prev) => ({
          ...prev,
          search: { value: data.search.value, error: null },
        }))
      }
    }
  }, [q, router.pathname])

  // useEffect(() => {
  //   if (!(router.asPath === '/explore')) {
  //     setData((prev) => ({
  //       ...prev,
  //       search: { value: '', error: null },
  //     }))
  //   }
  // }, [router.asPath])

  useEffect(() => {
    if (router.pathname.includes('explore')) {
      setHasShadow(false)
    } else {
      setHasShadow(true)
    }
  }, [router.pathname])

  const handleLogout = () => {
    logout()
    setShowDropdown(null)
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }

  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLFormElement>(null)
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false)

  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible)

    if (!isSearchInputVisible) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    searchResult()
    setIsSearchInputVisible(false)
  }

  const searchResult = () => {
    const val = data.search.value.trim()
    if (val) {
      router.push({ pathname: '/search', query: { q: val } })
    } else {
      router.push('/search')
    }
  }

  useEffect(() => {
    const handleBackButton = () => {
      if (isSearchInputVisible) {
        setIsSearchInputVisible(false)
        return false
      }
      return true
    }

    router.beforePopState(handleBackButton)

    return () => {
      router.beforePopState(() => true)
    }
  }, [isSearchInputVisible, router])

  useEffect(() => {
    setShowDropdown(null)
  }, [router.pathname])

  const toggleMenu = () => {
    setMenuActive(!menuActive)
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      mobileSearchRef.current &&
      !mobileSearchRef.current.contains(event.target as Node)
    ) {
      setIsSearchInputVisible(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (sidemenuRefresh !== 0) {
      toggleMenu()
    }
  }, [sidemenuRefresh])
  useEffect(() => {
    if (searchToggleRefresh !== 0) {
      toggleSearchInput()
    }
  }, [searchToggleRefresh])

  const isMobile = useMediaQuery('(max-width:1100px)')

  useEffect(() => {
    if (router.asPath === '/search') {
      searchInputRef.current?.focus()
      if (isMobile) toggleSearchInput()
    }
  }, [router.asPath])

  const searchCloseIcon = (
    <svg
      onClick={toggleSearchInput}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <g clip-path="url(#clip0_10712_82787)">
        <path
          d="M18.2987 5.90406C17.9087 5.51406 17.2787 5.51406 16.8887 5.90406L11.9988 10.7841L7.10875 5.89406C6.71875 5.50406 6.08875 5.50406 5.69875 5.89406C5.30875 6.28406 5.30875 6.91406 5.69875 7.30406L10.5888 12.1941L5.69875 17.0841C5.30875 17.4741 5.30875 18.1041 5.69875 18.4941C6.08875 18.8841 6.71875 18.8841 7.10875 18.4941L11.9988 13.6041L16.8887 18.4941C17.2787 18.8841 17.9087 18.8841 18.2987 18.4941C18.6887 18.1041 18.6887 17.4741 18.2987 17.0841L13.4087 12.1941L18.2987 7.30406C18.6787 6.92406 18.6787 6.28406 18.2987 5.90406Z"
          fill="#6D747A"
        />
      </g>
      <defs>
        <clipPath id="clip0_10712_82787">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.195312)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const searchCrossIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
    >
      <g clip-path="url(#clip0_7497_129809)">
        <path
          d="M12.2005 4.14112C11.9405 3.88112 11.5205 3.88112 11.2605 4.14112L8.00047 7.39445L4.74047 4.13445C4.48047 3.87445 4.06047 3.87445 3.80047 4.13445C3.54047 4.39445 3.54047 4.81445 3.80047 5.07445L7.06047 8.33445L3.80047 11.5945C3.54047 11.8545 3.54047 12.2745 3.80047 12.5345C4.06047 12.7945 4.48047 12.7945 4.74047 12.5345L8.00047 9.27445L11.2605 12.5345C11.5205 12.7945 11.9405 12.7945 12.2005 12.5345C12.4605 12.2745 12.4605 11.8545 12.2005 11.5945L8.94047 8.33445L12.2005 5.07445C12.4538 4.82112 12.4538 4.39445 12.2005 4.14112Z"
          fill="#08090A"
        />
      </g>
      <defs>
        <clipPath id="clip0_7497_129809">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.333984)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const { viewAs } = useSelector((state: RootState) => state.site)

  const toggleDashboard = (
    <svg
      width="49"
      height="49"
      viewBox="0 0 49 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.8615 8.49097C35.4306 9.86582 37.54 11.7253 39.2236 14.071C39.4558 14.3944 39.6311 14.732 39.5975 15.1408C39.5503 15.7148 39.1957 16.1621 38.6833 16.313C38.1153 16.4804 37.5717 16.2923 37.1829 15.8086C36.6399 15.133 36.1339 14.4206 35.5349 13.7982C33.1214 11.2903 30.1811 9.74848 26.7348 9.25738C19.633 8.24534 13.0451 12.0228 10.2819 18.6492C9.75548 19.9114 9.43475 21.2296 9.27274 22.5867C9.26473 22.6539 9.27171 22.7228 9.27171 22.8346C9.86288 22.8346 10.4348 22.8389 11.0066 22.8334C11.5769 22.8278 12.1698 22.7877 12.4754 23.4119C12.772 24.0177 12.5278 24.5284 12.1666 25.0371C11.0605 26.5954 9.98005 28.172 8.88647 29.7392C8.50124 30.2913 7.96621 30.4773 7.42688 30.2209C7.24571 30.1348 7.07056 29.9847 6.95484 29.8201C5.73429 28.0842 4.52831 26.3379 3.31331 24.598C3.04711 24.2168 2.98607 23.8261 3.20763 23.4103C3.42251 23.007 3.77732 22.837 4.22238 22.8358C4.89124 22.8341 5.56039 22.8238 6.22885 22.8401C6.49148 22.8465 6.59009 22.7773 6.61973 22.4984C6.90274 19.8361 7.73052 17.3517 9.13641 15.0715C11.315 11.5381 14.3283 8.98449 18.2322 7.55507C23.2232 5.72761 28.1024 6.07222 32.8615 8.49097Z"
        fill="#0096C8"
      />
      <path
        d="M36.4313 25.2456C36.3511 24.8416 36.4318 24.5083 36.6552 24.189C37.8518 22.4793 39.0347 20.7602 40.2298 19.0495C40.7259 18.3393 41.6104 18.3366 42.1088 19.0476C43.3134 20.7662 44.5064 22.4928 45.7053 24.2153C45.9719 24.5982 45.997 25.0008 45.7941 25.4122C45.5918 25.8225 45.2349 26.0013 44.7916 26.0067C44.1346 26.0146 43.4769 26.0237 42.8205 26.0035C42.5206 25.9943 42.3986 26.0628 42.3617 26.3923C41.9398 30.1618 40.4798 33.4848 37.9702 36.3267C35.2469 39.4105 31.8616 41.4431 27.8041 42.1042C20.344 43.3195 14.3391 40.7604 9.7691 34.7693C9.40958 34.298 9.25404 33.7918 9.51453 33.2279C9.9432 32.3 11.1521 32.1978 11.8044 33.0302C12.1441 33.4637 12.4545 33.9217 12.8129 34.3389C15.4079 37.3601 18.6951 39.1494 22.634 39.6451C29.5454 40.5148 36.1191 36.6014 38.7355 30.1322C39.2346 28.898 39.5526 27.6158 39.7132 26.2946C39.7227 26.216 39.7144 26.1353 39.7144 26.0098C39.0352 26.0098 38.3699 26.0155 37.7047 26.0064C37.4956 26.0036 37.244 26.0257 37.0881 25.9219C36.8387 25.7558 36.6531 25.4941 36.4313 25.2456Z"
        fill="#0096C8"
      />
      <path
        d="M27.4594 25.1154C27.9279 24.8449 28.3832 24.6021 28.8119 24.3191C28.9996 24.1953 29.124 24.1815 29.3076 24.3093C30.557 25.1789 31.2511 26.3809 31.4433 27.8765C31.6093 29.1671 31.7561 30.4602 31.9017 31.7532C31.9303 32.0073 31.9627 32.277 31.9087 32.5208C31.8108 32.9634 31.4876 33.1941 31.0441 33.288C28.8666 33.7493 26.663 33.9492 24.4407 33.948C22.2415 33.9467 20.0623 33.7333 17.9085 33.2792C17.3087 33.1527 16.9862 32.7205 17.0577 32.0638C17.196 30.7935 17.3728 29.5273 17.5026 28.2562C17.5934 27.3671 17.8122 26.5294 18.2903 25.7677C18.657 25.1837 19.124 24.6985 19.6915 24.3055C19.8589 24.1896 19.9805 24.178 20.1552 24.3106C21.5764 25.3891 23.1875 25.855 24.9633 25.7533C25.8259 25.7039 26.6497 25.4873 27.4594 25.1154Z"
        fill="#0096C8"
      />
      <path
        d="M22.4746 22.8929C20.5766 21.9156 19.6029 20.3907 19.6366 18.2694C19.6724 16.0128 21.4514 13.9993 23.6813 13.6554C26.4651 13.2261 28.9567 15.0811 29.337 17.8662C29.7522 20.9073 27.069 23.6613 24.022 23.2944C23.5062 23.2323 23.0065 23.0366 22.4746 22.8929Z"
        fill="#0096C8"
      />
    </svg>
  )

  return (
    <>
      <header
        style={viewAs === 'print' ? { height: '0' } : {}}
        className={`${styles['navbar-wrappper']} ${
          hasShadow && viewAs !== 'print' ? `${styles['showShadow']}` : ''
        }`}
        // style={{ backgroundColor: viewAs === 'print' ? '#F2F0F5' : '' }}
      >
        {viewAs !== 'print' && (
          <nav className={`site-container `} style={{ position: 'relative' }}>
            <section className={styles['navbar-left']}>
              <Link
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (isLoggedIn) {
                    // window.location.href = '/community'
                    router.push('/community')
                    const preferredHobbyId =
                      user?.preferences?.community_view?.preferred_hobby?.hobby
                        ?._id
                    const preferredGenreId =
                      user?.preferences?.community_view?.preferred_hobby?.genre
                        ?._id
                    const preferredLocation =
                      user?.preferences?.community_view?.preferred_location?.city?.split(
                        ' ',
                      )[0]
                    dispatch(
                      setFilters({
                        hobby: preferredHobbyId
                          ? preferredHobbyId
                          : 'All Hobbies',
                        genre: preferredGenreId ? preferredGenreId : '',
                        location: preferredLocation
                          ? preferredLocation
                          : 'All Locations',
                      }),
                    )
                  } else {
                    router.push('/')
                  }
                }}
                className={styles['pos-relative-z-2']}
                href={isLoggedIn ? '/community' : '/'}
              >
                {isLoggedIn ? (
                  <Image
                    src={LogoSmall}
                    alt="HobbyCue Logo"
                    className={styles['logo-full']}
                    // placeholder="blur" // Optional blur-up while loading
                    // height={50}
                    priority
                  />
                ) : (
                  <Image
                    src={LogoFull}
                    alt="HobbyCue Logo"
                    className={styles['logo-full']}
                    // placeholder="blur" // Optional blur-up while loading
                    priority
                  />
                )}
                {!isLoggedIn && !data.search.value ? (
                  <Image
                    src={LogoFull}
                    alt="HobbyCue Logo"
                    width={293.258}
                    height={60}
                    className={styles['logo-full-responsive']}
                    // placeholder="blur" // Optional blur-up while loading

                    priority
                  />
                ) : !isLoggedIn && data.search.value.length > 0 ? (
                  <Image
                    src={LogoSmall}
                    alt="HobbyCue Logo"
                    className={styles['logo-small-responsive']}
                    priority
                  />
                ) : isLoggedIn && !data.search.value ? (
                  <Image
                    src={LogoSmall}
                    alt="HobbyCue Logo"
                    className={styles['logo-small-responsive']}
                    priority
                  />
                ) : isLoggedIn && data.search.value ? (
                  <Image
                    src={LogoSmall}
                    alt="HobbyCue Logo"
                    className={styles['logo-small-responsive']}
                    priority
                  />
                ) : (
                  ''
                )}
              </Link>

              {
                isLoggedIn && (
                  <Link href={'/community'} className={styles['home-icon']}>
                    <Image src={HomeIcon} width={20} height={20} alt="home" />
                  </Link>
                )
              }

              <TextField
                autoComplete="off"
                inputRef={searchInputRef}
                variant="outlined"
                placeholder="Search for anything on your hobbies..."
                size="small"
                className={styles.inputField}
                onFocus={() => {
                  setIsWriting(true)
                }}
                onChange={handleInputChange}
                value={data.search.value}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchResult()
                  }
                }}
                style={isLoggedIn ? { width: '398px' } : { width: '300px' }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    padding: 0,
                    overflow: 'hidden',
                    borderColor: 'red',
                    background: '#f8f9fa',
                    '& fieldset': {
                      borderColor: '#EBEDF0',
                      borderRight: 0,
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '15px',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    fontSize: '12px',
                    color: 'black',
                  },
                }}
                InputLabelProps={{ shrink: false }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      style={{ position: 'relative' }}
                      position="end"
                    >
                      {data.search.value.length > 0 && isWriting && (
                        <div
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              search: { ...prev.search, value: '' },
                            }))
                            searchInputRef?.current?.focus()
                          }}
                          className={styles['search-cross-icon']}
                        >
                          {searchCrossIcon}
                        </div>
                      )}
                      <IconButton
                        onClick={() => searchResult()}
                        sx={{
                          height: '40px',
                          bgcolor: 'primary.main',
                          borderRadius: '0px 8px 8px 0px',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        <div className={styles['search-icon-container']}>
                          <Image
                            src={SearchIcon}
                            alt="search"
                            width={16}
                            height={16}
                          />
                        </div>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </section>
            {isLoggedIn && user?.is_admin && (
              <div
                className={styles['toggle-button']}
                onClick={() => router.push('/admin/dashboard')}
              >
                {toggleDashboard}
              </div>
            )}

            <section className={styles['navbar-right']}>
              <ul className={styles['right-listing-expanded']}>
                {/* Explore */}
                <li
                  className={styles["nav-explore-li"]}
                  onMouseOver={() => setShowDropdown('explore-list')}
                  onMouseLeave={() => setShowDropdown(null)}
                >
                  <Link
                    href={'/explore'}
                    onClick={() => {
                      dispatch(setCategory(''))
                      dispatch(setPageType(''))
                      dispatch(setKeyword(''))
                      dispatch(setHobby(''))
                      dispatch(setLocation(''))
                      dispatch(setSearching(true))
                    }}
                  >
                    <Image src={ExploreIcon} width={24} height={24} alt="explore" />
                    <span>Explore</span>
                    <KeyboardArrowDownRoundedIcon htmlColor="#939CA3" />
                  </Link>
                  {showDropdown === 'explore-list' && (
                    <div className={styles['explore-list-dropdown']}>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={''}
                            className={styles['hobbiescategory']}
                            onClick={async (e) => {
                              e.preventDefault()
                              dispatch(setPageType('People'))
                              dispatch(setSearching(true))
                              dispatch(setCategory(''))
                              dispatch(setKeyword(''))
                              dispatch(setHobby(''))
                              dispatch(setLocation(''))
                              const query = { ['page-type']: 'People' }
                              router.push({
                                pathname: '/explore/people',
                                query: query,
                              })
                            }}
                          >
                            People - Expertise
                          </Link>
                        </h4>
                        {/* <ul>
                        <Link href={'/hobby/music'}>
                          <li>Community</li>
                        </Link>
                      </ul> */}
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={''}
                            className={styles['hobbiescategory']}
                            onClick={async (e) => {
                              e.preventDefault()
                              dispatch(setCategory(''))
                              dispatch(setPageType('Place'))
                              dispatch(setSearching(true))
                              dispatch(setKeyword(''))
                              dispatch(setHobby(''))
                              dispatch(setLocation(''))
                              const query = { ['page-type']: 'Place' }
                              router.push({
                                pathname: '/explore/places',
                                query: query,
                              })
                            }}
                          >
                            Places - Venues
                          </Link>
                        </h4>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={''}
                            className={styles['hobbiescategory']}
                            onClick={async (e) => {
                              e.preventDefault()
                              dispatch(setCategory(''))
                              dispatch(setPageType('Product'))
                              dispatch(setSearching(true))
                              dispatch(setKeyword(''))
                              dispatch(setHobby(''))
                              dispatch(setLocation(''))
                              const query = { ['page-type']: 'Product' }
                              router.push({
                                pathname: '/explore/products',
                                query: query,
                              })
                            }}
                          >
                            Products - Store
                          </Link>
                        </h4>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={''}
                            className={styles['hobbiescategory']}
                            onClick={async (e) => {
                              e.preventDefault()
                              dispatch(setCategory(''))
                              dispatch(setPageType('Program'))
                              dispatch(setSearching(true))
                              dispatch(setKeyword(''))
                              dispatch(setHobby(''))
                              dispatch(setLocation(''))
                              const query = { ['page-type']: 'Program' }
                              router.push({
                                pathname: '/explore/programs',
                                query: query,
                              })
                            }}
                          >
                            Programs - Events
                          </Link>
                        </h4>
                      </section>

                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href=""
                            className={styles['hobbiescategory']}
                            onClick={async (e) => {
                              e.preventDefault()
                              router.push({
                                pathname: '/blog',
                              })
                            }}
                          >
                            Perspectives - Blogs
                          </Link>
                        </h4>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href=""
                            className={styles['hobbiescategory']}
                            onClick={async (e) => {
                              if (!isLoggedIn) {
                                dispatch(
                                  openModal({ type: 'auth', closable: true }),
                                )
                                return
                              }
                              e.preventDefault()
                              router.push({
                                pathname: '/community',
                              })
                            }}
                          >
                            Posts - Community
                          </Link>
                        </h4>
                      </section>
                    </div>
                  )}
                </li>

                {/* Hobbies */}
                <li
                  className={styles['hobby-icon']}
                  onMouseOver={() => setShowDropdown('hobby-list')}
                  onMouseLeave={() => setShowDropdown(null)}
                >
                  <Link href={'/hobby'}>
                    <Image src={HobbyIcon} width={24} height={24} alt="hobby" />
                    <span>Hobbies</span>
                    <KeyboardArrowDownRoundedIcon htmlColor="#939CA3" />
                  </Link>
                  {showDropdown === 'hobby-list' && (
                    <div className={styles['hobby-list-dropdown']}>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={'/hobby/arts'}
                            className={styles['hobbiescategory']}
                          >
                            Art
                          </Link>
                        </h4>
                        <ul>
                          <Link href={'/hobby/music'}>
                            <li>Music</li>
                          </Link>

                          <Link href={'/hobby/dance'}>
                            <li>Dance</li>
                          </Link>

                          <Link href={'/hobby/literary'}>
                            <li>Literary</li>
                          </Link>

                          <Link href={'/hobby/theatre'}>
                            <li>Theatre</li>
                          </Link>

                          <Link href={'/hobby/visual'}>
                            <li>Visual</li>
                          </Link>
                        </ul>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={'/hobby/play'}
                            className={styles['hobbiescategory']}
                          >
                            Play
                          </Link>
                        </h4>

                        <ul>
                          <Link href={'/hobby/games'}>
                            <li>Games</li>
                          </Link>

                          <Link href={'/hobby/sports'}>
                            <li>Sports</li>
                          </Link>
                        </ul>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={'/hobby/making'}
                            className={styles['hobbiescategory']}
                          >
                            Making Things
                          </Link>
                        </h4>

                        <ul>
                          <Link href={'/hobby/clothing'}>
                            <li>Clothing</li>
                          </Link>

                          <Link href={'/hobby/cooking'}>
                            <li>Cooking</li>
                          </Link>

                          <Link href={'/hobby/garden'}>
                            <li>Garden</li>
                          </Link>

                          <Link href={'/hobby/model'}>
                            <li>Model</li>
                          </Link>

                          <Link href={'/hobby/utility'}>
                            <li>Utility</li>
                          </Link>
                        </ul>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={'/hobby/activity'}
                            className={styles['hobbiescategory']}
                          >
                            Activity
                          </Link>
                        </h4>

                        <ul>
                          <Link href={'/hobby/animal-fancy'}>
                            <li>Animal-Fancy</li>
                          </Link>

                          <Link href={'/hobby/observe'}>
                            <li>Observe</li>
                          </Link>

                          <Link href={'/hobby/outdoors'}>
                            <li>Outdoors</li>
                          </Link>

                          <Link href={'/hobby/travel'}>
                            <li>Travel</li>
                          </Link>
                          <Link href={'/hobby/wellness'}>
                            <li>Wellness</li>
                          </Link>
                        </ul>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={'/hobby/collecting'}
                            className={styles['hobbiescategory']}
                          >
                            {' '}
                            Collecting{' '}
                          </Link>
                        </h4>

                        <ul>
                          <Link href={'/hobby/items'}>
                            <li>Items</li>
                          </Link>

                          <Link href={'/hobby/records'}>
                            <li>Records</li>
                          </Link>
                        </ul>
                      </section>
                      <section className={styles['list']}>
                        <h4>
                          <Link
                            href={'/hobby'}
                            className={styles['hobbiescategory']}
                          >
                            All Hobbies
                          </Link>
                        </h4>

                        <ul>
                          <li>Hobbies Challenges</li>
                        </ul>
                      </section>
                    </div>
                  )}
                </li>

                {/* Bookmark */}
                <li>
                  <Link href={'/bookmarks'}>
                    <CustomizedTooltips title="Bookmark">
                      <Image src={BookmarksIcon} width={24} height={24} alt="bookmark" />
                    </CustomizedTooltips>
                  </Link>{' '}
                </li>

                {/* Notification */}
                <li>
                  <Link href={'/notifications'}>
                    <CustomizedTooltips title="Notification">
                      <Image src={NotificationIcon} width={24} height={24} alt="notification" />
                    </CustomizedTooltips>
                  </Link>{' '}
                </li>

                {/* Cart */}
                <li>
                  <Link href={'/cart'}>
                    <CustomizedTooltips title="Cart">
                      <Image src={CartIcon} width={24} height={24} alt="cart" />
                    </CustomizedTooltips>
                  </Link>{' '}
                </li>

                {isLoggedIn ? (
                  <li
                    className={styles['user-menu']}
                    onMouseOver={() => setShowDropdown('user-menu')}
                    onMouseLeave={() => setShowDropdown(null)}
                  >
                    <Link
                      href={'#'}
                      onFocus={() => setShowDropdown('user-menu')}
                      onBlur={() => setShowDropdown(null)}
                    >
                      {user?.profile_image ? (
                        <img
                          className={styles['img']}
                          src={user.profile_image}
                          alt=""
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div
                          className={`${styles['img']} default-user-icon`}
                        ></div>
                      )}
                      <KeyboardArrowDownRoundedIcon htmlColor="#939CA3" />
                    </Link>

                    {showDropdown === 'user-menu' && (
                      <div className={styles['user-menu-dropdown']}>
                        <section className={styles['general-info']}>
                          <Link
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'start',
                            }}
                            prefetch={true}
                            href={`/profile/${user.profile_url}`}
                          >
                            <div className={styles['profile-name']}>
                              {user?.profile_image ? (
                                <img
                                  className={styles['img']}
                                  src={user.profile_image}
                                  alt=""
                                  width={48}
                                  height={48}
                                />
                              ) : (
                                <div
                                  className={`${styles['img']} default-user-icon`}
                                ></div>
                              )}
                              <h4
                                style={{
                                  width: '130px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {user.full_name}
                              </h4>
                            </div>
                            <button className={styles['view-profile-btn']}>
                              View Profile
                            </button>
                          </Link>
                        </section>

                        <span className={styles['divider']}></span>

                        <section className={styles['manage']}>
                          <h5>Manage</h5>
                          <Link href={`/activity`}>
                            <p>My Activity</p>
                          </Link>
                          <Link href={`/orders`}>
                            <p>My Orders</p>
                          </Link>
                          <Link href={`/profile/${user.profile_url}/pages`}>
                            <p>My Pages</p>
                          </Link>
                        </section>

                        <span className={styles['divider']}></span>

                        <Link href={'/add-listing'}>
                          <h5 className={styles['add-listing']}>
                            Add Listing Page
                          </h5>
                        </Link>

                        <span className={styles['divider']}></span>

                        <section className={styles['account']}>
                          <h5>Account</h5>
                          <Link href={`/settings/login-security`}>
                            <p>Settings</p>
                          </Link>
                          <p onClick={handleLogout}>Sign Out</p>
                        </section>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    <OutlinedButton
                      onClick={() =>
                        dispatch(openModal({ type: 'auth', closable: true }))
                      }
                      className={styles.textSmall}
                    >
                      Sign In
                    </OutlinedButton>{' '}
                  </li>
                )}
              </ul>
              <ul className={styles['right-listing-small']}>
                <div
                  className={`${styles['mobile-search-input']} ${
                    isSearchInputVisible
                      ? styles['mobile-search-input-visible']
                      : styles['left-0']
                  }`}
                >
                  {isSearchInputVisible ? (
                    <form
                      ref={mobileSearchRef}
                      onSubmit={handleSearchSubmit}
                      className={
                        styles['mobile-search-input'] +
                        ` ${
                          isSearchInputVisible === true &&
                          'mobile-search-input-visible'
                        }`
                      }
                    >
                      <header className={styles['header']}>
                        <Image
                          className={styles['responsive-logo']}
                          src={LogoSmall}
                          alt="hobbycue"
                        />
                        <h2 className={styles['modal-heading']}></h2>
                        {searchCloseIcon}
                      </header>
                      <div className={styles['mobile-search-container']}>
                        <TextField
                          autoComplete="off"
                          ref={mobileSearchInputRef}
                          type="search"
                          variant="outlined"
                          placeholder="Search for anything on your hobbies..."
                          size="small"
                          autoFocus
                          onFocus={() => {
                            setIsWriting(true)
                          }}
                          className={styles.inputField}
                          onChange={handleInputChange}
                          value={data.search.value}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              padding: 0,
                              overflow: 'hidden',
                              borderColor: 'red',
                              background: '#f8f9fa',
                              '& fieldset': {
                                borderColor: '#EBEDF0',
                                borderRight: 0,
                              },
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '15px',
                            },
                            '& .MuiInputBase-input::placeholder': {
                              fontSize: '12px',
                              color: 'black',
                            },
                          }}
                          InputLabelProps={{ shrink: false }}
                        />

                        <button
                          type="submit"
                          className={styles['search-icon-container']}
                        >
                          {/* Search Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              d="M6.83333 2.19531C4.17185 2.19531 2 4.36717 2 7.02865C2 9.69013 4.17185 11.862 6.83333 11.862C7.92439 11.862 8.92964 11.493 9.74023 10.8789L12.862 14C12.9234 14.064 12.997 14.1151 13.0784 14.1503C13.1598 14.1854 13.2474 14.204 13.3361 14.2049C13.4248 14.2058 13.5128 14.189 13.5949 14.1555C13.6771 14.122 13.7517 14.0724 13.8144 14.0097C13.8771 13.947 13.9267 13.8724 13.9602 13.7903C13.9937 13.7081 14.0105 13.6202 14.0096 13.5315C14.0087 13.4428 13.9901 13.3551 13.9549 13.2737C13.9198 13.1923 13.8687 13.1187 13.8047 13.0573L10.6836 9.93555C11.2977 9.12495 11.6667 8.1197 11.6667 7.02865C11.6667 4.36717 9.49481 2.19531 6.83333 2.19531ZM6.83333 3.52865C8.77423 3.52865 10.3333 5.08775 10.3333 7.02865C10.3333 7.96055 9.97135 8.80218 9.38281 9.42773C9.32552 9.46921 9.2752 9.51953 9.23372 9.57682C8.60803 10.1661 7.7659 10.5286 6.83333 10.5286C4.89244 10.5286 3.33333 8.96954 3.33333 7.02865C3.33333 5.08775 4.89244 3.52865 6.83333 3.52865Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                    </form>
                  ) : data.search.value.length > 0 ? (
                    <li
                      onClick={toggleSearchInput}
                      className={
                        data.search.value.length > 0
                          ? styles['topbar-search-box']
                          : ''
                      }
                    >
                      {data.search.value.length > 0 && (
                        <input
                          type="text"
                          autoComplete="new"
                          value={data.search.value}
                        />
                      )}
                      <div
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            search: { ...prev.search, value: '' },
                          }))
                          searchInputRef?.current?.focus()
                        }}
                        className={styles['search-cross-icon-inside']}
                      >
                        {searchCrossIcon}
                      </div>
                      <Image src={Search} alt="search" />
                    </li>
                  ) : null}
                </div>
                {data.search.value.length === 0 && (
                  <li onClick={toggleSearchInput} className={''}>
                    <Image src={Search} alt="search" />
                  </li>
                )}
                <li>
                  <Link href={'/notifications'}>
                    <Image src={BellIcon} alt="Bell" />
                  </Link>
                </li>
                <li>
                  <Image src={BarsIcon} alt="Bars" onClick={toggleMenu} />
                </li>
              </ul>
            </section>
          </nav>
        )}
      </header>

      {menuActive && <SideMenu handleClose={toggleMenu} />}
      {/* {showDropdown && <div className={styles['navbar-backdrop']}></div>} */}
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
