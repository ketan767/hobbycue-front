import scrollTopIcon from '@/assets/svg/scroll-top-icon.svg'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './GoTop.module.css'

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const handleScroll = () => {
    const scrollTop = window.scrollY
    setIsVisible(scrollTop > 100)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button className={`${styles['container']} `} onClick={scrollToTop}>
          <Image
            className={`${styles['iconSize']}`}
            src={scrollTopIcon}
            alt="icon"
          />
        </button>
      )}
    </>
  )
}

export default ScrollToTop
