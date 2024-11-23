import React from 'react'
import styles from './BlogComponents.module.css'
import BlogContainer from './BlogContainer'
import BlogActionBar from './BlogActionBar'

type Props = {
  data: any
}

const BlogStickyHeader: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.sticky}>
      <BlogContainer>
        <div className={styles.flexDiv}>
          <h1 className="truncateOneLine">{data?.blog_url?.title}</h1>
          <BlogActionBar data={data} />
        </div>
      </BlogContainer>
    </div>
  )
}

export default BlogStickyHeader
