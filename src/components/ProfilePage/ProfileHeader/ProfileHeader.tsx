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
import {
  updateListingModalData,
  updateListingTypeModalMode,
  updatePhotoEditModalData,
} from '@/redux/slices/site'
import { closeModal, openModal, updateShareUrl } from '@/redux/slices/modal'
import { setTimeout } from 'timers/promises'
import { updateUserCover, updateUserProfile } from '@/services/user.service'
import { RootState } from '@/redux/store'
import FilledButton from '@/components/_buttons/FilledButton'
import { useRouter } from 'next/router'
import ShareIcon from '@/assets/svg/share-outlined.svg'
import EditIcon from '@/assets/svg/edit-colored.svg'
import MailIcon from '@/assets/svg/mailicon.svg'
import UploadIcon from '@/assets/svg/upload.svg'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import ProfileImageLayout from '@/layouts/ProfileImageLayout/ProfileImageLayout'
import Tooltip from '@/components/Tooltip/ToolTip'
import Dropdown from './DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'

type Props = {
  activeTab: ProfilePageTabs
  data: ProfilePageData['pageData']
}

const ProfileHeader: React.FC<Props> = ({ activeTab, data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const handleDropdown = () => {
    setOpen(!open)
  }
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const tabs: ProfilePageTabs[] = ['home', 'posts', 'media', 'pages', 'blogs']

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

  const handleContact = () => {
    console.log('data', data)
    if (data.email) {
      window.open(
        `mailto:${data.email}?subject=Subject&body=Body%20goes%20here`,
      )
    }
  }

  return (
    <>
      <div className={`${styles['container']}`}>
        {/* Header */}
        <header className={`site-container ${styles['header']}`}>
          {/* Profile Picture */}
          <div className={styles['profile-img-wrapper']}>
            <div className={styles['relative']}>
              {data?.profile_image ? (
                <Image
                  className={styles['img']}
                  src={data.profile_image}
                  alt=""
                  width={160}
                  height={160}
                />
              ) : (
                <div className={`${styles['img']}`}>
                  <ProfileImageLayout
                    onChange={(e: any) => onInputChange(e, 'profile')}
                    profileLayoutMode={profileLayoutMode}
                    type={'user'}
                  ></ProfileImageLayout>
                </div>
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
            <div className={styles['name-container']}>
              <h1 className={styles['name']}>{data.full_name}</h1>
              {profileLayoutMode === 'edit' && (
                <Image
                  src={EditIcon}
                  alt="edit"
                  onClick={() =>
                    dispatch(
                      openModal({
                        type: 'profile-general-edit',
                        closable: true,
                      }),
                    )
                  }
                />
              )}
            </div>
            {/* <p className={styles['tagline']}>{data.tagline}</p> */}
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
                <div className={`${styles['img']}`}>
                  <CoverPhotoLayout
                    onChange={(e: any) => onInputChange(e, 'cover')}
                    profileLayoutMode={profileLayoutMode}
                  ></CoverPhotoLayout>
                </div>
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
            <div className={styles['name-container']}>
              <div>
                <div className={styles['profile-name']}>
                  <h1 className={styles['name']}>{data.full_name}</h1>
                  {profileLayoutMode === 'edit' && (
                    <Image
                      src={EditIcon}
                      alt="edit"
                      onClick={() =>
                        dispatch(
                          openModal({
                            type: 'profile-general-edit',
                            closable: true,
                          }),
                        )
                      }
                    />
                  )}
                </div>
                <p className={styles['tagline']}>{data.tagline}</p>
              </div>
              <FilledButton
                className={styles.contactBtn}
                onClick={handleContact}
              >
                Contact
              </FilledButton>
            </div>
          </section>

          {/* Action Buttons */}

          <div className={styles['actions-container']}>
            <FilledButton
              onClick={() => {
                dispatch(updateListingModalData({ type: 1 }))
                dispatch(
                  openModal({ type: 'listing-type-edit', closable: true }),
                )
                dispatch(updateListingTypeModalMode({ mode: 'edit' }))
              }}
              className={styles.makeMyPageButton}
            >
              Make My Page
            </FilledButton>
            <div className={styles['action-btn-wrapper']}>
              {/* Send Email Button  */}
              <Link href={`mailto:${data.public_email || data.email}`}>
                <Tooltip title="Repost">
                  <div
                    onClick={(e) => console.log(e)}
                    className={styles['action-btn']}
                  >
                    <Image src={MailIcon} alt="share" />
                  </div>
                </Tooltip>
              </Link>

              {/* Bookmark Button */}
              <Tooltip title="Bookmark">
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <BookmarkBorderRoundedIcon color="primary" />
                </div>
              </Tooltip>

              {/* Share Button */}
              <Tooltip title="Share">
                <div
                  onClick={(e) => handleShare()}
                  className={styles['action-btn']}
                >
                  <Image src={ShareIcon} alt="share" />
                </div>
              </Tooltip>

              {/* More Options Button */}

              <div
                onClick={(e) => handleDropdown()}
                className={styles['action-btn']}
              >
                <Tooltip title="More options">
                  <MoreHorizRoundedIcon color="primary" />
                </Tooltip>

                {profileLayoutMode === 'edit'
                  ? open && (
                      <Dropdown
                        userType={'edit'}
                        handleClose={handleDropdown}
                      />
                    )
                  : open && (
                      <Dropdown
                        userType={'anonymous'}
                        handleClose={handleDropdown}
                      />
                    )}
              </div>
            </div>
          </div>
        </header>
        {/* Navigation Links */}
        <nav className={styles['nav']}>
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

export default ProfileHeader
