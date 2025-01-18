import React, { useState, useRef, useEffect } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { useDispatch } from 'react-redux'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CloseIcon from '@/assets/icons/CloseIcon'
import styles from './styles.module.css'
import StatusDropdown from '@/components/_formElements/AdminStatusDropdown'
import Link from 'next/link'

type Props = {
  data?: any
  setData?: any
  handleSubmit?: any
  handleClose?: any
}

const AdminActionModal: React.FC<Props> = ({
  data,
  setData,
  handleSubmit,
  handleClose,
}) => {
  const dispatch = useDispatch()
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [inputErrs, setInputErrs] = useState<{ error: string | null }>({
    error: null,
  })
  const modalRef = useRef<HTMLDivElement | null>(null)
  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setData((prev: any) => ({ ...prev, description: value }))
    setInputErrs({ error: null })
  }

  const handleStatusChange = (newStatus: any) => {
    setData((prev: any) => ({ ...prev, status: newStatus.status }))
  }

  const handleFormSubmit = async () => {
    setSubmitBtnLoading(true)
    await handleSubmit()
    setSubmitBtnLoading(false)
  }

  // Close modal on clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose()
    }
  }

  // Close modal on pressing 'Esc'
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <div className={styles['modal-overlay']}>
        <div ref={modalRef} className={`${styles['modal-wrapper']}  `}>
          <header className={styles['header']}>
            <h4 className={styles['heading']}>{'Admin Notes and Status'}</h4>
            <CloseIcon
              className={styles['modal-close-icon']}
              onClick={handleClose}
            />
          </header>

          <hr className={styles['modal-hr']} />

          <section className={styles['body']}>
            <div className={styles['input-box']}>
              <div
                className={` ${inputErrs.error
                    ? styles['input-box-error']
                    : styles['street-input-container']
                  }`}
              >
                <textarea
                  className={styles['long-input-box']}
                  required
                  placeholder="Internal Notes or Notes for the User"
                  name="message"
                  onChange={handleInputChange}
                  value={data.description}
                />
              </div>
              {inputErrs.error && (
                <p className={styles['error-msg']}>{inputErrs.error}</p>
              )}
            </div>
            <p className={styles['status-text']}>Status</p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <StatusDropdown
                long={true}
                status={data?.status}
                onStatusChange={handleStatusChange}
              />
              <label className={styles.label}>
                Email User
                <input
                  type="checkbox"
                  style={{
                    marginLeft: '5px',
                    position: 'relative',
                    top: '2px',
                  }}
                />
              </label>
              <div />
            </div>
          </section>
          <div className={styles.auditFields}>
            <Link
                    href={`/profile/${data?.user?.profile_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
              <div className={styles.auditField}>
              
                <span className={styles.label}>Created By:</span>
                   
                    <span className={styles.value}>{data?.user.full_name || "N/A"}</span>
                  
              </div>
              </Link>
              <div className={styles.auditField}>
                <span className={styles.label}>Created At:</span>
                <span className={styles.value}>
                {data?.createdAt ? 
                  (() => {
                      const date = new Date(data?.createdAt);
                      const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const, hour: 'numeric' as const, minute: 'numeric' as const, hour12: true };
                      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                      const [monthDay, year, time] = formattedDate.split(', ');
                      return `${year} ${monthDay}, ${time}`;
                  })() 
                  : "N/A"
                }
                </span>
                
              </div>
              <Link
                    href={`/profile/admin`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
              <div className={styles.auditField}>
             
                <span className={styles.label}>Updated By:</span>
                
                    <span className={styles.value}>{"HobbyCue Admin"}</span>
                    
                {/* <span className={styles.value}></span> */}
              </div>
              </Link>
              <div className={styles.auditField}>
                <span className={styles.label}>Updated At:</span>
                <span className={styles.value}>
                {data?.updatedAt ? 
                  (() => {
                      const date = new Date(data?.updatedAt);
                      const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const, hour: 'numeric' as const, minute: 'numeric' as const, hour12: true };
                      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                      const [monthDay, year, time] = formattedDate.split(', ');
                      return `${year} ${monthDay}, ${time}`;
                  })() 
                  : "N/A"
                }
                </span>
              </div>
            </div>
          
          <footer className={styles['footer']}>
            <button
              ref={nextButtonRef}
              className="modal-footer-btn submit"
              style={{ backgroundColor: '#0096C8' }}
              onClick={handleFormSubmit}
              disabled={submitBtnLoading}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'24px'} />
              ) : (
                'Save'
              )}
            </button>
            <button
              ref={nextButtonRef}
              className="modal-mob-btn-save"
              onClick={handleFormSubmit}
              disabled={submitBtnLoading}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Save'
              )}
            </button>
          </footer>
        </div>
      </div>
      <CustomSnackbar
        message={snackbar?.message}
        triggerOpen={snackbar?.display}
        type={snackbar.type === 'success' ? 'success' : 'error'}
        closeSnackbar={() => {
          setSnackbar((prevValue) => ({ ...prevValue, display: false }))
        }}
      />
    </>
  )
}

export default AdminActionModal
