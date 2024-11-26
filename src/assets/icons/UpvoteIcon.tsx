import React from 'react'

const UpvoteIcon = ({ fill = false }) => {
  return fill ? (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 15L17 15V21H7L7 15Z" fill="#8064A2" />
      <path
        d="M12.857 3.36206C12.4608 2.90549 11.7532 2.90211 11.3527 3.35488L2.07967 13.8374C1.50872 14.4828 1.96695 15.5 2.82867 15.5L21.1978 15.5C22.055 15.5 22.5149 14.492 21.9531 13.8446L12.857 3.36206Z"
        fill="#8064A2"
      />
      <path
        d="M17.2329 21.5L6.71021 21.5C6.62018 21.5 6.53384 21.4642 6.47019 21.4006C6.40653 21.3369 6.37077 21.2506 6.37077 21.1606L6.37077 15.39H1.44884C1.38395 15.39 1.32042 15.3714 1.26577 15.3364C1.21113 15.3014 1.16766 15.2515 1.14051 15.1926C1.11336 15.1337 1.10368 15.0682 1.1126 15.0039C1.12153 14.9396 1.14869 14.8793 1.19086 14.8299L11.7136 2.60999C11.7463 2.57526 11.7857 2.54759 11.8295 2.52867C11.8733 2.50976 11.9205 2.5 11.9682 2.5C12.0159 2.5 12.0631 2.50976 12.1068 2.52867C12.1506 2.54759 12.1901 2.57526 12.2228 2.60999L22.7455 14.8299C22.7873 14.8788 22.8144 14.9386 22.8236 15.0022C22.8328 15.0659 22.8237 15.1309 22.7973 15.1896C22.771 15.2482 22.7285 15.2982 22.6749 15.3337C22.6213 15.3692 22.5586 15.3888 22.4943 15.39H17.5724L17.5724 21.1606C17.5724 21.2506 17.5366 21.3369 17.473 21.4006C17.4093 21.4642 17.323 21.5 17.2329 21.5ZM7.04965 20.8211L16.8935 20.8211V15.0506C16.8935 14.9606 16.9293 14.8742 16.9929 14.8106C17.0566 14.7469 17.1429 14.7111 17.2329 14.7111H21.7543L11.9716 3.35167L2.18883 14.7111H6.71021C6.80024 14.7111 6.88657 14.7469 6.95023 14.8106C7.01389 14.8742 7.04965 14.9606 7.04965 15.0506L7.04965 20.8211Z"
        fill="#8064A2"
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.2647 21.5L6.74195 21.5C6.65192 21.5 6.56558 21.4642 6.50193 21.4006C6.43827 21.3369 6.40251 21.2506 6.40251 21.1606L6.40251 15.39H1.48058C1.41569 15.39 1.35216 15.3714 1.29751 15.3364C1.24287 15.3014 1.19939 15.2515 1.17225 15.1926C1.1451 15.1337 1.13541 15.0682 1.14434 15.0039C1.15326 14.9396 1.18042 14.8793 1.2226 14.8299L11.7453 2.60999C11.778 2.57526 11.8175 2.54759 11.8613 2.52867C11.905 2.50976 11.9522 2.5 11.9999 2.5C12.0476 2.5 12.0948 2.50976 12.1386 2.52867C12.1824 2.54759 12.2218 2.57526 12.2545 2.60999L22.7772 14.8299C22.8191 14.8788 22.8461 14.9386 22.8553 15.0022C22.8645 15.0659 22.8554 15.1309 22.8291 15.1896C22.8027 15.2482 22.7603 15.2982 22.7066 15.3337C22.653 15.3692 22.5904 15.3888 22.5261 15.39H17.6041L17.6041 21.1606C17.6041 21.2506 17.5684 21.3369 17.5047 21.4006C17.4411 21.4642 17.3547 21.5 17.2647 21.5ZM7.08139 20.8211H16.9252V15.0506C16.9252 14.9606 16.961 14.8742 17.0247 14.8106C17.0883 14.7469 17.1747 14.7111 17.2647 14.7111H21.7861L12.0033 3.35167L2.22057 14.7111H6.74195C6.83197 14.7111 6.91831 14.7469 6.98197 14.8106C7.04563 14.8742 7.08139 14.9606 7.08139 15.0506L7.08139 20.8211Z"
        fill="#8064A2"
        stroke="#8064A2"
      />
    </svg>
  )
}

export default UpvoteIcon
