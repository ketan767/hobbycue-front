import React from 'react'
import styles from './styles.module.css'
type Props = {
  className?: any
  onClick?: any
}

const CloseIconWhite: React.FC<Props> = (props) => {
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
        <g clip-path="url(#clip0_17621_226974)">
          <path
            d="M18.3007 6.41383C17.9107 6.02383 17.2807 6.02383 16.8907 6.41383L12.0007 11.2938L7.1107 6.40383C6.7207 6.01383 6.0907 6.01383 5.7007 6.40383C5.3107 6.79383 5.3107 7.42383 5.7007 7.81383L10.5907 12.7038L5.7007 17.5938C5.3107 17.9838 5.3107 18.6138 5.7007 19.0038C6.0907 19.3938 6.7207 19.3938 7.1107 19.0038L12.0007 14.1138L16.8907 19.0038C17.2807 19.3938 17.9107 19.3938 18.3007 19.0038C18.6907 18.6138 18.6907 17.9838 18.3007 17.5938L13.4107 12.7038L18.3007 7.81383C18.6807 7.43383 18.6807 6.79383 18.3007 6.41383Z"
            fill="#ffff"
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

      {/* <svg
        tabIndex={0}
        role="button"
        className={`${styles['close-svg']} ${props.className}`}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        onClick={props.onClick}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            props.onClick && props.onClick()
          }
        }}
      >
        <g clipPath="url(#clip0_173_37496)">
          <path
            d="M24.4 7.61427C23.88 7.09427 23.04 7.09427 22.52 7.61427L16 14.1209L9.47996 7.60094C8.95996 7.08094 8.11996 7.08094 7.59996 7.60094C7.07996 8.12094 7.07996 8.96094 7.59996 9.48094L14.12 16.0009L7.59996 22.5209C7.07996 23.0409 7.07996 23.8809 7.59996 24.4009C8.11996 24.9209 8.95996 24.9209 9.47996 24.4009L16 17.8809L22.52 24.4009C23.04 24.9209 23.88 24.9209 24.4 24.4009C24.92 23.8809 24.92 23.0409 24.4 22.5209L17.88 16.0009L24.4 9.48094C24.9066 8.97427 24.9066 8.12094 24.4 7.61427Z"
            fill="#FFF"
          />
        </g>
        <defs>
          <clipPath id="clip0_173_37496">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg> */}
    </>
  )
}

export default CloseIconWhite
