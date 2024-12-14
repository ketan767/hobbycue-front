import React, { useState } from 'react'
import styles from './HobbyHeader.module.css'

import Image from 'next/image'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import MailIcon from '@/assets/svg/mailicon.svg'
// import ShareIcon from '@/assets/svg/share-outlined.svg'
import ShareIcon from '@/assets/icons/ShareIcon'
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
import {
  addUserHobby,
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { CircularProgress } from '@mui/material'
import VerticalBar from '@/assets/icons/VerticalBar'
import CustomizedTooltips from '@/components/Tooltip/ToolTip'

type Props = {
  activeTab: HobbyPageTabs
  data: any
}

const HobbyPageHeaderSmall = ({ activeTab, data }: Props) => {
  console.log('🚀 ~ file: HobbyHeader.tsx:22 ~ HobbyPageHeader ~ data:', data)
  const router = useRouter()
  const [addBtnLoading, setAddHobbyBtnLoading] = useState(false)
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
            <div className={styles['border-div-small']}>
              <img
                className={styles['profile-img-small']}
                src={data.profile_image}
                alt=""
                width={160}
                height={160}
              />
            </div>
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
              {/* <span>
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
              </span> */}
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
          </section>
          <div className={styles['action-btn-wrapper']}>
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
            {/* Send Email Button  */}
            <CustomizedTooltips title="Repost">
              <div onClick={handleRepost} className={styles['action-btn']}>
                <Image src={MailIcon} alt="share" />
              </div>
            </CustomizedTooltips>

            {/* Bookmark Button */}
            <CustomizedTooltips title="Bookmark">
              <div
                onClick={showFeatureUnderDevelopment}
                className={styles['action-btn']}
              >
                <BookmarkBorderRoundedIcon color="primary" />
              </div>
            </CustomizedTooltips>

            {/* Share Button */}
            <CustomizedTooltips title="Share">
              <div onClick={handleShare} className={styles['action-btn']}>
                {/* <Image src={ShareIcon} alt="share" /> */}
                <ShareIcon />
              </div>
            </CustomizedTooltips>

            {/* More Options Button */}
            <CustomizedTooltips title="Click to view options">
              <div
                onClick={(e) => showFeatureUnderDevelopment()}
                className={styles['action-btn']}
              >
                <MoreHorizRoundedIcon color="primary" />
              </div>
            </CustomizedTooltips>
          </div>
        </header>

        {/* Tabs */}
        <div className={styles['display-desktop']}>
          <div className={styles.navContainer}>
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
