import Link from 'next/link'
import styles from './ProfileHeader.module.css'
import { useRouter } from 'next/router'

type Props = {
  activeTab: ProfilePageTabs
}

const ProfileNavigationLinks: React.FC<Props> = ({ activeTab }) => {
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
