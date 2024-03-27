import React, { useEffect, useState } from 'react'
import styles from './login.module.css'
import exploreStyles from '@/styles/ExplorePage.module.css'
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
import SettingsDropdownLayout from '@/layouts/SettingsDropdownLayout'
import { useMediaQuery } from '@mui/material'
import { SnackbarState } from '@/components/_modals/ModalManager'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {}

const LoginAndSecurity: React.FC<Props> = ({}) => {
  const { user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [isDisGoogleVerified, setisDisGoogleVerified] = useState(false)
  const [isDisFaceBookVerified, setisDisFaceBookVerified] = useState(false)
  console.log(user)
  const openChangePasswordModal = () => {
    dispatch(openModal({ type: 'change-password', closable: true }))
  }

  const handleLogout = () => {
    logout()
  }
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: '',
    type: 'error',
  })

  function closeSnackbar() {
    setSnackbar({
      show: false,
      message: '',
      type: 'error',
    })
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
      window.location.reload()

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

  const handleGoogleDisconnect = () => {
    if (!isDisGoogleVerified) {
      dispatch(
        openModal({
          type: 'Verify-ActionModal',
          closable: true,
          onVerify: () => setisDisGoogleVerified(true),
        }),
      )
    }
  }
  useEffect(() => {
    const disconnectGoogleAsync = async () => {
      if (isDisGoogleVerified) {
        const { err, res } = await disconnectGoogle({})
        if (err) {
          return console.log(err)
        }
        console.log(res.data)
        window.location.reload()
      }
    }
    disconnectGoogleAsync()
  }, [isDisGoogleVerified, dispatch])

  const handleFacebookDisconnect = async () => {
    if (!isDisFaceBookVerified) {
      dispatch(
        openModal({
          type: 'Verify-ActionModal',
          closable: true,
          onVerify: () => setisDisFaceBookVerified(true),
        }),
      )
    }
  }
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      show: true,
      type: 'error',
      message: 'This feature is under development',
    })
  }

  useEffect(() => {
    const disconnectFaceBookAsync = async () => {
      if (isDisFaceBookVerified) {
        const { err, res } = await disconnectFacebook({})
        if (err) {
          return console.log(err)
        }
        console.log(res.data)
        window.location.reload()
      }
    }
    disconnectFaceBookAsync()
  }, [isDisFaceBookVerified, dispatch])

  const openForgotPasswordEmail = () => {
    dispatch(openModal({ type: 'confirm-email', closable: true }))
  }

  console.log('usergoogle', user)
  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <>
      {isMobile&&<aside className={`${exploreStyles['community-left-aside']} custom-scrollbar static-position`}>
        <section className="content-box-wrapper">
          <header>
            <div className={exploreStyles['heading']}>
              <h1>Settings</h1>
            </div>
          </header>
        </section>
      </aside>}
      <PageGridLayout column={2} customStyles={styles['settingcontainer']}>
        <SettingsDropdownLayout>
          {isMobile ? null : <SettingsSidebar active="login-security" />}
          <div className={styles.container}>
            <p className={`${styles.textLight} ${styles.title}`}>
              {' '}
              Email Login{' '}
            </p>
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
                <p
                  className={styles.editText}
                  onClick={openForgotPasswordEmail}
                >
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
                    className={styles['user-icon-google']}
                    src={user.google.picture}
                    fill
                    alt="google"
                  />
                  <div className={styles['google-icon']}>
                    <Image
                      src={GoogleIcon}
                      width={10}
                      height={10}
                      alt="google Icon"
                    />
                  </div>
                </div>
              ) : (
                <Image src={GoogleIcon} width={32} height={32} alt="google" />
              )}

              {user.google?.id ? (
                <p className={styles.socialLoginText}>{user.full_name}</p>
              ) : (
                <p className={styles.socialLoginText}>Connect with Google</p>
              )}
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
                    className={styles['user-icon-google']}
                    src={user.facebook.picture}
                    width={32}
                    height={32}
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
                <Image src={FacebookIcon} width={32} height={32} alt="google" />
              )}

              {user.facebok?.id ? (
                <p className={styles.socialLoginText}>{user.full_name}</p>
              ) : (
                <p className={styles.socialLoginText}>Connect with Facebook</p>
              )}
              {!user.facebook?.id ? (
                <FacebookLogin
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
                onClick={showFeatureUnderDevelopment}
              >
                {' '}
                Logout of all browsers{' '}
              </p>
            </div>
          </div>
        </SettingsDropdownLayout>
      </PageGridLayout>
      <CustomSnackbar
        triggerOpen={snackbar.show}
        message={snackbar.message ?? 'This feature is under development'}
        type={snackbar.type}
        closeSnackbar={closeSnackbar}
      />
    </>
  )
}

export default withAuth(LoginAndSecurity)
