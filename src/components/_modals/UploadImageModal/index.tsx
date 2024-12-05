import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'
import { CircularProgress, useMediaQuery } from '@mui/material'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import SaveModal from '../SaveModal/saveModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { setCroppedImage } from '@/redux/slices/confirmationData'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  onStatusChange?: (isChanged: boolean) => void
}

export const UploadImageModal: React.FC<Props> = ({
  onComplete,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const { editPhotoModalData } = useSelector((state: RootState) => state.site)
  const { croppedImage } = useSelector((state: RootState) => state.confirmation)
  const cropperRef = useRef<ReactCropperElement>(null)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const isMobile = useMediaQuery('(max-width:1100px)')

  const handleUpload = async () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas()
      if (croppedCanvas) {
        const image = croppedCanvas.toDataURL('image/jpeg')
        setLoading(true)

        await editPhotoModalData.onComplete(image)
        if (onComplete) {
          onComplete()
        } else {
          window.location.reload()
          dispatch(closeModal())
        }

        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas()
      const image = croppedCanvas?.toDataURL('image/jpeg')

      if (image) {
        dispatch(setCroppedImage(image))
      }

      if (onStatusChange) {
        onStatusChange(true)
      }
    }
  }, [dispatch, onStatusChange])

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleUpload}
        setConfirmationModal={setConfirmationModal}
      />
    )
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        <h3 className={styles['modal-heading']}>Crop Image</h3>
        <div className={styles['cropper-wrapper']}>
          <Cropper
            style={{ width: isMobile ? '' : '100%' }}
            ref={cropperRef}
            className={styles['cropper']}
            initialAspectRatio={editPhotoModalData.type === 'profile' ? 1 : 3}
            src={editPhotoModalData.image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            responsive={true}
            autoCropArea={1}
            // https://github.com/fengyuanchen/cropperjs/issues/671
            guides={true}
          />
          {!isMobile && (
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
          )}
        </div>
      </div>
      {isMobile && (
        <footer className={styles['footer']}>
          <button
            className={styles['save-btn']}
            disabled={loading}
            onClick={handleUpload}
          >
            {loading ? (
              <CircularProgress color="inherit" size={'14px'} />
            ) : (
              'Save Photo'
            )}
          </button>
        </footer>
      )}
    </>
  )
}
