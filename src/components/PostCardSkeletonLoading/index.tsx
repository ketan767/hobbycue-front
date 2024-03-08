import React, { useState } from 'react'
import styles from './styles.module.css'
import ContentLoader from 'react-content-loader'
import { useMediaQuery } from '@mui/material'

type Props = {}

const PostCardSkeletonLoading: React.FC<Props> = () => {
  const isMobile = useMediaQuery("(max-width:1100px)")
  return (
    <>
      <div className={styles['wrapper']}>
        <div className={styles['loader-container']}>
          {!isMobile?<ContentLoader
            speed={2}
            width="100%"
            height={320}
            viewBox="0 7 800 313"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="47" y="7" rx="3" ry="3" width="133" height="13" />
            <rect x="48" y="26" rx="3" ry="3" width="87" height="8" />
            <circle cx="20" cy="23" r="20" />
            <rect x="5" y="60" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="75" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="90" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="105" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="120" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="135" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="150" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="165" rx="5" ry="5" width="680" height="8" />
            <rect x="5" y="180" rx="5" ry="5" width="580" height="8" />

            <circle cx="130" cy="245" r="15" />
            <rect x="0" y="230" rx="17" ry="17" width="107" height="30" />
            <circle cx="18" cy="304" r="18" />
            <rect x="49" y="290" rx="9" ry="9" width="415" height="30" />
          </ContentLoader>:
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
        </div>
      </div>
    </>
  )
}

export default PostCardSkeletonLoading
