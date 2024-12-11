import React, { useState } from 'react'
import styles from '../styles.module.css'
import NameField from '../FilterComponents/NameField'
import HobbyField from '../FilterComponents/HobbyField'
import LocationField from '../FilterComponents/LocationField'
import { isMobile } from '@/utils'
import useHandleUserProfileSearch from '../utils/HandleUserProSearch'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type UserExploreProps = {
  currUserName: string
  setCurrUserName: (name: string) => void
}
const UserExplore: React.FC<UserExploreProps> = ({
  currUserName,
  setCurrUserName,
}) => {
  const isMob = isMobile()
  const handleUserProfileSearch = useHandleUserProfileSearch()
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  return (
    <div className={styles.siteExploreParent}>
      <div className={styles.inputExploreContainer}>
        <NameField
          filterPage={'User'}
          currUserName={currUserName}
          setCurrUserName={setCurrUserName}
          selectedLocation={selectedLocation}
          selectedHobby={selectedHobby}
        />
        <HobbyField
          filterPage={'User'}
          currUserName={currUserName}
          selectedLocation={selectedLocation}
          selectedHobby={selectedHobby}
          setSelectedHobby={setSelectedHobby}
        />
        <LocationField
          filterPage={'User'}
          currUserName={currUserName}
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
            handleUserProfileSearch(
              currUserName,
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

export default UserExplore