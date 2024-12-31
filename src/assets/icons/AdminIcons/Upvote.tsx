import * as React from "react"
const Upvote = (props : any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#8064A2"
      stroke="#8064A2"
      d="M17.264 21.5H6.741a.34.34 0 0 1-.339-.34v-5.77H1.48a.34.34 0 0 1-.258-.56L11.745 2.61a.349.349 0 0 1 .509 0l10.523 12.22a.34.34 0 0 1-.251.56h-4.922v5.77a.34.34 0 0 1-.34.34Zm-10.183-.679h9.844v-5.77a.34.34 0 0 1 .34-.34h4.52l-9.782-11.36-9.783 11.36h4.521a.34.34 0 0 1 .34.34v5.77Z"
    />
  </svg>
)
export default Upvote
