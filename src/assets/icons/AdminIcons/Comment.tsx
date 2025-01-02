import * as React from "react"
const Comment = (props : any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="#8064A2"
        stroke="#fff"
        strokeWidth={0.23}
        d="M6 18.685h-.05l-.033.036-3.802 3.991V4.1c0-1.097.854-1.985 1.885-1.985h16c1.031 0 1.885.888 1.885 1.985v12.6c0 1.097-.854 1.985-1.885 1.985H6Zm14-1.87h.115V3.985H3.885v15.102l.198-.208 1.966-2.064H20Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default Comment
