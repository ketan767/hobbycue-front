import React from 'react'

const DoubleDownArrow = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="31.5"
        y="31.5"
        width="31"
        height="31"
        rx="15.5"
        transform="rotate(-180 31.5 31.5)"
        fill="#F7F5F9"
      />
      <rect
        x="31.5"
        y="31.5"
        width="31"
        height="31"
        rx="15.5"
        transform="rotate(-180 31.5 31.5)"
        stroke="#8064A2"
      />
      <path
        d="M19.75 16.9375L16 20.6875L12.25 16.9375M19.75 11.3125L16 15.0625L12.25 11.3125"
        stroke="#8064A2"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

export default DoubleDownArrow
