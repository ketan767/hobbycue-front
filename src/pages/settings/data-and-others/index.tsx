import React, { useState } from 'react'
import styles from './style.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { Checkbox, FormControlLabel } from '@mui/material'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { support } from '@/services/user.service'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = {}

interface supportPayload {
  description: string
  name?: string
  email?: string
  user_id?: string
  type: 'user'
}

const DataAndOthers: React.FC<Props> = ({}) => {
  const [checked, setChecked] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const user = useSelector((state: RootState) => state.user.user)
  const handleRunSupportAPI = async (
    description: string,
    successMessage: string,
    errorMessage: string,
  ) => {
    const { err, res } = await support({
      description: description,
      name: user?.full_name,
      email: user?.email,
      user_id: user?._id,
      type: 'user',
    })
    if (res.data?.success) {
      setSnackbar({
        display: true,
        type: 'success',
        message: successMessage,
      })
    }
    if (err) {
      setSnackbar({
        display: true,
        type: 'error',
        message: errorMessage,
      })
    }
  }
  return (
    <>
      <PageGridLayout column={2}>
        <SettingsSidebar active="data-and-others" />
        <div className={styles['container']}>
          <div>
            <header className={styles['header']}>Export Personal Data</header>
            <p className={styles.text}>
              If you want to make a request, please click on the button below:
            </p>
            <OutlinedButton
              onClick={() =>
                handleRunSupportAPI(
                  'Request for personal data export.',
                  'Your request for personal data export has been sent successfully',
                  'Your request for personal data export is failed',
                )
              }
              className={styles.button}
            >
              Request personal data export
            </OutlinedButton>
          </div>

          <div className={styles.line}></div>

          <div>
            <header className={styles['header']}>Deactivate Account</header>
            <p className={styles.text}>
              You won’t be able to use your account.
            </p>
            <OutlinedButton
              onClick={() =>
                handleRunSupportAPI(
                  'Account deactivation request.',
                  'Your account deactivation request has been sent successfully',
                  'Your request for account deactivation is failed',
                )
              }
              className={styles.button}
            >
              Deactivate account
            </OutlinedButton>
          </div>

          <div className={styles.line}></div>

          <div>
            <header className={styles['header']}>Delete Account</header>
            <p className={styles.text}>
              Deleting your account will delete all of the content you have
              created. It will be completely irrecoverable.
            </p>
            <div className={styles['checkbox-container']}>
              <FormControlLabel
                className={styles['checkbox-text']}
                style={{ margin: 0 }}
                control={
                  <Checkbox
                    size="small"
                    color="primary"
                    name="rememberMe"
                    value={!checked}
                    checked={checked}
                    onChange={(e) => setChecked(!checked)}
                  />
                }
                label={'Remember Me'}
              />
            </div>
            <OutlinedButton
              onClick={() =>
                handleRunSupportAPI(
                  'Account deletion request.',
                  'Your account deletion request has been sent successfully',
                  'Your request for account deletion is failed',
                )
              }
              className={styles.button}
            >
              Delete account
            </OutlinedButton>
          </div>
        </div>
      </PageGridLayout>
      {
        <CustomSnackbar
          message={snackbar.message}
          triggerOpen={snackbar.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default DataAndOthers
