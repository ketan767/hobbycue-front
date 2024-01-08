import React, { useState } from 'react'
import styles from './footer.module.css'

import expandDown from '@/assets/svg/chevron-down.svg'
import expandUp from '@/assets/svg/chevron-up.svg'
import Facebook from '@/assets/svg/social/facebook.svg'
import Instagram from '@/assets/svg/social/instagram.svg'

import Mail from '@/assets/svg/social/mail.svg'

import Pintrest from '@/assets/svg/social/Pinterest.svg'
import Google from '@/assets/svg/social/google.svg'

import Telegram from '@/assets/svg/social/telegram.svg'
import Twitter from '@/assets/svg/social/twitter.svg'
import Youtube from '@/assets/svg/social/youtube.svg'
import { InviteToHobbycue } from '@/services/auth.service'
import Image from 'next/image'
import Link from 'next/link'

const icons = [Facebook, Twitter, Instagram, Pintrest, Youtube, Telegram]
const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [expand, setExpand] = useState(false)

  const data = [
    {
      title: 'Hobbycue',
      values: [
        { title: 'About Us', link: 'http://wp.hobbycue.com/about/' },
        { title: 'Our Services', link: 'http://wp.hobbycue.com/services/' },
        { title: 'Work with Us', link: 'http://wp.hobbycue.com/work/' },
        { title: 'FAQ', link: 'http://wp.hobbycue.com/faq/' },
        { title: 'Contact Us', link: 'http://wp.hobbycue.com/contact/' },
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
    const { err, res } = await InviteToHobbycue({
      to,
    })
    setEmail('')
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.contentWrapper}>
            {data.map((item: any, idx: any) => {
              return (
                <ul
                  key={idx}
                  className={
                    expand ? styles?.listContainerExapnd : styles.listContainer
                  }
                >
                  <li
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpand(!expand)}
                    className={styles.listHeading}
                  >
                    {' '}
                    {item.title}{' '}
                  </li>

                  {item.values.map((value: any, idx: any) => {
                    return (
                      <Link key={idx} href={value.link}>
                        <li
                          className={
                            expand ? styles.listExpand : styles.listItem
                          }
                          key={idx}
                        >
                          {value.title}
                        </li>
                      </Link>
                    )
                  })}

                  <li
                    onClick={() => setExpand(!expand)}
                    className={
                      expand ? styles.expandIconStyle : styles.expandIcon
                    }
                  >
                    <Image src={expand ? expandUp : expandDown} alt="icon" />
                  </li>
                </ul>
              )
            })}
          </div>
          <div className={styles.rightSection}>
            <div>
              <p className={styles.listHeading}> Social Media </p>
              <div className={styles.iconsContainer}>
                {icons.map((Icon: any, idx: any) => {
                  return (
                    <Image
                      className={styles.socialIcons}
                      height={32}
                      width={32}
                      src={Icon}
                      alt="social-media"
                      key={idx}
                    />
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
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottombar}>© Purple Cues Private Limited</div>
    </>
  )
}

export default Footer
