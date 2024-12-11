import React from 'react'
import EditBlog from '../EditBlog/EditBlog'
import styles from './BlogPublish.module.css'

const BlogPublish = () => {
  return (
    <div className={styles.modalWrapper}>
      <EditBlog />
    </div>
  )
}

export default BlogPublish
