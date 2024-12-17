import React from 'react'
import styles from '@/components/Navbar/SideMenu/SideMenu.module.css'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const ProfileSwitcherDownArrow = () => {
  const { activeProfile } = useSelector((state: RootState) => state.user)
  return (
    <svg
      className={
        activeProfile?.data?.profile_image
          ? `${styles['profile-switcher-downarrow']}`
          : `${[styles['profile-switcher-downarrow-icon']]}`
      }
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_9395_172053)">
        <rect width="16" height="16" rx="8" fill="white" />
        <path
          d="M10.5896 6.195L8.00292 8.78167L5.41625 6.195C5.15625 5.935 4.73625 5.935 4.47625 6.195C4.21625 6.455 4.21625 6.875 4.47625 7.135L7.53625 10.195C7.79625 10.455 8.21625 10.455 8.47625 10.195L11.5363 7.135C11.7963 6.875 11.7963 6.455 11.5363 6.195C11.2763 5.94167 10.8496 5.935 10.5896 6.195Z"
          fill="#8064A2"
        />
      </g>
      <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#8064A2" />
      <defs>
        <clipPath id="clip0_9395_172053">
          <rect width="16" height="16" rx="8" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default ProfileSwitcherDownArrow
