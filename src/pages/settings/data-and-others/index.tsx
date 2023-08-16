import React, { useState } from 'react'
import styles from './style.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { Checkbox, FormControlLabel } from '@mui/material'

type Props = {}

const DataAndOthers: React.FC<Props> = ({}) => {
  const [checked, setChecked] = useState(false)
  return (
    <PageGridLayout column={2}>
      <SettingsSidebar active="data-and-others" />
      <div className={styles['container']}>
        <div>
          <header className={styles['header']}>Export Personal Data</header>
          <p className={styles.text}>
            If you want to make a request, please click on the button below:
          </p>
          <OutlinedButton className={styles.button}>
            Request personal data export
          </OutlinedButton>
        </div>

        <div className={styles.line}></div>

        <div>
          <header className={styles['header']}>Deactivate Account</header>
          <p className={styles.text}>You won’t be able to use your account.</p>
          <OutlinedButton className={styles.button}>
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
          <div className={styles['checkbox-container']} >
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
          <OutlinedButton className={styles.button}>
            Delete account
          </OutlinedButton>
        </div>
      </div>
    </PageGridLayout>
  )
}

export default DataAndOthers
