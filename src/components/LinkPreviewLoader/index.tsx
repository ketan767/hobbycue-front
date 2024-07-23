import React, { useState } from 'react'
import styles from './styles.module.css'
import ContentLoader from 'react-content-loader'
import { useMediaQuery } from '@mui/material'

type Props = {}

const LinkPreviewLoader: React.FC<Props> = () => {
  const isMobile = useMediaQuery('(max-width:1100px)')
  return (
    <>
      <div className={styles['wrapper']}>
        <div className={styles['loader-container']}>
          {!isMobile ? (
            <ContentLoader
              speed={2}
              width="100%"
              height={100}
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              className={styles['content-loader']}
            >
              <rect x="" y="" rx="3" ry="3" width="100" height="100" />
              <rect x="112" y="4" rx="7" ry="5" width="60%" height="14" />
              <rect x="112" y="37" rx="5" ry="5" width="65%" height="12.5" />
              <rect x="112" y="72" rx="5" ry="5" width="50%" height="12.5" />
            </ContentLoader>
          ) : (
            <ContentLoader
              speed={2}
              width="100%"
              height={60}
              viewBox="0 0 300 60"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="" y="10" rx="3" ry="3" width="100" height="100" />
              <rect x="112" y="12" rx="7" ry="5" width="60%" height="14" />
              <rect x="112" y="45" rx="5" ry="5" width="65%" height="12.5" />
              <rect x="112" y="80" rx="5" ry="5" width="50%" height="12.5" />
            </ContentLoader>
          )}
        </div>
      </div>
    </>
  )
}

export default LinkPreviewLoader
