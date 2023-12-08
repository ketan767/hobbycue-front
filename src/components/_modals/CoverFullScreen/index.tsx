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
}
type ImageData = {
  cover_image: string
}

const FullScreenCoverModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const { listingLayoutMode } = useSelector((state: any) => state.site)

  const ImageUrl = listingModalData.cover_image

  console.log('coverdata', listingModalData)

  return (
    <div className={styles.imageModalContent}>
      <Image
        className={styles['img']}
        src={ImageUrl || ''}
        alt=""
        height={296}
        width={1000}
      />
    </div>
  )
}

export default FullScreenCoverModal
