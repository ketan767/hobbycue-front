import React, { useEffect, useRef, useState } from 'react'
import styles from './ProfileHeader.module.css'
import Image from 'next/image'

import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
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
import EditIcon from '@/assets/svg/edit-colored.svg'
import MailIcon from '@/assets/svg/mailicon.svg'
import UploadIcon from '@/assets/svg/upload.svg'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import ProfileImageLayout from '@/layouts/ProfileImageLayout/ProfileImageLayout'
import Tooltip from '@/components/Tooltip/ToolTip'
import Dropdown from './DropDown'
import useOutsideClick from '@/hooks/useOutsideClick'
import RepostIcon from '../../../assets/icons/RepostIcon'
import ShareIcon from '@/assets/icons/ShareIcon'
import { updateImageUrl } from '@/redux/slices/modal'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfileHeader: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const nameRef1 = useRef<HTMLHeadingElement>(null)
  const taglineRef1 = useRef<HTMLParagraphElement>(null)
  const nameRef2 = useRef<HTMLHeadingElement>(null)
  const taglineRef2 = useRef<HTMLParagraphElement>(null)
  const [eliipsis, setEllipsis] = useState({ name: false, tagline: false })
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const handleDropdown = () => {
    setOpen(!open)
  }
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
  useEffect(() => {
    const handleResize = () => {
      if (
        nameRef1.current &&
        taglineRef1.current &&
        taglineRef2.current &&
        nameRef2.current
      ) {
        if (window.innerWidth > 1100) {
          const nameLineHeight = parseFloat(
            window.getComputedStyle(nameRef1.current).lineHeight,
          )
          const taglineLineHeight = parseFloat(
            window.getComputedStyle(taglineRef1.current).lineHeight,
          )
          const nameHeight = nameRef1.current.clientHeight
          const taglineHeight = taglineRef1.current.clientHeight
          const nameLines = nameHeight / nameLineHeight
          const taglineLines = taglineHeight / taglineLineHeight
          if (nameLines >= 2 && taglineLines >= 2) {
            if (nameLines === 2) {
              setEllipsis({ name: false, tagline: true })
            }
          } else if (
            (nameLines === 1 && taglineLines === 2) ||
            (nameLines === 2 && taglineLines === 1)
          ) {
            setEllipsis({ name: false, tagline: false })
          } else {
            setEllipsis({ name: true, tagline: true })
          }
          console.log(nameLines, taglineLines)
        } else {
          const nameLineHeight = parseFloat(
            window.getComputedStyle(nameRef2.current).lineHeight,
          )
          const taglineLineHeight = parseFloat(
            window.getComputedStyle(taglineRef2.current).lineHeight,
          )
          const nameHeight = nameRef2.current.clientHeight
          const taglineHeight = taglineRef2.current.clientHeight
          const nameLines = nameHeight / nameLineHeight
          const taglineLines = taglineHeight / taglineLineHeight
          if (nameLines >= 2 && taglineLines >= 2) {
            if (nameLines === 2) {
              setEllipsis({ name: false, tagline: true })
            }
          } else if (
            (nameLines === 1 && taglineLines === 2) ||
            (nameLines === 2 && taglineLines === 1)
          ) {
            setEllipsis({ name: false, tagline: false })
          } else {
            setEllipsis({ name: true, tagline: true })
          }
          console.log(nameLines, taglineLines)
        }
      }
    }

    handleResize() // Call it initially

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [nameRef1.current, taglineRef1.current])

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
    dispatch(openModal({ type: 'UserContactToOwner', closable: false }))
  }

  const OpenProfileImage = () => {
    console.log('pro', data.profile_image)
    dispatch(updateImageUrl(data?.profile_image))
    dispatch(
      openModal({
        type: 'View-Image-Modal',
        closable: false,
        imageurl: data?.profile_image,
      }),
    )
  }

  const OpenCoverImage = () => {
    dispatch(updateImageUrl(data?.cover_image))
    dispatch(
      openModal({
        type: 'View-Image-Modal',
        closable: false,
        imageurl: data?.cover_image,
      }),
    )
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
                  onClick={OpenProfileImage}
                  className={`${styles['img']} imageclick`}
                  src={data?.profile_image}
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
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <h1
                  className={`${styles['name']} ${
                    eliipsis.name ? styles['text-ellipsis-mobile'] : ''
                  }`}
                  ref={nameRef2}
                >
                  {data.full_name}
                </h1>
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
              {data?.tagline ? (
                <p
                  className={`${styles['tagline']} ${
                    eliipsis.name ? styles['text-ellipsis-mobile'] : ''
                  }`}
                  ref={taglineRef2}
                >
                  {data?.tagline}
                </p>
              ) : (
                <p className={styles['tagline']}>&nbsp;</p>
              )}
            </div>
          </div>

          {/* Center Section */}
          <section className={styles['center-container']}>
            <div className={styles['cover-img-wrapper']}>
              {data?.cover_image ? (
                <Image
                  onClick={OpenCoverImage}
                  className={`${styles['img']} imageclick`}
                  src={data.cover_image}
                  alt=""
                  height={296}
                  width={1000}
                />
              ) : (
                <div className={styles['img']}>
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
                  <h1
                    className={`${styles['name']} ${
                      eliipsis.name ? styles['text-ellipsis'] : ''
                    }`}
                    ref={nameRef1}
                  >
                    {data.full_name}
                  </h1>
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
                {data?.tagline ? (
                  <p
                    className={`${styles['tagline']} ${
                      eliipsis.tagline ? styles['text-ellipsis'] : ''
                    }`}
                    ref={taglineRef1}
                  >
                    {data?.tagline}
                  </p>
                ) : (
                  <p className={styles['tagline']}>&nbsp;</p>
                )}
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
          <div className={styles['actions-container-desktop']}>
            {profileLayoutMode === 'edit' && (
              <FilledButton
                onClick={() => {
                  dispatch(updateListingModalData({ type: 1 }))
                  dispatch(
                    openModal({ type: 'CopyProfileDataModal', closable: true }),
                  )
                  dispatch(updateListingTypeModalMode({ mode: 'create' }))
                }}
                className={styles.makeMyPageButton}
              >
                Make My Page
              </FilledButton>
            )}
            <div className={styles['action-btn-wrapper']}>
              {/* Send Email Button  */}
              <Link href={`mailto:${data.public_email || data.email}`}>
                <Tooltip title="Repost">
                  <div
                    onClick={(e) => console.log(e)}
                    className={styles['action-btn']}
                  >
                    <RepostIcon />
                  </div>
                </Tooltip>
              </Link>

              {/* Bookmark Button */}
              <Tooltip title="Bookmark">
                <div
                  onClick={() => showFeatureUnderDevelopment()}
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
                  <ShareIcon />
                </div>
              </Tooltip>

              {/* More Options Button */}
              <div className={styles['action-btn-dropdown-wrapper']}>
                <Tooltip title="Click to view options">
                  <div
                    onClick={(e) => handleDropdown()}
                    className={styles['action-btn']}
                  >
                    <MoreHorizRoundedIcon color="primary" />
                  </div>
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

        {/* Action Buttons */}
        <div className={styles['actions-container-mobile']}>
          <div className={styles['action-btn-wrapper']}>
            {/* Send Email Button  */}
            <Link href={`mailto:${data.public_email || data.email}`}>
              <Tooltip title="Repost">
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <RepostIcon />
                </div>
              </Tooltip>
            </Link>

            {/* Bookmark Button */}
            <Tooltip title="Bookmark">
              <div
                onClick={() => showFeatureUnderDevelopment()}
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
                <ShareIcon />
              </div>
            </Tooltip>

            {/* More Options Button */}
            <div className={styles['action-btn-dropdown-wrapper']}>
              <Tooltip title="Click to view options">
                <div
                  onClick={(e) => handleDropdown()}
                  className={styles['action-btn']}
                >
                  <MoreHorizRoundedIcon color="primary" />
                </div>
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
            <FilledButton className={styles.contactBtn} onClick={handleContact}>
              Contact
            </FilledButton>
          </div>
        </div>
      </div>
      {
        <CustomSnackbar
          message={snackbar.message}
          triggerOpen={snackbar.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default ProfileHeader
