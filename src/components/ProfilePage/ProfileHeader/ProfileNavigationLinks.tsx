import Link from 'next/link'
import styles from './ProfileHeader.module.css'
import { useRouter } from 'next/router'
import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = {
  activeTab: ProfilePageTabs
  navigationTabs?: (tab: string) => void
}

const ProfileNavigationLinks: React.FC<Props> = ({ activeTab, navigationTabs }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const tabs: ProfilePageTabs[] = ['home', 'posts', 'media', 'pages', 'blogs']
  return (
    <nav className={styles['nav']}>
      <div className={styles['navigation-tabs']}>
        {tabs.map((tab) => {
          return (
            <Link
              key={tab}
              href={`/profile/${router.query.profile_url}/${
                tab !== 'home' ? tab : ''
              }`}
              className={activeTab === tab ? styles['active'] : ''}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isAuthenticated) {
                  dispatch(openModal({ type: 'auth', closable: true }))
                  return
                } else {
                 if(navigationTabs){
                  console.log('running nav')
                  navigationTabs(tab)
                 }else{
                  router.push(`/profile/${router.query.profile_url}/${
                    tab !== 'home' ? tab : ''
                  }`)
                 }
                }
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default ProfileNavigationLinks
