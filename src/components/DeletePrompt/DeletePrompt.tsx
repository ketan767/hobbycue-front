import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { IconButton, SnackbarContent } from '@mui/material'
import styles from './styles.module.css'
import Image from 'next/image'
import CloseIcon from '@mui/icons-material/Close'
import WarningIcon from '@/assets/svg/warning-icon.svg'
import SuccessIcon from '@/assets/svg/success-icon.svg'
type Props = {
  triggerOpen: boolean
  yesHandler?: (id: string) => void
  noHandler?: () => void
  closeHandler?: () => void
  _id?: string
}

const DeletePrompt: React.FC<Props> = ({
  triggerOpen,
  yesHandler,
  noHandler,
  closeHandler,
  _id,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={triggerOpen}
      onClose={closeHandler}
      key={'bottom' + 'left'}
      className={styles.Snackbar}
    >
      <SnackbarContent
        className={styles.errorSnackbarContent}
        message={
          <span className={styles.message}>
            <Image
              className={styles['typeIcon']}
              src={WarningIcon}
              alt="error"
              width={60}
              height={60}
            />
            Are you sure you wanna delete it?
          </span>
        }
        action={[
          <IconButton
            key="close"
            className={styles.CloseIcon}
            onClick={() => {if(typeof _id ==='string')yesHandler?.(_id)}}
          >
            Yes
          </IconButton>,
          <IconButton
            key="close"
            className={styles.CloseIcon}
            onClick={() => {noHandler?.()}}
          >
            No
          </IconButton>,
        ]}
      />
    </Snackbar>
  )
}

export default DeletePrompt
