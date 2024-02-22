import Link from 'next/link'
import styles from './HobbyHeader.module.css'
import { useRouter } from 'next/router'

type Props = {
  activeTab: HobbyPageTabs
}

const HobbyNavigationLinks: React.FC<Props> = ({ activeTab }) => {
  const router = useRouter()
  const tabs: HobbyPageTabs[] = [
    'home',
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]
  return (
    <div className={styles['navigation-links']}>
      {tabs.map((tab) => {
        return (
          <Link
            key={tab}
            href={`/hobby/${router.query.slug}/${tab !== 'home' ? tab : ''}`}
            className={activeTab === tab ? styles['active'] : ''}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Link>
        )
      })}
    </div>
  )
}

export default HobbyNavigationLinks
