import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import { admindashboard } from '@/services/admin.service'
import Link from 'next/link'

export default function Index() {
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
        console.log('Dashboard data:', res)
      }
    }
    getDashboardDetails()
  })

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
                Updated : <span>5 Jun 2024</span>
              </p>
            </div>
            <div className={styles.label}>
              <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/users`}>
                Users : <span>{data.userCount}</span>
              </Link>
            </div>
            <div className={styles.label}>
              <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/admin/pages`}>
                Pages : <span>{data.listingCount}</span>
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
