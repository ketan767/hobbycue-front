import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { SnackbarContent } from '@mui/material'
import { SnackbarState } from '../_modals/ModalManager'

type Props = {
  triggerOpen?: boolean
  message?: string
  resetSnackbar?: (data: SnackbarState) => void
}

const SimpleSnackbar: React.FC<Props> = ({
  triggerOpen,
  message,
  resetSnackbar,
}) => {
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    setDisplayMessage(message ?? '')
  }, [message])

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    resetSnackbar?.({ show: false, message: displayMessage })
  }

  return (
      <Snackbar
        open={triggerOpen}
        onClose={handleClose}
        onClick={handleClose}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
          style={{
            minWidth: '200px',
            display: 'flex',
            justifyContent: 'center',
          }}
          message={<span id="client-snackbar">{displayMessage}</span>}
        />
      </Snackbar>
  )
}

// SimpleSnackbar.propTypes = {
//   classes: PropTypes.object.isRequired,
// }

export default SimpleSnackbar
