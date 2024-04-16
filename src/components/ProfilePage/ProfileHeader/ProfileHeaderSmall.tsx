import React, { useEffect, useRef, useState } from 'react'
import styles from './ProfileHeader.module.css'
import Image from 'next/image'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import MailIcon from '@/assets/svg/mailicon.svg'
import ShareIcon from '@/assets/svg/share-outlined.svg'
import CameraIcon from '@/assets/icons/CameraIcon'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import FilledButton from '@/components/_buttons/FilledButton'
import { updatePhotoEditModalData } from '@/redux/slices/site'
import { closeModal, openModal, updateShareUrl } from '@/redux/slices/modal'
import { setTimeout } from 'timers/promises'
import { updateUserCover, updateUserProfile } from '@/services/user.service'
import Tooltip from '@/components/Tooltip/ToolTip'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import Dropdown from './DropDown'
import { SetLinkviaAuth } from '@/redux/slices/user'

type Props = {
  activeTab: ProfilePageTabs
  data: ProfilePageData['pageData']
  navigationTabs?: (tab: string) => void
}

/** // #fix: There are many things to update and improve code in this file. // */
const ProfileHeaderSmall: React.FC<Props> = ({
  activeTab,
  data,
  navigationTabs,
}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { isAuthenticated } = useSelector((state: RootState) => state.user)
  const tabs: ProfilePageTabs[] = ['home', 'posts', 'media', 'pages', 'blogs']

  const [open, setOpen] = useState(false)
  const location = window.location.href

  const handleDropdown = () => {
    setOpen(!open)
  }

  const handleContact = () => {
    console.log('data', data)
    if (data.public_email) {
      window.open(
        `mailto:${data.public_email}?subject=Subject&body=Body%20goes%20here`,
      )
    }
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
          <div
            className={`${styles['profile-img-wrapper']} ${styles['profile-img-wrapper-small']}`}
          >
            {data?.profile_image ? (
              <img
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
                <img
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
            <FilledButton className={styles.contactBtn} onClick={handleContact}>
              Contact
            </FilledButton>
            {/* Send Email Button  */}
            <div
              onClick={() => {
                dispatch(
                  openModal({
                    type: 'create-post',
                    closable: true,
                    propData: { defaultValue: location },
                  }),
                )
              }}
            >
              <Tooltip title="Repost">
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <Image src={MailIcon} alt="share" />
                </div>
              </Tooltip>
            </div>

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
            <Tooltip title="Ahare">
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
                    <Dropdown userType={'edit'} handleClose={handleDropdown} />
                  )
                : open && (
                    <Dropdown
                      userType={'anonymous'}
                      handleClose={handleDropdown}
                    />
                  )}
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
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!isAuthenticated) {
                      dispatch(
                        SetLinkviaAuth(
                          `/profile/${router.query.profile_url}/${
                            tab !== 'home' ? tab : ''
                          }`,
                        ),
                      )
                      dispatch(openModal({ type: 'auth', closable: true }))

                      return
                    } else {
                      if (navigationTabs) {
                        console.log('running nav')
                        navigationTabs(tab)
                      } else {
                        router.push(
                          `/profile/${router.query.profile_url}/${
                            tab !== 'home' ? tab : ''
                          }`,
                        )
                      }
                    }
                  }}
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
