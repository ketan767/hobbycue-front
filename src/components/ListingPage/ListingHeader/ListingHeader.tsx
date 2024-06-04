import React, { useEffect, useRef, useState } from 'react'
import styles from './ListingHeader.module.css'
import Image from 'next/image'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import CameraIcon from '@/assets/icons/CameraIcon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'
import {
  updateListing,
  updateListingCover,
  updateListingProfile,
} from '@/services/listing.service'
import { updatePhotoEditModalData } from '@/redux/slices/site'
import { openModal, updateImageUrl, updateShareUrl } from '@/redux/slices/modal'
import { dateFormat } from '@/utils'
import CustomTooltip from '@/components/Tooltip/ToolTip'
import Calendar from '@/assets/svg/calendar-light.svg'
import Time from '@/assets/svg/clock-light.svg'
import EditIcon from '@/assets/svg/edit-colored.svg'
import ShareIcon from '../../../assets/icons/ShareIcon'
import MailIcon from '@/assets/svg/mailicon.svg'
import ListingGeneralEditModal from '@/components/_modals/EditListing/ListingGeneral'
import FilledButton from '@/components/_buttons/FilledButton'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import ProfileImageLayout from '@/layouts/ProfileImageLayout/ProfileImageLayout'
import claimSvg from '@/assets/svg/claimedsvg.svg'
import EditWhite from '@/assets/svg/edit_white.svg'
import Dropdown from './DropDown'
import { listingTypes } from '@/constants/constant'
import ListingPageLayout from '@/layouts/ListingPageLayout'
import RepostIcon from '@/assets/icons/RepostIcon'
import { ClaimListing } from '@/services/auth.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { showProfileError } from '@/redux/slices/user'
import { useRouter } from 'next/router'
import smallPencilSvg from '@/assets/svg/small-pencil.svg'

type Props = {
  data: ListingPageData['pageData']
  activeTab: ListingPageTabs
  setpageTypeErr?: React.Dispatch<React.SetStateAction<boolean>>
  setHobbyError?: React.Dispatch<React.SetStateAction<boolean>>
  setHAboutErr?: React.Dispatch<React.SetStateAction<boolean>>
  setContactInfoErr?: React.Dispatch<React.SetStateAction<boolean>>
  setLocationErr?: React.Dispatch<React.SetStateAction<boolean>>
}

const ListingHeader: React.FC<Props> = ({
  data,
  activeTab,
  setContactInfoErr,
  setHAboutErr,
  setHobbyError,
  setLocationErr,
  setpageTypeErr,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const { listingLayoutMode } = useSelector((state: any) => state.site)
  const [titleEditModalActive, setTitleEditModalActive] = useState(false)
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
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
    console.log('data', data?.pageData)
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
    formData.append('listing-profile', blob)
    const { err, res } = await updateListingProfile(data._id, formData)
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
    formData.append('listing-cover', blob)
    const { err, res } = await updateListingCover(data._id, formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
      // dispatch(closeModal())
    }
  }

  const handleEventEditClick = () => {
    dispatch(
      openModal({
        type: 'listing-event-hours-edit',
        closable: true,
      }),
    )
  }

  const openTitleEditModal = () => {
    dispatch(
      openModal({
        type: 'listing-general-edit',
        closable: true,
      }),
    )
  }

  const handlePublish = async () => {
    if (data.is_published !== true) {
      let hasError = false
      if (data._hobbies.length === 0) {
        hasError = true
        setHobbyError?.(true)
      }
      if (data.page_type.length === 0) {
        hasError = true
        setpageTypeErr?.(true)
      }
      if (!data.phone && !data.public_email) {
        hasError = true
        setContactInfoErr?.(true)
      }
      if (!data._address.city) {
        hasError = true
        setLocationErr?.(true)
      }
      if (hasError) {
        setSnackbar({
          display: true,
          type: 'warning',
          message: 'Fill up the mandatory fields.',
        })
        return
      }
    }
    const { err, res } = await updateListing(data._id, {
      is_published: data.is_published === true ? false : true,
    })
    if (err) return console.log(err)
    else {
      window.location.reload()
    }
  }

  const handleContact = () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({ type: 'Listing-Contact-To-Owner', closable: true }),
        )
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const handleClaim = async () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(openModal({ type: 'claim-listing', closable: true }))
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const handleRegister = async () => {
    dispatch(openModal({type:"listing-product-purchase",closable:true,propData:{currentListing:data}}))
  }

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const [open, setOpen] = useState(false)

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

  const handleUpdateCTA = () => {
    dispatch(openModal({type:"listing-cta-edit",closable:true,propData:{currentListing:data}}));
  }

  const ctaText = data.cta_text;
  const isEditMode = listingLayoutMode === 'edit'

  let button
  if (!ctaText || ctaText === 'Contact') {
    button = (
      <FilledButton className={styles.contactBtn} onClick={isEditMode?handleUpdateCTA:handleContact}>
        <p>Contact</p>{isEditMode&&<img width={16} height={16} src={smallPencilSvg.src} alt='small pencil'/>}
      </FilledButton>
    )
  } else if(ctaText==='Claim') {
    button = (
      <FilledButton className={styles.contactBtn} onClick={isEditMode?handleUpdateCTA:handleClaim}>
        <p>Claim</p>{isEditMode&&<img width={16} height={16} src={smallPencilSvg.src} alt='small pencil'/>}
      </FilledButton>
    )
  }else if(ctaText==="Register"){
    button = (
      <FilledButton className={styles.contactBtn} onClick={isEditMode?handleUpdateCTA:handleRegister}>
        <p>Register</p>{isEditMode&&<img width={16} height={16} src={smallPencilSvg.src} alt='small pencil'/>}
      </FilledButton>
    )
  }

  function formatDateRange(
    fromDate: string | number | Date,
    toDate: string | number | Date,
  ): string {
    const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric' }
    const monthYearOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    }

    const from = new Date(fromDate)
    const to = new Date(toDate)

    const fromDay = new Intl.DateTimeFormat('en-US', dayOptions).format(from)
    const toDay = new Intl.DateTimeFormat('en-US', dayOptions).format(to)
    const fromMonthYear = new Intl.DateTimeFormat(
      'en-US',
      monthYearOptions,
    ).format(from)
    const toMonthYear = new Intl.DateTimeFormat(
      'en-US',
      monthYearOptions,
    ).format(to)

    if (
      from.getMonth() === to.getMonth() &&
      from.getFullYear() === to.getFullYear() &&
      from.getDate() !== to.getDate()
    ) {
      return `${fromDay} - ${toDay} ${fromMonthYear}`
    } else if (
      from.getMonth() === to.getMonth() &&
      from.getFullYear() === to.getFullYear() &&
      from.getDate() === to.getDate()
    ) {
      return `${fromDay} ${fromMonthYear}`
    } else {
      return `${fromDay} ${fromMonthYear} - ${toDay} ${toMonthYear}`
    }
  }
  const location = typeof window !== 'undefined' ? window.location.href : ''
  const handleRepost = () => {
    if (!isAuthenticated) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    if (isLoggedIn) {
      if (!user.is_onboarded) {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      } else {
        dispatch(
          openModal({
            type: 'create-post',
            closable: true,
            propData: { defaultValue: location },
          }),
        )
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
                  profileLayoutMode={listingLayoutMode}
                  type={'page'}
                  typeId={data?.type}
                ></ProfileImageLayout>
              </div>
            )}

            {listingLayoutMode === 'edit' && (
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <h1 className={styles['name']}>{data?.title} </h1>
              {listingLayoutMode === 'edit' && (
                <Image
                  className={styles['edit-icon']}
                  src={EditIcon}
                  alt="edit"
                  onClick={openTitleEditModal}
                />
              )}
            </div>
            {data?.tagline ? (
              <p className={styles['tagline']}>{data?.tagline}</p>
            ) : (
              <p className={styles['tagline']}>&nbsp;</p>
            )}
          </div>
        </div>

        {/* Center Elements */}
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
                src={data?.cover_image}
                alt=""
                height={296}
                width={1000}
              />
            ) : (
              <div className={styles['img']}>
                <CoverPhotoLayout
                  type="page"
                  onChange={(e: any) => onInputChange(e, 'cover')}
                  profileLayoutMode={listingLayoutMode}
                  typeId={data?.type}
                ></CoverPhotoLayout>
              </div>
            )}

            {listingLayoutMode === 'edit' && (
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
          <div className={styles['content-container']}>
            <div className={styles['name-container']}>
              <h1 className={styles['name']}>
                {data?.title}
                {data?.is_verified ? <Image alt="claim" src={claimSvg} /> : ''}
                {listingLayoutMode === 'edit' && (
                  <Image
                    className={styles['edit-icon']}
                    src={EditIcon}
                    alt="edit"
                    onClick={openTitleEditModal}
                  />
                )}
              </h1>
              {data?.tagline ? (
                <p className={styles['tagline']}>{data?.tagline}</p>
              ) : (
                <p className={styles['tagline']}>&nbsp;</p>
              )}
            </div>
            <div className={styles['event-date-container']}>
              {data?.type === listingTypes.PROGRAM && data?.event_date_time ? (
                <div>
                  <div className={styles.eventDate}>
                    <Image
                      className={styles['im']}
                      src={Calendar}
                      alt="calendar"
                    />
                    <p className={styles.date}>
                      {formatDateRange(
                        data?.event_date_time.from_date,
                        data?.event_date_time.to_date,
                      )}
                    </p>
                    <Image className={styles['im']} src={Time} alt="Time" />{' '}
                    <p className={styles.time}>
                      {data?.event_date_time.from_time} -{' '}
                      {data?.event_date_time.to_time}
                    </p>
                    {listingLayoutMode === 'edit' && (
                      <Image
                        className={styles['edit-icon']}
                        src={EditIcon}
                        alt="edit"
                        onClick={handleEventEditClick}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className={styles['display-desktop']}>{button}</div>
            </div>
          </div>
        </section>
        <div className={styles['actions-container-desktop']}>
          {listingLayoutMode === 'edit' && (
            <FilledButton
              className={
                data.is_published ? styles.unpublishBtn : styles.publishBtn
              }
              onClick={handlePublish}
            >
              {data.is_published ? 'Unpublish' : 'Publish'}
            </FilledButton>
          )}
          {/* Action Buttons */}
          <div className={styles['action-btn-wrapper']}>
            {/* Send Email Button  */}
            <div onClick={handleRepost}>
              <CustomTooltip title="Repost">
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <RepostIcon />
                </div>
              </CustomTooltip>
            </div>

            {/* Bookmark Button */}
            <CustomTooltip title="Bookmark">
              <div
                onClick={showFeatureUnderDevelopment}
                className={styles['action-btn']}
              >
                <BookmarkBorderRoundedIcon color="primary" />
              </div>
            </CustomTooltip>

            {/* Share Button */}
            <CustomTooltip title="Share">
              <div
                onClick={(e) => handleShare()}
                className={styles['action-btn']}
              >
                <ShareIcon />
              </div>
            </CustomTooltip>

            {/* More Options Button */}
            <div
              className={styles['action-btn-dropdown-wrapper']}
              ref={Dropdownref}
            >
              <CustomTooltip title="Click to view options">
                <div
                  onClick={(e) => handleDropdown()}
                  className={styles['action-btn']}
                >
                  <MoreHorizRoundedIcon color="primary" />
                </div>
              </CustomTooltip>
              {listingLayoutMode === 'edit'
                ? open && (
                    <Dropdown
                      userType={'edit'}
                      handleClose={handleDropdown}
                      showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                    />
                  )
                : open && (
                    <Dropdown
                      userType={'anonymous'}
                      handleClose={handleDropdown}
                      showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                    />
                  )}
            </div>
          </div>
        </div>
      </header>
      <div className={styles['actions-container-mobile']}>
        {listingLayoutMode === 'edit' && (
          <FilledButton
            className={
              data.is_published ? styles.unpublishBtn : styles.publishBtn
            }
            onClick={handlePublish}
          >
            {data.is_published ? 'Unpublish' : 'Publish'}
          </FilledButton>
        )}
        {/* Action Buttons */}
        <div className={styles['action-btn-wrapper']}>
          {/* Send Email Button  */}
          <CustomTooltip title="Repost">
            <div
              onClick={(e) => handleRepost()}
              className={styles['action-btn']}
            >
              <RepostIcon />
            </div>
          </CustomTooltip>

          {/* Bookmark Button */}
          <CustomTooltip title="Bookmark">
            <div
              onClick={showFeatureUnderDevelopment}
              className={styles['action-btn']}
            >
              <BookmarkBorderRoundedIcon color="primary" />
            </div>
          </CustomTooltip>

          {/* Share Button */}
          <CustomTooltip title="Share">
            <div
              onClick={(e) => handleShare()}
              className={styles['action-btn']}
            >
              <ShareIcon />
            </div>
          </CustomTooltip>

          {/* More Options Button */}
          <div className={styles['action-btn-dropdown-wrapper']}>
            <CustomTooltip title="Click to view options">
              <div
                onClick={(e) => handleDropdown()}
                className={styles['action-btn']}
              >
                <MoreHorizRoundedIcon color="primary" />
              </div>
            </CustomTooltip>
            {listingLayoutMode === 'edit'
              ? open && (
                  <Dropdown
                    showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                    userType={'edit'}
                    handleClose={handleDropdown}
                  />
                )
              : open && (
                  <Dropdown
                    userType={'anonymous'}
                    handleClose={handleDropdown}
                    showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                  />
                )}
          </div>
          {button}
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

export default ListingHeader
