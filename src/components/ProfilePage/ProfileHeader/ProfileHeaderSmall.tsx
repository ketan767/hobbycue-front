import React, { useEffect, useRef, useState } from 'react'
import styles from './ProfileHeader.module.css'
import Image from 'next/image'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import CameraIcon from '@/assets/icons/CameraIcon'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { updatePhotoEditModalData } from '@/redux/slices/site'
import { closeModal, openModal, updateShareUrl } from '@/redux/slices/modal'
import { setTimeout } from 'timers/promises'
import { updateUserCover, updateUserProfile } from '@/services/user.service'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import Dropdown from './DropDown'

type Props = {
  activeTab: ProfilePageTabs
  data: ProfilePageData['pageData']
}

/** // #fix: There are many things to update and improve code in this file. // */
const ProfileHeaderSmall: React.FC<Props> = ({ activeTab, data }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const tabs: ProfilePageTabs[] = ['home', 'posts', 'media', 'pages', 'blogs']

  const [open, setOpen] = useState(false)

  const handleDropdown = () => {
    setOpen(!open)
  }
  const onInputChange = (e: any, type: 'profile' | 'cover') => {
    e.preventDefault()
    let files = e.target.files

    if (files.length === 0) return

    const reader = new FileReader()
    reader.onload = () => {
      dispatch(
        updatePhotoEditModalData({
          type,
          image: reader.result,
          onComplete:
            type === 'profile'
              ? handleUserProfileUpload
              : type === 'cover'
              ? handleUserCoverUpload
              : () => {},
        }),
      )
      dispatch(
        openModal({
          type: 'upload-image',
          closable: true,
          // onModalClose: () =>
          //   updatePhotoEditModalData({
          //     type: null,
          //     image: null,
          //     onComplete: null,
          //   }),
        }),
      )
    }
    reader.readAsDataURL(files[0])
  }

  const handleUserProfileUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('user-profile', blob)
    const { err, res } = await updateUserProfile(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
      // dispatch(closeModal())
    }
  }

  const handleUserCoverUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('user-cover', blob)
    const { err, res } = await updateUserCover(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
      // dispatch(closeModal())
    }
  }

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }


  return (
    <>
      <div className={`${styles['container']} ${styles['small']} `}>
        {/* Header */}
        <header className={`site-container ${styles['header']}`}>
          {/* Profile Picture */}
          <div className={styles['profile-img-wrapper']}>
            {data?.profile_image ? (
              <Image
                className={styles['img']}
                src={data.profile_image}
                alt=""
                width={160}
                height={160}
              />
            ) : (
              <div className={`${styles['img']} default-user-icon`}></div>
            )}

            {profileLayoutMode === 'edit' && (
              <label className={styles['edit-btn']}>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => onInputChange(e, 'profile')}
                />
                <CameraIcon />
              </label>
            )}
          </div>

          {/* Center Section */}
          <section className={styles['center-container']}>
            <div className={styles['cover-img-wrapper']}>
              {data?.cover_image ? (
                <Image
                  className={styles['img']}
                  src={data.cover_image}
                  alt=""
                  height={296}
                  width={1000}
                />
              ) : (
                <div className={`${styles['img']} default-user-cover`}></div>
              )}

              {profileLayoutMode === 'edit' && (
                <label className={styles['edit-btn']}>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => onInputChange(e, 'cover')}
                  />
                  <CameraIcon />
                </label>
              )}
            </div>

            <h1 className={styles['name']}>{data.full_name}</h1>
            <p className={styles['tagline']}>{data.tagline}</p>
          </section>

          {/* Action Buttons */}
          <div className={styles['action-btn-wrapper']}>
            {/* Send Email Button  */}
            <Link href={`mailto:${data.public_email || data.email}`}>
              <div
                onClick={(e) => console.log(e)}
                className={styles['action-btn']}
              >
                <MailOutlineRoundedIcon color="primary" />
              </div>
            </Link>

            {/* Bookmark Button */}
            <div
              onClick={(e) => console.log(e)}
              className={styles['action-btn']}
            >
              <BookmarkBorderRoundedIcon color="primary" />
            </div>

            {/* Share Button */}
            <div
             onClick={(e) => handleShare()}
              className={styles['action-btn']}
            >
              <ShareRoundedIcon color="primary" fontSize="small" />
            </div>

            {/* More Options Button */}
            <div
              onClick={(e) => handleDropdown()}
              className={styles['action-btn']}
            >
              <MoreHorizRoundedIcon color="primary" />
              {open && <Dropdown handleClose={handleDropdown} />}
            </div>
          </div>
        </header>
        {/* Navigation Links */}
        <nav>
          <div className={styles['navigation-tabs']}>
            {tabs.map((tab) => {
              return (
                <Link
                  key={tab}
                  href={`/profile/${router.query.profile_url}/${
                    tab !== 'home' ? tab : ''
                  }`}
                  className={activeTab === tab ? styles['active'] : ''}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

export default ProfileHeaderSmall
