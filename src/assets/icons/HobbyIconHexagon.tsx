import React from 'react'

const HobbyIconHexagon = (Props:{size?:number}) => {
  return (
    <svg
      width={Props.size ? Props.size : 16}
      height={Props.size ? Props.size : 16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99929 0.727051L14.2977 4.36341V11.6361L7.99929 15.2725L1.70092 11.6361V4.36341L7.99929 0.727051Z"
        fill="#939CA3"
      />
      <path
        d="M7.7244 4.46331C7.81286 4.19819 8.18785 4.19819 8.27631 4.46331L8.9323 6.42941C8.97166 6.54736 9.08162 6.62725 9.20596 6.62823L11.2785 6.64456C11.558 6.64676 11.6739 7.00341 11.4491 7.16946L9.78194 8.4009C9.68192 8.47478 9.63992 8.60406 9.67741 8.72261L10.3023 10.6988C10.3866 10.9653 10.0832 11.1857 9.85584 11.0232L8.16949 9.81818C8.06832 9.74589 7.93239 9.74589 7.83122 9.81818L6.14487 11.0232C5.91748 11.1857 5.6141 10.9653 5.69836 10.6988L6.3233 8.72261C6.36079 8.60406 6.31879 8.47478 6.21877 8.4009L4.55161 7.16946C4.32681 7.00341 4.44269 6.64676 4.72216 6.64456L6.79475 6.62823C6.91908 6.62725 7.02905 6.54736 7.06841 6.42941L7.7244 4.46331Z"
        fill="white"
      />
    </svg>
  )
}

export default HobbyIconHexagon
