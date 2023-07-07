import React, { useRef } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import UploadIcon from '@/assets/svg/upload.svg'

type Props = {
  onChange: any
  profileLayoutMode: any
}
const CoverPhotoLayout: React.FC<Props> = ({ onChange, profileLayoutMode }) => {
  const inputRef = useRef<any>(null)

  return (
    <div className={`${styles['container']} ${profileLayoutMode !== 'edit' ? 'default-cover-icon' : styles['editable'] } `}>
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
        <p>User Cover Photo</p>
      </div>
    )}
  </div>
  )
}

export default CoverPhotoLayout
