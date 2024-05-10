import { FC } from 'react'
import styles from './AdminNavbar.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ProfileSwitcher from '../ProfileSwitcher/ProfileSwitcher'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'

interface AdminNavbarProps {
  
}

const AdminNavbar: FC<AdminNavbarProps> = ({}) => {
  return <nav className={styles.container}>
    <div className={styles.navlist}>
      <ProfileSwitcher/>
    </div>
  </nav>
}

export default AdminNavbar