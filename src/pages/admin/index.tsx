import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './dashboard/styles.module.css'
import { signIn } from '../../services/auth.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateUser } from '@/redux/slices/user'

const Admin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();
  const dispatch = useDispatch();
  const {user} = useSelector((state:RootState)=>state.user);

  const handleLogin = async (e: any) => {
    e.preventDefault()

    const data: any = {
      email: email,
      password: password,
    }
    const { err, res } = await signIn(data)

    if (res) {
      dispatch(updateUser({...user,is_admin:true}));
      console.log('Login successful:', res)

      // router.push('/admin/dashboard')
    } else if (err) {
      console.error('Login failed:', err)
    }
  }

  useEffect(()=>{
    if(user.is_admin){
      router.push('/admin/dashboard');
    }
  },[router, user])

  return (
    <div className={styles['Admin-login']}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Admin
