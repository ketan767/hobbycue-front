import React from 'react'
import styles from './PostSearchButton.module.css'
import useHandlePostsSearch from '@/pages/search/utils/HandlePostsSearch'
import { isMobile } from '@/utils'
type PostSearchButton = {
  currPostedBy: string
  selectedHobby: string
  selectedLocation: string
}

const PostSearchButton: React.FC<PostSearchButton> = ({
  currPostedBy,
  selectedHobby,
  selectedLocation,
}) => {
  const isMob = isMobile()
  const handlePostsSearch = useHandlePostsSearch()

  return (
    <button
      className={`modal-footer-btn ${styles.searchButtonMobile}`}
      style={{
        width: isMob ? '100%' : 71,
        height: 32,
        marginLeft: 'auto',
      }}
      onClick={() => {
        handlePostsSearch(currPostedBy, selectedHobby, selectedLocation)
      }}
    >
      Search
    </button>
  )
}

export default PostSearchButton