import React, { useState } from 'react'
import styles from './footer.module.css'

import Facebook from '@/assets/svg/social/facebook.svg'
import Instagram from '@/assets/svg/social/instagram.svg'
import ChevronDown from '@/assets/svg/chevron-down.svg'

import Pintrest from '@/assets/svg/social/Pinterest.svg'

import Telegram from '@/assets/svg/social/telegram.svg'
import Twitter from '@/assets/svg/social/X.svg'
import LinkedIn from '@/assets/svg/social/LinkedIn.svg'
import Youtube from '@/assets/svg/social/youtube.svg'
import Message from '@/assets/svg/social/Message.svg'

import HoverFacebook from '@/assets/svg/hover/Facebook.svg'
import HoverIntsa from '@/assets/svg/hover/Instagram.svg'
import HoverPinterest from '@/assets/svg/hover/Pinterest.svg'
import HoverTelegram from '@/assets/svg/hover/Telegram.svg'
import HoverTwitter from '@/assets/svg/hover/X.svg'
import HoverLinkedIn from '@/assets/svg/hover/Linkedin.svg'
import HoverYoutube from '@/assets/svg/hover/Youtube.svg'
import HoverMessage from '@/assets/svg/hover/Message.svg'

import { InviteToHobbycue } from '@/services/auth.service'
import Image from 'next/image'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { useDispatch, useSelector } from 'react-redux'
import { showAllProductsTrue } from '@/redux/slices/search'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { useRouter } from 'next/router'
import { validateEmail } from '@/utils'

const icons = [
  {
    name: Facebook,
    link: 'https://www.facebook.com/hobbycue.community',
    hover: HoverFacebook,
  },
  { name: Twitter, link: 'https://twitter.com/hobbycue', hover: HoverTwitter },
  {
    name: Instagram,
    link: 'https://www.instagram.com/hobbycue.community',
    hover: HoverIntsa,
  },
  {
    name: Pintrest,
    link: 'https://in.pinterest.com/hobbycue/',
    hover: HoverPinterest,
  },
  {
    name: LinkedIn,
    link: 'https://linkedin.com/company/hobbycue',
    hover: HoverLinkedIn,
  },
  {
    name: Youtube,
    link: 'https://www.youtube.com/@hobbycue',
    hover: HoverYoutube,
  },
  { name: Telegram, link: 'https://t.me/hobbycue', hover: HoverTelegram },
  { name: Message, link: 'mailto:info@hobbycue.com', hover: HoverMessage },
]
const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [expandHobbyCue, setExpandHobbyCue] = useState(false)
  const [expandHowDoI, setExpandHowDoI] = useState(false)
  const [expandQuickLinks, setExpandQuickLinks] = useState(false)
  const [inviteBtnLoader, setInviteBtnLoader] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const dispatch = useDispatch()
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const router = useRouter()

  const handleExpand = (type: string) => {
    if (type === 'HobbyCue') {
      return expandHobbyCue
    }
    if (type === 'How do I') {
      return expandHowDoI
    }
    if (type === 'Quick Links') {
      return expandQuickLinks
    }
  }
  const handleSetExpand = (type: string) => {
    if (type === 'HobbyCue') {
      setExpandHobbyCue(!expandHobbyCue)
    }
    if (type === 'How do I') {
      setExpandHowDoI(!expandHowDoI)
    }
    if (type === 'Quick Links') {
      setExpandQuickLinks(!expandQuickLinks)
    }
  }

  const data = [
    {
      title: 'HobbyCue',
      values: [
        { title: 'About Us', link: 'http://blog.hobbycue.com/about/' },
        { title: 'Our Services', link: 'http://blog.hobbycue.com/services/' },
        { title: 'Work with Us', link: 'http://blog.hobbycue.com/work/' },
        { title: 'FAQ', link: 'http://blog.hobbycue.com/faq/' },
        { title: 'Contact Us', link: '/contact/' },
      ],
    },
    {
      title: 'How do I',
      values: [
        { title: 'Sign Up', link: 'http://blog.hobbycue.com/how-to/' },
        {
          title: 'Add a Listing',
          link: 'http://blog.hobbycue.com/how-to/#add-listing/',
        },
        {
          title: 'Claim Listing',
          link: 'http://blog.hobbycue.com/how-to/#claim-listing/',
        },
        {
          title: 'Post a Query',
          link: 'http://blog.hobbycue.com/how-to/#post-query/',
        },
        {
          title: 'Add a Blog Post',
          link: 'http://blog.hobbycue.com/how-to/#blog-post/',
        },
        { title: 'Other Queries', link: 'http://blog.hobbycue.com/how-to/' },
      ],
    },
    {
      title: 'Quick Links',

      values: [
        { title: 'Listing Pages', link: '/search' },
        { title: 'Blog Posts', link: 'http://blog.hobbycue.com' },
        {
          title: 'Shop / Store',
          link: '/search',
          func: () => {
            dispatch(showAllProductsTrue())
            router.push('/search')
          },
        },
        {
          title: 'Community',
          link: '/community',
          func: () => {
            if (isLoggedIn) {
              return
            } else {
              dispatch(openModal({ type: 'auth', closable: true }))
            }
          },
        },
        { title: 'Sitemap', link: '/sitemap' },
      ],
    },
  ]
  const to = email

  const sendInvite = async () => {
    if (!to || to === '') {
      setErrorMessage('This field is required')
      return
    }
    if (!validateEmail(to)) {
      setErrorMessage('Please enter a valid email')
      return
    }
    setErrorMessage('')
    setInviteBtnLoader(true)
    const { err, res } = await InviteToHobbycue({
      to,
    })
    if (res?.data?.success) {
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Invitation sent sucessfully!',
      })
      setEmail('')
    }
    if (err) {
      setEmail('')
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'error',
        message: 'Invitation failed.',
      })
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.contentWrapper}>
            {data.map((item: any, idx: any) => {
              return (
                <div key={idx}>
                  <div onClick={() => handleSetExpand(item.title)}>
                    <p
                      style={{ cursor: 'pointer' }}
                      className={styles.listHeading}
                    >
                      {item.title}
                    </p>
                    <Image
                      src={ChevronDown}
                      alt=""
                      width={20}
                      height={20}
                      className={`${styles['chevron-down']}${
                        handleExpand(item.title)
                          ? ' ' + styles['rotate-180']
                          : ''
                      }`}
                    />
                  </div>
                  <ul
                    className={
                      handleExpand(item.title)
                        ? styles?.listContainerExapnd
                        : styles.listContainer
                    }
                  >
                    {item.values.map((value: any, idx: any) => {
                      return (
                        <Link
                          key={idx}
                          onClick={(e) => {
                            if (value.func) {
                              e.preventDefault()
                              value.func()
                            }
                          }}
                          href={value.link}
                        >
                          <li className={styles.listItem} key={idx}>
                            {value.title}
                          </li>
                        </Link>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className={styles.rightSection}>
            <div>
              <p className={styles.listHeading}> Invite Friends </p>
              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder={`Email ID`}
                  value={email}
                  name="society"
                  onChange={(e: any) => setEmail(e.target.value)}
                  className={errorMessage !== ''?styles['errorInput']:""}
                />
                <button onClick={sendInvite} className={styles.button}>
                  {inviteBtnLoader ? (
                    <CircularProgress color="inherit" size={'20px'} />
                  ) : (
                    'Invite'
                  )}
                </button>
                {errorMessage !== '' && (
                  <span className={styles['error-invite']}>{errorMessage}</span>
                )}
              </div>
            </div>
            <div className={styles.inviteContainer}>
              <p className={styles.listHeading}> Social Media </p>
              <div className={styles.iconsContainer}>
                {icons.map((Icon: any, idx: any) => {
                  return (
                    <Link target="_blank" href={Icon.link} key={idx}>
                      <Image
                        onMouseEnter={(e) => {
                          e.currentTarget.src = Icon.hover.src
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.src = Icon.name.src
                        }}
                        className={styles.socialIcons}
                        height={32}
                        width={32}
                        src={Icon.name}
                        alt="social-media"
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottombar}>© Purple Cues Private Limited</div>
      {
        <CustomSnackbar
          message={snackbar.message}
          triggerOpen={snackbar.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default Footer
