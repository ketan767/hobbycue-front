import React, { useState } from 'react'
import styles from '../styles.module.css'
import NameField from '../FilterComponents/NameField'
import HobbyField from '../FilterComponents/HobbyField'
import LocationField from '../FilterComponents/LocationField'
import UserSearchButton from './buttons/user/UserSearchButton'

type UserExploreProps = {
  currUserName: string
  setCurrUserName: (name: string) => void
}
const UserExplore: React.FC<UserExploreProps> = ({
  currUserName,
  setCurrUserName,
}) => {
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  return (
    <>
      <div className={styles.siteExploreParent}>
        <div className={styles.inputExploreContainer}>
          <NameField
            filterPage={'User'}
            currUserName={currUserName}
            setCurrUserName={setCurrUserName}
            selectedLocation={selectedLocation}
            selectedHobby={selectedHobby}
          />
          <div className={`${styles.mobileHidden}`}>
            <HobbyField
              filterPage={'User'}
              currUserName={currUserName}
              selectedLocation={selectedLocation}
              selectedHobby={selectedHobby}
              setSelectedHobby={setSelectedHobby}
            />
          </div>
          <LocationField
            filterPage={'User'}
            currUserName={currUserName}
            selectedHobby={selectedHobby}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
          <div className={styles.mobileHidden}>
            <UserSearchButton
              currUserName={currUserName}
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
          <div
            className={`${styles.accordianPositionMobile}`}
          >
            <HobbyField
              filterPage={'User'}
              currUserName={currUserName}
              selectedLocation={selectedLocation}
              selectedHobby={selectedHobby}
              setSelectedHobby={setSelectedHobby}
            />
          </div>
          <div className={`${styles.submitMobile}`}>
            <UserSearchButton
              currUserName={currUserName}
              selectedHobby={selectedHobby}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserExplore
