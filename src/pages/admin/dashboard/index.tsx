import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import { admindashboard } from '@/services/admin.service'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assets/image/Switch-Role-to-User.png'

export default function Index() {
  interface IconProps {
    active?: boolean
  }
  const [data, setData] = useState<any>([])
  const table1data = [
    {
      name: 'User Support',
      open: data.usersSupportOpen,
      total: data.userSupportCount,
    },
    {
      name: 'User Report',
      open: data.userReportpen,
      total: data.userReportCount,
    },
    {
      name: 'Hobby Requests',
      open: 0,
      total: 0,
    },
    {
      name: 'Blog Approvals',
      open: 0,
      total: 0,
    },
    {
      name: 'Post Reports',
      open: data.postReportOpen,
      total: data.postReportCount,
    },
    {
      name: 'Location Edit',
      open: 0,
      total: 0,
    },
  ]
  const table2data = [
    {
      name: 'Page Claims',
      open: 0,
      total: 0,
    },
    {
      name: 'Page Reports',
      open: data.listingReportOpen,
      total: data.listingReportCount,
    },
    {
      name: 'Page Support',
      open: data.listingSupportOpen,
      total: data.listingSupportCount,
    },
    {
      name: 'Page Relations',
      open: 0,
      total: 0,
    },
    {
      name: 'Seller KYC',
      open: 0,
      total: 0,
    },
  ]

  useEffect(() => {
    const getDashboardDetails = async () => {
      const { res, err } = await admindashboard()
      if (err) {
        console.error('Error:', err)
      } else {
        setData(res?.data.data)
        // console.log('Dashboard data:', res)
      }
    }
    getDashboardDetails()
  })

  const UserIcon = ({ active }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <g clip-path="url(#clip0_11920_191441)">
        <path
          d="M10.9998 11.0013C13.0257 11.0013 14.6665 9.36047 14.6665 7.33464C14.6665 5.3088 13.0257 3.66797 10.9998 3.66797C8.974 3.66797 7.33317 5.3088 7.33317 7.33464C7.33317 9.36047 8.974 11.0013 10.9998 11.0013ZM10.9998 12.8346C8.55234 12.8346 3.6665 14.063 3.6665 16.5013V18.3346H18.3332V16.5013C18.3332 14.063 13.4473 12.8346 10.9998 12.8346Z"
          fill={active ? '#0096C8' : '#6D747A'}
        />
      </g>
      <defs>
        <clipPath id="clip0_11920_191441">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  return (
    <>
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.allLabels}>
            <div className={styles.label}>
              <p>
                Version : <span>0.9.1c</span>
              </p>
            </div>
            <div className={styles.label}>
              <p>
                Updated : <span>18 Jun 2024</span>
              </p>
            </div>
            <div style={{ marginLeft: '48px' }}>
              <Link href={`/community`}>
                <Image src={logo} alt="Logo" width={50} height={50} />
              </Link>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.label}>
              <Link href={`/admin/users`}>
                Users : <span>{data.userCount}</span>
              </Link>
            </div>
            <div style={{ width: '20px' }} />
            <div className={styles.label}>
              <Link href={`/admin/pages`}>
                Pages : <span>{data.listingCount}</span>
              </Link>
            </div>
            <div style={{ width: '20px' }} />
            <div className={styles.label}>
              <Link href={`/admin/posts`}>
                Posts : <span>{data?.postCount || 462}</span>
              </Link>
            </div>
          </div>

          <div className={styles.twoTables}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Open</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {table1data.map((obj, i) => (
                  <tr key={i}>
                    <td>{obj.name}</td>
                    <td>{obj.open}</td>
                    <td>{obj.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Open</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {table2data.map((obj, i) => (
                  <tr key={i}>
                    <td>{obj.name}</td>
                    <td>{obj.open}</td>
                    <td>{obj.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
