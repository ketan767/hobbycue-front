import React, { useState } from 'react'
import styles from './ListingHeader.module.css'
import Image from 'next/image'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
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
import { openModal } from '@/redux/slices/modal'
import { dateFormat } from '@/utils'
import Calendar from '@/assets/svg/calendar-light.svg'
import Time from '@/assets/svg/clock-light.svg'
import EditIcon from '@/assets/svg/edit-colored.svg'
import ListingGeneralEditModal from '@/components/_modals/EditListing/ListingGeneral'
import FilledButton from '@/components/_buttons/FilledButton'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import ProfileImageLayout from '@/layouts/ProfileImageLayout/ProfileImageLayout'

type Props = {
  data: ListingPageData['pageData']
}

const ListingHeader: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()

  const { listingLayoutMode } = useSelector((state: RootState) => state.site)
  const [titleEditModalActive, setTitleEditModalActive] = useState(false)

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
      is_published: true,
    })
    if (err) return console.log(err)
    else {
      window.location.reload()
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
                className={styles['img']}
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
              <Image
                className={styles['edit-icon']}
                src={EditIcon}
                alt="edit"
                onClick={openTitleEditModal}
              />{' '}
            </h1>
          </div>
        </div>

        {/* Center Elements */}
        <section className={styles['center-container']}>
          <div className={styles['cover-img-wrapper']}>
            {data?.cover_image ? (
              <Image
                className={styles['img']}
                src={data?.cover_image}
                alt=""
                height={296}
                width={1000}
              />
            ) : (
              <div className={`${styles['img']}`}>
                <CoverPhotoLayout
                  onChange={(e: any) => onInputChange(e, 'cover')}
                  profileLayoutMode={listingLayoutMode}
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
                {data?.title}{' '}
                <Image
                  className={styles['edit-icon']}
                  src={EditIcon}
                  alt="edit"
                  onClick={openTitleEditModal}
                />{' '}
              </h1>
              <p className={styles['tagline']}>{data?.tagline}</p>
            </div>
            <div>
              {data?.type === 4 && data?.event_date_time ? (
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
                    <Image
                      className={styles['edit-icon']}
                      src={EditIcon}
                      alt="edit"
                      onClick={handleEventEditClick}
                    />{' '}
                  </div>
                </div>
              ) : data.type === 2 ? (
                <></>
              ) : (
                <>
                  <FilledButton className={styles.contactBtn}>
                    Contact
                  </FilledButton>
                </>
              )}
            </div>
          </div>
        </section>
        <div className={styles['actions-container']}>
          <FilledButton className={styles.publishBtn} onClick={handlePublish}>
            Publish
          </FilledButton>
          {/* Action Buttons */}
          <div className={styles['action-btn-wrapper']}>
            {/* Send Email Button  */}

            <Link href={`mailto:${data.public_email}`}>
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
              onClick={(e) => console.log(e)}
              className={styles['action-btn']}
            >
              <ShareRoundedIcon color="primary" fontSize="small" />
            </div>

            {/* More Options Button */}
            <div
              onClick={(e) => console.log(e)}
              className={styles['action-btn']}
            >
              <MoreHorizRoundedIcon color="primary" />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default ListingHeader
