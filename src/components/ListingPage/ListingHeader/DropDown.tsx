import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '@/components/ProfilePage/ProfileHeader/ProfileHeader.module.css'
import { openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import { showProfileError } from '@/redux/slices/user'
import { useRouter } from 'next/router'

type Props = {
  handleClose?: any
  userType: 'edit' | 'anonymous' | 'page'
  showFeatureUnderDevelopment?: () => void
}

const Dropdown: React.FC<Props> = ({
  handleClose,
  userType,
  showFeatureUnderDevelopment,
}) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const Claimref = useRef<HTMLLIElement>(null)
  const Reviewref = useRef<HTMLLIElement>(null)
  const supportRef = useRef<HTMLLIElement>(null)
  const reportRef = useRef<HTMLLIElement>(null)
  const transferRef = useRef<HTMLLIElement>(null)
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: any) {
      console.log({ targ: event.target, ref: ref.current })
      if (
        event.target.nodeName == Claimref.current?.nodeName &&
        event.target.textContent === Claimref.current?.textContent
      ) {
        if (isLoggedIn) {
          if (user.is_onboarded) {
            dispatch(openModal({ type: 'claim-listing', closable: true }))
            handleClose()
          } else {
            router.push(`/profile/${user.profile_url}`)
            dispatch(showProfileError(true))
          }
        } else {
          dispatch(openModal({ type: 'auth', closable: true }))
          handleClose()
        }
      } else if (
        event.target.nodeName == Reviewref.current?.nodeName &&
        event.target.textContent === Reviewref.current?.textContent
      ) {
        if (isLoggedIn) {
          if (user.is_onboarded) {
            dispatch(openModal({ type: 'ListingReviewModal', closable: true }))
            handleClose()
          } else {
            router.push(`/profile/${user.profile_url}`)
            dispatch(showProfileError(true))
          }
        } else {
          dispatch(openModal({ type: 'auth', closable: true }))
          handleClose()
        }
      } else if (
        event.target.nodeName == supportRef.current?.nodeName &&
        event.target.textContent === supportRef.current?.textContent
      ) {
        if (isLoggedIn) {
          if (user.is_onboarded) {
            dispatch(openModal({ type: 'ListingSupportModal', closable: true }))
            handleClose()
          } else {
            router.push(`/profile/${user.profile_url}`)
            dispatch(showProfileError(true))
          }
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
            dispatch(openModal({ type: 'ListingReportModal', closable: true }))
            handleClose()
          } else {
            router.push(`/profile/${user.profile_url}`)
            dispatch(showProfileError(true))
          }
        } else dispatch(openModal({ type: 'auth', closable: true }))
      } else if (
        event.target.nodeName == transferRef.current?.nodeName &&
        event.target.textContent === transferRef.current?.textContent
      ) {
        if (isLoggedIn) {
          if (user.is_onboarded) {
            dispatch(
              openModal({
                type: 'listing-contact-edit',
                closable: true,
                propData: { istransfer: true },
              }),
            )
            handleClose()
          } else {
            router.push(`/profile/${user.profile_url}`)
            dispatch(showProfileError(true))
          }
        } else dispatch(openModal({ type: 'auth', closable: true }))
      } else if (ref.current && !ref.current.contains(event.target)) {
        handleClose()
        return
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref])

  return (
    <>
      <div className={styles['dropdown']} ref={ref}>
        <ul className={styles['customList']}>
          {userType === 'edit' && (
            <>
              <li ref={supportRef}>Support</li>
              <li ref={transferRef}>Transfer</li>
            </>
          )}
          {userType === 'anonymous' && (
            <>
              <li ref={Claimref}>Claim</li>
              <li ref={Reviewref} onClick={showFeatureUnderDevelopment}>
                Review
              </li>{' '}
              {/* Modified line */}
              <li ref={reportRef}>Report</li>
            </>
          )}
          {userType === 'page' && (
            <>
              <li ref={Claimref}>Claim</li>
              <li ref={Reviewref} onClick={showFeatureUnderDevelopment}>
                Review
              </li>{' '}
              {/* Modified line */}
              <li ref={reportRef}>Report</li>
            </>
          )}
        </ul>
      </div>
    </>
  )
}

export default Dropdown
