import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './users/styles.module.css'
import { signIn } from '../../services/auth.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateUser } from '@/redux/slices/user'

const Admin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

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

  return (
    <div className={styles['admin-login-wrapper']}>
      <form onSubmit={handleLogin}>
        <h1>Hobbycue Admin</h1>

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
