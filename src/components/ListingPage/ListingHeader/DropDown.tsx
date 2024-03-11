import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '@/components/ProfilePage/ProfileHeader/ProfileHeader.module.css'
import { openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  handleClose?: any
  userType: 'edit' | 'anonymous' | 'page'
}

const Dropdown: React.FC<Props> = ({ handleClose, userType }) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const Claimref = useRef<HTMLLIElement>(null)
  const Reviewref = useRef<HTMLLIElement>(null)
  const supportRef = useRef<HTMLLIElement>(null)
  const reportRef = useRef<HTMLLIElement>(null)
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (
          event.target.nodeName == Claimref.current?.nodeName &&
          event.target.textContent === Claimref.current?.textContent
        ) {
          if (isLoggedIn) {
            dispatch(openModal({ type: 'claim-listing', closable: true }))
          } else {
            dispatch(openModal({ type: 'auth', closable: true }))
          }
        }
        if (
          event.target.nodeName == Reviewref.current?.nodeName &&
          event.target.textContent === Reviewref.current?.textContent
        ) {
          showFeatureUnderDevelopment()
          event.stopPropagation()
        }

        if (
          event.target.nodeName == supportRef.current?.nodeName &&
          event.target.textContent === supportRef.current?.textContent
        ) {
          if (isLoggedIn) {
            dispatch(openModal({ type: 'ListingSupportModal', closable: true }))
          } else {
            dispatch(openModal({ type: 'auth', closable: true }))
          }
        }

        if (
          event.target.nodeName == reportRef.current?.nodeName &&
          event.target.textContent === reportRef.current?.textContent
        ) {
          if (isLoggedIn)
            dispatch(openModal({ type: 'ListingReportModal', closable: true }))
          else dispatch(openModal({ type: 'auth', closable: true }))
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
    <>
      <div className={styles['dropdown']} ref={ref}>
        <ul className={styles['customList']}>
          {userType === 'edit' && <li ref={supportRef}>Support</li>}
          {userType === 'anonymous' && (
            <>
              <li ref={Claimref}>Claim</li>
              <li onClick={showFeatureUnderDevelopment}>Review</li>{' '}
              {/* Modified line */}
              <li ref={reportRef}>Report</li>
            </>
          )}
          {userType === 'page' && (
            <>
              <li ref={Claimref}>Claim</li>
              <li onClick={showFeatureUnderDevelopment}>Review</li>{' '}
              {/* Modified line */}
              <li ref={reportRef}>Report</li>
            </>
          )}
        </ul>
      </div>

      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default Dropdown
