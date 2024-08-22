import { FC } from 'react'
import styles from './AdminNavbar.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
// import ProfileSwitcher from '../ProfileSwitcher/ProfileSwitcher'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import { toggleAdminNav } from '@/redux/slices/site'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface AdminNavbarProps {}

interface IconProps {
  active?: boolean
}

const AdminNavbar: FC<AdminNavbarProps> = ({}) => {
  const { admin_nav } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = router.pathname

  const ArrowRight = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
    >
      <rect
        width="24"
        height="24"
        transform="translate(0.5)"
        fill="white"
        fillOpacity="0.01"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.7938 9.69817C10.7006 9.60626 10.6266 9.49673 10.576 9.37596C10.5255 9.25519 10.4995 9.12559 10.4995 8.99467C10.4995 8.86376 10.5255 8.73416 10.576 8.61339C10.6266 8.49262 10.7006 8.38309 10.7938 8.29117C10.9828 8.10461 11.2377 8 11.5033 8C11.7689 8 12.0238 8.10461 12.2128 8.29117L15.1778 11.2312C15.28 11.3325 15.3611 11.4531 15.4165 11.5859C15.4718 11.7188 15.5003 11.8613 15.5003 12.0052C15.5003 12.1491 15.4718 12.2916 15.4165 12.4244C15.3611 12.5573 15.28 12.6778 15.1778 12.7792L12.2228 15.7092C12.0337 15.896 11.7786 16.0008 11.5128 16.0008C11.247 16.0008 10.9919 15.896 10.8028 15.7092C10.7096 15.6173 10.6356 15.5077 10.585 15.387C10.5345 15.2662 10.5085 15.1366 10.5085 15.0057C10.5085 14.8748 10.5345 14.7452 10.585 14.6244C10.6356 14.5036 10.7096 14.3941 10.8028 14.3022L13.1208 12.0052L10.7938 9.69817Z"
        fill="#42526E"
      />
    </svg>
  )

  const ArrowDown = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={styles['admin-nav-arrow']}
    >
      <g clip-path="url(#clip0_11919_191435)">
        <path
          d="M15.88 9.28859L12 13.1686L8.11998 9.28859C7.72998 8.89859 7.09998 8.89859 6.70998 9.28859C6.31998 9.67859 6.31998 10.3086 6.70998 10.6986L11.3 15.2886C11.69 15.6786 12.32 15.6786 12.71 15.2886L17.3 10.6986C17.69 10.3086 17.69 9.67859 17.3 9.28859C16.91 8.90859 16.27 8.89859 15.88 9.28859Z"
          fill="#08090A"
        />
      </g>
      <defs>
        <clipPath id="clip0_11919_191435">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  const toggleNavbar = () => {
    dispatch(toggleAdminNav())
  }

  const UserIcon = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <g clip-path="url(#clip0_11920_191441)">
        <path
          d="M10.9998 11.0013C13.0257 11.0013 14.6665 9.36047 14.6665 7.33464C14.6665 5.3088 13.0257 3.66797 10.9998 3.66797C8.974 3.66797 7.33317 5.3088 7.33317 7.33464C7.33317 9.36047 8.974 11.0013 10.9998 11.0013ZM10.9998 12.8346C8.55234 12.8346 3.6665 14.063 3.6665 16.5013V18.3346H18.3332V16.5013C18.3332 14.063 13.4473 12.8346 10.9998 12.8346Z"
          fill={active ? '#0096C8' : '#6D747A'}
        />
      </g>
      <defs>
        <clipPath id="clip0_11920_191441">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
  const PostIcon = ({ active }: IconProps) => (
    <svg
      width="22"
      height="23"
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Posts">
        <path
          id="Vector"
          d="M12.6163 1.5H6C5.33696 1.5 4.70107 1.76339 4.23223 2.23223C3.76339 2.70107 3.5 3.33696 3.5 4V19C3.5 19.663 3.76339 20.2989 4.23223 20.7678C4.70107 21.2366 5.33696 21.5 6 21.5H16C16.663 21.5 17.2989 21.2366 17.7678 20.7678C18.2366 20.2989 18.5 19.663 18.5 19V7.38375C18.4999 7.05226 18.3682 6.73437 18.1337 6.5L13.5 1.86625C13.2656 1.63181 12.9477 1.50007 12.6163 1.5ZM12.875 5.875V3.375L16.625 7.125H14.125C13.7935 7.125 13.4755 6.9933 13.2411 6.75888C13.0067 6.52446 12.875 6.20652 12.875 5.875ZM6.625 5.25H9.75C9.91576 5.25 10.0747 5.31585 10.1919 5.43306C10.3092 5.55027 10.375 5.70924 10.375 5.875C10.375 6.04076 10.3092 6.19973 10.1919 6.31694C10.0747 6.43415 9.91576 6.5 9.75 6.5H6.625C6.45924 6.5 6.30027 6.43415 6.18306 6.31694C6.06585 6.19973 6 6.04076 6 5.875C6 5.70924 6.06585 5.55027 6.18306 5.43306C6.30027 5.31585 6.45924 5.25 6.625 5.25ZM6.625 9H15.375C15.5408 9 15.6997 9.06585 15.8169 9.18306C15.9342 9.30027 16 9.45924 16 9.625V18.375C16 18.5408 15.9342 18.6997 15.8169 18.8169C15.6997 18.9342 15.5408 19 15.375 19H6.625C6.45924 19 6.30027 18.9342 6.18306 18.8169C6.06585 18.6997 6 18.5408 6 18.375V9.625C6 9.45924 6.06585 9.30027 6.18306 9.18306C6.30027 9.06585 6.45924 9 6.625 9Z"
          fill={active ? '#0096C8' : '#6D747A'}
        />
        <rect
          id="Rectangle 3467572"
          x="5.55176"
          y="8.99609"
          width="10.9985"
          height="10.3002"
          fill="#6D747A"
        />
        <rect
          id="Rectangle 3467573"
          x="5.50098"
          y="11.4961"
          width="10.9985"
          height="1.26752"
          rx="0.63376"
          fill="white"
        />
        <rect
          id="Rectangle 3467574"
          x="5.55176"
          y="14.5078"
          width="10.9985"
          height="1.26752"
          rx="0.63376"
          fill="white"
        />
        <rect
          id="Rectangle 3467575"
          x="5.50098"
          y="17.5156"
          width="10.9985"
          height="1.26752"
          rx="0.63376"
          fill="white"
        />
      </g>
    </svg>
  )

  const UserHobbies = ({ active }: IconProps) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 1.5L19.2272 6.25V15.75L11 20.5L2.77276 15.75V6.25L11 1.5Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
      <path
        d="M10.6206 6.13723C10.7422 5.77269 11.2578 5.77269 11.3794 6.13723L12.2814 8.84062C12.3355 9.0028 12.4867 9.11266 12.6577 9.11401L15.5075 9.13645C15.8918 9.13948 16.0511 9.62987 15.742 9.85819L13.4497 11.5514C13.3122 11.653 13.2544 11.8308 13.3059 11.9938L14.1652 14.711C14.2811 15.0774 13.864 15.3805 13.5513 15.1571L11.2326 13.5002C11.0935 13.4008 10.9065 13.4008 10.7674 13.5002L8.44871 15.1571C8.13604 15.3805 7.71889 15.0774 7.83476 14.711L8.69405 11.9938C8.7456 11.8308 8.68785 11.653 8.55032 11.5514L6.25798 9.85819C5.94887 9.62987 6.1082 9.13948 6.49248 9.13645L9.34229 9.11401C9.51325 9.11266 9.66446 9.0028 9.71857 8.84062L10.6206 6.13723Z"
        fill="white"
      />
    </svg>
  )

  const PageIcon = ({ active }: IconProps) => (
    <svg
      width="22"
      height="17"
      viewBox="0 0 22 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group">
        <g id="Group_2">
          <g id="Group_3">
            <path
              id="Vector"
              d="M2.25117 0.9375C1.60664 1.06641 1.03086 1.65937 0.901953 2.32109C0.850391 2.60469 0.850391 14.3953 0.901953 14.6789C1.03086 15.3578 1.61523 15.9422 2.28555 16.0625C2.57773 16.1141 19.4301 16.1141 19.7137 16.0625C20.1863 15.968 20.659 15.6328 20.8996 15.2117C21.1402 14.7906 21.1402 14.9109 21.1402 10.2359V5.96484L19.2152 5.95625L17.2816 5.94766L17.0152 5.81875C16.6887 5.66406 16.4223 5.39766 16.2504 5.07109L16.1301 4.83906L16.1215 2.8625L16.1129 0.894531H9.27227C5.49961 0.903125 2.3457 0.920312 2.25117 0.9375ZM18.6051 7.86406V8.5H10.9996H3.39414V7.86406V7.22812H10.9996H18.6051V7.86406ZM18.6051 10.3992V11.0352H10.9996H3.39414V10.3992V9.76328H10.9996H18.6051V10.3992ZM18.6051 12.9344V13.5703H10.9996H3.39414V12.9344V12.2984H10.9996H18.6051V12.9344Z"
              fill={active ? '#0096C8' : '#6D747A'}
            />
            <path d="M17.3758 2.38047C17.3758 3.94453 17.3844 4.00469 17.6078 4.29688C17.668 4.37422 17.8141 4.49453 17.9344 4.56328L18.1406 4.675L19.2922 4.68359C19.9281 4.69219 20.5898 4.69219 20.7703 4.68359L21.0969 4.675L19.232 2.81016L17.3672 0.945312L17.3758 2.38047Z" />
          </g>
        </g>
      </g>
    </svg>
  )

  const Claims = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M11 1L19.6603 6V16L11 21L2.33975 16V6L11 1Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
      <path
        d="M7.49865 12.2995L8.90045 13.3181C9.32379 13.6257 9.91268 13.5549 10.2511 13.1557L14.5024 8.14062"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  )

  const Reports = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M14.0433 2.75H7.95667C7.71833 2.75 7.48 2.85083 7.315 3.01583L3.01583 7.315C2.85083 7.48 2.75 7.71833 2.75 7.95667V14.0342C2.75 14.2817 2.85083 14.5108 3.01583 14.685L7.30583 18.975C7.48 19.1492 7.71833 19.25 7.95667 19.25H14.0342C14.2817 19.25 14.5108 19.1492 14.685 18.9842L18.975 14.6942C19.0604 14.6088 19.1279 14.5073 19.1735 14.3955C19.2191 14.2838 19.242 14.164 19.2408 14.0433V7.95667C19.2408 7.70917 19.14 7.48 18.975 7.30583L14.685 3.01583C14.52 2.85083 14.2817 2.75 14.0433 2.75ZM11 15.8583C10.34 15.8583 9.80833 15.3267 9.80833 14.6667C9.80833 14.0067 10.34 13.475 11 13.475C11.66 13.475 12.1917 14.0067 12.1917 14.6667C12.1917 15.3267 11.66 15.8583 11 15.8583ZM11 11.9167C10.4958 11.9167 10.0833 11.5042 10.0833 11V7.33333C10.0833 6.82917 10.4958 6.41667 11 6.41667C11.5042 6.41667 11.9167 6.82917 11.9167 7.33333V11C11.9167 11.5042 11.5042 11.9167 11 11.9167Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
    </svg>
  )

  const Supports = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M8.97463 14.8235L8.97325 14.8193C8.88564 14.7926 8.79854 14.7641 8.712 14.7341C7.46989 14.2942 6.37998 13.5073 5.5715 12.4667C4.91822 11.6255 4.46933 10.6439 4.26026 9.59952C4.05118 8.55512 4.08763 7.47643 4.36673 6.44852C4.64582 5.42061 5.15994 4.47161 5.86852 3.67637C6.57709 2.88114 7.46076 2.26141 8.4498 1.86608C9.43884 1.47075 10.5062 1.31064 11.5677 1.39836C12.6292 1.48608 13.6558 1.81924 14.5666 2.37156C15.4773 2.92388 16.2472 3.68026 16.8156 4.58103C17.3841 5.48179 17.7354 6.50232 17.842 7.56209C17.8791 7.94022 17.567 8.24822 17.1875 8.24822C16.808 8.24822 16.5041 7.93884 16.4588 7.56209C16.336 6.58974 15.9557 5.66783 15.3572 4.89177C14.7586 4.11571 13.9636 3.51368 13.0543 3.14798C12.145 2.78229 11.1545 2.6662 10.1853 2.81174C9.2161 2.95728 8.30339 3.35915 7.54161 3.97578C6.77983 4.59241 6.19666 5.40139 5.85243 6.31902C5.50821 7.23665 5.41544 8.2296 5.58372 9.19511C5.752 10.1606 6.17521 11.0636 6.80958 11.8107C7.44394 12.5578 8.26641 13.1218 9.19188 13.4443C9.42532 13.0186 9.8015 12.6888 10.2542 12.5131C10.7069 12.3374 11.207 12.3271 11.6665 12.4839C12.1261 12.6408 12.5156 12.9547 12.7664 13.3705C13.0172 13.7863 13.1133 14.2772 13.0378 14.7568C12.9622 15.2365 12.7198 15.6741 12.3533 15.9926C11.9868 16.3112 11.5197 16.4902 11.0342 16.4981C10.5487 16.5061 10.0759 16.3425 9.6992 16.0362C9.32245 15.7298 9.06587 15.3004 8.97463 14.8235ZM7.88425 15.8891C6.53824 15.3382 5.36114 14.4423 4.4715 13.2917C4.24508 13.6302 4.12447 14.0285 4.125 14.4357V15.1232C4.125 17.8333 6.6825 20.6232 11 20.6232C15.3175 20.6232 17.875 17.8333 17.875 15.1232V14.4357C17.875 13.8887 17.6577 13.3641 17.2709 12.9773C16.8841 12.5905 16.3595 12.3732 15.8125 12.3732H13.75C14.0384 12.7584 14.2427 13.1998 14.3498 13.6689C14.4568 14.138 14.4642 14.6243 14.3714 15.0964C14.2786 15.5686 14.0877 16.016 13.8111 16.4097C13.5345 16.8034 13.1783 17.1346 12.7656 17.382C12.3529 17.6294 11.8929 17.7873 11.4153 17.8457C10.9377 17.904 10.4532 17.8615 9.99305 17.7208C9.53293 17.58 9.10748 17.3443 8.74422 17.0288C8.38096 16.7133 8.08799 16.325 7.88425 15.8891ZM15.125 8.24822C15.125 6.99147 14.5626 5.86534 13.6758 5.10909C13.2427 4.74231 12.7387 4.46882 12.1951 4.30572C11.6516 4.14263 11.0803 4.09344 10.5168 4.16123C9.95342 4.22903 9.41004 4.41235 8.9207 4.69972C8.43137 4.9871 8.00659 5.37235 7.67293 5.83139C7.33928 6.29042 7.10393 6.81336 6.9816 7.36751C6.85927 7.92165 6.8526 8.49507 6.962 9.05191C7.0714 9.60875 7.29452 10.137 7.6174 10.6037C7.94028 11.0704 8.35598 11.4654 8.8385 11.7641C9.44936 11.2674 10.2127 10.9965 11 10.9968C11.787 10.9957 12.5503 11.2657 13.1615 11.7613C13.7617 11.3924 14.2574 10.8757 14.6011 10.2607C14.9449 9.64566 15.1252 8.95279 15.125 8.24822Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
    </svg>
  )

  const Relations = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M10.9998 20.625C10.0373 20.625 9.22395 20.2926 8.55967 19.6277C7.89539 18.9628 7.56295 18.1494 7.56234 17.1875C7.56234 16.3931 7.79914 15.6943 8.27275 15.0911C8.74636 14.4879 9.34984 14.0788 10.0832 13.8637V11.9167H4.58317V8.25H2.2915V1.83333H8.70817V8.25H6.4165V10.0833H15.5832V8.13542C14.8498 7.92153 14.2464 7.51269 13.7728 6.90892C13.2991 6.30514 13.0623 5.60633 13.0623 4.8125C13.0623 3.85 13.3948 3.03661 14.0597 2.37233C14.7246 1.70806 15.5379 1.37561 16.4998 1.375C17.4623 1.375 18.276 1.70744 18.9409 2.37233C19.6058 3.03722 19.9379 3.85061 19.9373 4.8125C19.9373 5.60694 19.7005 6.30606 19.2269 6.90983C18.7533 7.51361 18.1498 7.92214 17.4165 8.13542V11.9167H11.9165V13.8646C12.6498 14.0785 13.2533 14.4873 13.7269 15.0911C14.2005 15.6949 14.4373 16.3937 14.4373 17.1875C14.4373 18.15 14.1049 18.9637 13.44 19.6286C12.7751 20.2935 11.9617 20.6256 10.9998 20.625Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
    </svg>
  )

  const Blogs = ({ active }: IconProps) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.2188 9.96875C17.6516 9.96875 17.1875 10.4328 17.1875 11V16.3831C17.1875 16.9503 16.7234 17.4144 16.1562 17.4144H5.84375C5.27656 17.4144 4.8125 16.9503 4.8125 16.3831V5.84375C4.8125 5.27656 5.27656 4.8125 5.84375 4.8125H11C11.5672 4.8125 12.0312 4.34844 12.0312 3.78125C12.0312 3.21406 11.5672 2.75 11 2.75H4.8125C3.67812 2.75 2.75 3.67812 2.75 4.8125V17.1875C2.75 18.3219 3.67812 19.25 4.8125 19.25H17.1875C18.3219 19.25 19.25 18.3219 19.25 17.1875V11C19.25 10.4328 18.7859 9.96875 18.2188 9.96875Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
      <path
        d="M14.0938 6.875H7.90625C7.33906 6.875 6.875 7.33906 6.875 7.90625C6.875 8.47344 7.33906 8.9375 7.90625 8.9375H14.0938C14.6609 8.9375 15.125 8.47344 15.125 7.90625C15.125 7.33906 14.6609 6.875 14.0938 6.875Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
      <path
        d="M14.0938 9.96875H7.90625C7.33906 9.96875 6.875 10.4328 6.875 11C6.875 11.5672 7.33906 12.0312 7.90625 12.0312H14.0938C14.6609 12.0312 15.125 11.5672 15.125 11C15.125 10.4328 14.6609 9.96875 14.0938 9.96875Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
      <path
        d="M14.0938 13.0625H7.90625C7.33906 13.0625 6.875 13.5266 6.875 14.0938C6.875 14.6609 7.33906 15.125 7.90625 15.125H14.0938C14.6609 15.125 15.125 14.6609 15.125 14.0938C15.125 13.5266 14.6609 13.0625 14.0938 13.0625Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
    </svg>
  )

  const SellerKYC = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M16.5002 11.918C16.7599 11.918 16.9777 11.83 17.1537 11.654C17.3297 11.478 17.4174 11.2604 17.4168 11.0013C17.4168 10.7416 17.3288 10.524 17.1528 10.3486C16.9768 10.1732 16.7593 10.0852 16.5002 10.0846H13.7502C13.4904 10.0846 13.2729 10.1726 13.0975 10.3486C12.9221 10.5246 12.8341 10.7422 12.8335 11.0013C12.8335 11.261 12.9215 11.4789 13.0975 11.6549C13.2735 11.8309 13.4911 11.9186 13.7502 11.918H16.5002ZM16.5002 9.16797C16.7599 9.16797 16.9777 9.07997 17.1537 8.90397C17.3297 8.72797 17.4174 8.51041 17.4168 8.2513C17.4168 7.99158 17.3288 7.77402 17.1528 7.59864C16.9768 7.42325 16.7593 7.33525 16.5002 7.33464H13.7502C13.4904 7.33464 13.2729 7.42264 13.0975 7.59864C12.9221 7.77464 12.8341 7.99219 12.8335 8.2513C12.8335 8.51102 12.9215 8.72889 13.0975 8.90489C13.2735 9.08089 13.4911 9.16858 13.7502 9.16797H16.5002ZM8.25016 11.918C7.70016 11.918 7.20364 11.9678 6.76058 12.0674C6.31752 12.167 5.92794 12.3234 5.59183 12.5367C5.271 12.7353 5.02655 12.9608 4.8585 13.2132C4.69044 13.4656 4.60641 13.7366 4.60641 14.0263C4.60641 14.2096 4.67516 14.3624 4.81266 14.4846C4.95016 14.6069 5.11822 14.668 5.31683 14.668H11.1835C11.3821 14.668 11.5502 14.6029 11.6877 14.4727C11.8252 14.3426 11.8939 14.1785 11.8939 13.9805C11.8939 13.7207 11.8099 13.4687 11.6418 13.2242C11.4738 12.9798 11.2293 12.7506 10.9085 12.5367C10.5724 12.3228 10.1828 12.1661 9.73975 12.0665C9.29669 11.9669 8.80016 11.9174 8.25016 11.918ZM8.25016 11.0013C8.75433 11.0013 9.18577 10.8219 9.5445 10.4632C9.90322 10.1045 10.0829 9.67275 10.0835 9.16797C10.0835 8.6638 9.90414 8.23236 9.54541 7.87364C9.18669 7.51491 8.75494 7.33525 8.25016 7.33464C7.746 7.33464 7.31455 7.5143 6.95583 7.87364C6.59711 8.23297 6.41744 8.66441 6.41683 9.16797C6.41683 9.67214 6.5965 10.1039 6.95583 10.4632C7.31516 10.8226 7.74661 11.0019 8.25016 11.0013ZM3.66683 18.3346C3.16266 18.3346 2.73122 18.1553 2.3725 17.7966C2.01377 17.4378 1.83411 17.0061 1.8335 16.5013V5.5013C1.8335 4.99714 2.01316 4.56569 2.3725 4.20697C2.73183 3.84825 3.16327 3.66858 3.66683 3.66797H18.3335C18.8377 3.66797 19.2694 3.84764 19.6287 4.20697C19.9881 4.5663 20.1674 4.99775 20.1668 5.5013V16.5013C20.1668 17.0055 19.9875 17.4372 19.6287 17.7966C19.27 18.1559 18.8383 18.3352 18.3335 18.3346H3.66683Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
    </svg>
  )

  const ListValues = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M7.33333 15.5833C7.59306 15.5833 7.81092 15.4953 7.98692 15.3193C8.16292 15.1433 8.25061 14.9258 8.25 14.6667C8.25 14.4069 8.162 14.1894 7.986 14.014C7.81 13.8386 7.59244 13.7506 7.33333 13.75C7.07361 13.75 6.85606 13.838 6.68067 14.014C6.50528 14.19 6.41728 14.4076 6.41667 14.6667C6.41667 14.9264 6.50467 15.1442 6.68067 15.3202C6.85667 15.4963 7.07422 15.5839 7.33333 15.5833ZM7.33333 11.9167C7.59306 11.9167 7.81092 11.8287 7.98692 11.6527C8.16292 11.4767 8.25061 11.2591 8.25 11C8.25 10.7403 8.162 10.5227 7.986 10.3473C7.81 10.1719 7.59244 10.0839 7.33333 10.0833C7.07361 10.0833 6.85606 10.1713 6.68067 10.3473C6.50528 10.5233 6.41728 10.7409 6.41667 11C6.41667 11.2597 6.50467 11.4776 6.68067 11.6536C6.85667 11.8296 7.07422 11.9173 7.33333 11.9167ZM7.33333 8.25C7.59306 8.25 7.81092 8.162 7.98692 7.986C8.16292 7.81 8.25061 7.59244 8.25 7.33333C8.25 7.07361 8.162 6.85606 7.986 6.68067C7.81 6.50528 7.59244 6.41728 7.33333 6.41667C7.07361 6.41667 6.85606 6.50467 6.68067 6.68067C6.50528 6.85667 6.41728 7.07422 6.41667 7.33333C6.41667 7.59306 6.50467 7.81092 6.68067 7.98692C6.85667 8.16292 7.07422 8.25061 7.33333 8.25ZM10.0833 15.5833H15.5833V13.75H10.0833V15.5833ZM10.0833 11.9167H15.5833V10.0833H10.0833V11.9167ZM10.0833 8.25H15.5833V6.41667H10.0833V8.25ZM4.58333 19.25C4.07917 19.25 3.64772 19.0706 3.289 18.7119C2.93028 18.3532 2.75061 17.9214 2.75 17.4167V4.58333C2.75 4.07917 2.92967 3.64772 3.289 3.289C3.64833 2.93028 4.07978 2.75061 4.58333 2.75H17.4167C17.9208 2.75 18.3526 2.92967 18.7119 3.289C19.0713 3.64833 19.2506 4.07978 19.25 4.58333V17.4167C19.25 17.9208 19.0706 18.3526 18.7119 18.7119C18.3532 19.0713 17.9214 19.2506 17.4167 19.25H4.58333Z"
        fill={active ? '#0096C8' : '#6D747A'}
      />
    </svg>
  )

  const NavItem = ({
    url,
    Icon,
    name,
  }: {
    url: string
    Icon: FC<IconProps>
    name: string
  }) => {
    return (
      <Link
        href={url}
        className={
          styles['nav-item'] + ` ${pathname === url && styles['active']}`
        }
      >
        <span>
          <Icon active={pathname === url} />
        </span>
        {admin_nav && <p className={styles['nav-item-para']}>{name}</p>}
      </Link>
    )
  }

  return (
    <nav className={styles.container + ` ${admin_nav && styles.open}`}>
      <div
        onClick={toggleNavbar}
        style={{
          rotate: admin_nav ? '180deg' : '0deg',
          left: admin_nav ? '248px' : '59px',
        }}
        className={styles.arrowbox}
      >
        <ArrowRight />
      </div>
      <div className={`${styles.navlist} custom-scrollbar`}>
        {/* <ProfileSwitcher /> */}

        <div className={styles['profile-switcher']}>
          <div className={styles['profile-and-title']}>
            <span>
              <Link
                href={'/admin/dashboard'}
                className={styles['profile-and-title']}
              >
                <img src={defaultUserImage?.src} alt="" />
              </Link>
            </span>

            {admin_nav && <p>Hobbycue Admin</p>}
            {admin_nav && <ArrowDown />}
          </div>
        </div>

        <NavItem url="/admin/users" name="Users" Icon={UserIcon} />
        <NavItem url="/admin/posts" name="Posts" Icon={PostIcon} />
        <NavItem url="/admin/hobbies" name="Hobbies" Icon={UserHobbies} />
        <NavItem url="/admin/hobby" name="Edit Hobbies" Icon={UserHobbies} />
        <NavItem url="/admin/pages" name="Pages" Icon={PageIcon} />
        <NavItem url="/admin/claims" name="Claims" Icon={Claims} />
        <NavItem url="/admin/reports" name="Reports" Icon={Reports} />
        <NavItem url="/admin/supports" name="Support" Icon={Supports} />
        {/* here please change the Supports icon with contact us icon */}
        <NavItem url="/admin/contactUs" name="Contact Us" Icon={Supports} />
        <NavItem
          url="/admin/searchHistory"
          name="Search History"
          Icon={Supports}
        />
        <NavItem url="/admin/communities" name="Communities" Icon={Supports} />
        <NavItem url="/admin/relations" name="Relation" Icon={Relations} />
        <NavItem url="/admin/blogs" name="Blogs" Icon={Blogs} />
        <NavItem url="/admin/sellers-kyc" name="Seller KYC" Icon={SellerKYC} />
        <NavItem
          url="/admin/list-of-values"
          name="List Values"
          Icon={ListValues}
        />
      </div>
    </nav>
  )
}

export default AdminNavbar
