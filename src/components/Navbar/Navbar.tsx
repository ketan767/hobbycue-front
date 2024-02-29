"use client"

import React, { useRef, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
// import SearchIcon from '@mui/icons-material/Search'

import Image from 'next/image'
import { searchPages } from '@/services/listing.service'
import {
  setUserSearchResults,
  setTypeResultOne,
  setTypeResultTwo,
  setTypeResultThree,
  setSearchString,
  setHobbiesSearchResult,
  Page,
} from '@/redux/slices/search'
import LogoFull from '@/assets/image/logo-full.svg'
import LogoSmall from '@/assets/image/logo-small.png'
import ExploreIcon from '@/assets/svg/navbar-explore-icon.svg'
import HobbyIcon from '@/assets/svg/navbar-hobby-icon.svg'
import Search from '@/assets/svg/search.svg'
import SearchIcon from '@/assets/svg/search-small.svg'
import BellIcon from '@/assets/svg/bell.svg'
import BarsIcon from '@/assets/svg/bars.svg'
import { searchUsers } from '@/services/user.service'
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
import { setShowPageLoader } from '@/redux/slices/site'

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

  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const { activeModal } = useSelector(
    (state: RootState) => state.modal,
  )

  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [showDropdown, setShowDropdown] = useState<
    'user-menu' | 'hobby-list' | null
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
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false)

  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible)

    if (!isSearchInputVisible) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    searchResult()
    setIsSearchInputVisible(false)
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

  const searchResult = async () => {
    router.push('/search')
    const searchValue = data.search.value.trim()
    const taglineValue = ''
    const cityValue = ''
    const hobbyValue = ''
    const titleValue = ''

    if (!searchValue && !taglineValue && !cityValue && !hobbyValue) {
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
      const { res: userRes, err: userErr } = await searchUsers({
        full_name: searchValue,
      })
      if (userErr) {
      } else {
        if (userRes?.length < 10) {
          const { res: taglineRes, err: taglineErr } = await searchUsers({
            tagline: searchValue,
          })
          if (!taglineErr) {
            const combinedResults = userRes.concat(taglineRes)
            dispatch(setUserSearchResults(combinedResults))
          }
        } else {
          dispatch(setUserSearchResults(userRes))
        }
      }
      // Search by title
      dispatch(setShowPageLoader(true))
      const { res: titleRes, err: titleErr } = await searchPages({
        title: searchValue,
      })
      if (titleErr) {
        console.error('An error occurred during the title search:', titleErr)
        return
      }
      console.warn({ titleRes })
      let combinedResults = new Set(titleRes.data.slice(0, 50))
      let remainingSlots = 50 - combinedResults.size

      if (combinedResults.size < 10) {
        dispatch(setShowPageLoader(true))
        const { res: taglineRes, err: taglineErr } = await searchPages({
          tagline: searchValue,
        })
        if (!taglineErr) {
          taglineRes.data.slice(0, remainingSlots).forEach((item: any) => {
            combinedResults.add(item)
          })
        }
      }
      if (combinedResults.size < 10) {
        dispatch(setShowPageLoader(true))
        const { res: taglineRes, err: taglineErr } = await searchPages({
          tagline: searchValue,
        })
        if (!taglineErr) {
          combinedResults = combinedResults.add(
            taglineRes.data.slice(0, remainingSlots),
          )
        }
      }
      // If title search results are exactly 50, prioritize the first 40 and get 10 by tagline
      else if (combinedResults.size === 50) {
        dispatch(setShowPageLoader(true))
        combinedResults = new Set(Array.from(combinedResults).slice(0, 40))
        const { res: taglineRes, err: taglineErr } = await searchPages({
          tagline: searchValue,
        })
        if (!taglineErr) {
          combinedResults = combinedResults.add(taglineRes.data.slice(0, 10))
        }
      }

      const typeResultOne = Array.from(combinedResults).filter(
        (page: any) => page.type === 1 && page.is_published === true,
      )

      dispatch(
        setTypeResultOne({
          data: typeResultOne as Page[],
          message: 'Search completed successfully.',
          success: true,
        }),
      )
      const typeResultTwo = Array.from(combinedResults).filter(
        (page: any) => page.type === 2 && page.is_published === true,
      )

      dispatch(
        setTypeResultTwo({
          data: typeResultTwo as Page[],
          message: 'Search completed successfully.',
          success: true,
        }),
      )
      const typeResultThree = Array.from(combinedResults).filter(
        (page: any) => page.type === 3 && page.is_published === true,
      )

      dispatch(
        setTypeResultThree({
          data: typeResultThree as Page[],
          message: 'Search completed successfully.',
          success: true,
        }),
      )
      const query = `fields=display,genre,slug,profile_image&level=3&level=2&level=1&level=0&show=true&search=${searchValue}`
      dispatch(setShowPageLoader(true))
      const { res: hobbyRes, err: hobbyErr } = await getAllHobbies(query)
      if (hobbyErr) {
        console.error('An error occurred during the page search:', hobbyErr)
      } else {
        console.log('hobbies search results:', hobbyRes.data.hobbies)
        dispatch(setHobbiesSearchResult(hobbyRes.data.hobbies))
      }
      dispatch(setShowPageLoader(false))
      dispatch(setSearchString(searchValue))
    } catch (error) {
      dispatch(setShowPageLoader(false))
      console.error('An error occurred during the combined search:', error)
    }
  }

  return (
    <>
      <header className={`${styles['navbar-wrappper']}`}>
        <nav className={`site-container `}>
          <section className={styles['navbar-left']}>
            <Link href={isLoggedIn ? '/community' : '/'}>
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
              <Image
                src={LogoSmall}
                alt="HobbyCue Logo"
                className={styles['logo-small']}
                // placeholder="blur" // Optional blur-up while loading
                height={40}
                priority
              />
            </Link>

            <TextField
              variant="outlined"
              placeholder="Search for anything on your hobbies..."
              size="small"
              className={styles.inputField}
              onChange={handleInputChange}
              value={data.search.value}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchResult()
                }
              }}
              style={isLoggedIn?{width:"400px"}:{width:"100%"}}
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
                  <InputAdornment position="end">
                    <IconButton
                      onClick={searchResult}
                      sx={{
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
              <li>
                <Link href={'/explore'}>
                  <Image src={ExploreIcon} alt="" />
                  <span>Explore</span>
                  <KeyboardArrowDownRoundedIcon htmlColor="#939CA3" />
                </Link>
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

                        <Link href={'/hobby/outdoor'}>
                          <li>Outdoor</li>
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
                      <Image
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
                            <Image
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
                    : ''
                }`}
              >
                {isSearchInputVisible ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className={styles['mobile-search-input']}
                  >
                    <TextField
                      variant="outlined"
                      placeholder="Search here..."
                      size="small"
                      autoFocus
                      onBlur={() => setIsSearchInputVisible(false)}
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
                  </form>
                ) : (
                  <li>
                    <Image
                      src={Search}
                      alt="search"
                      onClick={toggleSearchInput}
                    />
                  </li>
                )}
              </div>
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
    </>
  )
}
