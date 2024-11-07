import React, { useState } from 'react'
import styles from './HobbyHeader.module.css'

import Image from 'next/image'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import ShareIcon from '@/assets/icons/ShareIcon'
import DefaultProfile from '@/assets/svg/default-images/default-hobbies.svg'
import MailIcon from '@/assets/svg/mailicon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { openModal, updateImageUrl, updateShareUrl } from '@/redux/slices/modal'
import HobbyNavigationLinks from './HobbyNavigationLinks'
import FilledButton from '@/components/_buttons/FilledButton'
import { RootState } from '@/redux/store'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { showProfileError, updateUser } from '@/redux/slices/user'
import { useRouter } from 'next/router'
import Tooltip from '@/components/Tooltip/ToolTip'
import RepostIcon from '../../../assets/icons/RepostIcon'
import {
  addUserHobby,
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { CircularProgress } from '@mui/material'
import { updateHobbyCover, updateHobbyProfile } from '@/services/admin.service'
import { updatePhotoEditModalData } from '@/redux/slices/site'
import CameraIcon from '@/assets/icons/CameraIcon'
import EditIcon from '@/assets/svg/edit-colored.svg'
import VerticalBar from '@/assets/icons/VerticalBar'

type Props = {
  activeTab: HobbyPageTabs
  data: any
}

const HobbyPageHeader = ({ activeTab, data }: Props) => {
  // console.log('🚀 ~ file: HobbyHeader.tsx:22 ~ HobbyPageHeader ~ data:', data)
  const dispatch = useDispatch()
  const router = useRouter()
  const [addBtnLoading, setAddHobbyBtnLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const { user, isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

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
              ? handleHobbyProfileUpload
              : type === 'cover'
              ? handleHobbyCoverUpload
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

  const handleHobbyProfileUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('hobby-profile', blob)
    const { err, res } = await updateHobbyProfile(data?._id, formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
      // dispatch(closeModal())
    }
  }

  const handleHobbyCoverUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('hobby-cover', blob)
    const { err, res } = await updateHobbyCover(data?._id, formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
      // dispatch(closeModal())
    }
  }

  const OpenProfileImage = () => {
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

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }
  const handleAddhobby = () => {
    if (isLoggedIn) {
      dispatch(
        openModal({
          type: 'profile-hobby-edit',
          closable: true,
          propData: { selectedHobbyToAdd: data },
        }),
      )
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }
  const location = typeof window !== 'undefined' ? window.location.href : ''
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
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
      {/* Page Header  */}
      <header
        className={`site-container ${styles['header']} ${styles['expanded']} `}
      >
        <div className={styles['profile-img-wrapper']}>
          <div className={styles['relative']}>
            {data?.profile_image ? (
              <div className={styles['title-mobile']}>
                <div className={styles['border-div']}>
                  <img
                    onClick={OpenProfileImage}
                    className={styles['profile-img']}
                    src={data.profile_image}
                    alt=""
                    width={160}
                    height={160}
                  />
                </div>
                <div className={styles['name-container-mobile']}>
                  <h1 className={styles['name']}>{data?.display}</h1>
                  <p className={styles['category']}>
                    <span>
                      {data?.level === 0
                        ? 'Category'
                        : data?.level === 1
                        ? 'Sub-Category'
                        : data?.level === 2
                        ? 'Hobby Tag'
                        : data?.level === 3
                        ? 'Hobby'
                        : data?.level === 5
                        ? 'Genre/Style'
                        : 'Hobby'}
                    </span>
                    {data?.level !== 0 && (
                      <>
                        <VerticalBar />
                        <span>
                          {data?.category?.display}
                          {data?.level > 1 && (
                            <>
                              ,{` `}
                              {data?.sub_category?.display}
                            </>
                          )}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles['title-mobile']}>
                <Image
                  className={styles['profile-img-icon']}
                  src={DefaultProfile}
                  alt=""
                  width={160}
                  height={160}
                />
                <div className={styles['name-container-mobile']}>
                  <h1 className={styles['name']}>{data?.display}</h1>
                  <p className={styles['category']}>
                    <span>
                      {data?.level === 0
                        ? 'Category'
                        : data?.level === 1
                        ? 'Sub-Category'
                        : data?.level === 2
                        ? 'Hobby Tag'
                        : data?.level === 3
                        ? 'Hobby'
                        : data?.level === 5
                        ? 'Genre/Style'
                        : 'Hobby'}
                    </span>
                    {data?.level !== 0 && (
                      <>
                        <VerticalBar />
                        <span>
                          {data?.category?.display}
                          {data?.level > 1 && (
                            <>
                              ,{` `}
                              {data?.sub_category?.display}
                            </>
                          )}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
            {user?.is_admin && (
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
        </div>

        <section className={styles['center-container']}>
          <div className={styles['cover-img-wrapper']}>
            {data?.cover_image ? (
              <img
                onClick={OpenCoverImage}
                className={styles['cover-img']}
                src={data.cover_image}
                alt=""
                height={296}
                width={1000}
              />
            ) : (
              <div
                className={`${styles['cover-img']} default-user-cover`}
              ></div>
            )}
            {user?.is_admin && (
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

          <div className={styles['name-container-desktop']}>
            <div>
              <h1 className={styles['name']}>
                {data?.display}{' '}
                {user?.is_admin && (
                  <Image
                    src={EditIcon}
                    alt="edit"
                    onClick={() =>
                      router.push(`/admin/hobby/edit/${data?.slug}`)
                    }
                  />
                )}
              </h1>{' '}
              <p className={styles['category']}>
                <span>
                  {data?.level === 0
                    ? 'Category'
                    : data?.level === 1
                    ? 'Sub-Category'
                    : data?.level === 2
                    ? 'Hobby Tag'
                    : data?.level === 3
                    ? 'Hobby'
                    : data?.level === 5
                    ? 'Genre/Style'
                    : 'Hobby'}
                </span>
                {data?.level !== 0 && (
                  <>
                    <VerticalBar />
                    <span>
                      {data?.category?.display}
                      {data?.level > 1 && (
                        <>
                          ,{` `}
                          {data?.sub_category?.display}
                        </>
                      )}
                    </span>
                  </>
                )}
              </p>
            </div>
            <FilledButton
              className={styles['add-mine']}
              onClick={handleAddhobby}
            >
              {addBtnLoading ? (
                <CircularProgress color="inherit" size={'12px'} />
              ) : (
                'Add to mine'
              )}
            </FilledButton>
          </div>
        </section>

        {/* Action buttons for desktop view */}
        <div
          className={`${styles['action-btn-wrapper']} ${styles['display-desktop']}`}
        >
          {/* Repost Button  */}
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
            <div onClick={handleShare} className={styles['action-btn']}>
              <ShareIcon />
            </div>
          </Tooltip>

          {/* More Options Button */}
          <div
            onClick={(e) => showFeatureUnderDevelopment()}
            className={styles['action-btn']}
          >
            <MoreHorizRoundedIcon color="primary" />
          </div>
        </div>
      </header>

      {/* Action buttons for mobile view */}
      <div
        className={`${styles['action-btn-wrapper']} ${styles['display-flex-mobile']}`}
      >
        {/* Send Email Button  */}
        <div onClick={(e) => handleRepost()} className={styles['action-btn']}>
          <Image src={MailIcon} alt="share" />
        </div>

        {/* Bookmark Button */}
        <div
          onClick={() => showFeatureUnderDevelopment()}
          className={styles['action-btn']}
        >
          <BookmarkBorderRoundedIcon color="primary" />
        </div>

        {/* Share Button */}
        <div onClick={handleShare} className={styles['action-btn']}>
          <ShareIcon />
        </div>

        {/* More Options Button */}
        <div
          onClick={(e) => showFeatureUnderDevelopment()}
          className={styles['action-btn']}
        >
          <MoreHorizRoundedIcon color="primary" />
        </div>
        {/*  */}
        <FilledButton className={styles['add-mine']} onClick={handleAddhobby}>
          {addBtnLoading ? (
            <CircularProgress color="inherit" size={'12px'} />
          ) : (
            'Add to mine'
          )}
        </FilledButton>
      </div>

      {/* Tabs */}
      <div className={styles['display-desktop']}>
        <HobbyNavigationLinks activeTab={activeTab} />
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

export default HobbyPageHeader
