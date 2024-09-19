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
} from '@/redux/slices/search'
import LogoFull from '@/assets/image/logo-full.svg'
import LogoSmall from '@/assets/image/logo-small.png'
import ExploreIcon from '@/assets/svg/navbar-explore-icon.svg'
import HobbyIcon from '@/assets/svg/navbar-hobby-icon.svg'
import Search from '@/assets/svg/search.svg'
import SearchIcon from '@/assets/svg/search-small.svg'
import BellIcon from '@/assets/svg/bell.svg'
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
  const [menuActive, setMenuActive] = useState(false)
  const [isWriting, setIsWriting] = useState(false)
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
    if (router.asPath === '/search') {
      return
    } else {
      setData((prev) => ({ ...prev, search: { value: '', error: null } }))
    }
  }, [router.asPath])

  const handleLogout = () => {
    logout()
    setShowDropdown(null)
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }

  const searchInputRef = useRef<HTMLInputElement>(null)
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

  // const searchResult = async (page = 1) => {
  //   dispatch(resetSearch())
  //   dispatch(setExplore(false))
  //   dispatch(setSearchString(data.search.value.trim()))
  //   if (router.pathname !== '/search') {
  //     dispatch(showAllTrue())
  //     // router.push('/search')
  //   }
  //   const searchValue = data.search.value.trim()
  //   const taglineValue = ''
  //   const cityValue = ''
  //   const hobbyValue = ''
  //   const titleValue = ''

  //   if (!searchValue && !taglineValue && !cityValue && !hobbyValue) {
  //     console.log('Search fields are empty.')
  //     return
  //   }

  //   router.push({
  //     pathname: `/search`,
  //     query: { q: searchValue },
  //   })

  //   let searchCriteria = {
  //     full_name: searchValue,
  //     tagline: taglineValue,
  //     city: cityValue,
  //     hobby: hobbyValue,
  //     title: titleValue,
  //   }

  //   try {
  //     dispatch(setSearchLoading(true))
  //     const { res: userRes, err: userErr } = await searchUsers({
  //       full_name: searchValue,
  //     })
  //     if (userErr) {
  //     } else {
  //       if (userRes?.length < 10) {
  //         const { res: taglineRes, err: taglineErr } = await searchUsers({
  //           tagline: searchValue,
  //         })
  //         if (!taglineErr) {
  //           const combinedResults = userRes.concat(taglineRes)
  //           dispatch(setUserSearchResults(combinedResults))
  //         }
  //       } else {
  //         dispatch(setUserSearchResults(userRes))
  //       }
  //     }
  //     // Search by title
  //     dispatch(setShowPageLoader(true))
  //     const { res: titleRes, err: titleErr } = await searchPages({
  //       title: searchValue,
  //     })

  //     if (titleErr) {
  //       console.error('An error occurred during the title search:', titleErr)
  //       dispatch(setSearchLoading(false))
  //       return
  //     }

  //     const titlePages = titleRes.data.slice(0, 100) // Get title search results

  //     // Function to fetch tagline search results and process unique pages

  //     dispatch(setShowPageLoader(true))
  //     const { res: taglineRes, err: taglineErr } = await searchPages({
  //       tagline: searchValue,
  //     })

  //     if (!taglineErr) {
  //       const taglinePages = taglineRes.data.slice(0, 50) // Get tagline search results

  //       // Combine titlePages and taglinePages and filter out duplicate URLs
  //       const uniqueUrls = new Set<string>()
  //       const uniquePages: any[] = [] // Use 'any[]' if you prefer not to define a specific type
  //       console.warn({ titlePages, taglinePages })
  //       ;[...titlePages, ...taglinePages].forEach((page) => {
  //         if (
  //           page &&
  //           page.page_url &&
  //           typeof page.page_url === 'string' &&
  //           !uniqueUrls.has(page.page_url)
  //         ) {
  //           uniqueUrls.add(page.page_url)
  //           uniquePages.push(page)
  //         }
  //       })
  //       const user_id = isLoggedIn ? user?._id : null
  //       console.log('sto')
  //       const { res, err } = await addSearchHistory({
  //         user_id: user_id,
  //         no_of_pages: uniquePages?.length,
  //         search_input: searchValue,
  //       })

  //       // Filter uniquePages by type and is_published
  //       const typeResultOne = uniquePages.filter(
  //         (page) => page.type === 1 && page.is_published,
  //       )
  //       const typeResultTwo = uniquePages.filter(
  //         (page) => page.type === 2 && page.is_published,
  //       )
  //       const typeResultThree = uniquePages.filter(
  //         (page) => page.type === 3 && page.is_published,
  //       )

  //       const typeResultFour = uniquePages.filter(
  //         (page) => page.type === 4 && page.is_published,
  //       )

  //       // Dispatch the unique results to the appropriate actions
  //       dispatch(
  //         setTypeResultOne({
  //           data: typeResultOne,
  //           message: 'Search completed successfully.',
  //           success: true,
  //         }),
  //       )
  //       dispatch(
  //         setTypeResultTwo({
  //           data: typeResultTwo,
  //           message: 'Search completed successfully.',
  //           success: true,
  //         }),
  //       )
  //       dispatch(
  //         setTypeResultThree({
  //           data: typeResultThree,
  //           message: 'Search completed successfully.',
  //           success: true,
  //         }),
  //       )

  //       dispatch(
  //         setTypeResultFour({
  //           data: typeResultFour,
  //           message: 'Search completed successfully.',
  //           success: true,
  //         }),
  //       )
  //     }

  //     dispatch(setShowPageLoader(false))

  //     const query = `level=1&level=2&level=3&level=4&level=5&search=${searchValue}`
  //     dispatch(setShowPageLoader(true))
  //     const { res: hobbyRes, err: hobbyErr } = await getAllHobbies(query)
  //     if (hobbyErr) {
  //       console.error('An error occurred during the page search:', hobbyErr)
  //     } else {
  //       const sortedHobbies = hobbyRes.data.hobbies.sort((a: any, b: any) => {
  //         const indexA = a.display
  //           .toLowerCase()
  //           .indexOf(searchValue.toLowerCase())
  //         const indexB = b.display
  //           .toLowerCase()
  //           .indexOf(searchValue.toLowerCase())

  //         if (indexA === 0 && indexB !== 0) {
  //           return -1
  //         } else if (indexB === 0 && indexA !== 0) {
  //           return 1
  //         }
  //         return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
  //       })
  //       dispatch(
  //         setHobbiesSearchResult({
  //           data: sortedHobbies,
  //           message: 'Search completed successfully.',
  //           success: true,
  //         }),
  //       )
  //     }

  //     dispatch(setShowPageLoader(true))
  //     const { res: blogRes, err: BlogErr } = await searchBlogs({
  //       search: searchValue,
  //     })

  //     if (BlogErr) {
  //       console.error('An error occurred during the page search:', BlogErr)
  //     } else {
  //       const sortedBlog = blogRes?.data?.sort((a: any, b: any) => {
  //         const titleA = a.title?.toLowerCase()
  //         const titleB = b.title?.toLowerCase()
  //         const indexA = titleA.indexOf(searchValue?.toLowerCase())
  //         const indexB = titleB.indexOf(searchValue?.toLowerCase())

  //         if (indexA === 0 && indexB !== 0) {
  //           return -1
  //         } else if (indexB === 0 && indexA !== 0) {
  //           return 1
  //         }
  //         return titleA.localeCompare(titleB)
  //       })

  //       console.log('blog search results:', sortedBlog)
  //       dispatch(
  //         setBlogsSearchResult({
  //           data: sortedBlog,
  //           message: 'Search completed successfully.',
  //           success: true,
  //         }),
  //       )
  //     }
  //     // if (isLoggedIn) {
  //     //   const { res: PostRes, err: PostErr } = await searchPosts({
  //     //     content: searchValue,
  //     //   })
  //     //   if (PostErr) {
  //     //     console.error('An error occurred during the page search:', PostErr)
  //     //   } else {
  //     //     const sortedposts = PostRes?.data?.sort((a: any, b: any) => {
  //     //       const indexA = a?.content
  //     //         .toLowerCase()
  //     //         .indexOf(searchValue.toLowerCase())
  //     //       const indexB = b?.content
  //     //         .toLowerCase()
  //     //         .indexOf(searchValue.toLowerCase())

  //     //       if (indexA === 0 && indexB !== 0) {
  //     //         return -1
  //     //       } else if (indexB === 0 && indexA !== 0) {
  //     //         return 1
  //     //       }
  //     //       return a?.content
  //     //         ?.toLowerCase()
  //     //         ?.localeCompare(b?.content?.toLowerCase())
  //     //     })
  //     //     console.warn('posts search results:', PostRes?.data)
  //     //     dispatch(
  //     //       setPostsSearchResult({
  //     //         data: sortedposts,
  //     //         message: 'Search completed successfully.',
  //     //         success: true,
  //     //       }),
  //     //     )
  //     //   }
  //     // }

  //     dispatch(setSearchLoading(false))
  //     dispatch(setShowPageLoader(false))
  //     dispatch(showAllTrue())
  //   } catch (error) {
  //     dispatch(setSearchLoading(false))
  //     dispatch(setShowPageLoader(false))
  //     console.error('An error occurred during the combined search:', error)
  //   }
  // }

  // const ExplorePeople = async () => {
  //   const { res: PeopleRes, err: PeopleErr } = await getListingPages(
  //     `type=1&sort=-createdAt&is_published=true`,
  //   )

  //   const PeoplePages = PeopleRes?.data.data?.listings

  //   dispatch(
  //     setTypeResultOne({
  //       data: PeoplePages,
  //       message: 'Search completed successfully.',
  //       success: true,
  //     }),
  //   )
  // }

  // const ExplorePlaces = async () => {
  //   const { res: PlacesRes, err: PlacesErr } = await getListingPages(
  //     `type=2&sort=-createdAt&is_published=true`,
  //   )

  //   const PlacesPages = PlacesRes?.data.data?.listings

  //   dispatch(
  //     setTypeResultTwo({
  //       data: PlacesPages,
  //       message: 'Search completed successfully.',
  //       success: true,
  //     }),
  //   )
  // }

  // const ExploreEvents = async () => {
  //   const { res: EventRes, err: EventErr } = await getAllEvents()

  //   const EventPages = EventRes?.data?.data

  //   dispatch(
  //     setTypeResultThree({
  //       data: EventPages,
  //       message: 'Search completed successfully.',
  //       success: true,
  //     }),
  //   )
  // }

  // const ExploreProducts = async () => {
  //   const { res: ProductsRes, err: ProductsErr } = await getListingPages(
  //     `type=4&sort=-createdAt&is_published=true`,
  //   )

  //   const ProductsPages = ProductsRes?.data.data?.listings

  //   dispatch(
  //     setTypeResultFour({
  //       data: ProductsPages,
  //       message: 'Search completed successfully.',
  //       success: true,
  //     }),
  //   )
  // }

  // const ExplorePosts = async () => {
  //   dispatch(setShowPageLoader(true))
  //   const { res: PostRes, err: PostErr } = await getAllPosts(
  //     `sort=-createdAt&populate=_author,_hobby`,
  //   )

  //   const PostsPages = PostRes?.data.data?.posts

  //   dispatch(
  //     setPostsSearchResult({
  //       data: PostsPages,
  //       message: 'Search completed successfully.',
  //       success: true,
  //     }),
  //   )
  //   dispatch(setShowPageLoader(false))
  // }

  // const ExploreBlogs = async () => {
  //   const { res: BlogRes, err: PostErr } = await getAllBlogs(
  //     `sort=-createdAt&populate=author&status=Published`,
  //   )

  //   const BlogsPages = BlogRes?.data.data?.blog

  //   dispatch(
  //     setBlogsSearchResult({
  //       data: BlogsPages,
  //       message: 'Search completed successfully.',
  //       success: true,
  //     }),
  //   )
  // }

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

  return (
    <>
      <header className={`${styles['navbar-wrappper']}`}>
        <nav className={`site-container `}>
          <section className={styles['navbar-left']}>
            <Link
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (isLoggedIn) {
                  window.location.href = '/community'
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

            <TextField
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
              style={isLoggedIn ? { width: '400px' } : { width: '300px' }}
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

          <section className={styles['navbar-right']}>
            <ul className={styles['right-listing-expanded']}>
              {/* Explore */}
              <li
                className=""
                onMouseOver={() => setShowDropdown('explore-list')}
                onMouseLeave={() => setShowDropdown(null)}
              >
                <Link href={'/explore'}>
                  <Image src={ExploreIcon} alt="" />
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
                            router.push({
                              pathname: '/explore/people',
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
                            router.push({
                              pathname: '/explore/places',
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
                            router.push({
                              pathname: '/explore/programs',
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
                          href={''}
                          className={styles['hobbiescategory']}
                          onClick={async (e) => {
                            e.preventDefault()
                            router.push({
                              pathname: '/explore/products',
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
                  <Image src={HobbyIcon} alt="hobby" />
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_10705_1996)">
                        <path
                          d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10705_1996">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </CustomizedTooltips>
                </Link>{' '}
              </li>

              {/* Notification */}
              <li>
                <Link href={'/notifications'}>
                  <CustomizedTooltips title="Notification">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_10705_1999)">
                        <path
                          d="M12.0001 22C13.1001 22 14.0001 21.1 14.0001 20H10.0001C10.0001 21.1 10.8901 22 12.0001 22ZM18.0001 16V11C18.0001 7.93 16.3601 5.36 13.5001 4.68V4C13.5001 3.17 12.8301 2.5 12.0001 2.5C11.1701 2.5 10.5001 3.17 10.5001 4V4.68C7.63005 5.36 6.00005 7.92 6.00005 11V16L4.71005 17.29C4.08005 17.92 4.52005 19 5.41005 19H18.5801C19.4701 19 19.9201 17.92 19.2901 17.29L18.0001 16Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10705_1999">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </CustomizedTooltips>
                </Link>{' '}
              </li>

              {/* Cart */}
              <li>
                <Link href={'/cart'}>
                  <CustomizedTooltips title="Cart">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.9201 7.25002V7.38002L20.4601 12.78C20.2875 13.421 19.9073 13.9866 19.3789 14.3883C18.8505 14.79 18.2038 15.0051 17.5401 15H9.89007C9.13906 15.0031 8.41423 14.7243 7.85877 14.2189C7.30332 13.7134 6.95765 13.018 6.89007 12.27L6.24007 4.91002C6.21754 4.6607 6.10232 4.4289 5.91717 4.26041C5.73202 4.09192 5.4904 3.99901 5.24007 4.00002H3.07007C2.80485 4.00002 2.5505 3.89467 2.36296 3.70713C2.17543 3.51959 2.07007 3.26524 2.07007 3.00002C2.07007 2.73481 2.17543 2.48045 2.36296 2.29292C2.5505 2.10538 2.80485 2.00002 3.07007 2.00002H5.24007C5.99107 1.99698 6.71591 2.27572 7.27136 2.78118C7.82682 3.28665 8.17248 3.98206 8.24007 4.73002V5.00002H19.9301C20.2151 4.99779 20.4974 5.05652 20.7579 5.17228C21.0184 5.28805 21.2512 5.45816 21.4406 5.67124C21.63 5.88431 21.7716 6.1354 21.8561 6.4077C21.9405 6.67999 21.9657 6.96718 21.9301 7.25002H21.9201Z"
                        fill="#8064A2"
                      />
                      <path
                        d="M9.07007 22C10.4508 22 11.5701 20.8807 11.5701 19.5C11.5701 18.1193 10.4508 17 9.07007 17C7.68936 17 6.57007 18.1193 6.57007 19.5C6.57007 20.8807 7.68936 22 9.07007 22Z"
                        fill="#8064A2"
                      />
                      <path
                        d="M17.0701 22C18.4508 22 19.5701 20.8807 19.5701 19.5C19.5701 18.1193 18.4508 17 17.0701 17C15.6894 17 14.5701 18.1193 14.5701 19.5C14.5701 20.8807 15.6894 22 17.0701 22Z"
                        fill="#8064A2"
                      />
                    </svg>
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
                          <h4>{user.full_name}</h4>
                        </div>
                        <Link
                          prefetch={true}
                          href={`/profile/${user.profile_url}`}
                        >
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
                        variant="outlined"
                        placeholder="Search here..."
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
                      <input type="text" value={data.search.value} />
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
      </header>

      {menuActive && <SideMenu handleClose={toggleMenu} />}
      {showDropdown && <div className={styles['navbar-backdrop']}></div>}
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
