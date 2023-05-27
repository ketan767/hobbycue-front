import React from 'react'
import styles from './login.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import EditIcon from '../../../assets/svg/edit-colored.svg'
import GoogleIcon from '../../../assets/svg/google-icon.svg'
import FacebookIcon from '../../../assets/svg/facebook-icon.svg'
import Image from 'next/image'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { withAuth } from '@/navigation/withAuth'

type Props = {}

const LoginAndSecurity: React.FC<Props> = ({}) => {
  return (
    <>
      <PageGridLayout column={2}>
        <SettingsSidebar active="" />
        <div className={styles.container}>
          <p className={`${styles.textLight} ${styles.title}`}> Email Login </p>
          <p className={styles.email}>Email ID: rakeshsha</p>
          <section className={styles.editSection}>
            <div className={styles.editContainer}>
              <Image src={EditIcon} width={16} height={16} alt="edit" />
              <p className={styles.editText}> Change Password </p>
            </div>
            <div className={styles.editContainer}>
              <Image src={EditIcon} width={16} height={16} alt="edit" />
              <p className={styles.editText}>
                {' '}
                Used Social Media Login or Forgot Password?{' '}
              </p>
            </div>
          </section>

          <div className={styles.line}></div>

          <p className={`${styles.textLight} ${styles.title}`}>
            {' '}
            Social Media Login{' '}
          </p>
          <div className={styles.socialLoginContainer}>
            <Image src={GoogleIcon} width={16} height={16} alt="edit" />
            <p className={styles.socialLoginText}>Connect with Google</p>
            <OutlinedButton className={styles.loginBtn}>Connect</OutlinedButton>
          </div>

          <div className={styles.socialLoginContainer}>
            <Image src={FacebookIcon} width={16} height={16} alt="edit" />
            <p className={styles.socialLoginText}>Connect with Facebook</p>
            <OutlinedButton className={styles.loginBtn}>Connect</OutlinedButton>
          </div>

          <div className={styles.line}></div>
          <p
            className={`${styles.textLight} ${styles.title} ${styles.clickable}`}
          >
            {' '}
            Logout{' '}
          </p>
          <p className={`${styles.logoutText} ${styles.clickable}`}>
            {' '}
            Logout of all browsers{' '}
          </p>
        </div>
      </PageGridLayout>
    </>
  )
}

export default withAuth(LoginAndSecurity)
