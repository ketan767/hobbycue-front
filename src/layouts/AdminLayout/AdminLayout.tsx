import AdminNavbar from '@/components/AdminNavbar/AdminNavbar'
import { RootState } from '@/redux/store'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'

interface AdminLayoutProps {
  children: any
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { admin_nav } = useSelector((state: RootState) => state.site)
  const { user } = useSelector((state: RootState) => state.user)

  if (!user.is_admin) {
    return null
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
