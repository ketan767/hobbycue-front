import React, { useState } from 'react'
import styles from './ListingHeader.module.css'
import Image from 'next/image'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import Tooltip from '@/components/Tooltip/ToolTip'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
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
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import { dateFormat } from '@/utils'
import Calendar from '@/assets/svg/calendar-light.svg'
import MailIcon from '@/assets/svg/mailicon.svg'
import Time from '@/assets/svg/clock-light.svg'
import EditIcon from '@/assets/svg/edit-colored.svg'
import ShareIcon from '@/assets/svg/share-outlined.svg'
import ListingGeneralEditModal from '@/components/_modals/EditListing/ListingGeneral'
import FilledButton from '@/components/_buttons/FilledButton'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import ProfileImageLayout from '@/layouts/ProfileImageLayout/ProfileImageLayout'
import { useRouter } from 'next/router'
import { listingTypes } from '@/constants/constant'
import Dropdown from './DropDown'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CustomizedTooltips from '@/components/Tooltip/ToolTip'
import smallPencilSvg from '@/assets/svg/small-pencil.svg'
import { showProfileError } from '@/redux/slices/user'

type Props = {
  data: ListingPageData['pageData']
  activeTab: any
}
const tabs: ListingPageTabs[] = [
  'home',
  'posts',
  'media',
  'reviews',
  'events',
  'store',
  'orders',
]

const ListingHeaderSmall: React.FC<Props> = ({ data, activeTab }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { listingLayoutMode } = useSelector((state: any) => state.site)
  const { isLoggedIn, user, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const [open, setOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const handleDropdown = () => {
    setOpen(!open)
  }
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
  // console.log('head', data)
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
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({
            type: 'listing-product-purchase',
            closable: true,
            propData: { currentListing: data },
          }),
        )
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
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
    // console.log(data)
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

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const handleUpdateCTA = () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({
            type: 'listing-cta-edit',
            closable: true,
            propData: { currentListing: data },
          }),
        )
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const ctaText = data.cta_text
  const isEditMode = listingLayoutMode === 'edit'

  let button
  if (!ctaText || ctaText === 'Contact') {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : handleContact}
      >
        <p>Contact</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
      </FilledButton>
    )
  } else if (ctaText === 'Claim') {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : handleClaim}
      >
        <p>Claim</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
      </FilledButton>
    )
  } else if (ctaText === 'Register') {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : handleRegister}
      >
        <p>Register</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
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

  return (
    <>
      <div className={`${styles['container']} ${styles['small']} `}>
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
              <div
                className={
                  data.type == 1
                    ? `${styles['img']} default-people-listing-icon`
                    : data.type == 2
                    ? `${styles['img']} default-place-listing-icon`
                    : data.type == 3
                    ? `${styles['img']} default-program-listing-icon`
                    : data.type == 4
                    ? `${styles['img']} default-product-listing-icon`
                    : `${styles['img']} default-people-listing-icon`
                }
              ></div>
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

            <h1 className={styles['name']}>{data.title}</h1>
            <p className={styles['tagline']}>{data.tagline}</p>
          </section>

          {/* Action Buttons */}
          <div className={styles['action-btn-wrapper']}>
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
              {button}
            </div>

            {/* Send Email Button  */}
            <Tooltip title="Repost">
              <div onClick={handleRepost} className={styles['action-btn']}>
                <Image src={MailIcon} alt="share" />
              </div>
            </Tooltip>

            {/* Bookmark Button */}
            <Tooltip title="Bookmark">
              <div
                onClick={showFeatureUnderDevelopment}
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
            <div className={styles['action-btn-dropdown-wrapper']}>
              <CustomizedTooltips title="Click to view options">
                <div
                  onClick={(e) => handleDropdown()}
                  className={styles['action-btn']}
                >
                  <MoreHorizRoundedIcon color="primary" />
                </div>
              </CustomizedTooltips>
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
        </header>

        <nav>
          <div className={styles['navigation-tabs']}>
            {tabs.map((tab) => {
              if (tab === 'events') {
                if (data.type !== 3)
                  return (
                    <Link
                      key={tab}
                      href={`/page/${router.query.page_url}/${tab}`}
                      className={activeTab === tab ? styles['active'] : ''}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Link>
                  )
              } else {
                return (
                  <Link
                    key={tab}
                    href={`/page/${router.query.page_url}/${
                      tab !== 'home' ? tab : ''
                    }`}
                    className={activeTab === tab ? styles['active'] : ''}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Link>
                )
              }
            })}
            {/* Add a condition to include a blank tab if 'events' tab is not present */}
            {data.type === 3 && (
              <Link key="blank-tab" href="#" className={styles.disabledtab}>
                {' '}
              </Link>
            )}
          </div>
        </nav>
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

export default ListingHeaderSmall
