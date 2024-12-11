import { FC } from 'react'
import styles from './LinksLoader.module.css'
import ContentLoader from 'react-content-loader'
import { useMediaQuery } from '@mui/material'

const upArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
  >
    <g clip-path="url(#clip0_13344_151918)">
      <path
        d="M13.3427 17.125H5.45063C5.38311 17.125 5.31835 17.0982 5.27061 17.0504C5.22287 17.0027 5.19604 16.9379 5.19604 16.8704V12.5425H1.5046C1.45593 12.5425 1.40828 12.5286 1.3673 12.5023C1.32631 12.4761 1.29371 12.4386 1.27335 12.3944C1.25299 12.3502 1.24573 12.3011 1.25242 12.2529C1.25911 12.2047 1.27948 12.1594 1.31112 12.1225L9.20317 2.95749C9.22769 2.93145 9.25727 2.91069 9.29011 2.8965C9.32295 2.88232 9.35834 2.875 9.39411 2.875C9.42988 2.875 9.46527 2.88232 9.4981 2.8965C9.53094 2.91069 9.56053 2.93145 9.58504 2.95749L17.4771 12.1225C17.5085 12.1591 17.5288 12.2039 17.5357 12.2517C17.5425 12.2994 17.5357 12.3481 17.516 12.3922C17.4962 12.4362 17.4644 12.4737 17.4241 12.5003C17.3839 12.5269 17.3369 12.5416 17.2887 12.5425H13.5973V16.8704C13.5973 16.9379 13.5704 17.0027 13.5227 17.0504C13.475 17.0982 13.4102 17.125 13.3427 17.125ZM5.70521 16.6158H13.0881V12.2879C13.0881 12.2204 13.1149 12.1557 13.1627 12.1079C13.2104 12.0602 13.2752 12.0334 13.3427 12.0334H16.7337L9.39665 3.51375L2.05959 12.0334H5.45063C5.51815 12.0334 5.5829 12.0602 5.63064 12.1079C5.67839 12.1557 5.70521 12.2204 5.70521 12.2879L5.70521 16.6158Z"
        fill="#8064A2"
        stroke="#8064A2"
      />
    </g>
    <defs>
      <clipPath id="clip0_13344_151918">
        <rect
          width="18"
          height="18"
          fill="white"
          transform="translate(0.5 0.625)"
        />
      </clipPath>
    </defs>
  </svg>
)

const downArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
  >
    <g clip-path="url(#clip0_13344_151889)">
      <path
        d="M5.65732 1.5L13.5494 1.5C13.6169 1.5 13.6816 1.52682 13.7294 1.57457C13.7771 1.62231 13.804 1.68706 13.804 1.75458L13.804 6.08248L17.4954 6.08248C17.5441 6.08248 17.5917 6.09643 17.6327 6.12267C17.6737 6.14891 17.7063 6.18635 17.7267 6.23056C17.747 6.27476 17.7543 6.32387 17.7476 6.37208C17.7409 6.42028 17.7205 6.46556 17.6889 6.50254L9.79683 15.6675C9.77231 15.6936 9.74273 15.7143 9.70989 15.7285C9.67705 15.7427 9.64166 15.75 9.60589 15.75C9.57012 15.75 9.53473 15.7427 9.5019 15.7285C9.46906 15.7143 9.43947 15.6936 9.41496 15.6675L1.5229 6.50254C1.49154 6.46589 1.47123 6.42108 1.46435 6.37333C1.45747 6.32558 1.46429 6.27685 1.48404 6.23284C1.50378 6.18882 1.53562 6.15131 1.57586 6.12469C1.61609 6.09807 1.66306 6.08344 1.71129 6.08248L5.40274 6.08248L5.40274 1.75458C5.40274 1.68706 5.42956 1.62231 5.4773 1.57456C5.52505 1.52682 5.5898 1.5 5.65732 1.5ZM13.2948 2.00917L5.9119 2.00916L5.9119 6.33706C5.9119 6.40458 5.88508 6.46934 5.83734 6.51708C5.78959 6.56482 5.72484 6.59165 5.65732 6.59165L2.26628 6.59165L9.60335 15.1112L16.9404 6.59165L13.5494 6.59165C13.4819 6.59165 13.4171 6.56483 13.3694 6.51708C13.3216 6.46934 13.2948 6.40458 13.2948 6.33707L13.2948 2.00917Z"
        fill="#8064A2"
        stroke="#8064A2"
      />
    </g>
    <defs>
      <clipPath id="clip0_13344_151889">
        <rect
          width="18"
          height="18"
          fill="white"
          transform="translate(18.5 18) rotate(-180)"
        />
      </clipPath>
    </defs>
  </svg>
)

const commentIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
  >
    <g clip-path="url(#clip0_13344_151892)">
      <path
        d="M15.5 12.8775L14.6225 12H3.5V3H15.5V12.8775ZM15.5 1.5H3.5C2.675 1.5 2 2.175 2 3V12C2 12.825 2.675 13.5 3.5 13.5H14L17 16.5V3C17 2.175 16.325 1.5 15.5 1.5Z"
        fill="#8064A2"
      />
    </g>
    <defs>
      <clipPath id="clip0_13344_151892">
        <rect width="18" height="18" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
)

interface LinksLoaderProps {}

const LinksLoader: FC<LinksLoaderProps> = ({}) => {

  const isMobile = useMediaQuery('(max-width:1100px)')
  
  return (
    <div className={styles.wrapper}>
      <div style={{ display: 'flex', width:"100%" }}>
        <div className={styles.box}></div>
        <div className={styles.content}>
          {
            isMobile ? (
          <ContentLoader
            speed={2}
            width="100%"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            height={130}
            viewBox='0 0 480 auto'
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="10"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
            <rect
              x="0"
              y="15"
              width="80%"
              height="10"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
            {/* two stroke in a line */}
            <rect
              x="0"
              y="38"
              width="20%"
              height="10"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
            <rect
              x="40%"
              y="38"
              width="20%"
              height="10"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
            {/* two stroke in a line */}
            <rect
              x="0"
              y="57"
              width="22%"
              height="10"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
            <rect
              x="40%"
              y="57"
              width="20%"
              height="10"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
          </ContentLoader>
            ) : (
          <ContentLoader
            speed={2}
            width="100%"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            height={130}
          >
            <rect
              x="0"
              y="0"
              width="254"
              height="14"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
            <rect
              x="0"
              y="24"
              width="157"
              height="14"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />

            <rect
              x="0"
              y="60"
              width="145"
              height="14"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
            <rect
              x="0"
              y="84"
              width="113"
              height="14"
              rx={6}
              ry={6}
              fill="#F7F5F9"
            />
          </ContentLoader>
            )
          }
          <div className={styles.iconsContainer}>
            <div className={styles.upArrow}>{upArrow}</div>
            <div className={styles.downArrow}>{downArrow}</div>
            <div>{commentIcon}</div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <ContentLoader
          speed={2}
          width="100%"
          backgroundColor="#f3f3f3"
          foregroundColor="#D9DBE9"
          height={20}
          viewBox="0 0 50 auto"
        >
          <rect
            x="0"
            y="4"
            width="95%"
            height="10"
            rx={6}
            ry={6}
            fill="#F7F5F9"
          />
        </ContentLoader>
      </div>
    </div>
  )
}

export default LinksLoader
