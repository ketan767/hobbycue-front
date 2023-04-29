import React from 'react'
import styles from './Header.module.css'
import Image from 'next/image'

import DefaultProfileImage from '@/assets/svg/default-profile.svg'
import DefaultCoverImage from '@/assets/svg/default-cover.svg'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import CameraIcon from '@/assets/svg/CameraIcon'

type Props = {
  detail: any
  profileMode: ProfileMode
}

const ProfileHeader: React.FC<Props> = ({ detail, profileMode }) => {
  return (
    <>
      <header className={`site-container ${styles['header']}`}>
        {/* Profile Picture */}
        <div className={styles['profile-img-wrapper']}>
          {detail.profile_image ? (
            <Image className={styles['img']} src={detail.profile_image} alt="" />
          ) : (
            <div className={`${styles['img']} ${styles['default']}`}></div>
          )}

          {profileMode === 'edit' && (
            <div className={styles['edit-btn']}>
              <CameraIcon />
            </div>
          )}
        </div>

        {/* Center Elements */}
        <section className={styles['center-container']}>
          <div className={styles['cover-img-wrapper']}>
            {detail.cover_image ? (
              <Image className={styles['img']} src={detail.cover_image} alt="" />
            ) : (
              <div className={`${styles['img']} ${styles['default']} `}></div>
            )}

            {profileMode === 'edit' && (
              <div className={styles['edit-btn']}>
                <CameraIcon />
              </div>
            )}
          </div>

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
