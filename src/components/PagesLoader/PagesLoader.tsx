import { FC } from 'react'
import styles from './PagesLoader.module.css'
import ContentLoader from 'react-content-loader'

interface PagesLoaderProps {}

const PagesLoader: FC<PagesLoaderProps> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}></div>
      <ContentLoader
        speed={2}
        width="100%"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        height={130}
      >
        <svg width="314" height="265" viewBox="0 0 314 265" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1.16992" y="0.5" width="312" height="264" rx="7.5" fill="white" stroke="#EBEDF0"/>
</svg>

        <rect
          x="10"
          y="10"
          width="48"
          height="48"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="69"
          y="12"
          width="230"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="69"
          y="33"
          width="97"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />

        <rect
          x="10"
          y="64"
          width="204"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="10"
          y="85"
          width="204"
          height="14"
          rx={6}
          ry={6}
          fill="#F7F5F9"
        />
        <rect
          x="10"
          y="106"
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

export default PagesLoader
