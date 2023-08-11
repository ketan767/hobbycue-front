import React, { useRef } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import UploadIcon from '@/assets/svg/upload.svg'
import { listingTypes } from '@/constants/constant'

type Props = {
  onChange?: any
  profileLayoutMode: any
  type: any
  typeId?: 1 | 2 | 3 | 4
}
const ProfileImageLayout: React.FC<Props> = ({
  onChange,
  profileLayoutMode,
  type,
  typeId,
}) => {
  const inputRef = useRef<any>(null)

  const getClass = (type: any) => {
    if (type === 'page') {
      if (typeId === listingTypes.PEOPLE) {
        return 'default-people-listing-icon'
      } else if (typeId === listingTypes.PLACE) {
        return 'default-place-listing-icon'
      } else if (typeId === listingTypes.PROGRAM) {
        return 'default-program-listing-icon'
      } else if (typeId === listingTypes.PRODUCT) {
        return 'default-product-listing-icon'
      }
    } else {
      return 'default-user-icon'
    }
  }
  const defaultProfile = getClass(type)
  return (
    <div
      className={`${styles['container']} ${
        type === 'page' ? styles.page : styles.user
      } ${
        profileLayoutMode !== 'edit'
          ? `${profileLayoutMode === 'view' ? defaultProfile : ''}`
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
          <p>{type === 'page' ? 'Page Profile Pic' : 'User Profile Pic'}</p>
        </div>
      )}
    </div>
  )
}

export default ProfileImageLayout
