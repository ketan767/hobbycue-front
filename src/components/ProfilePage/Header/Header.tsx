import React from 'react'
import styles from './Header.module.css'
import Image from 'next/image'

import DefaultProfileImage from '@/assets/image/default-profile.svg'
import DefaultCoverImage from '@/assets/image/default-cover.svg'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

type Props = {
  detail: any
}

const ProfileHeader: React.FC<Props> = ({ detail }) => {
  return (
    <>
      <header className={`site-container ${styles['header']}`}>
        {/* Profile Picture */}
        <Image
          className={styles['profile-img']}
          src={detail.profile_image || DefaultProfileImage}
          alt=""
        />

        {/* Center Elements */}
        <section className={styles['center-container']}>
          <Image
            className={styles['cover-img']}
            src={detail.cover_image || DefaultCoverImage}
            alt=""
          />
          <h1 className={styles['name']}>{detail.full_name}</h1>
          <p className={styles['tagline']}>{detail.tagline}</p>
        </section>

        {/* Action Buttons */}
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
    </>
  )
}

export default ProfileHeader
