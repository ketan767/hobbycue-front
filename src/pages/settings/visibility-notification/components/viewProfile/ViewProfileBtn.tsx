import React from 'react'
import styles from './ViewProfileBtn.module.css'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type ViewProfileBtnProps = {}
const ViewProfileBtn: React.FC<ViewProfileBtnProps> = () => {
  const router = useRouter()
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const handleOpenProfile = () => {
    if (isLoggedIn) {
      router.push(`/profile/${user.profile_url}`)
    } else {
      router.push('/')
    }
  }
  return (
    <div className={styles['explore-sidebar']}>
      <button onClick={handleOpenProfile} className={'modal-footer-btn'}>
        View Profile
      </button>
    </div>
  )
}

export default ViewProfileBtn