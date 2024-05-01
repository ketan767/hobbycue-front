import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ProfileHeader.module.css'
import { openModal } from '@/redux/slices/modal'
import useOutsideClick from '@/hooks/useOutsideClick'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { showProfileError } from '@/redux/slices/user'

type Props = {
  handleClose?: any
  userType: 'edit' | 'anonymous' | 'page'
}

const Dropdown: React.FC<Props> = ({ handleClose, userType }) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const supportRef = useRef<HTMLLIElement>(null)
  const reportRef = useRef<HTMLLIElement>(null)
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: any) {
      console.log({ targ: event.target })
      if (ref.current && ref.current.contains(event.target) !== true) {
        handleClose()
        return
      } else if (
        event.target.nodeName == supportRef.current?.nodeName &&
        event.target.textContent === supportRef.current?.textContent
      ) {
        if (isLoggedIn) {
          dispatch(openModal({ type: 'SupportUserModal', closable: true }))
          handleClose()
        } else {
          dispatch(openModal({ type: 'auth', closable: true }))
          handleClose()
        }
      } else if (
        event.target.nodeName == reportRef.current?.nodeName &&
        event.target.textContent === reportRef.current?.textContent
      ) {
        if (isLoggedIn) {
          if (user.is_onboarded) {
            dispatch(openModal({ type: 'UserReportModal', closable: true }))
            handleClose()
          } else {
            router.push(`/profile/${user.profile_url}`)
            dispatch(showProfileError(true))
          }
        } else {
          dispatch(openModal({ type: 'auth', closable: true }))
          handleClose()
        }
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
            <li ref={reportRef}>Report</li>
          </>
        )}
        {userType === 'page' && (
          <>
            <li>Claim</li>
            <li>Review</li>
            <li ref={reportRef}>Report</li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Dropdown
