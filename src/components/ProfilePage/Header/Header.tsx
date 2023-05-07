import React from 'react'
import styles from './Header.module.css'
import Image from 'next/image'

import DefaultProfileImage from '@/assets/svg/default-profile.svg'
import DefaultCoverImage from '@/assets/svg/default-cover.svg'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import CameraIcon from '@/assets/icons/CameraIcon'

type Props = {
  data: ProfilePageData['pageData']
  mode: ProfileLayoutMode
}

const ProfileHeader: React.FC<Props> = ({ data, mode }) => {
  return (
    <>
      <header className={`site-container ${styles['header']}`}>
        {/* Profile Picture */}
        <div className={styles['profile-img-wrapper']}>
          {data.profile_image ? (
            <Image
              className={styles['img']}
              src={data.profile_image}
              alt=""
              width={160}
              height={160}
            />
          ) : (
            <div className={`${styles['img']} ${styles['default']}`}></div>
          )}

          {mode === 'edit' && (
            <div className={styles['edit-btn']}>
              <CameraIcon />
            </div>
          )}
        </div>

        {/* Center Elements */}
        <section className={styles['center-container']}>
          <div className={styles['cover-img-wrapper']}>
            {data.cover_image ? (
              <Image
                className={styles['img']}
                src={data.cover_image}
                alt=""
                height={296}
                width={1000}
              />
            ) : (
              <div className={`${styles['img']} ${styles['default']} `}></div>
            )}

            {mode === 'edit' && (
              <div className={styles['edit-btn']}>
                <CameraIcon />
              </div>
            )}
          </div>

          <h1 className={styles['name']}>{data.full_name}</h1>
          <p className={styles['tagline']}>{data.tagline}</p>
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
