import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { IconButton, SnackbarContent } from '@mui/material'
import styles from './style.module.css'
import Image from 'next/image'
import CloseIcon from '@mui/icons-material/Close'
import WarningIcon from '@/assets/svg/warning-icon.svg'
import SuccessIcon from '@/assets/svg/success-icon.svg'
type Props = {
  triggerOpen: boolean
  message: string
  type: 'error' | 'success'
  closeSnackbar?: () => void
}

const CustomSnackbar: React.FC<Props> = ({
  triggerOpen,
  message,
  type,
  closeSnackbar,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={triggerOpen}
      onClose={closeSnackbar}
      key={'bottom' + 'left'}
      className={type === 'success' ? styles.successSnackbar : styles.Snackbar}
      autoHideDuration={2000}
    >
      <SnackbarContent
        className={
          type === 'success'
            ? styles.successSnackbarContent
            : styles.errorSnackbarContent
        }
        message={
          <span className={styles.message}>
            <Image
              className={styles['typeIcon']}
              src={type === 'success' ? SuccessIcon : WarningIcon}
              alt="error"
              width={60}
              height={60}
            />
            {message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            className={styles.CloseIcon}
            onClick={closeSnackbar}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  )
}

export default CustomSnackbar
