import React from 'react'
import styles from './HobbyHeader.module.css'

import Image from 'next/image'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import MailIcon from '@/assets/svg/mailicon.svg'
import ShareIcon from '@/assets/svg/share-outlined.svg'
import { useRouter } from 'next/router'
import Link from 'next/link'
import DefaultProfile from '@/assets/svg/default-images/default-hobbies.svg'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import { useDispatch } from 'react-redux'

type Props = {
  activeTab: HobbyPageTabs
  data: any
}

const HobbyPageHeaderSmall = ({ activeTab, data }: Props) => {
  console.log('🚀 ~ file: HobbyHeader.tsx:22 ~ HobbyPageHeader ~ data:', data)
  const router = useRouter()
  const tabs: HobbyPageTabs[] = [
    'home',
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]
  const dispatch = useDispatch()
  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  return (
    <>
      {/* Page Header  */}
      <div className={`${styles['container']} ${styles['small']} `}>
        <header
          className={`site-container ${styles['header']} ${styles['small']}`}
        >
          {data?.profile_image ? (
            <Image
              className={styles['profile-img']}
              src={data.profile_image}
              alt=""
              width={160}
              height={160}
            />
          ) : (
            <div className={`${styles['profile-img']}`}>
              <Image
                // className={styles['profile-img']}
                src={DefaultProfile}
                alt=""
                width={160}
                height={160}
              />
            </div>
          )}
          <section className={styles['center-container']}>
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
            <div
              onClick={(e) => console.log(e)}
              className={styles['action-btn']}
            >
              <Image src={MailIcon} alt="share" />
            </div>

            {/* Bookmark Button */}
            <div
              onClick={(e) => console.log(e)}
              className={styles['action-btn']}
            >
              <BookmarkBorderRoundedIcon color="primary" />
            </div>

            {/* Share Button */}
            <div
              onClick={(e) => console.log(e)}
              className={styles['action-btn']}
            >
              <Image src={ShareIcon} alt="share" onClick={handleShare} />
            </div>

            {/* More Options Button */}
            <div
              onClick={(e) => console.log(e)}
              className={styles['action-btn']}
            >
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
                href={`/hobby/${router.query.slug}/${
                  tab !== 'home' ? tab : ''
                }`}
                className={activeTab === tab ? styles['active'] : ''}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default HobbyPageHeaderSmall
