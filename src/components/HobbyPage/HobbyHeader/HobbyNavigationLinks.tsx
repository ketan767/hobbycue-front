import Link from 'next/link'
import styles from './HobbyHeader.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'

type Props = {
  activeTab: HobbyPageTabs
}

const HobbyNavigationLinks: React.FC<Props> = ({ activeTab }) => {
  const router = useRouter()
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const tabs: HobbyPageTabs[] = [
    'home',
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]

  const handleTabClick = (tab: string) => {
    if (isLoggedIn) {
      return
    } else if (tab === 'posts' || tab === 'links') {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  return (
    <div className={styles['navigation-links']}>
      {tabs.map((tab) => {
        return (
          <Link
            key={tab}
            href={
              tab === 'home' ||
              tab === 'posts' ||
              tab === 'links' ||
              tab === 'pages' ||
              tab === 'store' ||
              tab === 'blogs'
                ? `/hobby/${router.query.slug}/${tab !== 'home' ? tab : ''}`
                : '#'
            }
            onClick={() => handleTabClick(tab)}
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
