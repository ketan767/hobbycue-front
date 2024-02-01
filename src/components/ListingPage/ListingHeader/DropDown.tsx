import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from '@/components/ProfilePage/ProfileHeader/ProfileHeader.module.css'
import { openModal } from '@/redux/slices/modal'

type Props = {
  handleClose?: any
  userType: 'edit' | 'anonymous' | 'page'
}

const Dropdown: React.FC<Props> = ({ handleClose, userType }) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLLIElement>(null)

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (
          event.target.nodeName == ref2.current?.nodeName &&
          event.target.textContent === ref2.current?.textContent
        ) {
          dispatch(openModal({ type: 'claim-listing', closable: true }))
        }
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

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
            <li ref={ref2}>Claim</li>
            <li>Review</li>
            <li>Report</li>
          </>
        )}
        {userType === 'page' && (
          <>
            <li ref={ref2}>Claim</li>
            <li>Review</li>
            <li>Report</li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Dropdown
