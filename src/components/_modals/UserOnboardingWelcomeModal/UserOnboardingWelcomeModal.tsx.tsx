import React, { useEffect, useState } from 'react'

import styles from './UserOnboardingWelcomeModal.module.css'
import Image from 'next/image'
import SearchIcon from '@mui/icons-material/Search'
import FilledButton from '@/components/_buttons/FilledButton'

const UserOnboardingWelcomeModal = () => {
  const initialInnerWidth = () => {
    let width = window.innerWidth
    if (width - 1300 >= 0) {
      return ((width - 1300) / 2)
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
      <div>
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
                <FilledButton className={styles['button']}>
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
                <FilledButton className={styles['button']}>Search</FilledButton>
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
                <FilledButton className={styles['button']}>
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
    </div>
  )
}

export default UserOnboardingWelcomeModal
