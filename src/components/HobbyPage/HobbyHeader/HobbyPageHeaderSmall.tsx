import React, { useState } from 'react'
import styles from './HobbyHeader.module.css'

import Image from 'next/image'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import MailIcon from '@/assets/svg/mailicon.svg'
import ShareIcon from '@/assets/svg/share-outlined.svg'
import { useRouter } from 'next/router'
import Link from 'next/link'
import DefaultProfile from '@/assets/svg/default-images/default-hobbies.svg'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import FilledButton from '@/components/_buttons/FilledButton'
import { RootState } from '@/redux/store'
import { showProfileError, updateUser } from '@/redux/slices/user'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import Tooltip from '@/components/Tooltip/ToolTip'
import { addUserHobby, getMyProfileDetail, updateMyProfileDetail } from '@/services/user.service'
import { CircularProgress } from '@mui/material'

type Props = {
  activeTab: HobbyPageTabs
  data: any
}

const HobbyPageHeaderSmall = ({ activeTab, data }: Props) => {
  console.log('🚀 ~ file: HobbyHeader.tsx:22 ~ HobbyPageHeader ~ data:', data)
  const router = useRouter()
  const [addBtnLoading, setAddHobbyBtnLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const tabs: HobbyPageTabs[] = [
    'home',
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]
  const dispatch = useDispatch()
  const { user, isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )
  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }
  const location = typeof window !== 'undefined' ? window.location.href : ''
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
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }

  return (
    <>
      {/* Page Header  */}
      <div className={`${styles['container']} ${styles['small']} `}>
        <header
          className={`site-container ${styles['header']} ${styles['small']}`}
        >
          {data?.profile_image ? (
            <img
              className={styles['profile-img']}
              src={data.profile_image}
              alt=""
              width={160}
              height={160}
            />
          ) : (
            <div className={`${styles['profile-img']}`}>
              <Image
                // className={styles['profile-img']}
                src={DefaultProfile}
                alt=""
                width={160}
                height={160}
              />
            </div>
          )}
          <section className={styles['center-container']}>
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
          </section>
          <div className={styles['action-btn-wrapper']}>
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
            {/* Send Email Button  */}
            <div onClick={handleRepost} className={styles['action-btn']}>
              <Image src={MailIcon} alt="share" />
            </div>

            {/* Bookmark Button */}
            <div
              onClick={showFeatureUnderDevelopment}
              className={styles['action-btn']}
            >
              <Tooltip title="Bookmark">
                <BookmarkBorderRoundedIcon color="primary" />
              </Tooltip>
            </div>

            {/* Share Button */}
            <div onClick={handleShare} className={styles['action-btn']}>
              <Image src={ShareIcon} alt="share" />
            </div>

            {/* More Options Button */}
            <div
              onClick={(e) => showFeatureUnderDevelopment()}
              className={styles['action-btn']}
            >
              <MoreHorizRoundedIcon color="primary" />
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className={styles['navigation-links']}>
          {tabs.map((tab) => {
            return (
              <Link
                key={tab}
                href={`/hobby/${router.query.slug}/${
                  tab !== 'home' ? tab : ''
                }`}
                className={activeTab === tab ? styles['active'] : ''}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Link>
            )
          })}
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

export default HobbyPageHeaderSmall
