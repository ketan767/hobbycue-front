import React from 'react'
import styles from './styles.module.css'

export default function index() {
  return (
    <div className={styles.container}>
      <div className={styles.allLabels}>
        <div className={styles.label}>
          <p>
            Version :<span>1 . 16</span>
          </p>
        </div>
        <div className={styles.label}>
          <p>
            Updated :<span>20 Jan 2024</span>
          </p>
        </div>
        <div className={styles.label}>
          <p>
            Users :<span>1,250</span>
          </p>
        </div>
        <div className={styles.label}>
          <p>
            Pages :<span>4,856</span>
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
            <tr>
              <td>User Support</td>
              <td>2</td>
              <td>11</td>
            </tr>
            <tr>
              <td>User Support</td>
              <td>2</td>
              <td>11</td>
            </tr>
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
            <tr>
              <td>User Support</td>
              <td>2</td>
              <td>11</td>
            </tr>
            <tr>
              <td>User Support</td>
              <td>2</td>
              <td>11</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
