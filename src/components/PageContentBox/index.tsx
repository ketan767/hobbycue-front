import React from 'react'
import styles from './PageContentBox.module.css'

type Props = {
  children: React.ReactNode
  showEditButton: boolean
  onEditBtnClick?: () => void
}

const PageContentBox: React.FC<Props> = ({ children, onEditBtnClick, showEditButton }) => {
  return (
    <div className={styles['wrapper']}>
      {children}

      {showEditButton && (
        <svg
          onClick={onEditBtnClick}
          className={styles['edit-btn']}
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <g clip-path="url(#clip0_528_31971)">
            <path
              d="M2.18054 11.5017V14.0017H4.68054L12.0539 6.62833L9.55388 4.12833L2.18054 11.5017ZM13.9872 4.695C14.2472 4.435 14.2472 4.015 13.9872 3.755L12.4272 2.195C12.1672 1.935 11.7472 1.935 11.4872 2.195L10.2672 3.415L12.7672 5.915L13.9872 4.695Z"
              fill="#8064A2"
            />
          </g>
          <defs>
            <clipPath id="clip0_528_31971">
              <rect width="16" height="16" fill="white" transform="translate(0.180542)" />
            </clipPath>
          </defs>
        </svg>
      )}
    </div>
  )
}

export default PageContentBox
