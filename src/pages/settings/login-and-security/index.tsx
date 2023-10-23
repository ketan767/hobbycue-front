import React, { useEffect } from 'react'
import styles from './login.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import EditIcon from '../../../assets/svg/edit-colored.svg'
import GoogleIcon from '../../../assets/svg/google-icon.svg'
import FacebookIcon from '../../../assets/svg/facebook-icon.svg'
import Image from 'next/image'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { withAuth } from '@/navigation/withAuth'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import { logout } from '@/helper'
import GoogleLogin from 'react-google-login'
import { setShowPageLoader } from '@/redux/slices/site'
import {
  connectFacebook,
  connectGoogle,
  disconnectFacebook,
  disconnectGoogle,
  facebookAuth,
  googleAuth,
} from '@/services/auth.service'
import FilledButton from '@/components/_buttons/FilledButton'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

type Props = {}

const LoginAndSecurity: React.FC<Props> = ({}) => {
  const { user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  console.log(user)
  const openChangePasswordModal = () => {
    dispatch(openModal({ type: 'change-password', closable: true }))
  }

  const handleLogout = () => {
    logout()
  }

  // Social Login Handle
  const googleAuthSuccess = async (e: any) => {
    dispatch(setShowPageLoader(true))
    const { err, res } = await connectGoogle({
      googleId: e.profileObj.googleId,
      tokenId: e.tokenId,
      name: e.profileObj.name,
      'profile-google': e.profileObj.imageUrl,
    })
    console.log('g-image', e.profileObj.imageUrl)
    console.log('g', res)
    dispatch(setShowPageLoader(false))
    if (err) return console.log(err)
    if (res.status === 200 && res.data.success) {
      console.log('google', res.data)
      // window.location.reload()

      // res.data.data.user.google.googleId
      // localStorage.setItem('token', res.data.data.token)
      // router.push('/community', undefined, { shallow: false })
    }
  }
  const googleAuthFailure = (e: any) => console.log(e)

  const handleFacebookAuth = async (e: any) => {
    dispatch(setShowPageLoader(true))

    const { err, res } = await connectFacebook({
      accessToken: e.accessToken,
      userId: e.userID,
    })
    dispatch(setShowPageLoader(false))
    if (err) return console.log(err)
    if (res.status === 200 && res.data.success) {
      console.log('fb - ', res.data)
      window.location.reload()
    }
  }
  const handleGoogleDisconnect = async () => {
    const { err, res } = await disconnectGoogle({})
    if (err) {
      return console.log(err)
    }
    console.log(res.data)
    window.location.reload()
  }

  const handleFacebookDisconnect = async () => {
    const { err, res } = await disconnectFacebook({})
    if (err) {
      return console.log(err)
    }
    console.log(res.data)
    window.location.reload()
  }

  const openForgotPasswordEmail = () => {
    dispatch(openModal({ type: 'confirm-email', closable: true }))
  }

  console.log('usergoogle', user)
  return (
    <>
      <PageGridLayout column={2} customStyles={styles['settingcontainer']}>
        <SettingsSidebar active="" />
        <div className={styles.container}>
          <p className={`${styles.textLight} ${styles.title}`}> Email Login </p>
          <p className={styles.email}>Email ID: {user.email} </p>
          <section className={styles.editSection}>
            <div
              className={styles.editContainer}
              onClick={openChangePasswordModal}
            >
              <Image src={EditIcon} width={16} height={16} alt="edit" />
              <p className={styles.editText}> Change Password </p>
            </div>
            <div className={styles.editContainer}>
              <Image src={EditIcon} width={16} height={16} alt="edit" />
              <p className={styles.editText} onClick={openForgotPasswordEmail}>
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
            {user.google?.picture ? (
              <div className={styles['google-image']}>
                <Image
                  src={user.google.picture}
                  width={20}
                  height={20}
                  alt="google"
                />
                <div className={styles['google-icon']}>
                  <Image
                    src={GoogleIcon}
                    width={10}
                    height={10}
                    alt="google Image"
                  />
                </div>
              </div>
            ) : (
              <Image src={GoogleIcon} width={20} height={20} alt="google" />
            )}
            <p className={styles.socialLoginText}>Connect with Google</p>
            {!user.google?.id ? (
              <GoogleLogin
                clientId="795616019189-b0s94ri1i98355rjv1pg6ai588k0k87d.apps.googleusercontent.com"
                render={(renderProps) => (
                  <OutlinedButton
                    className={styles.loginBtn}
                    onClick={renderProps.onClick}
                  >
                    Connect
                  </OutlinedButton>
                )}
                onSuccess={googleAuthSuccess}
                onFailure={googleAuthFailure}
              />
            ) : (
              <FilledButton
                className={styles.loginBtn}
                onClick={handleGoogleDisconnect}
              >
                Disconnect
              </FilledButton>
            )}
          </div>

          <div className={styles.socialLoginContainer}>
            {user.facebook?.picture ? (
              <div className={styles['google-image']}>
                <Image
                  src={user.facebook.picture}
                  width={20}
                  height={20}
                  alt="facebook"
                />
                <div className={styles['google-icon']}>
                  <Image
                    src={FacebookIcon}
                    width={10}
                    height={10}
                    alt="facebook Image"
                  />
                </div>
              </div>
            ) : (
              <Image src={FacebookIcon} width={20} height={20} alt="google" />
            )}

            <p className={styles.socialLoginText}>Connect with Facebook</p>
            {!user.facebook?.id ? (
              <FacebookLogin
                // App ID: 1614660215286765
                // App Secret: a4839f4438a6b3527ca60636cc5d76a6
                appId="1614660215286765"
                callback={handleFacebookAuth}
                render={(renderProps: any) => (
                  <OutlinedButton
                    className={styles.loginBtn}
                    onClick={renderProps.onClick}
                  >
                    Connect
                  </OutlinedButton>
                )}
              />
            ) : (
              <FilledButton
                className={styles.loginBtn}
                onClick={handleFacebookDisconnect}
              >
                Disconnect
              </FilledButton>
            )}
          </div>

          <div className={styles.line}></div>
          <div className={styles['logout-container']}>
            <p
              className={`${styles.textLight} ${styles.title} ${styles.clickable}`}
              onClick={handleLogout}
            >
              {' '}
              Logout{' '}
            </p>
            <p
              className={`${styles.logoutText} ${styles.clickable}`}
              onClick={handleLogout}
            >
              {' '}
              Logout of all browsers{' '}
            </p>
          </div>
        </div>
      </PageGridLayout>
    </>
  )
}

export default withAuth(LoginAndSecurity)
