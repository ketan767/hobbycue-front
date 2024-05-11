import { FC } from 'react'
import styles from './SearchLoader.module.css'
import ContentLoader from 'react-content-loader'
import { useMediaQuery } from '@mui/material'

interface indexProps {
  showBox?: boolean
}

const hexagon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="56"
    height="65"
    viewBox="0 0 56 65"
    fill="none"
  >
    <path
      d="M28.293 0.5L56.0058 16.5V48.5L28.293 64.5L0.580156 48.5V16.5L28.293 0.5Z"
      fill="#F7F5F9"
    />
  </svg>
)

const box = <div className={styles.box}></div>

const SearchLoader: FC<indexProps> = ({ showBox }) => {
  const isMobile = useMediaQuery('(max-width:1100px)')
  return (
    <>
      <div className={styles['wrapper']}>
        {isMobile ? (
          <>
          <div style={{ width: '100%' }}>
            <div className={styles.topLoader}>
              <ContentLoader
                speed={2}
                width="100%"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                height={50}
              >
                <rect x="24" y="16" width="106" height="16" rx={9} ry={9} />
              </ContentLoader>
            </div>

            <div className={styles.middleLoaders}>
              {showBox ? box : hexagon}
              <ContentLoader
                speed={2}
                width="100%"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                height={100}
              >
                <rect x="0" y="24" width="106" height="16" rx={9} ry={9} />
                <rect x="0" y="46" width="185" height="12" rx={6} ry={6} />
                <rect x="0" y="62" width="185" height="12" rx={6} ry={6} />
              </ContentLoader>
            </div>
            <div className={styles.middleLoaders}>
              {showBox ? box : hexagon}

              <ContentLoader
                speed={2}
                width="100%"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                height={100}
              >
                <rect x="0" y="24" width="106" height="16" rx={9} ry={9} />
                <rect x="0" y="46" width="185" height="12" rx={6} ry={6} />
                <rect x="0" y="62" width="185" height="12" rx={6} ry={6} />
              </ContentLoader>
            </div>
            <div className={styles.middleLoaders}>
              {showBox ? box : hexagon}

              <ContentLoader
                speed={2}
                width="100%"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                height={100}
              >
                <rect x="0" y="24" width="106" height="16" rx={9} ry={9} />
                <rect x="0" y="46" width="185" height="12" rx={6} ry={6} />
                <rect x="0" y="62" width="185" height="12" rx={6} ry={6} />
              </ContentLoader>
            </div>
          </div>
          <div>
            <ContentLoader
              speed={2}
              width="100%"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              height={30}
            >
              <rect x="30%" y="12" width="106" height="16" rx={9} ry={9} />
            </ContentLoader>
          </div>
        </>
        ) : (
          <>
            <div style={{ width: '100%' }}>
              <div className={styles.topLoader}>
                <ContentLoader
                  speed={2}
                  width="100%"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  height={50}
                >
                  <rect x="24" y="16" width="106" height="16" rx={9} ry={9} />
                </ContentLoader>
              </div>

              <div className={styles.middleLoaders}>
                {showBox ? box : hexagon}
                <ContentLoader
                  speed={2}
                  width="100%"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  height={100}
                >
                  <rect x="0" y="24" width="106" height="16" rx={9} ry={9} />
                  <rect x="0" y="46" width="185" height="12" rx={6} ry={6} />
                  <rect x="0" y="62" width="185" height="12" rx={6} ry={6} />
                </ContentLoader>
              </div>
              <div className={styles.middleLoaders}>
                {showBox ? box : hexagon}

                <ContentLoader
                  speed={2}
                  width="100%"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  height={100}
                >
                  <rect x="0" y="24" width="106" height="16" rx={9} ry={9} />
                  <rect x="0" y="46" width="185" height="12" rx={6} ry={6} />
                  <rect x="0" y="62" width="185" height="12" rx={6} ry={6} />
                </ContentLoader>
              </div>
              <div className={styles.middleLoaders}>
                {showBox ? box : hexagon}

                <ContentLoader
                  speed={2}
                  width="100%"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  height={100}
                >
                  <rect x="0" y="24" width="106" height="16" rx={9} ry={9} />
                  <rect x="0" y="46" width="185" height="12" rx={6} ry={6} />
                  <rect x="0" y="62" width="185" height="12" rx={6} ry={6} />
                </ContentLoader>
              </div>
            </div>
            <div>
              <ContentLoader
                speed={2}
                width="671px"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                height={30}
              >
                <rect x="282" y="12" width="106" height="16" rx={9} ry={9} />
              </ContentLoader>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default SearchLoader
