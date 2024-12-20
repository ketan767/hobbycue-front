import React from 'react'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import styles from './Bookmark.module.css'
const BookmarkOnCards = () => {
  return (
    <div
      // onClick={() => showFeatureUnderDevelopment()}
      className={styles['action-btn']}
    >
      <BookmarkBorderRoundedIcon color="primary" />
    </div>
  )
}

export default BookmarkOnCards
