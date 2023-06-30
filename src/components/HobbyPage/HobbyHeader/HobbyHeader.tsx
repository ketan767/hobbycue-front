import React from 'react'
import styles from './HobbyHeader.module.css'

import Image from 'next/image'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

import profile from '@/assets/temp/hooby-profile.png'
import cover from '@/assets/temp/hobby-cover.png'
import mailSvg from '@/Assets/Icons/mail.svg'
import { useRouter } from 'next/router'
import Link from 'next/link'

type Props = {
  activeTab: HobbyPageTabs
  data: any
}

const HobbyPageHeader = ({ activeTab, data }: Props) => {
  // console.log('🚀 ~ file: HobbyHeader.tsx:22 ~ HobbyPageHeader ~ data:', data)
  const router = useRouter()
  const tabs: HobbyPageTabs[] = [
    'about',
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]

  return (
    <>
      {/* Page Header  */}
      <header className={`site-container ${styles['header']}`}>
        {data?.profile_image ? (
          <Image
            className={styles['profile-img']}
            src={data.profile_image}
            alt=""
            width={160}
            height={160}
          />
        ) : (
          <div
            className={`${styles['profile-img']} default-people-listing-icon`}
          ></div>
        )}
        <section className={styles['center-container']}>
          {data?.cover_image ? (
            <Image
              className={styles['cover-img']}
              src={data.cover_image}
              alt=""
              height={296}
              width={1000}
            />
          ) : (
            <div className={`${styles['cover-img']} default-user-cover`}></div>
          )}
          <h1 className={styles['name']}>{data?.display}</h1>
          <p className={styles['category']}>
            {data?.level === 0
              ? 'Category'
              : data?.level === 1
              ? 'Sub-Category'
              : data?.level === 2
              ? 'Hobby Tag'
              : data?.level === 3
              ? 'Hobby'
              : data?.level === 5
              ? 'Genre/Style'
              : 'Hobby'}
          </p>
        </section>
        <div className={styles['action-btn-wrapper']}>
          {/* Send Email Button  */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <MailOutlineRoundedIcon color="primary" />
          </div>

          {/* Bookmark Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <BookmarkBorderRoundedIcon color="primary" />
          </div>

          {/* Share Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <ShareRoundedIcon color="primary" fontSize="small" />
          </div>

          {/* More Options Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <MoreHorizRoundedIcon color="primary" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles['navigation-links']}>
        {tabs.map((tab) => {
          return (
            <Link
              key={tab}
              href={`/hobby/${router.query.slug}/${tab !== 'about' ? tab : ''}`}
              className={activeTab === tab ? styles['active'] : ''}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default HobbyPageHeader
