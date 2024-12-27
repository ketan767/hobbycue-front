import BlogFilter from '@/components/Blog/Filter/BlogFilter'
import React from 'react'
import styles from './BlogFilterMobileModal.module.css'

const trianglePointer = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="27"
    viewBox="0 0 32 27"
    fill="none"
  >
    <path
      d="M14.0467 1.76243C14.8279 0.494929 16.6706 0.49493 17.4519 1.76243L30.9732 23.7006C31.7945 25.0331 30.8359 26.75 29.2706 26.75H2.22793C0.662671 26.75 -0.295927 25.0331 0.525343 23.7006L14.0467 1.76243Z"
      fill="white"
    />
  </svg>
)

const BlogFilterMobileModal = () => {
  return (
    <div className={styles.blogFilterParent}>
      <span>{trianglePointer}</span>
      <BlogFilter />
    </div>
  )
}

export default BlogFilterMobileModal
