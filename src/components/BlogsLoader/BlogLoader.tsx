import { FC } from 'react'
import styles from './BlogLoader.module.css'
import ContentLoader from 'react-content-loader'
import { isMobile } from '@/utils'

interface PagesLoaderProps {}

const BlogLoader: FC<PagesLoaderProps> = ({}) => {
  const isMob = isMobile()
  return (
    <div className={styles.wrapper}>
      {
        !isMob ? (
          <>
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
          width="50%"
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
      </>
        ) : (
          <div style={{marginTop: '8px', width: '100%'}}>

          <ContentLoader
        speed={2}
        width="100%"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        height={367}
        viewBox='0 0 360 auto'
      >
        <rect x="0.14%" y="0.13%" width="99.86%" height="46.25%" fill="#F7F5F9" stroke="#F7F5F9" />
        <rect x="10" y="50.13%" width="77.22%" height="3.16%" rx="6.125" fill="#D9DBE9" />
        <rect x="10" y="54.63%" width="61.67%" height="3.16%" rx="6.125" fill="#D9DBE9" />
        <rect x="10" y="63.57%" width="53.89%" height="2.71%" rx="5.25" fill="#D9DBE9" />
        <rect x="10" y="67.44%" width="80.56%" height="2.71%" rx="5.25" fill="#D9DBE9" />
        <rect x="10" y="71.3%" width="78.06%" height="2.71%" rx="5.25" fill="#D9DBE9" />
        <rect x="10" y="75.16%" width="56.67%" height="2.71%" rx="5.25" fill="#D9DBE9" />
        <rect x="10" y="81.65%" width="18.33%" height="3.16%" rx="6.125" fill="#D9DBE9" />
        <rect x="31.67%" y="81.65%" width="14.44%" height="3.16%" rx="6.125" fill="#D9DBE9" />
        <rect x="12" y="91%" width="20" height="20" rx="10" fill="#D9DBE9" />
        <rect x="37" y="91.22%" width="60" height="5.68%" rx="11" fill="#F7F5F9" />
        <rect x="100" y="91.22%" width="60" height="5.68%" rx="11" fill="#F7F5F9" />
      </ContentLoader>
          </div>
        )
      }
    </div>
  )
}

export default BlogLoader
