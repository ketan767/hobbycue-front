import scrollTopIcon from '@/assets/svg/scroll-top-icon.svg'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './GoTop.module.css'
import CustomizedTooltips from '../Tooltip/ToolTip'

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
        <CustomizedTooltips title="Return to top (Ctrl+Home)">
          <button className={`${styles['container']} `} onClick={scrollToTop}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M14.0062 11.0823C14.3329 10.7556 14.3329 10.229 14.0062 9.90228L8.46621 4.36229C8.20621 4.10229 7.78621 4.10229 7.52621 4.36229L1.98621 9.90229C1.65954 10.229 1.65954 10.7556 1.98621 11.0823C2.31288 11.409 2.83954 11.409 3.16621 11.0823L7.99954 6.25562L12.8329 11.089C13.1529 11.409 13.6862 11.409 14.0062 11.0823Z"
                fill="#939CA3"
                stroke-width="2"
              />
            </svg>
          </button>
        </CustomizedTooltips>
      )}
    </>
  )
}

export default ScrollToTop
