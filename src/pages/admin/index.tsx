import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './users/styles.module.css'
import { googleAuth, signIn } from '../../services/auth.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateIsLoggedIn, updateUser } from '@/redux/slices/user'
import GoogleLogin from 'react-google-login'
import { Button } from '@mui/material'
import { setShowPageLoader } from '@/redux/slices/site'
import { isBrowser } from '@/utils'
import UAParser from 'ua-parser-js'
import { closeModal } from '@/redux/slices/modal'
import { getMyProfileDetail, updateUserProfile } from '@/services/user.service'

const Admin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const [deviceInfo, setDeviceInfo] = useState<any>({
    device: 'unknown',
    browser: 'unknown',
  })

  useEffect(() => {
    const getBrowserData = async () => {
      if (isBrowser()) {
        const parser = new UAParser()
        const result = parser.getResult()
        const userAgent = navigator?.userAgent

        const deviceType = window.innerWidth < 800 ? 'Phone' : 'Desktop'
        setDeviceInfo({
          device: `${deviceType} - ${userAgent}`,
          browser: result?.browser?.name || 'unknown',
        })
      }
    }
    getBrowserData()
  }, [user])
  const handleLogin = async (e: any) => {
    e.preventDefault()

    const data: any = {
      email: email,
      password: password,
    }
    const { err, res } = await signIn(data)

    if (res) {
      dispatch(updateUser({ ...user, is_admin: true }))
      console.log('Login successful:', res)

      // router.push('/admin/dashboard')
    } else if (err) {
      console.error('Login failed:', err)
    }
  }

  useEffect(() => {
    if (user.is_admin) {
      router.push('/admin/dashboard')
    }
  }, [router, user])

  const googleAuthSuccess = async (e: any) => {
    dispatch(setShowPageLoader(true))
    const { err, res } = await googleAuth({
      googleId: e.profileObj.googleId,
      tokenId: e.tokenId,
      name: e.profileObj.name,
      imageUrl: e.profileObj.imageUrl,
      browser: deviceInfo?.browser,
      device: deviceInfo.device,
    })
    dispatch(setShowPageLoader(false))
    if (err) {
      console.log({ err })
      return alert('Some error occured during google authentication')
    } else if (res.status === 200 && res.data.success) {
      localStorage.setItem('token', res.data.data.token)
      dispatch(updateIsLoggedIn(true))
      dispatch(closeModal())
    }
    const { err: error, res: response } = await getMyProfileDetail()
    console.log({ response })
    if (response?.data?.data?.user?.is_admin === true) {
      dispatch(updateUser({ ...user, is_admin: true }))
    } else {
      alert('Sorry you are not an admin')
    }
  }

  const googleAuthFailure = (e: any) => console.log(e)

  return (
    <div className={styles['admin-login-wrapper']}>
      <form onSubmit={handleLogin}>
        <h1>Hobbycue Admin</h1>

        <GoogleLogin
          clientId="795616019189-b0s94ri1i98355rjv1pg6ai588k0k87d.apps.googleusercontent.com"
          render={(renderProps) => (
            <Button
              className={`${styles['social-login-btn']} ${styles['google']}`}
              onClick={renderProps.onClick}
            >
              Continue with Google
            </Button>
          )}
          onSuccess={googleAuthSuccess}
          onFailure={googleAuthFailure}
        />

        <div style={{ paddingBottom: '20px' }}></div>
        <div className={styles['input-box']}>
          <label>Email:</label>
          <input
            type="email"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles['input-box']}>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="modal-footer-btn submit" type="submit">
          Login
        </button>
        <button className="modal-mob-btn-save" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default Admin
