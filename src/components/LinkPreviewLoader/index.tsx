import React, { useState } from 'react'
import styles from './styles.module.css'
import ContentLoader from 'react-content-loader'
import { useMediaQuery } from '@mui/material'

type Props = {}

const LinkPreviewLoader: React.FC<Props> = () => {
  const isMobile = useMediaQuery("(max-width:1100px)")
  return (
    <>
      <div className={styles['wrapper']}>
        <div className={styles['loader-container']}>
          {!isMobile?<ContentLoader
            speed={2}
            width="100%"
            height={80}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={styles['content-loader']}
          >
            <rect x="0" y="10" rx="3" ry="3" width="80" height="80" />
            <rect x="88" y="20" rx="5" ry="5" width="100%" height="16" />
            <rect x="88" y="60" rx="5" ry="5" width="100%" height="14" />
          </ContentLoader>:
          <ContentLoader
            speed={2}
            width="100%"
            height={60}
            viewBox="0 0 300 60"
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

export default LinkPreviewLoader
