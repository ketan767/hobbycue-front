import React from 'react'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import styles from './Bookmark.module.css'
type BookmarkProps = {
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      type: string
      display: boolean
      message: string
    }>
  >
}
const BookmarkOnCards: React.FC<BookmarkProps> = ({ setSnackbar }) => {
  const showFeatureUnderDevelopment = (e: any) => {
    e.stopPropagation()
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
  return (
    <div
      onClick={(e) => showFeatureUnderDevelopment(e)}
      className={styles['action-btn']}
    >
      <BookmarkBorderRoundedIcon color="primary" />
    </div>
  )
}

export default BookmarkOnCards
