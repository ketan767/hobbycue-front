import React, { useEffect, useState } from 'react'

import styles from './UserOnboardingWelcomeModal.module.css'
import Image from 'next/image'
import SearchIcon from '@mui/icons-material/Search'
import FilledButton from '@/components/_buttons/FilledButton'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'

const UserOnboardingWelcomeModal = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const initialInnerWidth = () => {
    let width = window.innerWidth
    if (width - 1300 >= 0) {
      return (width - 1300) / 2
    } else return 0
  }
  const [screenWidth, setScreenWidth] = useState(initialInnerWidth)

  useEffect(() => {
    const updateScreenWidth = () => {
      let width = window.innerWidth
      if (width - 1300 >= 0) {
        setScreenWidth((width - 1300) / 2)
      } else setScreenWidth(0)
    }
    window.addEventListener('resize', updateScreenWidth)
    return () => {
      window.removeEventListener('resize', updateScreenWidth)
    }
  }, [])
  console.error(screenWidth)

  return (
    <div className={styles.wrapper}>
      <div className={styles['display-desktop']}>
        <div
          style={{ left: `calc(0rem + ${screenWidth}px - 5px)` }}
          className={styles['my-community-wrapper']}
        >
          <Image src="/logo-welcome-small.svg" alt="" width={55} height={55} />
          <div>
            <div className={styles['my-community']}>
              <svg
                width="22"
                height="19"
                viewBox="0 0 22 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0V19H22L0 0Z" fill="white" />
              </svg>
              <div>
                <p>My community</p>
                <p>Communities specific to your Hobbies + Location.</p>

                <FilledButton
                  className={styles['button']}
                  onClick={() => {
                    router.push('/community')
                    dispatch(closeModal())
                  }}
                >
                  My Community
                </FilledButton>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ left: `calc(5.4rem + ${screenWidth}px)` }}
          className={styles['search-wrapper']}
        >
          <div className={styles['search']}>
            <div>
              <p>Search here...</p>
            </div>
            <div>
              <SearchIcon />
            </div>
          </div>
          <div>
            <div className={styles['search-content']}>
              <svg
                width="22"
                height="19"
                viewBox="0 0 22 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0V19H22L0 0Z" fill="white" />
              </svg>
              <div>
                <p>Search</p>
                <p>Search the site and you may find your next cue.</p>
                <FilledButton
                  className={styles['button']}
                  onClick={() => {
                    router.push('/search')
                    dispatch(closeModal())
                  }}
                >
                  Search
                </FilledButton>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ right: `calc(1.5rem + ${screenWidth}px)` }}
          className={styles['my-profile-wrapper']}
        >
          <div className={styles['my-profile']}>
            <Image src={'/testPerson.png'} alt="" width={50} height={50} />
          </div>
          <div>
            <div className={styles['my-profile-content']}>
              <svg
                width="22"
                height="19"
                viewBox="0 0 22 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 0V19H0L22 0Z" fill="white" />
              </svg>

              <div>
                <p>My Profile</p>
                <p>View your Profile, Add Pics, Social and more.</p>
                <FilledButton
                  className={styles['button']}
                  onClick={() => {
                    dispatch(closeModal())
                  }}
                >
                  My Profile
                </FilledButton>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['welcome-wrapper']}>
          <div>
            <Image src={'/celebration.png'} alt="" width={60} height={60} />
          </div>
          <div>
            <p>Welcome to HobbyCue</p>
            <div>
              <p>Choose from one of the options to continue.</p>
              <p>You can always find them on the top navigation.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles['mobile']} ${styles['display-mobile']}`}>
        <div>
          <div className={styles['my-community-wrapper-mobile']}>
            <Image
              src="/logo-welcome-small.svg"
              alt=""
              width={40}
              height={40}
            />
            <div>
              <div className={styles['my-community-mobile']}>
                <svg
                  width="44"
                  height="314"
                  viewBox="0 0 44 314"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.78125 0.742188V308.418C1.78125 310.627 3.57211 312.418 5.78125 312.418H43.127"
                    stroke="#1CB7EB"
                    stroke-width="2"
                  />
                </svg>

                <div className={styles['my-community-mobile-content']}>
                  <div>
                    <p>My community</p>
                    <p>Communities specific to your Hobbies + Location.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['search-wrapper-mobile']}>
            <Image src={'/searchIcon.svg'} width={30} height={30} alt="" />
            <div>
              <div className={styles['search-mobile']}>
                <svg
                  width="76"
                  height="112"
                  viewBox="0 0 76 112"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M74.3128 0.0234375V106.738C74.3128 108.947 72.5219 110.738 70.3128 110.738H0.9375"
                    stroke="#1CB7EB"
                    stroke-width="2"
                  />
                </svg>
                <div className={styles['search-mobile-content']}>
                  <div>
                    <p>Search</p>
                    <p>Search the site and you may find your next cue.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['my-profile-wrapper-mobile']}>
            <Image src={'/hamburger-menu.svg'} width={30} height={30} alt="" />
            <div>
              <div className={styles['my-profile-mobile']}>
                <svg
                  width="68"
                  height="215"
                  viewBox="0 0 68 215"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M66.3993 0.0859375V209.441C66.3993 211.651 64.6085 213.441 62.3993 213.441H0.429688"
                    stroke="#1CB7EB"
                    stroke-width="2"
                  />
                </svg>
                <div className={styles['my-profile-mobile-content']}>
                  <div>
                    <p>My Profile</p>
                    <p>Search the site and you may find your next cue.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['welcome-wrapper-mobile']}>
            <div>
              <Image src={'/celebration.png'} alt="" width={60} height={60} />
            </div>
            <div>
              <p>Welcome to HobbyCue</p>
              <div>
                <p>Choose from one of the options to continue.</p>
                <p>You can always find them on the top navigation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserOnboardingWelcomeModal
