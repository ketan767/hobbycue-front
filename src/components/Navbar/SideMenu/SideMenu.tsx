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
    <div className={styles['container']} ref={parentRef} onClick={handleClick}>
      <div className={styles['wrapper']}>
        {isLoggedIn ? (
          <header className={styles.header}>
            <div className={styles['profile']} onClick={navigateToUserProfile}>
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
              {user?.full_name}
            </div>
            <div className={styles['header-icons']}>
              <Image src={BookmarkIcon} alt="bookmark" />
              <Image src={ShoppingIcon} alt="shop" />
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
          <div
            className={`${styles['dropdown-container']} ${
              exploreActive ? styles['dropdown-active'] : ''
            } `}
          >
            <header onClick={() => setExploreActive(!exploreActive)}>
              <div>
                <Image src={ExploreIcon} alt="Explore" />
                <p> Explore </p>
              </div>
              <Image
                src={DownIcon}
                alt="Down"
                className={`${styles['arrow']}`}
              />
            </header>
            <div className={styles['dropdown-options']}>
              {exploreOptions.map((option: any) => {
                return <p key={option.text}>{option.text}</p>
              })}
            </div>
          </div>

          <div
            className={`${styles['dropdown-container']} ${
              hobbiesActive ? styles['dropdown-active'] : ''
            } `}
          >
            <header onClick={() => setHobbiesActive(!hobbiesActive)}>
              <div>
                <Image src={HobbyIcon} alt="Hobby" />
                <p> Hobbies </p>
              </div>
              <Image
                src={DownIcon}
                alt="Down"
                className={`${styles['arrow']}`}
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
                  <Link href={'/hobby/fitness'}>
                    <li>Fitness</li>
                  </Link>

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
                    <li>Animals</li>
                  </Link>

                  <Link href={'/hobby/observe'}>
                    <li>Observe</li>
                  </Link>

                  <Link href={'/hobby/outdoor'}>
                    <li>Outdoor</li>
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
                  <li>Items</li>

                  <Link href={'/hobby/record-keeping'}>
                    <li>Record</li>
                  </Link>

                  <li>Spotting</li>
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
                    <Link href={`/settings/login-and-security`}>
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
  )
}

export default SideMenu
