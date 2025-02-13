import React from 'react'

type Props = {
  className: any
  onClick: any
}

const CloseIcon: React.FC<Props> = (props) => {
  return (
    <>
      <svg
        className={props.className}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        onClick={props.onClick}
      >
        <g clipPath="url(#clip0_173_37496)">
          <path
            d="M24.4 7.61427C23.88 7.09427 23.04 7.09427 22.52 7.61427L16 14.1209L9.47996 7.60094C8.95996 7.08094 8.11996 7.08094 7.59996 7.60094C7.07996 8.12094 7.07996 8.96094 7.59996 9.48094L14.12 16.0009L7.59996 22.5209C7.07996 23.0409 7.07996 23.8809 7.59996 24.4009C8.11996 24.9209 8.95996 24.9209 9.47996 24.4009L16 17.8809L22.52 24.4009C23.04 24.9209 23.88 24.9209 24.4 24.4009C24.92 23.8809 24.92 23.0409 24.4 22.5209L17.88 16.0009L24.4 9.48094C24.9066 8.97427 24.9066 8.12094 24.4 7.61427Z"
            fill="#6D747A"
          />
        </g>
        <defs>
          <clipPath id="clip0_173_37496">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  )
}

export default CloseIcon
