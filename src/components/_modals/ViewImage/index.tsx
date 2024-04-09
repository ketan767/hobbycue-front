import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Cover.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { closeModal, openModal } from '@/redux/slices/modal'
import CloseIcon from '@/assets/icons/CloseIcon'
import Image from 'next/image'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import { updateListingCover } from '@/services/listing.service'
import { updateListingProfile } from '@/services/listing.service'
import { updatePhotoEditModalData } from '@/redux/slices/site'

interface Props {
  isOpen?: boolean
  onClose?: () => void
  handleClose?: () => void
}

const ViewImageModal: React.FC<Props> = ({ isOpen, onClose, handleClose }) => {
  const imageUrl = useSelector((state: any) => state.modal.imageUrl)

  return (
    <>
      <header className={styles['header']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
      </header>
      <div className={styles.imageModalContent}>
        {imageUrl ? (
          <img
            className={styles['img']}
            src={imageUrl || ''}
            alt=""
            height={296}
            width={1000}
          />
        ) : (
          <Image
            className={styles['img']}
            src={''}
            alt=""
            height={296}
            width={1000}
          />
        )}
      </div>
    </>
  )
}

export default ViewImageModal
