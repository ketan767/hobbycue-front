import * as React from "react"
const Downvote = (props : any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#8064A2"
        stroke="#8064A2"
        d="M6.859 3h10.523a.34.34 0 0 1 .339.34v5.77h4.922a.34.34 0 0 1 .258.56L12.378 21.89a.35.35 0 0 1-.509 0L1.346 9.67a.34.34 0 0 1 .251-.56H6.52V3.34A.34.34 0 0 1 6.86 3Zm10.183.679H7.198v5.77a.34.34 0 0 1-.34.34h-4.52l9.782 11.36 9.783-11.36h-4.521a.34.34 0 0 1-.34-.34V3.68Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M24.123 24h-24V0h24z" />
      </clipPath>
    </defs>
  </svg>
)
export default Downvote
