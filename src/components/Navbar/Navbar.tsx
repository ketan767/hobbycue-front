import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'

import Image from 'next/image'

import LogoFull from '@/assets/image/logo-full.png'
import ExploreIcon from '@/assets/svg/navbar-explore-icon.svg'
import HobbyIcon from '@/assets/svg/navbar-hobby-icon.svg'

import styles from './Navbar.module.css'
import OutlinedButton from '../_buttons/OutlinedButton'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import { updateIsLoggedIn } from '@/redux/slices/user'
import Link from 'next/link'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import store, { RootState } from '@/redux/store'

import { useRouter } from 'next/router'
import { DEFAULT_PROFILE_IMAGES } from '@/utils'

type Props = {}

export const Navbar: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { isLoggedIn, isAuthenticated, user } = useSelector((state: RootState) => state.user)
  // const { isLoggedIn, isAuthenticated, user } = store.getState().user

  const [showDropdown, setShowDropdown] = useState<'user-menu' | 'hobby-list' | null>(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(updateIsLoggedIn(false))
    setShowDropdown(null)
    window.location.pathname = '/'
  }

  useEffect(() => {
    setShowDropdown(null)
  }, [router.pathname])

  return (
    <>
      <header className={`${styles['navbar-wrappper']}`}>
        <nav className={`site-container `}>
          <section className={styles['navbar-left']}>
            <Link href={isLoggedIn ? '/community' : '/'}>
              <Image
                src={LogoFull}
                alt="HobbyCue Logo"
                placeholder="blur" // Optional blur-up while loading
                priority
              />
            </Link>

            <TextField
              variant="outlined"
              placeholder="Search here..."
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  padding: 0,
                  overflow: 'hidden',
                  borderColor: 'red',
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
                      sx={{
                        bgcolor: 'primary.main',
                        borderRadius: '0px 8px 8px 0px',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      <SearchIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </section>

          <section className={styles['navbar-right']}>
            <ul>
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
                  <Image src={HobbyIcon} alt="" />
                  <span>Hobbies</span>
                  <KeyboardArrowDownRoundedIcon htmlColor="#939CA3" />
                </Link>
                {showDropdown === 'hobby-list' && (
                  <div className={styles['hobby-list-dropdown']}>
                    <section className={styles['list']}>
                      <h4>Art</h4>
                      <ul>
                        <li>Music</li>
                        <li>Dance</li>
                        <li>Literary</li>
                        <li>Theatre</li>
                        <li>Visual</li>
                      </ul>
                    </section>
                    <section className={styles['list']}>
                      <h4>Play</h4>

                      <ul>
                        <li>Fitness</li>
                        <li>Games</li>
                        <li>Sports</li>
                      </ul>
                    </section>
                    <section className={styles['list']}>
                      <h4>Making Things</h4>

                      <ul>
                        <li>Clothing</li>
                        <li>Cooking</li>
                        <li>Garden</li>
                        <li>Model</li>
                        <li>Utility</li>
                      </ul>
                    </section>
                    <section className={styles['list']}>
                      <h4>
                        <Link href={'/hobby/activity'}>Activity</Link>
                      </h4>

                      <ul>
                        <li>Animals</li>
                        <li>Observe</li>
                        <li>Outdoor</li>

                        <Link href={'/hobby/traveling'}>
                          <li>Travel</li>
                        </Link>
                        <Link href={'/hobby/wellness'}>
                          <li>Wellness</li>
                        </Link>
                      </ul>
                    </section>
                    <section className={styles['list']}>
                      <h4>Collecting</h4>

                      <ul>
                        <li>Items</li>
                        <li>Record</li>
                        <li>Spotting</li>
                      </ul>
                    </section>
                  </div>
                )}
              </li>

              {/* Bookmark */}
              <li>
                <Link href={'#'}>
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
                </Link>{' '}
              </li>

              {/* Notification */}
              <li>
                <Link href={'#'}>
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
                </Link>{' '}
              </li>

              {/* Cart */}
              <li>
                <Link href={'#'}>
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
                    <Image
                      src={user.profile_image || DEFAULT_PROFILE_IMAGES.user}
                      alt=""
                      width={48}
                      height={48}
                    />
                    <KeyboardArrowDownRoundedIcon htmlColor="#939CA3" />
                  </Link>

                  {showDropdown === 'user-menu' && (
                    <div className={styles['user-menu-dropdown']}>
                      <section className={styles['general-info']}>
                        <div className={styles['profile-name']}>
                          <Image
                            src={user.profile_image || DEFAULT_PROFILE_IMAGES.user}
                            alt=""
                            width={48}
                            height={48}
                          />
                          <h4>{user.full_name}</h4>
                        </div>
                        <Link prefetch={true} href={`/profile/${user.profile_url}`}>
                          <button className={styles['view-profile-btn']}>View Profile</button>
                        </Link>
                      </section>

                      <span className={styles['divider']}></span>

                      <section className={styles['manage']}>
                        <h5>Manage</h5>
                        <p>My Activity</p>
                        <p>My Orders</p>
                        <Link href={`/profile/${user.profile_url}/pages`}>
                          <p>My Pages</p>
                        </Link>
                      </section>

                      <span className={styles['divider']}></span>

                      <Link href={'/add-listing'}>
                        <h5 className={styles['add-listing']}>Add Listing Page</h5>
                      </Link>

                      <span className={styles['divider']}></span>

                      <section className={styles['account']}>
                        <h5>Account</h5>
                        <p>Settings</p>
                        <p onClick={handleLogout}>Sign Out</p>
                      </section>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <OutlinedButton
                    onClick={() => dispatch(openModal({ type: 'auth', closable: true }))}
                  >
                    Sign In
                  </OutlinedButton>{' '}
                </li>
              )}
            </ul>
          </section>
        </nav>
      </header>
      {showDropdown && <div className={styles['navbar-backdrop']}></div>}
    </>
  )
}
