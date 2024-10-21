import styles from './styles.module.css'
import img404 from '@/assets/image/_404.png'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'

const index = () => {
  const imageUrl = img404.src
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)

  return (
    <div className={styles['notfound-container']}>
      <img
        src={imageUrl}
        alt="Error Page Image"
        className={styles['notfoundImg']}
      />
      <div className={styles['contentContainer']}>
        <h1>Content unavailable</h1>
        <p>
          Oops! Please re-check the link. If it seems correct, maybe the owner
          has restricted who can view, or the content has been deleted.
          <br />
          You may try the <Link href="/search">Search option</Link> to find it
          or <Link href="/help">Visit Help Center</Link> for more information.
        </p>
      </div>
      <div className={styles['flexColContainer']}>
        <button onClick={() => router.back()} className={styles.btnSecondary}>
          Go Back
        </button>
        <button
          onClick={() =>
            router.replace(user?.isAuthenticated ? '/community' : '/')
          }
          className={`${styles['btnPrimary']}`}
        >
          Home Page
        </button>
      </div>
    </div>
  )
}

export default index
