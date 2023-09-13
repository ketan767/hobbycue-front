import React, { useRef } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import UploadIcon from '@/assets/svg/upload.svg'
import { listingTypes } from '@/constants/constant'

type Props = {
  onChange: any
  profileLayoutMode: any
  type?: any
  typeId?: 1 | 2 | 3 | 4
}
const CoverPhotoLayout: React.FC<Props> = ({
  onChange,
  profileLayoutMode,
  type,
  typeId,
}) => {
  const inputRef = useRef<any>(null)

  const getClass = (type: any) => {
    if (type === 'page') {
      if (typeId === listingTypes.PEOPLE) {
        return 'default-people-listing-cover'
      } else if (typeId === listingTypes.PLACE) {
        return 'default-place-listing-cover'
      } else if (typeId === listingTypes.PROGRAM) {
        return 'default-program-listing-cover'
      } else if (typeId === listingTypes.PRODUCT) {
        return 'default-product-listing-cover'
      }
    } else {
      return 'default-user-icon'
    }
  }
  const defaultCover = getClass(type)

  return (
    <div
      className={`${styles['container']} ${
        type === 'page' ? styles.page : styles.user
      }
      ${
        profileLayoutMode !== 'edit'
          ? `${profileLayoutMode === 'view' ? defaultCover : ''}`
          : styles['editable']
      } `}
    >
      {profileLayoutMode === 'edit' && (
        <div
          className={styles['wrapper']}
          onClick={() => inputRef?.current?.click()}
        >
          <Image
            className={styles['upload-icon']}
            src={UploadIcon}
            alt=""
            height={20}
            width={20}
          />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => onChange(e)}
            ref={inputRef}
          />
          <p>{type === 'page' ? 'Page Cover Photo' : 'User Cover Photo'}</p>
        </div>
      )}
    </div>
  )
}

export default CoverPhotoLayout
