import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from './ProfileHeader.module.css'
import { openModal } from '@/redux/slices/modal'
import useOutsideClick from '@/hooks/useOutsideClick'

type Props = {
  handleClose?: any
  userType: 'edit' | 'anonymous' | 'page'
}

const Dropdown: React.FC<Props> = ({ handleClose, userType }) => {
  const dispatch = useDispatch()
  const ref = useRef(null)
  useOutsideClick(ref, handleClose)
  const claimModal = () => {
    dispatch(openModal({ type: 'claim-listing', closable: true }))
  }

  return (
    <div className={styles['dropdown']} ref={ref}>
      <ul className={styles['customList']}>
        {userType === 'edit' && (
          <li
            onClick={(e) => {
              dispatch(openModal({ type: 'SupportModal', closable: true }))
            }}
          >
            Support
          </li>
        )}
        {userType === 'anonymous' && (
          <>
            <li>Report</li>
          </>
        )}
        {userType === 'page' && (
          <>
            <li>Claim</li>
            <li>Review</li>
            <li>Report</li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Dropdown
