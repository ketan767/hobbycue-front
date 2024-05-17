import React, { useEffect, useRef, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import {
  CircularProgress,
  IconButton,
  SnackbarContent,
  useMediaQuery,
} from '@mui/material'
import styles from './styles.module.css'
import Image from 'next/image'
import CloseIcon from '@mui/icons-material/Close'
import WarningIcon from '@/assets/svg/warning-icon.svg'
import SuccessIcon from '@/assets/svg/success-icon.svg'
import FilledButton from '../_buttons/FilledButton'
import OutlinedButton from '../_buttons/OutlinedButton'
type Props = {
  triggerOpen: boolean
  yesHandler?: (id: string) => void
  noHandler?: () => void
  closeHandler?: () => void
  _id?: string
  text?:string
}

const DeletePrompt: React.FC<Props> = ({
  triggerOpen,
  yesHandler,
  noHandler,
  closeHandler,
  _id,
  text
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width:1100px)')

  const [YesBtnLoading, setYesBtnLoading] = useState<boolean>(false)
  const handleYesClick = async () => {
    setYesBtnLoading(true)
    if (_id) await yesHandler?.(_id)
    setYesBtnLoading(false)
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      closeHandler?.()
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  // useEffect(() => {
  //   if (triggerOpen) {
  //     document.documentElement.style.overflow = 'hidden'
  //   } else {
  //     document.documentElement.style.overflow = 'auto'
  //   }
  // }, [triggerOpen])
  return (
    <>
      {triggerOpen && (
        <div className={styles['modal-wrapper']}>
          <div ref={wrapperRef} className={`${styles['confirmation-modal']}`}>
            <div className={styles['confirmation-modal-body']}>
              <p> Are you sure you want to delete this {text??''}? </p>
              <div className={styles['buttons']}>
                <FilledButton
                  className={styles['button1']}
                  onClick={noHandler}
                >
                  Cancel
                </FilledButton>
                <OutlinedButton
                  onClick={handleYesClick}
                >
                  {YesBtnLoading ? (
                    <CircularProgress
                      color="inherit"
                      size={isMobile ? '14px' : '24px'}
                    />
                  ) : (
                    'Delete'
                  )}
                </OutlinedButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeletePrompt
