import { FC } from 'react'
import styles from './styles.module.css'
import hc404Img from '@/assets/image/hc_404.png'
import hcRestrictedImg from '@/assets/image/hc_restricted_link.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface ErrorPageProps {
  restricted?: boolean
}

const ErrorPage: FC<ErrorPageProps> = ({ restricted = false }) => {
  const imageUrl = hc404Img.src
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
          has restricted who can view, or the content has been deleted. You may{' '}
          <a href="/help">Visit Help Center</a> for more information
        </p>
      </div>
      <div className={styles['flexColContainer']}>
        <button
          onClick={() => router.back()}
          className={`${styles['btnSecondary']} modal-footer-btn cancel`}
        >
          Go Back
        </button>
        <button
          onClick={() =>
            router.replace(user?.isAuthenticated ? '/community' : '/')
          }
          className={`${styles['btnPrimary']} modal-footer-btn submit`}
        >
          Home Page
        </button>
      </div>
    </div>
  )
}

export default ErrorPage
