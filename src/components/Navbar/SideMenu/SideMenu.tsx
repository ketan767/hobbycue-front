import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import styles from './SideMenu.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { openModal } from '@/redux/slices/modal'
import { updateIsLoggedIn } from '@/redux/slices/user'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import store, { RootState } from '@/redux/store'
import BookmarkIcon from '@/assets/svg/bookmark.svg'
import ShoppingIcon from '@/assets/svg/shopping.svg'
import ExploreIcon from '@/assets/svg/navbar-explore-icon.svg'
import HobbyIcon from '@/assets/svg/hobby-colored.svg'
import CloseIcon from '@/assets/svg/cross.svg'
import DownIcon from '@/assets/svg/chevron-down.svg'

import { logout } from '@/helper'
import { Data } from '@react-google-maps/api'
import CustomizedTooltips from '@/components/Tooltip/ToolTip'
import {
  resetSearch,
  showAllEventTrue,
  showAllPeopleTrue,
  showAllPlaceTrue,
  showAllProductsTrue,
} from '@/redux/slices/search'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
type Props = {
  handleClose: any
}

const exploreOptions = [
  {
    text: 'People - Community',
  },
  {
    text: 'Places - Venues',
  },
  {
    text: 'Programs - Events',
  },
  {
    text: 'Products - Store',
  },
  {
    text: 'Posts - Write-ups',
  },
]

const SideMenu: React.FC<Props> = ({ handleClose }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const parentRef = useRef<HTMLDivElement>(null)
  const [exploreActive, setExploreActive] = useState(false)
  const [hobbiesActive, setHobbiesActive] = useState(false)

  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const handleLogout = () => {
    logout()
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

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleClick = (event: any) => {
    if (event.target === parentRef.current) {
      handleClose()
    }
  }

  const navigateToUserProfile = () => {
    router.push(`/profile/${user.profile_url}`)
    handleClose()
  }

  useEffect(() => {
    const handleLinkClick = (event: any) => {
      if (event.target.closest('a')) {
        handleClose()
      }
    }

    const mainElement = document.querySelector(`.${styles['main']}`)
    mainElement?.addEventListener('click', handleLinkClick)

    return () => {
      mainElement?.removeEventListener('click', handleLinkClick)
    }
  }, [handleClose])

  return (
    <>
      <div
        className={styles['container']}
        ref={parentRef}
        onClick={handleClick}
      >
        <div className={styles['wrapper']}>
          {isLoggedIn ? (
            <header className={styles.header}>
              <div
                className={styles['profile']}
                onClick={navigateToUserProfile}
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
                  <div className={`${styles['img']} default-user-icon`}></div>
                )}
                <p>{user?.full_name}</p>
              </div>
              <div className={styles['header-icons']}>
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
                </Link>
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
                <Image src={CloseIcon} alt="close" onClick={handleClose} />
              </div>
            </header>
          ) : (
            <header className={styles.header}>
              <div className={styles['header-icons']}>
                <Image src={CloseIcon} alt="close" onClick={handleClose} />
              </div>
            </header>
          )}
          <main className={styles['main']}>
            {isLoggedIn ? (
              <Link prefetch={true} href={`/profile/${user.profile_url}`}>
                <button className={styles['view-profile-btn']}>
                  View Profile
                </button>
              </Link>
            ) : (
              <button
                className={styles['view-profile-btn']}
                onClick={() => {
                  dispatch(openModal({ type: 'auth', closable: true }))
                  handleClose()
                }}
              >
                Sign in
              </button>
            )}
            <div
              className={`${styles['dropdown-container']} ${
                exploreActive ? styles['dropdown-active'] : ''
              } `}
            >
              <header className={styles['dropdown-header']}>
                <div
                  onClick={() => {
                    router.push('/explore')
                    handleClose()
                  }}
                >
                  <Image src={ExploreIcon} alt="Explore" />
                  <p> Explore </p>
                </div>
                <Image
                  onClick={() => setExploreActive(!exploreActive)}
                  src={DownIcon}
                  alt="Down"
                  className={`${styles['arrow']} ${
                    exploreActive && styles.rotate180
                  }`}
                />
              </header>
              <div className={styles['dropdown-options']}>
                {exploreOptions.map((option: any) => {
                  return <p key={option.text}>{option.text}</p>
                })}
              </div>

              <div className={styles['explore-list-dropdown']}>
                {exploreOptions.map((option: any) => (
                  <section className={styles['list']} key={option.text}>
                    <h4>
                      <Link
                        href={'/search'}
                        className={styles['hobbiescategory']}
                        onClick={(e) => {
                          e.preventDefault()
                          dispatch(resetSearch())

                          switch (option.text) {
                            case 'People - Community':
                              dispatch(showAllPeopleTrue())
                              break
                            case 'Places - Venues':
                              dispatch(showAllPlaceTrue())
                              break
                            case 'Programs - Events':
                              dispatch(showAllEventTrue())
                              break
                            case 'Products - Store':
                              dispatch(showAllProductsTrue())
                              break
                            case 'Posts - Write-ups':
                              showFeatureUnderDevelopment()
                              break
                            default:
                              break
                          }
                          router.push('/search')
                        }}
                      >
                        {option.text}
                      </Link>
                    </h4>
                  </section>
                ))}
              </div>
            </div>

            <div
              className={`${styles['dropdown-container']} ${
                hobbiesActive ? styles['dropdown-active'] : ''
              } `}
            >
              <header className={styles['dropdown-header']}>
                <div
                  onClick={() => {
                    router.push('/hobby')
                    handleClose()
                  }}
                >
                  <Image src={HobbyIcon} alt="Hobby" />
                  <p> Hobbies </p>
                </div>
                <Image
                  onClick={() => setHobbiesActive(!hobbiesActive)}
                  src={DownIcon}
                  alt="Down"
                  className={`${styles['arrow']} ${
                    hobbiesActive && styles.rotate180
                  }`}
                />
              </header>
              <div
                className={`${styles['dropdown-options']} ${styles['hobby-dropdown-options']}`}
              >
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
                    <Link
                      href={'/hobby/music'}
                      onClick={() => window.location.reload()}
                    >
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

                    <Link href={'/hobby/visual-arts'}>
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

                    <Link href={'/hobby/gardening'}>
                      <li>Garden</li>
                    </Link>

                    <Link href={'/hobby/model-making'}>
                      <li>Model</li>
                    </Link>

                    <Link href={'/hobby/making-utility'}>
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

                    <Link href={'/hobby/traveling'}>
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
                      href={'/hobby/collect'}
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

                    <Link href={'/hobby/record-keeping'}>
                      <li>Records</li>
                    </Link>
                  </ul>
                </section>
              </div>
            </div>
            {isLoggedIn ? (
              <div>
                <div
                  className={`${styles['dropdown-container']} ${
                    exploreActive ? styles['dropdown-active'] : ''
                  } `}
                >
                  <header>
                    <div>
                      <p>Manage</p>
                    </div>
                  </header>
                  <section className={styles['list']}>
                    {/* <ul>
                <Link href={'/hobby/music'}>
                  <li>My orders</li>
                </Link>
              </ul> */}
                    <ul>
                      <Link href={`/activity`}>
                        <li>My Activity</li>
                      </Link>
                      <Link href={`/orders`}>
                        <li>My Orders</li>
                      </Link>
                      <Link href={`/profile/${user.profile_url}/pages`}>
                        <li>My Pages</li>
                      </Link>
                    </ul>
                    <ul className={styles['add-listing-link']}>
                      <Link href={`/add-listing`}>
                        <li>Add Listing Page</li>
                      </Link>
                    </ul>
                  </section>
                </div>
                <div
                  className={`${styles['dropdown-container']} ${
                    exploreActive ? styles['dropdown-active'] : ''
                  } `}
                >
                  <header>
                    <div>
                      <p>Account</p>
                    </div>
                  </header>
                  <section className={styles['list']}>
                    {/* <ul>
                <Link href={'/hobby/music'}>
                  <li>My orders</li>
                </Link>
              </ul> */}
                    <ul>
                      <Link href={`/settings/login-security`}>
                        <li>Settings</li>
                      </Link>
                    </ul>
                    <ul onClick={handleLogout}>
                      <li>Sign Out</li>
                    </ul>
                  </section>
                </div>
              </div>
            ) : (
              ''
            )}
          </main>
        </div>
      </div>

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

export default SideMenu
