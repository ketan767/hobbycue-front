import styles from './styles.module.css'
import img503 from '@/assets/image/_503.png'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { useEffect, useRef, useState } from 'react'
import { openModal } from '@/redux/slices/modal'
import { notifyMaintenance } from '@/services/user.service'

type Snackbar = {
  message: string
  triggerOpen: boolean
  type: 'error' | 'success'
}

const index = () => {
  const imageUrl = img503.src
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState<Snackbar>({
    message: '',
    triggerOpen: false,
    type: 'success',
  })
  const dispatch = useDispatch()

  const focusableRefs = useRef<(HTMLButtonElement | HTMLAnchorElement)[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      event.preventDefault() // Prevent default tabbing behavior
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % focusableRefs.current.length,
      ) // Cycle focus
    }
  }

  useEffect(() => {
    // Set focus to the current element
    focusableRefs.current[currentIndex]?.focus()
  }, [currentIndex])

  useEffect(() => {
    // Attach keydown listener on mount
    const handleKey = (e: KeyboardEvent) => handleKeyDown(e)
    window.addEventListener('keydown', handleKey)

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  const handleNotify = async () => {
    if (user?.email) {
      try {
        setBtnDisabled(true)
        const { res, err } = await notifyMaintenance({
          email: user.email,
          username: user.full_name,
        })
        if (err || !res?.data.success) {
          throw err || new Error('Error in 500 page')
        }
        setShowSnackbar({
          message: "You will receive an e-mail as soon as we're back",
          triggerOpen: true,
          type: 'success',
        })
      } catch (err: any) {
        console.log('Error in 500 page', err)
        if (err.response?.status === 400) {
          setShowSnackbar({
            message: 'You are already on our waiting list!',
            triggerOpen: true,
            type: 'success',
          })
        }
        // if (err.message === '')
      } finally {
        setBtnDisabled(false)
      }
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
          onClick={() => {
            router.refresh()
            router.back()
          }}
          className={styles.btnSecondary}
          ref={(el) => {
            if (el) focusableRefs.current[0] = el
          }}
        >
          Refresh
        </button>
        <button
          ref={(el) => {
            if (el) focusableRefs.current[2] = el
          }}
          onClick={handleNotify}
          className={`${styles['btnPrimary']}`}
          disabled={btnDisabled}
        >
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
