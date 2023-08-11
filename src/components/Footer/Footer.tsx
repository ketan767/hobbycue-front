import React, { useState } from 'react'
import styles from './footer.module.css'

import Facebook from '@/assets/svg/social/facebook.svg'
import Instagram from '@/assets/svg/social/instagram.svg'
import Twitter from '@/assets/svg/social/twitter.svg'
import Pintrest from '@/assets/svg/social/pintrest.svg'
import Google from '@/assets/svg/social/google.svg'
import Youtube from '@/assets/svg/social/youtube.svg'
import Telegram from '@/assets/svg/social/telegram.svg'
import Mail from '@/assets/svg/social/mail.svg'
import Image from 'next/image'

const icons = [
  Facebook,
  Twitter,
  Instagram,
  Pintrest,
  Google,
  Youtube,
  Telegram,
  Mail,
]
const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const data = [
    {
      title: 'Hobbycue',
      values: ['About Us', 'Our Services', 'Work with Us', 'FAQ', 'Contact Us'],
    },
    {
      title: 'How do I',
      values: [
        'Sign Up',
        'Add a Listing',
        'Claim Listing',
        'Post a Query',
        'Add a Blog Post',
        'Other Queries',
      ],
    },
    {
      title: 'Quick Links',
      values: ['Listings', 'Blog Posts', 'Shop / Store', 'Community'],
    },
  ]
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.contentWrapper}>
            {data.map((item: any, idx: any) => {
              return (
                <ul key={idx} className={styles.listContainer}>
                  <li className={styles.listHeading}> {item.title} </li>
                  {item.values.map((value: any, idx: any) => {
                    return (
                      <li className={styles.listItem} key={idx}>
                        {value}{' '}
                      </li>
                    )
                  })}
                </ul>
              )
            })}
          </div>
          <div className={styles.rightSection}>
            <div>
              <p className={styles.listHeading}> Social Media </p>
              <div className={styles.iconsContainer}>
                {icons.map((Icon: any, idx: any) => {
                  return <Image src={Icon} alt="social-media" key={idx} />
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
                <button className={styles.button}>Invite</button>
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
