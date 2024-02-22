import React, { useState } from 'react'
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

import Dropdown from './DropDown'
import { listingTypes } from '@/constants/constant'
import ListingPageLayout from '@/layouts/ListingPageLayout'
import RepostIcon from '@/assets/icons/RepostIcon'
import { ClaimListing } from '@/services/auth.service'

type Props = {
  data: ListingPageData['pageData']
  activeTab: ListingPageTabs
}

const ListingHeader: React.FC<Props> = ({ data, activeTab }) => {
  const dispatch = useDispatch()

  const { listingLayoutMode } = useSelector((state: any) => state.site)
  const [titleEditModalActive, setTitleEditModalActive] = useState(false)
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )

  const onInputChange = (e: any, type: 'profile' | 'cover') => {
    e.preventDefault()
    let files = e.target.files

    if (files.length === 0) return
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
    dispatch(openModal({ type: 'ContactToOwner', closable: true }))
  }

  const handleClaim = async () => {
    if (isLoggedIn) {
      dispatch(openModal({ type: 'claim-listing', closable: true }))
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const [open, setOpen] = useState(false)

  const handleDropdown = () => {
    setOpen(!open)
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

  const isClaimed = data.is_claimed
  const isEditMode = listingLayoutMode === 'edit'

  let button
  if (!isClaimed && !isEditMode) {
    button = (
      <FilledButton className={styles.contactBtn} onClick={handleClaim}>
        Claim
      </FilledButton>
    )
  } else {
    button = (
      <FilledButton className={styles.contactBtn} onClick={handleContact}>
        Contact
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
      from.getFullYear() === to.getFullYear()
    ) {
      return `${fromDay} - ${toDay} ${fromMonthYear}`
    } else {
      return `${fromDay} ${fromMonthYear} - ${toDay} ${toMonthYear}`
    }
  }

  return (
    <>
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
            <h1 className={styles['name']}>
              {data?.title}{' '}
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
        </div>

        {/* Center Elements */}
        <section className={styles['center-container']}>
          <div className={styles['cover-img-wrapper']}>
            <div
              className={styles['background']}
              style={{ backgroundImage: `url(${data?.cover_image})` }}
            ></div>
            {data?.cover_image ? (
              <Image
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
            <Link href={`mailto:${data.public_email || data.email}`}>
              <CustomTooltip title="Repost">
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <RepostIcon />
                </div>
              </CustomTooltip>
            </Link>

            {/* Bookmark Button */}
            <CustomTooltip title="Bookmark">
              <div
                onClick={(e) => console.log(e)}
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
          <Link href={`mailto:${data.public_email || data.email}`}>
            <CustomTooltip title="Repost">
              <div
                onClick={(e) => console.log(e)}
                className={styles['action-btn']}
              >
                <RepostIcon />
              </div>
            </CustomTooltip>
          </Link>

          {/* Bookmark Button */}
          <CustomTooltip title="Bookmark">
            <div
              onClick={(e) => console.log(e)}
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
                  <Dropdown userType={'edit'} handleClose={handleDropdown} />
                )
              : open && (
                  <Dropdown
                    userType={'anonymous'}
                    handleClose={handleDropdown}
                  />
                )}
          </div>
          {button}
        </div>
      </div>
    </>
  )
}

export default ListingHeader
