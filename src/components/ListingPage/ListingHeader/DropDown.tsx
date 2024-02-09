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
  const Claimref = useRef<HTMLLIElement>(null)
  const supportRef = useRef<HTMLLIElement>(null)
  const reportRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (
          event.target.nodeName == Claimref.current?.nodeName &&
          event.target.textContent === Claimref.current?.textContent
        ) {
          dispatch(openModal({ type: 'claim-listing', closable: true }))
        }

        if (
          event.target.nodeName == supportRef.current?.nodeName &&
          event.target.textContent === supportRef.current?.textContent
        ) {
          dispatch(openModal({ type: 'SupportModal', closable: true }))
        }

        if (
          event.target.nodeName == reportRef.current?.nodeName &&
          event.target.textContent === reportRef.current?.textContent
        ) {
          dispatch(openModal({ type: 'ListingReportModal', closable: true }))
        }
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return (
    <div className={styles['dropdown']} ref={ref}>
      <ul className={styles['customList']}>
        {userType === 'edit' && <li ref={supportRef}>Support</li>}
        {userType === 'anonymous' && (
          <>
            <li ref={Claimref}>Claim</li>
            <li>Review</li>
            <li ref={reportRef}>Report</li>
          </>
        )}
        {userType === 'page' && (
          <>
            <li ref={Claimref}>Claim</li>
            <li>Review</li>
            <li ref={reportRef}>Report</li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Dropdown
