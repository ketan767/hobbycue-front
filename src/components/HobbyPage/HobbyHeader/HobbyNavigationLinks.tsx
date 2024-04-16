import Link from 'next/link'
import styles from './HobbyHeader.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { SetLinkviaAuth } from '@/redux/slices/user'

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

  const handleTabClick = (tab: any) => {
    if (!isLoggedIn && (tab === 'posts' || tab === 'links')) {
      dispatch(openModal({ type: 'auth', closable: true }))
      dispatch(
        SetLinkviaAuth(
          `/hobby/${router.query.slug}/${tab !== 'home' ? tab : ''}`,
        ),
      )
    } else {
      router.push(`/hobby/${router.query.slug}/${tab !== 'home' ? tab : ''}`)
    }
  }
  return (
    <div className={styles['navigation-links']}>
      {tabs.map((tab) => {
        return (
          <a
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={activeTab === tab ? styles['active'] : ''}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </a>
        )
      })}
    </div>
  )
}

export default HobbyNavigationLinks
