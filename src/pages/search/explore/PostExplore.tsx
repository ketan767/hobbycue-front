import React, { useState } from 'react'
import styles from '../styles.module.css'
import HobbyField from '../FilterComponents/HobbyField'
import LocationField from '../FilterComponents/LocationField'
import PostField from '../FilterComponents/PostField'
import PostSearchButton from './buttons/post/PostSearchButton'

type PostExploreProps = {
  currPostedBy: string
  setCurrPostedBy: (name: string) => void
}
const PostExplore: React.FC<PostExploreProps> = ({
  currPostedBy,
  setCurrPostedBy,
}) => {
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  return (
    <>
      <div className={styles.siteExploreParent}>
        <div className={styles.inputExploreContainer}>
          <PostField
            currPostedBy={currPostedBy}
            setCurrPostedBy={setCurrPostedBy}
            selectedLocation={selectedLocation}
            selectedHobby={selectedHobby}
          />
          <div className={`${styles.mobileHidden}`}>
            <HobbyField
              filterPage={'Post'}
              currPostedBy={currPostedBy}
              selectedLocation={selectedLocation}
              selectedHobby={selectedHobby}
              setSelectedHobby={setSelectedHobby}
            />
          </div>

          <LocationField
            filterPage={'Post'}
            currPostedBy={currPostedBy}
            selectedHobby={selectedHobby}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
          <div className={styles.mobileHidden}>
            <PostSearchButton
              currPostedBy={currPostedBy}
              selectedHobby={selectedHobby}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </div>
      <div className={`${styles.siteExploreParent} ${styles.laptopHidden}`}>
        <div
          className={`${styles.inputExploreContainer} ${styles.inputExploreContainerWithBtn}`}
        >
          <div className={`${styles.accordianPositionMobile}`}>
            <HobbyField
              filterPage={'Post'}
              currPostedBy={currPostedBy}
              selectedLocation={selectedLocation}
              selectedHobby={selectedHobby}
              setSelectedHobby={setSelectedHobby}
            />
          </div>
          <div className={`${styles.submitMobile}`}>
            <PostSearchButton
              currPostedBy={currPostedBy}
              selectedHobby={selectedHobby}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PostExplore