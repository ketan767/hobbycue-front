import { useState, useEffect, FC } from 'react'
import styles from './DownloadInMobile.module.css'

interface DownloadInMobileProps {}

const DownloadInMobile: FC<DownloadInMobileProps> = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showButton, setShowButton] = useState<boolean>(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      const promptEvent = event as any // Cast event to any
      setDeferredPrompt(promptEvent)
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
    }
  }, [])

  const addToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
        } else {
          console.log('User dismissed the A2HS prompt')
        }
        setDeferredPrompt(null)
        setShowButton(false) // Hide the button after user interaction
      })
    }
  }

  const hideComponent = () => {
    setShowButton(false) // Hide the button when 'later' is clicked
  }

  return (
    <div className={styles.container}>
      {showButton && (
        <div className={styles.childContainer}>
          <p>Install HobbyCue web app on your phone</p>
          <button onClick={addToHomeScreen} className={styles.downloadBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
                fill="#8064A2"
              />
            </svg>
          </button>
          <button onClick={hideComponent} className={styles.closeBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12.1966 3.80714C11.9366 3.54714 11.5166 3.54714 11.2566 3.80714L7.99656 7.06047L4.73656 3.80047C4.47656 3.54047 4.05656 3.54047 3.79656 3.80047C3.53656 4.06047 3.53656 4.48047 3.79656 4.74047L7.05656 8.00047L3.79656 11.2605C3.53656 11.5205 3.53656 11.9405 3.79656 12.2005C4.05656 12.4605 4.47656 12.4605 4.73656 12.2005L7.99656 8.94047L11.2566 12.2005C11.5166 12.4605 11.9366 12.4605 12.1966 12.2005C12.4566 11.9405 12.4566 11.5205 12.1966 11.2605L8.93656 8.00047L12.1966 4.74047C12.4499 4.48714 12.4499 4.06047 12.1966 3.80714Z"
                fill="#6D747A"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default DownloadInMobile
