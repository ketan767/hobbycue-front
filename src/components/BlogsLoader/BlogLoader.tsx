import { FC } from 'react'
import styles from './BlogLoader.module.css'
import ContentLoader from 'react-content-loader'

interface PagesLoaderProps {}

const BlogLoader: FC<PagesLoaderProps> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}></div>
      <ContentLoader
        speed={2}
        width="100%"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        height={170}
      >
        <rect
          x="10"
          y="12"
          width="83%"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="10"
          y="35"
          width="52%"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />

        <rect
          x="10"
          y="64"
          width="90%"
          height="12"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="10"
          y="85"
          width="90%"
          height="12"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="10"
          y="106"
          width="87%"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="10"
          y="125"
          width="204"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
      </ContentLoader>
    </div>
  )
}

export default BlogLoader
