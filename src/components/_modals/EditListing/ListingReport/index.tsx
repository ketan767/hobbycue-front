import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import {
  getAllUserDetail,
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './styles.module.css'
import { isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'
import { ReportListing } from '@/services/listing.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
}

type reportData = {
  description: string
  name: string
  email: string
  user_id: string
  type: string
  reported_user_id: string
}

const ListingReport: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const [data, setData] = useState<reportData>({
    description: '',
    name: '',
    email: '',
    user_id: '',
    type: '',
    reported_user_id: '',
  })
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)
  const listingPageData = useSelector(
    (state: RootState) => state.site.listingPageData,
  )

  const [inputErrs, setInputErrs] = useState<{ error: string | null }>({
    error: null,
  })
  const [initialData, setInitialData] = useState<reportData>({
    description: '',
    name: user.full_name,
    email: user?.public_email,
    user_id: user._id,
    type: listingPageData.type,
    reported_user_id: listingPageData._id,
  })
  const [isChanged, setIsChanged] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  useEffect(() => {
    setInitialData({
      description: '',
      name: user.full_name,
      email: user?.public_email,
      user_id: user._id,
      type: listingPageData.type,
      reported_user_id: listingPageData._id,
    })
  }, [user])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, description: value }))
    setInputErrs({ error: null })

    const hasChanged = value !== initialData.description
    setIsChanged(hasChanged)

    if (onStatusChange) {
      onStatusChange(hasChanged)
    }
  }

  const handleSubmit = async () => {
    console.log('report', data)
    if (!data.description || data.description?.trim() === '') {
      if (textareaRef.current) {
        textareaRef.current?.focus()
      }
      setInputErrs((prev) => {
        return { ...prev, error: 'This field is required!' }
      })
      setIsError(true)
      return
    }

    setSubmitBtnLoading(true)
    const { err, res } = await ReportListing(data)
    if (res?.data.success) {
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Report sent',
      })
      setSubmitBtnLoading(false)
      setTimeout(() => {
        dispatch(closeModal())
      }, 2500)
    } else if (err) {
      setSubmitBtnLoading(false)
      setSnackbar({
        display: true,
        type: 'warning',
        message: 'Something went wrong',
      })
      console.log(err)
    }
  }

  useEffect(() => {
    setData({
      description: '',
      name: user.full_name,
      email: user?.public_email,
      user_id: user._id,
      type: listingPageData.type,
      reported_user_id: listingPageData._id,
    })
  }, [user])

  const HandleSaveError = async () => {
    if (
      !data.description ||
      data.description?.trim() === '' ||
      data.description === '<p><br></p>'
    ) {
      setIsError(true)
    }
  }

  useEffect(() => {
    if (confirmationModal) {
      HandleSaveError()
    }
  }, [confirmationModal])

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isError])

  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    const focusTextarea = () => {
      if (textareaRef.current) {
        textareaRef.current?.focus()
      }
    }
    focusTextarea()
  }, [textareaRef.current])

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if(event?.srcElement?.tagName && 
          event?.srcElement?.tagName?.toLowerCase()==="textarea" ||
          event?.srcElement?.tagName?.toLowerCase()==="svg"
        ){
          return
        }
       nextButtonRef.current?.click();
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [data?.description])

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
      />
    )
  }

  return (
    <>
      <div
        className={`${styles['modal-wrapper']} ${
          confirmationModal ? styles['ins-active'] : ''
        }  `}
      >
        {/* Modal Header */}
        <header className={styles['header']}>
          <CloseIcon
            className={styles['modal-close-icon']}
            onClick={() =>
              isChanged ? setConfirmationModal(true) : handleClose()
            }
          />
          <h4 className={styles['heading']}>{'Report'}</h4>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            <div
              className={` ${
                inputErrs.error
                  ? styles['input-box-error']
                  : styles['street-input-container']
              }`}
            >
              <textarea
                ref={textareaRef}
                className={styles['long-input-box']}
                required
                placeholder="Write your description here"
                name="message"
                onChange={handleInputChange}
                value={data.description}
              />
            </div>
            {inputErrs.error ? (
              <p className={styles['error-msg']}>{inputErrs.error}</p>
            ) : (
              <p className={styles['error-msg']}>&nbsp;</p> // Render an empty <p> element
            )}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel">
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
              </button>
              {/* SVG Button for Mobile */}
              <div>
                <Image
                  src={BackIcon}
                  alt="Back"
                  className="modal-mob-btn cancel"
                />
              </div>
            </>
          )}

          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Submit'
            ) : (
              'Submit'
            )}
          </button>
          {/* SVG Button for Mobile */}
          {onComplete ? (
            <div onClick={handleSubmit}>
              <Image
                src={NextIcon}
                alt="back"
                className="modal-mob-btn cancel"
              />
            </div>
          ) : (
            <button
              ref={nextButtonRef}
              className="modal-mob-btn-save"
              onClick={handleSubmit}
              disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Submit'
              )}
            </button>
          )}
        </footer>
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

export default ListingReport
