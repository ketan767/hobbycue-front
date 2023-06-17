import React, { useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Facebook from '@/assets/svg/Facebook.svg'
import Twitter from '@/assets/svg/Twitter.svg'
import Instagram from '@/assets/svg/Instagram.svg'
import Image from 'next/image'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfileSocialMediaSide = ({ data }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
 
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
          <li>
            <Image src={Facebook} alt="facebook" />
          </li>
          <li>
            <Image src={Twitter} alt="Twitter" />
          </li>
          <li>
            <Image src={Instagram} alt="Instagram" />
          </li>
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileSocialMediaSide
