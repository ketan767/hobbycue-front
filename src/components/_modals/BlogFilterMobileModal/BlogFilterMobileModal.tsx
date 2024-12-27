import BlogFilter from '@/components/Blog/Filter/BlogFilter'
import React from 'react'
import styles from './BlogFilterMobileModal.module.css'

const BlogFilterMobileModal = () => {
  return (
    <div className={styles.blogFilterParent}>
      <BlogFilter />
    </div>
  )
}

export default BlogFilterMobileModal
