import Link from 'next/link'
import styles from './ExploreSideBar.module.css'

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
  return (
    <div className={styles['explore-sidebar']}>
      <Link href={href}>
        <button className="modal-footer-btn">
          {icon}
          {text}
        </button>
      </Link>
    </div>
  )
}

export default ExploreSidebarBtn
