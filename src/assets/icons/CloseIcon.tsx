import React from 'react'
import styles from './styles.module.css'
type Props = {
  className?: any
  onClick?: any
}

const CloseIcon: React.FC<Props> = (props) => {
  return (
    <>
      <svg
        tabIndex={0}
        role="button"
        className={`${styles['close-svg']} ${props.className}`}
        onClick={props.onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            props.onClick && props.onClick()
          }
        }}
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_17621_226974)">
          <path
            d="M18.3007 6.41383C17.9107 6.02383 17.2807 6.02383 16.8907 6.41383L12.0007 11.2938L7.1107 6.40383C6.7207 6.01383 6.0907 6.01383 5.7007 6.40383C5.3107 6.79383 5.3107 7.42383 5.7007 7.81383L10.5907 12.7038L5.7007 17.5938C5.3107 17.9838 5.3107 18.6138 5.7007 19.0038C6.0907 19.3938 6.7207 19.3938 7.1107 19.0038L12.0007 14.1138L16.8907 19.0038C17.2807 19.3938 17.9107 19.3938 18.3007 19.0038C18.6907 18.6138 18.6907 17.9838 18.3007 17.5938L13.4107 12.7038L18.3007 7.81383C18.6807 7.43383 18.6807 6.79383 18.3007 6.41383Z"
            fill="#6D747A"
          />
        </g>
        <defs>
          <clipPath id="clip0_17621_226974">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0 0.703125)"
            />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}

export default CloseIcon
