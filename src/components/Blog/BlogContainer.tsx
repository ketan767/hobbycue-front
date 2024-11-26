import React from 'react'
import styles from './BlogComponents.module.css'

type Props = {
  children: React.ReactNode
}

const BlogContainer: React.FC<Props> = ({ children }) => {
  return <div className={styles.blogContainer}>{children}</div>
}

export default BlogContainer
