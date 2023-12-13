import React, { useState, createRef } from 'react'
import styles from './styles.module.css'
import dynamic from 'next/dynamic'

import { CircularProgress } from '@mui/material'
import Image from 'next/image'
import store, { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

type Props = {}

export const UploadImageModal: React.FC<Props> = (props) => {
  const { editPhotoModalData } = useSelector((state: RootState) => state.site)

  const cropperRef = createRef<ReactCropperElement>()

  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      const image = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()

      setLoading(true)
      await editPhotoModalData.onComplete(image)
      setLoading(false)
    }
  }

  return (
    <div className={styles['modal-wrapper']}>
      <h3 className={styles['modal-heading']}>Crop Image</h3>
      <div className={styles['cropper-wrapper']}>
        <Cropper
          ref={cropperRef}
          zoomTo={0.2}
          className={styles['cropper']}
          initialAspectRatio={1}
          src={editPhotoModalData.image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          // background={false}
          responsive={true}
          autoCropArea={1}
          // https://github.com/fengyuanchen/cropperjs/issues/671
          guides={true}
        />

        <button
          className={styles['save-btn']}
          disabled={loading}
          onClick={handleUpload}
        >
          {loading ? (
            <CircularProgress color="inherit" size={'20px'} />
          ) : (
            'Save Photo'
          )}
        </button>
      </div>
    </div>
  )
}
