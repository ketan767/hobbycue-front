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
import { dateFormat, pageType } from '@/utils'
import Calendar from '@/assets/svg/calendar-light.svg'
import MailIcon from '@/assets/svg/mailicon.svg'
import Time from '@/assets/svg/clock-light.svg'
import EditIcon from '@/assets/svg/edit-colored.svg'
import ShareIcon from '../../../assets/icons/ShareIcon'
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
import { useMediaQuery } from '@mui/material'

type Props = {
  data: ListingPageData['pageData']
  activeTab: any
}
const tabs: ListingPageTabs[] = [
  'home',
  'posts',
  'events',
  'media',
  'reviews',
  'store',
  'related',
  'orders',
]

const ListingHeaderSmall: React.FC<Props> = ({ data, activeTab }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { listingLayoutMode, totalEvents } = useSelector(
    (state: any) => state.site,
  )
  const { isLoggedIn, user, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )
  const [showDays, setShowDays] = useState(false)
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

  const handleCtaText = (ctaText: string) => {
    if (ctaText === 'Buy Now') {
      if (data.click_url) {
        window.open(data.click_url, '_blank', 'noopener,noreferrer')
      } else {
        setSnackbar({
          type: 'warning',
          display: true,
          message: 'No Buy Now URL available',
        })
      }
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
  const isMobile = useMediaQuery('(max-width:1100px)')

  let button
  if (!ctaText || ctaText === 'Contact') {
    button = (
      <FilledButton
        className={isEditMode ? styles.contactBtn : styles.contactBtnpublic}
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
  } else {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : () => handleCtaText(ctaText)}
      >
        <p>{ctaText}</p>
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

    const fromDay =
      from && from instanceof Date && !isNaN(from.getTime())
        ? new Intl.DateTimeFormat('en-US', dayOptions).format(from)
        : ''
    const toDay =
      to && to instanceof Date && !isNaN(to.getTime())
        ? new Intl.DateTimeFormat('en-US', dayOptions).format(to)
        : ''
    const fromMonthYear =
      from && from instanceof Date && !isNaN(from.getTime())
        ? new Intl.DateTimeFormat('en-US', monthYearOptions).format(from)
        : ''

    const toMonthYear =
      to && to instanceof Date && !isNaN(to.getTime())
        ? new Intl.DateTimeFormat('en-US', monthYearOptions).format(to)
        : ''

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
  const dropdownIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      cursor={'pointer'}
    >
      <path
        d="M2.7313 13.0784H13.5506C13.6601 13.078 13.7675 13.0478 13.8612 12.991C13.9548 12.9341 14.0312 12.8529 14.0821 12.7558C14.1329 12.6588 14.1564 12.5498 14.1499 12.4404C14.1434 12.3311 14.1073 12.2256 14.0453 12.1353L8.63563 4.32134C8.41143 3.99736 7.87167 3.99736 7.64687 4.32134L2.23722 12.1353C2.1746 12.2254 2.13788 12.331 2.13105 12.4405C2.12421 12.55 2.14753 12.6593 2.19846 12.7565C2.24939 12.8538 2.32598 12.9351 2.41992 12.9919C2.51386 13.0486 2.62156 13.0785 2.7313 13.0784Z"
        fill="#6D747A"
      />
    </svg>
  )

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
                <div className={styles['eventDate-parent']}>
                  <div
                    className={
                      styles.eventDate +
                      ` ${showDays && styles['eventDate-open']}`
                    }
                  >
                    <Image
                      className={styles['im']}
                      src={Calendar}
                      alt="calendar"
                    />
                    <div className={styles['event-dates']}>
                      {data.event_date_time && data?.event_date_time?.length > 0
                        ? (showDays
                            ? data.event_date_time
                            : data.event_date_time.slice(0, 1)
                          ).map((obj: any, i: number, arr: any[]) => (
                            <p key={i} className={styles.date}>
                              {formatDateRange(obj?.from_date, obj?.to_date)}

                              {isMobile &&
                              showDays === false &&
                              data.event_date_time?.length > 1 &&
                              (!data.event_weekdays ||
                                data.event_weekdays.length <= 1) ? (
                                <>
                                  ...{' '}
                                  <span
                                    onClick={() => setShowDays((prev) => !prev)}
                                  >
                                    more
                                  </span>
                                </>
                              ) : null}
                              {isMobile &&
                                showDays &&
                                data.event_date_time.length - 1 === i && (
                                  <>
                                    {' '}
                                    <span
                                      onClick={() =>
                                        setShowDays((prev) => !prev)
                                      }
                                    >
                                      Less
                                    </span>
                                  </>
                                )}
                            </p>
                          ))
                        : ''}
                    </div>
                    {(data.event_weekdays && data.event_weekdays.length > 0) ||
                      (data.event_date_time &&
                        data?.event_date_time?.length > 0 && (
                          <Image
                            className={styles['im']}
                            src={Time}
                            alt="Time"
                          />
                        ))}
                    <div className={styles['flex-col-4']}>
                      {data.event_weekdays && data?.event_weekdays?.length > 0
                        ? (showDays
                            ? data.event_weekdays
                            : data.event_weekdays.slice(0, 1)
                          ).map((obj: any, i: number, arr: any[]) =>
                            i > 0 && !showDays ? null : (
                              <p
                                key={i}
                                className={
                                  isEditMode
                                    ? styles.time
                                    : styles.editTime +
                                      ` ${
                                        i !== 0 && showDays === false
                                          ? styles['hide']
                                          : ''
                                      }`
                                }
                              >
                                {obj?.from_day}{' '}
                                {obj?.to_day !== obj?.from_day &&
                                  ' - ' + obj?.to_day}
                                , {obj?.from_time}
                                {isMobile && showDays === false ? (
                                  <>
                                    ...{' '}
                                    <span
                                      onClick={() =>
                                        setShowDays((prev) => !prev)
                                      }
                                    >
                                      more
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    -
                                    {showDays === false &&
                                    !isMobile &&
                                    data.event_weekdays.length > 1 ? (
                                      <>
                                        {' ... '}
                                        <span
                                          onClick={() =>
                                            setShowDays((prev) => !prev)
                                          }
                                          className={styles['purpleText']}
                                        >
                                          more
                                        </span>
                                      </>
                                    ) : (
                                      obj?.to_time
                                    )}
                                    {data.event_weekdays.length - 1 === i &&
                                      isMobile && (
                                        <>
                                          {' '}
                                          <span
                                            onClick={() =>
                                              setShowDays((prev) => !prev)
                                            }
                                          >
                                            Less
                                          </span>
                                        </>
                                      )}
                                  </>
                                )}
                              </p>
                            ),
                          )
                        : data.event_date_time &&
                          data?.event_date_time?.length > 0 && (
                            <>
                              {(showDays
                                ? data.event_date_time
                                : data.event_date_time.slice(0, 1)
                              ).map((obj: any, i: number) => (
                                <p
                                  key={i}
                                  className={
                                    isEditMode ? styles.time : styles.editTime
                                  }
                                >
                                  {obj?.from_time} - {obj?.to_time}
                                </p>
                              ))}
                            </>
                          )}
                    </div>
                    {listingLayoutMode === 'edit' ? (
                      <>
                        <Image
                          className={styles['edit-icon']}
                          src={EditIcon}
                          alt="edit"
                          onClick={handleEventEditClick}
                        />
                        {((data.event_weekdays &&
                          data?.event_weekdays?.length > 1) ||
                          (data?.event_date_time &&
                            data?.event_date_time?.length > 1)) && (
                          <div
                            onClick={() => setShowDays((prev) => !prev)}
                            className={`${showDays ? '' : styles['rotate']} ${
                              styles['flex-col-start']
                            }`}
                          >
                            {dropdownIcon}
                          </div>
                        )}
                      </>
                    ) : (
                      listingLayoutMode !== 'edit' &&
                      ((data.event_weekdays &&
                        data?.event_weekdays?.length > 1) ||
                        (data?.event_date_time &&
                          data?.event_date_time?.length > 1)) &&
                      !isMobile && (
                        <div
                          onClick={() => setShowDays((prev) => !prev)}
                          className={`${showDays ? '' : styles['rotate']} ${
                            styles['flex-col-start']
                          }`}
                        >
                          {dropdownIcon}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className={styles['display-desktop']}>{button}</div>
            </div>

            {/* Send Email Button  */}
            <Tooltip title="Repost">
              <div onClick={handleRepost} className={styles['action-btn']}>
                <Image
                  style={{ borderRadius: '8px' }}
                  src={MailIcon}
                  alt="share"
                />
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
                <ShareIcon />
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
              if (['posts', 'store'].includes(tab)) {
                if (data.type === 4) {
                  return
                }
              }

              if (tab === 'related') {
                if (data.type !== 4) {
                  return
                }
              }

              if (tab === 'events') {
                if (![3, 4].includes(data.type))
                  return (
                    <Link
                      key={tab}
                      href={`/${pageType(data?.type)}/${
                        router.query.page_url
                      }/${tab}`}
                      className={
                        activeTab === tab
                          ? styles['active']
                          : '' + ` ${styles['event-tab']}`
                      }
                    >
                      {totalEvents > 0 && (
                        <button className={styles['event-count']}>
                          {totalEvents}
                        </button>
                      )}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Link>
                  )
              } else if (tab === 'orders') {
                if ([3, 4].includes(data.type) && listingLayoutMode === 'edit')
                  return (
                    <Link
                      key={tab}
                      href={`/${pageType(data?.type)}/${
                        router.query.page_url
                      }/${tab}`}
                      className={activeTab === tab ? styles['active'] : ''}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Link>
                  )
              } else {
                return (
                  <Link
                    key={tab}
                    href={`/${pageType(data?.type)}/${router.query.page_url}/${
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
