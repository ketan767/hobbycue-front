import React from 'react'
import styles from './BlogComponents.module.css'

type Props = {
  children: React.ReactNode
  className?: string
}

const BlogContainer: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={styles.blogContainer + ' ' + className}>{children}</div>
  )
}

export default BlogContainer
