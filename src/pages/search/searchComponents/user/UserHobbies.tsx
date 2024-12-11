import React from 'react'
import styles from './UserHobbies.module.css'
type User = {
  profile_image: string
  full_name: string
  tagline: string
  primary_address: { city: string }
  profile_url: string
  _hobbies: any[]
}
type UserHobbiesProps = {
  user: User
}
const UserHobbies: React.FC<UserHobbiesProps> = ({ user }) => {
  return (
    <span className={styles.truncate}>
      {`${
        user?._hobbies[0]?.hobby?.display
          ? user?._hobbies[0]?.hobby?.display
          : ''
      }${
        user?._hobbies[0]?.genre?.display
          ? ' - ' + user?._hobbies[0]?.genre?.display
          : ''
      }`}
      {user?._hobbies[1]?.hobby?.display ? ', ' : ''}
      {`${
        user?._hobbies[1]?.hobby?.display
          ? user?._hobbies[1]?.hobby?.display
          : ''
      }${
        user?._hobbies[1]?.genre?.display
          ? ' - ' + user?._hobbies[1]?.genre?.display
          : ''
      }`}
      {user?._hobbies[2]?.hobby?.display ? ', ' : ''}
      {`${
        user?._hobbies[2]?.hobby?.display
          ? user?._hobbies[2]?.hobby?.display
          : ''
      }${
        user?._hobbies[2]?.genre?.display
          ? ' - ' + user?._hobbies[2]?.genre?.display
          : ''
      }${
        user?._hobbies?.length > 3
          ? ' (+' + (user?._hobbies?.length - 3) + ')'
          : ''
      }`}
    </span>
  )
}

export default UserHobbies