import React, { useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { Tooltip } from '@mui/material'
import Facebook from '@/assets/svg/Facebook.svg'
import Twitter from '@/assets/svg/Twitter.svg'
import Instagram from '@/assets/svg/Instagram.svg'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfileSocialMediaSide = ({ data }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { user } = useSelector((state: any) => state.user)

  const dispatch = useDispatch()
  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'social-media-edit', closable: true }))
        }
      >
        <h4 className={styles['heading']}>Social Media</h4>
        <ul className={styles['contact-wrapper']}>
          <Tooltip title="Facebook">
            <Link href={user.facebook_url ? user.facebook_url : ''}>
              <Image src={Facebook} alt="facebook" />
            </Link>
          </Tooltip>
          <Tooltip title="Twitter">
            <Link href={user.twitter_url ? user.twitter_url : ''}>
              <Image src={Twitter} alt="Twitter" />
            </Link>
          </Tooltip>
          <Tooltip title="Instagram">
            <Link href={user.instagram_url ? user.instagram_url : ''}>
              <Image src={Instagram} alt="Instagram" />
            </Link>
          </Tooltip>
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileSocialMediaSide
