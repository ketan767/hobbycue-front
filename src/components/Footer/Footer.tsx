import React, { useState } from 'react'
import styles from './footer.module.css'

import Facebook from '@/assets/svg/social/facebook.svg'
import Instagram from '@/assets/svg/social/instagram.svg'
import ChevronDown from '@/assets/svg/chevron-down.svg'

import Pintrest from '@/assets/svg/social/Pinterest.svg'

import Telegram from '@/assets/svg/social/telegram.svg'
import Twitter from '@/assets/svg/social/twitter.svg'
import Youtube from '@/assets/svg/social/youtube.svg'
import { InviteToHobbycue } from '@/services/auth.service'
import Image from 'next/image'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

const icons = [
  { name: Facebook, link: 'https://www.facebook.com/hobbycue.community' },
  { name: Twitter, link: 'https://twitter.com/hobbycue' },
  { name: Instagram, link: 'https://www.instagram.com/hobbycue.community' },
  { name: Pintrest, link: 'https://in.pinterest.com/hobbycue/' },
  {
    name: Youtube,
    link: 'https://www.youtube.com/channel/UCEPxiQLanjReHcRe0FaHvrQ',
  },
  { name: Telegram, link: 'https://t.me/hobbycue' },
]
const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [expandHobbyCue, setExpandHobbyCue] = useState(false)
  const [expandHowDoI, setExpandHowDoI] = useState(false)
  const [expandQuickLinks, setExpandQuickLinks] = useState(false)
  const [inviteBtnLoader, setInviteBtnLoader] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const handleExpand = (type: string) => {
    if (type === 'Hobbycue') {
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
    if (type === 'Hobbycue') {
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
      title: 'Hobbycue',
      values: [
        { title: 'About Us', link: 'http://wp.hobbycue.com/about/' },
        { title: 'Our Services', link: 'http://wp.hobbycue.com/services/' },
        { title: 'Work with Us', link: 'http://wp.hobbycue.com/work/' },
        { title: 'FAQ', link: 'http://wp.hobbycue.com/faq/' },
        { title: 'Contact Us', link: '/contact/' },
      ],
    },
    {
      title: 'How do I',
      values: [
        { title: 'Sign Up', link: 'http://wp.hobbycue.com/how-to/' },
        {
          title: 'Add a Listing',
          link: 'http://wp.hobbycue.com/how-to/#add-listing/',
        },
        {
          title: 'Claim Listing',
          link: 'http://wp.hobbycue.com/how-to/#claim-listing/',
        },
        {
          title: 'Post a Query',
          link: 'http://wp.hobbycue.com/how-to/#post-query/',
        },
        {
          title: 'Add a Blog Post',
          link: 'http://wp.hobbycue.com/how-to/#blog-post/',
        },
        { title: 'Other Queries', link: 'http://wp.hobbycue.com/how-to/' },
      ],
    },
    {
      title: 'Quick Links',

      values: [
        { title: 'Listings', link: 'http://wp.hobbycue.com/explore/' },
        { title: 'Blog Posts', link: 'http://wp.hobbycue.com/blog/' },
        { title: 'Shop / Store', link: 'http://wp.hobbycue.com/shop/' },
        { title: 'Community', link: 'http://wp.hobbycue.com/activity/' },
      ],
    },
  ]
  const to = email
  const sendInvite = async () => {
    setInviteBtnLoader(true)
    const { err, res } = await InviteToHobbycue({
      to,
    })
    if (res.data?.success) {
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
                        <Link key={idx} href={value.link}>
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
              <p className={styles.listHeading}> Social Media </p>
              <div className={styles.iconsContainer}>
                {icons.map((Icon: any, idx: any) => {
                  return (
                    <Link href={Icon.link} key={idx}>
                      <Image
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
            <div className={styles.inviteContainer}>
              <p className={styles.listHeading}> Invite Friends </p>
              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder={`Email ID`}
                  value={email}
                  name="society"
                  onChange={(e: any) => setEmail(e.target.value)}
                />
                <button onClick={sendInvite} className={styles.button}>
                  {inviteBtnLoader ? (
                    <CircularProgress color="inherit" size={'20px'} />
                  ) : (
                    'Invite'
                  )}
                </button>
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
