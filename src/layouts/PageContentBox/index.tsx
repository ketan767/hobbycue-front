import React, { SetStateAction, useState } from 'react'
import styles from './PageContentBox.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Tooltip from '@/components/Tooltip/ToolTip'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import Image from 'next/image'
type Props = {
  children: React.ReactNode
  showEditButton?: boolean

  onEditBtnClick?: () => void
  className?: string
  setDisplayData?: any
}

const PageContentBox: React.FC<Props> = ({
  children,
  onEditBtnClick,
  showEditButton,
  className,
  setDisplayData,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { listingLayoutMode } = useSelector((state: RootState) => state.site)

  const onDropdownClick = () => {
    setShowDropdown((prevValue) => !prevValue)
    if (setDisplayData !== undefined || null)
      setDisplayData((prevValue: boolean) => !prevValue)
  }

  return (
    <div className={`${styles['wrapper']} ${className}`}>
      {children}

      {
        <Image
          src={ChevronDown}
          alt=""
          onClick={onDropdownClick}
          className={`${styles['dropdown-icon']} ${
            showDropdown && styles['rotate-180deg']
          }`}
        />
      }

      {showEditButton && (
        <svg
          onClick={onEditBtnClick}
          className={`${styles['edit-btn']} ${
            showDropdown && styles['display-initial']
          }`}
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <g clipPath="url(#clip0_528_31971)">
            <path
              d="M2.18054 11.5017V14.0017H4.68054L12.0539 6.62833L9.55388 4.12833L2.18054 11.5017ZM13.9872 4.695C14.2472 4.435 14.2472 4.015 13.9872 3.755L12.4272 2.195C12.1672 1.935 11.7472 1.935 11.4872 2.195L10.2672 3.415L12.7672 5.915L13.9872 4.695Z"
              fill="#8064A2"
            />
          </g>
          <defs>
            <clipPath id="clip0_528_31971">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.180542)"
              />
            </clipPath>
          </defs>
        </svg>
      )}
    </div>
  )
}

export default PageContentBox
