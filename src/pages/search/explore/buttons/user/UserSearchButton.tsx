import React from 'react'
import styles from './UserSearchButton.module.css'
import useHandleUserProfileSearch from '@/pages/search/utils/HandleUserProSearch'
import { isMobile } from '@/utils'
type UserSearchButton = {
  currUserName: string
  selectedHobby: string
  selectedLocation: string
}
const UserSearchButton: React.FC<UserSearchButton> = ({
  currUserName,
  selectedHobby,
  selectedLocation,
}) => {
  const handleUserProfileSearch = useHandleUserProfileSearch()
  const isMob = isMobile()

  return (
    <button
      className={`modal-footer-btn ${styles.searchButtonMobile}`}
      style={{
        width: isMob ? '100%' : 71,
        height: 32,
        marginLeft: 'auto',
      }}
      onClick={() => {
        handleUserProfileSearch(currUserName, selectedHobby, selectedLocation)
      }}
    >
      Search
    </button>
  )
}

export default UserSearchButton
