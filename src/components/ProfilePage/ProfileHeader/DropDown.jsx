import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from './ProfileHeader.module.css'
import { openModal } from '@/redux/slices/modal'

const Dropdown = () => {
  const dispatch = useDispatch()

  const claimModal = () => {
    dispatch(openModal({ type: 'claim-listing', closable: true }))
  }

  return (
    <div className={styles['dropdown']}>
      <ul className={styles['customList']}>
        <li>Claim</li>
        <li>Review</li>
        <li>Report</li>
      </ul>
    </div>
  )
}

export default Dropdown
