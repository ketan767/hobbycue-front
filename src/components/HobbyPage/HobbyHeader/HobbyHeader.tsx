import React from 'react'
import styles from './HobbyHeader.module.css'

import Image from 'next/image'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import ShareIcon from '@/assets/svg/share-outlined.svg'
import DefaultProfile from '@/assets/svg/default-images/default-hobbies.svg'
import MailIcon from '@/assets/svg/mailicon.svg'
import { useDispatch } from 'react-redux'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import HobbyNavigationLinks from './HobbyNavigationLinks'
import FilledButton from '@/components/_buttons/FilledButton'

type Props = {
  activeTab: HobbyPageTabs
  data: any
}

const HobbyPageHeader = ({ activeTab, data }: Props) => {
  // console.log('🚀 ~ file: HobbyHeader.tsx:22 ~ HobbyPageHeader ~ data:', data)
  const dispatch = useDispatch()

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }
  const handleAddhobby = () => {
    dispatch(openModal({ type: 'profile-hobby-edit', closable: true }))
  }

  return (
    <>
      {/* Page Header  */}
      <header
        className={`site-container ${styles['header']} ${styles['expanded']} `}
      >
        {data?.profile_image ? (
          <div className={styles['title-mobile']}>
            <Image
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
            <Image
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
            >
              Add to mine
            </FilledButton>
          </div>
        </section>

        {/* Action buttons for desktop view */}
        <div
          className={`${styles['action-btn-wrapper']} ${styles['display-desktop']}`}
        >
          {/* Send Email Button  */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <Image src={MailIcon} alt="share" />
          </div>

          {/* Bookmark Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <BookmarkBorderRoundedIcon color="primary" />
          </div>

          {/* Share Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <Image src={ShareIcon} alt="share" onClick={handleShare} />
          </div>

          {/* More Options Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <MoreHorizRoundedIcon color="primary" />
          </div>
        </div>
      </header>

      {/* Action buttons for mobile view */}
      <div
        className={`${styles['action-btn-wrapper']} ${styles['display-flex-mobile']}`}
      >
        {/* Send Email Button  */}
        <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
          <Image src={MailIcon} alt="share" />
        </div>

        {/* Bookmark Button */}
        <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
          <BookmarkBorderRoundedIcon color="primary" />
        </div>

        {/* Share Button */}
        <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
          <Image src={ShareIcon} alt="share" onClick={handleShare} />
        </div>

        {/* More Options Button */}
        <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
          <MoreHorizRoundedIcon color="primary" />
        </div>
        {/*  */}
        <FilledButton className={styles['add-mine']} onClick={handleAddhobby}>
          Add to mine
        </FilledButton>
      </div>

      {/* Tabs */}
      <div className={styles['display-desktop']}>
        <HobbyNavigationLinks activeTab={activeTab} />
      </div>
    </>
  )
}

export default HobbyPageHeader
