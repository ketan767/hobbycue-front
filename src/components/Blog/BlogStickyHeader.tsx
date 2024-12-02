import React from 'react'
import styles from './BlogComponents.module.css'
import BlogContainer from './BlogContainer'
import BlogActionBar from './BlogActionBar'

type Props = {
  data: any
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  isAuthor: boolean
  vote: { up: boolean; down: boolean }
  setVote: React.Dispatch<
    React.SetStateAction<{
      up: boolean
      down: boolean
    }>
  >
}

const BlogStickyHeader: React.FC<Props> = ({
  data,
  isEditing,
  setIsEditing,
  isAuthor,
  vote,
  setVote,
}) => {
  return (
    <div className={styles.sticky}>
      <BlogContainer>
        <div className={styles.flexDiv}>
          <h1 className="truncateOneLine">{data?.blog_url?.title}</h1>
          <BlogActionBar
            data={data}
            vote={vote}
            setVote={setVote}
            isEditing={isEditing}
            isAuthor={isAuthor}
            setIsEditing={setIsEditing}
          />
        </div>
      </BlogContainer>
    </div>
  )
}

export default BlogStickyHeader
