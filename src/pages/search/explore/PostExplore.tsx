import React, { useState } from 'react'
import styles from '../styles.module.css'
import HobbyField from '../FilterComponents/HobbyField'
import LocationField from '../FilterComponents/LocationField'
import { isMobile } from '@/utils'
import useHandleUserProfileSearch from '../utils/HandleUserProSearch'
import PostField from '../FilterComponents/PostField'
import useHandlePostsSearch from '../utils/HandlePostsSearch'

type PostExploreProps = {
  currPostedBy: string
  setCurrPostedBy: (name: string) => void
}
const PostExplore: React.FC<PostExploreProps> = ({
  currPostedBy,
  setCurrPostedBy,
}) => {
  const isMob = isMobile()
  const handlePostsSearch = useHandlePostsSearch()
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  return (
    <div className={styles.siteExploreParent}>
      <div className={styles.inputExploreContainer}>
        <PostField
          currPostedBy={currPostedBy}
          setCurrPostedBy={setCurrPostedBy}
          selectedLocation={selectedLocation}
          selectedHobby={selectedHobby}
        />
        <HobbyField
          filterPage={'Post'}
          currPostedBy={currPostedBy}
          selectedLocation={selectedLocation}
          selectedHobby={selectedHobby}
          setSelectedHobby={setSelectedHobby}
        />
        <LocationField
          filterPage={'Post'}
          currPostedBy={currPostedBy}
          selectedHobby={selectedHobby}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />

        <button
          className="modal-footer-btn"
          style={{
            width: isMob ? '100%' : 71,
            height: 32,
            marginLeft: 'auto',
          }}
          onClick={() => {
            handlePostsSearch(
              currPostedBy,
              selectedHobby,
              selectedLocation,
            )
          }}
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default PostExplore