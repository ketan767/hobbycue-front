import React from 'react'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'

export default function Index() {
  const table1data = [
    {
      name: 'User Support',
      open: 2,
      total: 11,
    },
    {
      name: 'Hobby Requests',
      open: 4,
      total: 20,
    },
    {
      name: 'Blog Approvals',
      open: 1,
      total: 17,
    },
    {
      name: 'Post Reports',
      open: 3,
      total: 48,
    },
    {
      name: 'Location Edit',
      open: 0,
      total: 4,
    },
  ]
  const table2data = [
    {
      name: 'Page Claims',
      open: 9,
      total: 101,
    },
    {
      name: 'Page Reports',
      open: 2,
      total: 9,
    },
    {
      name: 'Page Support',
      open: 5,
      total: 14,
    },
    {
      name: 'Page Relations',
      open: 2,
      total: 32,
    },
    {
      name: 'Seller KYC',
      open: 0,
      total: 24,
    },
  ]

  return (
    <>
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.allLabels}>
            <div className={styles.label}>
              <p>
                Version : <span>1 . 16</span>
              </p>
            </div>
            <div className={styles.label}>
              <p>
                Updated : <span>20 Jan 2024</span>
              </p>
            </div>
            <div className={styles.label}>
              <p>
                Users : <span>1,250</span>
              </p>
            </div>
            <div className={styles.label}>
              <p>
                Pages : <span>4,856</span>
              </p>
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
