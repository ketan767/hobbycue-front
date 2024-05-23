import React, { useState } from 'react'
import styles from './styles.module.css'
import ContentLoader from 'react-content-loader'
import { useMediaQuery } from '@mui/material'
import postcardBottomSection from '@/assets/svg/loader/postcard-bottom-section.svg'

type Props = {}

const PostCardSkeletonLoading: React.FC<Props> = () => {
  const isMobile = useMediaQuery("(max-width:1100px)");
  const threeDots = (<svg className={styles['three-dots']} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="28" height="28" rx="14" fill="white"/>
  <g clip-path="url(#clip0_39_1223)">
  <path d="M14 10C15.1 10 16 9.1 16 8C16 6.9 15.1 6 14 6C12.9 6 12 6.9 12 8C12 9.1 12.9 10 14 10ZM14 12C12.9 12 12 12.9 12 14C12 15.1 12.9 16 14 16C15.1 16 16 15.1 16 14C16 12.9 15.1 12 14 12ZM14 18C12.9 18 12 18.9 12 20C12 21.1 12.9 22 14 22C15.1 22 16 21.1 16 20C16 18.9 15.1 18 14 18Z" fill="#8064A2"/>
  </g>
  <defs>
  <clipPath id="clip0_39_1223">
  <rect width="24" height="24" fill="white" transform="translate(2 2)"/>
  </clipPath>
  </defs>
  </svg>
  )
  return (
    <>
      <div className={styles['wrapper']}>
        <div className={styles['loader-container']}>
          {!isMobile&&threeDots}
          {!isMobile?<ContentLoader
            speed={2}
            width="100%"
            height={537}
            viewBox="0 0 726 537"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={styles['content-loader']}
          >
            <rect x="12" y="12" rx="3" ry="3" width="40" height="40" />
            <rect x="60" y="12" rx="9" ry="9" width="340" height="16" fill='#D9DBE9' />
            <rect x="60" y="34" rx="9" ry="9" width="210" height="14" fill='#D9DBE9' />
            <rect x="12" y="72" rx="9" ry="9" width="637" height="14" fill='#D9DBE9' />
            <rect x="12" y="91" rx="9" ry="9" width="343" height="14" fill='#D9DBE9' />
            <rect x="0" y="116" rx="0" ry="0" width="800" height="294" fill='#F7F5F9' />
            </ContentLoader>
            :
          <ContentLoader
            speed={2}
            width="100%"
            height={160}
            viewBox="0 0 400 160"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="88" rx="3" ry="3" width="278" height="6" />
            <rect x="0" y="104" rx="3" ry="3" width="240" height="6" />
            <rect x="0" y="120" rx="3" ry="3" width="340" height="6" />
            <rect x="0" y="136" rx="3" ry="3" width="280" height="6" />
            <rect x="0" y="150" rx="3" ry="3" width="240" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>}
         {!isMobile &&<img className={styles['postcardBottomSection']} src={postcardBottomSection.src} alt='loading'/>}
        </div>
      </div>
    </>
  )
}

export default PostCardSkeletonLoading
