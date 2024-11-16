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
import { showProfileError } from '@/redux/slices/user'
import OutlinedButton from '@/components/_buttons/OutlinedButton'

type Props = {
  data: ProfilePageData['pageData']
  titleError?: boolean
  noDataChecker?: () => boolean
}

const ProfileHeader: React.FC<Props> = ({
  data,
  titleError,
  noDataChecker,
}) => {
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
    if (open) {
      setOpen(false)
      if (!isAuthenticated) {
        dispatch(openModal({ type: 'auth', closable: true }))
      }
    } else {
      setOpen(true)
    }
  }
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const location = typeof window !== 'undefined' ? window.location.href : ''

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
    // const fileTobeUploaded = files[0]
    // if (fileTobeUploaded) {
    //   const fileSize = fileTobeUploaded.size
    //   const fileSizeKB = fileSize / 1024
    //   if (fileSizeKB > 2048) {
    //     setSnackbar({
    //       display: true,
    //       type: 'warning',
    //       message: 'Image size should not be greater than 2MB',
    //     })
    //     return
    //   }
    // }

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

  const handleRepost = () => {
    if (!isAuthenticated) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
    if (noDataChecker?.() === true) {
      return
    }
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({
            type: 'create-post',
            closable: true,
            propData: { defaultValue: location },
          }),
        )
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(
        openModal({
          type: 'auth',
          closable: true,
        }),
      )
    }
  }

  const handleShare = () => {
    if (!isAuthenticated) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
    if (noDataChecker?.() === true) {
      return
    }
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const handleContact = () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(openModal({ type: 'User-Contact-To-Owner', closable: true }))
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const OpenProfileImage = () => {
    console.log('pro asifs', data.profile_image)
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

  const itsMe = data?._id === user?._id

  const Dropdownref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        Dropdownref.current &&
        !Dropdownref.current.contains(event.target as Node)
      ) {
        setOpen(false) // Close the dropdown when clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [Dropdownref])
  return (
    <>
      <div className={`${styles['container']}`}>
        {/* Header */}
        <header className={`site-container ${styles['header']}`}>
          {/* Profile Picture */}
          <div className={styles['profile-img-wrapper']}>
            <div className={styles['relative']}>
              {data?.profile_image ? (
                <img
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
                  }
                  ${titleError === true ? styles['error-name'] : ''}
                  `}
                  ref={nameRef2}
                >
                  {data.full_name}
                  {titleError === true ? 'Full Name of Profile*' : ''}
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
              <div
                className={styles['background']}
                style={{ backgroundImage: `url(${data?.cover_image})` }}
              ></div>
              {data?.cover_image ? (
                <img
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
                    }
                    ${titleError === true ? styles['error-name'] : ''}
                    `}
                    ref={nameRef1}
                  >
                    {data.full_name}
                    {titleError === true ? 'Full Name of Profile*' : ''}
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
                disabled={itsMe}
              >
                Contact
              </FilledButton>
            </div>
          </section>

          {/* Action Buttons */}
          <div className={styles['actions-container-desktop']}>
            {profileLayoutMode === 'edit' && (
              <OutlinedButton
                onClick={() => {
                  if (noDataChecker?.() === true) {
                    return
                  }
                  dispatch(updateListingModalData({ type: 1 }))
                  dispatch(
                    openModal({ type: 'CopyProfileDataModal', closable: true }),
                  )
                  dispatch(updateListingTypeModalMode({ mode: 'create' }))
                }}
                className={styles.makeMyPageButton}
              >
                Make My Page
              </OutlinedButton>
            )}
            <div className={styles['action-btn-wrapper']}>
              {/* Send Email Button  */}
              {/* <Link href={`mailto:${data.public_email || data.email}`}> */}
              <div onClick={handleRepost}>
                <Tooltip title="Repost">
                  <div
                    onClick={(e) => console.log(e)}
                    className={styles['action-btn']}
                  >
                    <RepostIcon />
                  </div>
                </Tooltip>
              </div>
              {/* </Link> */}

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
              <div
                className={styles['action-btn-dropdown-wrapper']}
                ref={Dropdownref}
              >
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
            {/* <Link href={`mailto:${data.public_email || data.email}`}> */}
            <div onClick={handleRepost}>
              <Tooltip title="Repost">
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <RepostIcon />
                </div>
              </Tooltip>
            </div>
            {/* </Link> */}

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
            <FilledButton
              disabled={itsMe}
              className={styles.contactBtn}
              onClick={handleContact}
            >
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
