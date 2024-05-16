import React, { useState } from 'react'
import styles from './HobbyHeader.module.css'

import Image from 'next/image'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import ShareIcon from '@/assets/svg/share-outlined.svg'
import DefaultProfile from '@/assets/svg/default-images/default-hobbies.svg'
import MailIcon from '@/assets/svg/mailicon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
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

type Props = {
  activeTab: HobbyPageTabs
  data: any
}

const HobbyPageHeader = ({ activeTab, data }: Props) => {
  // console.log('🚀 ~ file: HobbyHeader.tsx:22 ~ HobbyPageHeader ~ data:', data)
  const dispatch = useDispatch()
  const router = useRouter()
  const [addBtnLoading, setAddHobbyBtnLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const { user, isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }
  const handleAddhobby = () => {
    if (isLoggedIn) {
      const alreadyAdded = user?._hobbies?.some(
        (obj: any) => obj?.hobby?._id === data?._id,
      )
      if (alreadyAdded) {
        setSnackbar({
          type: 'warning',
          display: true,
          message: 'This hobby is already added to your profile',
        })
      } else {
        addUserHobby({ hobby: data?._id, level: 1 }, async (err, res) => {
          setAddHobbyBtnLoading(true)
          if (err) {
            setSnackbar({
              display: true,
              message: 'Some error occured',
              type: 'warning',
            })
          } else {
            setSnackbar({
              display: true,
              message: 'Hobby added successfully',
              type: 'success',
            })
          }
          let updatedCompletedSteps = [...user.completed_onboarding_steps]

          if (!updatedCompletedSteps.includes('Hobby')) {
            updatedCompletedSteps.push('Hobby')
          }
          let onboarded = false
          if (user.completed_onboarding_steps.length === 3) {
            onboarded = true
          }
          const { err: updtProfileErr, res: updtProfileRes } =
            await updateMyProfileDetail({
              is_onboarded: onboarded,
              completed_onboarding_steps: updatedCompletedSteps,
            })
          const { err: error, res: response } = await getMyProfileDetail()
          setAddHobbyBtnLoading(false)
          if (error) return console.log(error)

          if (response?.data.success) {
            const { is_onboarded } = user
            dispatch(updateUser({ ...response?.data.data.user, is_onboarded }))
            setAddHobbyBtnLoading(false)
          }
          setAddHobbyBtnLoading(false)
        })
      }
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
        {data?.profile_image ? (
          <div className={styles['title-mobile']}>
            <img
              className={styles['profile-img']}
              src={data.profile_image}
              alt=""
              width={160}
              height={160}
            />
            <div className={styles['name-container-mobile']}>
              <h1 className={styles['name']}>{data?.display}</h1>
              <p className={styles['category']}>
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
              </p>
            </div>
          </div>
        ) : (
          <div className={styles['title-mobile']}>
            <Image
              className={styles['profile-img']}
              src={DefaultProfile}
              alt=""
              width={160}
              height={160}
            />
            <div className={styles['name-container-mobile']}>
              <h1 className={styles['name']}>{data?.display}</h1>
              <p className={styles['category']}>
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
              </p>
            </div>
          </div>
        )}

        <section className={styles['center-container']}>
          {data?.cover_image ? (
            <img
              className={styles['cover-img']}
              src={data.cover_image}
              alt=""
              height={296}
              width={1000}
            />
          ) : (
            <div className={`${styles['cover-img']} default-user-cover`}></div>
          )}
          <div className={styles['name-container-desktop']}>
            <div>
              <h1 className={styles['name']}>{data?.display}</h1>
              <p className={styles['category']}>
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
              </p>
            </div>
            <FilledButton
              className={styles['add-mine']}
              onClick={handleAddhobby}
              disabled={data?.level !== 3}
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
              <Image src={ShareIcon} alt="share" />
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
        <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
          <Image src={ShareIcon} alt="share" onClick={handleShare} />
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
