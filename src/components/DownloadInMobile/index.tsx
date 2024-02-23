import { FC, useEffect, useState } from 'react'
import styles from './styles.module.css'

interface DownloadInMobileProps {}

const DownloadInMobile: FC<DownloadInMobileProps> = ({}) => {
  const [hide, setHide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // You can replace 'any' with a more specific type if known
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent Chrome 76 and later from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(event);
      setShowButton(true); // Show the button when the event is detected
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const addToHomeScreen = () => {
    if (deferredPrompt) {
      // Show the prompt
      (deferredPrompt as any).prompt(); // You can replace 'any' with a more specific type if known
      // Wait for the user to respond to the prompt
      (deferredPrompt as any).userChoice.then((choiceResult: any) => { // You can replace 'any' with a more specific type if known
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // Reset the deferred prompt variable
        setDeferredPrompt(null);
      });
    }
  };

  if (hide === true) {
    return null
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.childContainer}>
          <button onClick={addToHomeScreen} className={styles.downloadBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clip-path="url(#clip0_2677_80519)">
                <path
                  d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
                  fill="#8064A2"
                />
              </g>
              <defs>
                <clipPath id="clip0_2677_80519">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <p>Add HobbyCue shortcut to your Home screen</p>
          <button
            onClick={() => {
              setHide(true)
            }}
            className={styles.closeBtn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clip-path="url(#clip0_2677_80513)">
                <path
                  d="M12.1966 3.80714C11.9366 3.54714 11.5166 3.54714 11.2566 3.80714L7.99656 7.06047L4.73656 3.80047C4.47656 3.54047 4.05656 3.54047 3.79656 3.80047C3.53656 4.06047 3.53656 4.48047 3.79656 4.74047L7.05656 8.00047L3.79656 11.2605C3.53656 11.5205 3.53656 11.9405 3.79656 12.2005C4.05656 12.4605 4.47656 12.4605 4.73656 12.2005L7.99656 8.94047L11.2566 12.2005C11.5166 12.4605 11.9366 12.4605 12.1966 12.2005C12.4566 11.9405 12.4566 11.5205 12.1966 11.2605L8.93656 8.00047L12.1966 4.74047C12.4499 4.48714 12.4499 4.06047 12.1966 3.80714Z"
                  fill="#6D747A"
                />
              </g>
              <defs>
                <clipPath id="clip0_2677_80513">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    )
  }
}

export default DownloadInMobile
