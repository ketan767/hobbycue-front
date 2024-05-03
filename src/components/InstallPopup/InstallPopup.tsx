import React, { FC, useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useMediaQuery } from '@mui/material'
import hcSmallLogo from '@/assets/image/logo-small.png'
import Image from 'next/image'
interface InstallPopupProps {
  showAddToHome: boolean | 'loading'
  setShowAddToHome: React.Dispatch<React.SetStateAction<boolean | 'loading'>>
}

const InstallPopup: FC<InstallPopupProps> = ({
  showAddToHome,
  setShowAddToHome,
}) => {
  const isMobile = useMediaQuery('(max-width:1100px)')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      console.log(event,'click');
      
      setDeferredPrompt(event)
    }
    if ('serviceWorker' in navigator) {
       
         console.log('sas');
    navigator.serviceWorker.register('./sw.js')        
        .then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
         
          const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault()
            console.log(event,'click');
            
            setDeferredPrompt(event)
          }
          window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
          console.log('click');
          
        }, function(err) {
          // Registration failed
          console.log('ServiceWorker registration failed: ', err);
        });
       console.log('click1');

    }
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
    }
  }, []);
  // useEffect(() => {
  //   console.log('click22');
  //   const handleBeforeInstallPrompt = (event: Event) => {
  //     event.preventDefault()
  //     console.log(event,'click');
      
  //     setDeferredPrompt(event)
  //   }

  //   window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

  //   return () => {
  //     window.removeEventListener(
  //       'beforeinstallprompt',
  //       handleBeforeInstallPrompt,
  //     )
  //   }
  // }, [])

  const addToHomeScreen = () => {
    console.log(deferredPrompt,'click');
    
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
          localStorage.setItem('addToHomePopup', 'false')
          setShowAddToHome(false)
        } else {
          console.log('User dismissed the A2HS prompt')
        }
        setDeferredPrompt(null)
      })
    }
  }

  const remindLater = () => {
    localStorage.setItem('addToHomePopup', 'false')
    setShowAddToHome(false)
  }
  return (
    <section
      className={styles['fixed-bg'] + ` ${!isMobile ? styles['hidden'] : ''}`}
    >
      <div className={styles['container']}>
        <Image src={hcSmallLogo} alt="Hobbycue Small Logo" />
        <div className={styles['data-container']}>
          <p className={styles['title']}>Add HobbyCue to your Home screen?</p>
          <p className={styles['desc']}>
            Get to HobbyCue quickly and easily by adding it to your Home creen.
          </p>
          <button onClick={addToHomeScreen} className={styles['primary-btn']}>
            Add to Home screen
          </button>
          <p onClick={remindLater} className={styles['secondary-txt']}>
            Remind me later
          </p>
        </div>
      </div>
    </section>
  )
}

export default InstallPopup
