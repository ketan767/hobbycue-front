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
]

const ListingHeaderSmall: React.FC<Props> = ({ data, activeTab }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { listingLayoutMode } = useSelector((state: any) => state.site)

  const [open, setOpen] = useState(false)

  const handleDropdown = () => {
    setOpen(!open)
  }
  console.log('head', data)
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

  const handleClaim = async () => {
    dispatch(openModal({ type: 'claim-listing', closable: true }))
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
    console.log('data', data)
    if (data.public_email) {
      window.open(
        `mailto:${data.public_email}?subject=Subject&body=Body%20goes%20here`,
      )
    }
  }

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  return (
    <>
      <div className={`${styles['container']} ${styles['small']} `}>
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
                      {dateFormat.format(
                        new Date(data?.event_date_time.from_date),
                      )}{' '}
                      -{' '}
                      {dateFormat.format(
                        new Date(data?.event_date_time.to_date),
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
              {data.pageData?.is_claimed ? (
                <FilledButton
                  className={styles.contactBtn}
                  onClick={handleContact}
                >
                  Contact
                </FilledButton>
              ) : (
                <FilledButton
                  className={styles.contactBtn}
                  onClick={handleClaim}
                >
                  Claim
                </FilledButton>
              )}
            </div>

            {/* Send Email Button  */}
            <Tooltip title="Repost">
              <Link href={`mailto:${data.public_email || data.email}`}>
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <Image src={MailIcon} alt="share" />
                </div>
              </Link>
            </Tooltip>

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
        </header>

        <nav>
          <div className={styles['navigation-tabs']}>
            {tabs.map((tab) => {
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
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

export default ListingHeaderSmall
