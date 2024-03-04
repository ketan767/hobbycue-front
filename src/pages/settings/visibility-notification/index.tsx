import React from 'react'
import styles from './visibility.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import EditIcon from '../../../assets/svg/edit-colored.svg'
import GoogleIcon from '../../../assets/svg/google-icon.svg'
import FacebookIcon from '../../../assets/svg/facebook-icon.svg'
import Image from 'next/image'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import RadioButton from '@/components/radioButton/radioButton'
import { withAuth } from '@/navigation/withAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useMediaQuery } from '@mui/material'
import SettingsDropdownLayout from '@/layouts/SettingsDropdownLayout'

type Props = {}
const options = [
  'All Locations',
  'My City',
  'My Pincode',
  'My Locality',
  'My Society',
]
const VisibilityAndNotification: React.FC<Props> = ({}) => {
  const userProfileUrl = useSelector(
    (state: RootState) => state?.user?.user?.profile_url,
  )
  
    const isMobile = useMediaQuery('(max-width:1100px)');
  return (
    <>
      <PageGridLayout column={2} customStyles={styles['settingcontainer']}>
      <SettingsDropdownLayout>
        {isMobile?null:<SettingsSidebar active="visibility-notification" />}
        <div className={styles.container}>
          <p className={styles.underDev}>
            Below features are under development. Come back soon to view this.
          </p>
          <p className={`${styles.textLight} ${styles.title}`}>
            {' '}
            By default, who can view{' '}
          </p>

          <div className={`${styles.viewOptionContainer}`}>
            <p className={`${styles.textDark}`}> View my posts </p>
            <div>
              <select disabled name="Select" className={styles.select}>
                {options.map((item: any) => {
                  return (
                    <option key={item} className={styles.option}>
                      {item}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className={`${styles.viewOptionContainer}`}>
            <p className={`${styles.textDark}`}> View my E-Mail ID </p>
            <div>
              <select disabled name="Select" className={styles.select}>
                {options.map((item: any) => {
                  return (
                    <option key={item} className={styles.option}>
                      {item}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className={styles.line}></div>

          <p className={`${styles.textLight} ${styles.title}`}>
            {' '}
            Notify me when someone{' '}
          </p>
          <div className={styles.notifyEditContainer}>
            <p className={`${styles.textDark}`}>
              Mentions me using @{userProfileUrl}
            </p>
            <RadioButton disabled active={false} />
          </div>
          <div className={styles.notifyEditContainer}>
            <p className={`${styles.textDark}`}>Comments on my post</p>
            <RadioButton disabled active={true} />
          </div>
          <div className={styles.notifyEditContainer}>
            <p className={`${styles.textDark}`}>
              Accepts my request to join hobbycue
            </p>
            <RadioButton disabled active={true} />
          </div>
          <div className={styles.notifyEditContainer}>
            <p className={`${styles.textDark}`}>Invites me to join a group</p>
            <RadioButton disabled active={true} />
          </div>
          <div className={styles.notifyEditContainer}>
            <p className={`${styles.textDark}`}>Upvotes my content</p>
            <RadioButton disabled active={true} />
          </div>
          <div className={styles.notifyEditContainer}>
            <p className={`${styles.textDark}`}>Shares my content</p>
            <RadioButton disabled active={true} />
          </div>

          <div
            className={`${styles.viewOptionContainer} ${styles.emailUpdates}`}
          >
            <p className={`${styles.textDark}`}> Email updates </p>
            <div>
              <select disabled name="Select" className={styles.select}>
                {options.map((item: any) => {
                  return (
                    <option key={item} className={styles.option}>
                      {item}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>
        </SettingsDropdownLayout>
      </PageGridLayout>
    </>
  )
}

export default withAuth(VisibilityAndNotification)
