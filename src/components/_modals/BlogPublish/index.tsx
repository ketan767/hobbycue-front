import React from 'react'
import EditBlog from '../EditBlog/EditBlog'
import styles from './BlogPublish.module.css'

const BlogPublish = ({ propData }: { propData: any }) => {
  return (
    <div className={styles.modalWrapper}>
      <EditBlog propData={propData} />
    </div>
  )
}

export default BlogPublish
