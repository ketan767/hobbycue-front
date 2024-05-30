import AdminNavbar from '@/components/AdminNavbar/AdminNavbar'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface AdminLayoutProps {
  children: any
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)
  const { admin_nav } = useSelector((state: RootState) => state.site)

  useEffect(() => {
    if (!user.is_admin) {
      router.push('https://hobbycue.com/')
    }
  }, [user, router])

  if (!user.is_admin) {
    return null // Optionally render a loading state or null
  }

  return (
    <>
      <AdminNavbar />
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          style: {
            width: `calc(100% - ${admin_nav ? '248px' : '59px'})`,
            left: admin_nav ? '248px' : '59px',
            position: 'relative',
          },
        }),
      )}
    </>
  )
}

export default AdminLayout
