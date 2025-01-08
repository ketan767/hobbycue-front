import React, { useState, useRef } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CloseIcon from '@/assets/icons/CloseIcon'
import styles from './styles.module.css'
import Image from 'next/image'
import StatusDropdown from '@/components/_formElements/StatusDropdown'
// import StatusDropdown from '@/components/_formElements/AdminStatusDropdown'

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
  }

  return (
    <>
      <div className={`${styles['modal-wrapper']}  `}>
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
            ) }
          </div>
          <p className={styles['status-text']}>Status</p>
          <div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-between' }}>
            <StatusDropdown
              status={data?.status}
              onStatusChange={handleStatusChange}
            />
            <label className={styles.label}>
            Email User
              <input
                type="checkbox"
                // onChange={handleEmailUserChange} 
                style={{ marginLeft: '5px',position: 'relative', top: '2px'  }}
              />
             
            </label>
            <div/>
          </div>
          
        </section>
        <footer className={styles['footer']}>
          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            style={{backgroundColor:'#0096C8'}}
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