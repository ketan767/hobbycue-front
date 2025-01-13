import React from 'react'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import styles from './ListingBookmark.module.css'

interface Props {
  isCardHovered: boolean
}

const ListingBookmark = ({ isCardHovered }: Props) => {
  return (
    <div
      // onClick={() => showFeatureUnderDevelopment()}
      className={styles['action-btn']}
      style={isCardHovered ? { opacity: 1 } : { opacity: 0.3 }}
    >
      <BookmarkBorderRoundedIcon color="primary" />
    </div>
  )
}

export default ListingBookmark
