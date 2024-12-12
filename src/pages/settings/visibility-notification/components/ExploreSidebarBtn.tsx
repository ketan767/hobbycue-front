import Link from 'next/link'
import styles from './ExploreSideBar.module.css'
import { useRouter } from 'next/router'

type PropsExploreSidebarBtn = {
  href: string
  text: string
  icon?: React.ReactNode
}
const ExploreSidebarBtn: React.FC<PropsExploreSidebarBtn> = ({
  href,
  text,
  icon,
}) => {
  const router = useRouter()
  const handleOpenHelp = () => {
    router.push(href)
  }
  return (
    <div className={styles['explore-sidebar']}>
      <button onClick={handleOpenHelp} className="modal-footer-btn">
        {icon}
        {text}
      </button>
    </div>
  )
}

export default ExploreSidebarBtn
