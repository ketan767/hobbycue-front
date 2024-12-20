import React from 'react'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import styles from './ListingBookmark.module.css'
const ListingBookmark = () => {
  return (
    <div
      // onClick={() => showFeatureUnderDevelopment()}
      className={styles['action-btn']}
    >
      <BookmarkBorderRoundedIcon color="primary" />
    </div>
  )
}

export default ListingBookmark
