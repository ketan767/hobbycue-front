import React from 'react'

type Props = {}

const CameraIcon: React.FC<Props> = (props) => {
  return (
    <>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#D9D9D9" />
        <g clip-path="url(#clip0_233_34097)">
          <path
            d="M15.9998 19.1969C17.7671 19.1969 19.1998 17.7642 19.1998 15.9969C19.1998 14.2296 17.7671 12.7969 15.9998 12.7969C14.2325 12.7969 12.7998 14.2296 12.7998 15.9969C12.7998 17.7642 14.2325 19.1969 15.9998 19.1969Z"
            fill="#08090A"
          />
          <path
            d="M13 6L11.17 8H8C6.9 8 6 8.9 6 10V22C6 23.1 6.9 24 8 24H24C25.1 24 26 23.1 26 22V10C26 8.9 25.1 8 24 8H20.83L19 6H13ZM16 21C13.24 21 11 18.76 11 16C11 13.24 13.24 11 16 11C18.76 11 21 13.24 21 16C21 18.76 18.76 21 16 21Z"
            fill="#08090A"
          />
        </g>
        <defs>
          <clipPath id="clip0_233_34097">
            <rect width="24" height="24" fill="white" transform="translate(4 4)" />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}

export default CameraIcon
