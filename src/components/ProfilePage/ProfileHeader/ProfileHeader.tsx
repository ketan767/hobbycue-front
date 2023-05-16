import React from 'react'
import styles from './ProfileHeader.module.css'
import Image from 'next/image'

import DefaultProfileImage from '@/assets/svg/default-profile.svg'
import DefaultCoverImage from '@/assets/svg/default-cover.svg'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import CameraIcon from '@/assets/icons/CameraIcon'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { updatePhotoEditModalData } from '@/redux/slices/site'
import { openModal } from '@/redux/slices/modal'
import { setTimeout } from 'timers/promises'
import { uploadPhoto } from '@/services/user.service'
import { RootState } from '@/redux/store'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfileHeader: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()

  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const onChange = (e: any) => {
    e.preventDefault()
    let files = e.target.files

    if (files.length === 0) return

    const reader = new FileReader()
    reader.onload = () => {
      dispatch(
        updatePhotoEditModalData({
          type: 'profile',
          image: reader.result,
          onComplete: handleProfilePhotoUpload,
        }),
      )
      dispatch(
        openModal({
          type: 'upload-profile',
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

  const handleProfilePhotoUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    console.log('🚀 ~ file: Header.tsx:68 ~ handleProfilePhotoUpload ~ blob:', blob)

    const formData = new FormData()
    formData.append('image', blob)
    const { err, res } = await uploadPhoto(formData)
    console.log('🚀 ~ file: Header.tsx:62 ~ handleProfilePhotoUpload ~ res:', res)
    console.log('🚀 ~ file: Header.tsx:62 ~ handleProfilePhotoUpload ~ err:', err)
  }
  return (
    <>
      <header className={`site-container ${styles['header']}`}>
        {/* Profile Picture */}
        <div className={styles['profile-img-wrapper']}>
          {data.profile_image ? (
            <Image
              className={styles['img']}
              src={data.profile_image}
              alt=""
              width={160}
              height={160}
            />
          ) : (
            <div className={`${styles['img']} ${styles['default']}`}></div>
          )}

          {profileLayoutMode === 'edit' && (
            <label className={styles['edit-btn']}>
              <input type="file" hidden onChange={onChange} />
              <CameraIcon />
            </label>
          )}
        </div>

        {/* Center Elements */}
        <section className={styles['center-container']}>
          <div className={styles['cover-img-wrapper']}>
            {data.cover_image ? (
              <Image
                className={styles['img']}
                src={data.cover_image}
                alt=""
                height={296}
                width={1000}
              />
            ) : (
              <div className={`${styles['img']} ${styles['default']} `}></div>
            )}

            {profileLayoutMode === 'edit' && (
              <div className={styles['edit-btn']}>
                <CameraIcon />
              </div>
            )}
          </div>

          <h1 className={styles['name']}>{data.full_name}</h1>
          <p className={styles['tagline']}>{data.tagline}</p>
        </section>

        {/* Action Buttons */}
        <div className={styles['action-btn-wrapper']}>
          {/* Send Email Button  */}
          <Link href={`mailto:${data.public_email || data.email}`}>
            <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
              <MailOutlineRoundedIcon color="primary" />
            </div>
          </Link>

          {/* Bookmark Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <BookmarkBorderRoundedIcon color="primary" />
          </div>

          {/* Share Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <ShareRoundedIcon color="primary" fontSize="small" />
          </div>

          {/* More Options Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <MoreHorizRoundedIcon color="primary" />
          </div>
        </div>
      </header>
    </>
  )
}

export default ProfileHeader
