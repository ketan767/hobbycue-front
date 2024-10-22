import styles from './styles.module.css'
import img503 from '@/assets/image/_503.png'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { useState } from 'react'
import { openModal } from '@/redux/slices/modal'

type Snackbar = {
  message: string
  triggerOpen: boolean
  type: 'error' | 'success'
}

const index = () => {
  const imageUrl = img503.src
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)
  const [showSnackbar, setShowSnackbar] = useState<Snackbar>({
    message: '',
    triggerOpen: false,
    type: 'success',
  })
  const dispatch = useDispatch()

  const handleNotify = () => {
    if (user?.email) {
      setShowSnackbar({
        message: "You will receive an e-mail as soon as we're back",
        triggerOpen: true,
        type: 'success',
      })
    } else {
      dispatch(openModal({ type: 'confirm-email', closable: true }))
    }
  }

  return (
    <div className={styles['notfound-container']}>
      <img
        src={imageUrl}
        alt="Error Page Image"
        className={styles['notfoundImg']}
      />
      <div className={styles['contentContainer']}>
        <h1>We'll be right back...</h1>
        <p>
          Hi there! We're currently doing some work to make things better for
          you. Please check back soon. Thanks for your patience!
        </p>
      </div>
      <div className={styles['flexRowContainer']}>
        <button
          onClick={() => router.refresh()}
          className={styles.btnSecondary}
        >
          Refresh
        </button>
        <button onClick={handleNotify} className={`${styles['btnPrimary']}`}>
          Notify
        </button>
      </div>

      <CustomSnackbar
        message={showSnackbar.message}
        triggerOpen={showSnackbar.triggerOpen}
        type={showSnackbar.type}
        closeSnackbar={() =>
          setShowSnackbar({ ...showSnackbar, triggerOpen: false })
        }
      />
    </div>
  )
}

export default index
