import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import {
  getAllUserDetail,
  getMyProfileDetail,
  updateMyProfileDetail,
  ReportUser,
} from '@/services/user.service'

import styles from './styles.module.css'
import { isEmpty, isEmptyField, isMobile } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  propData?: any
}

type reportData = {
  description: string
  name: string
  email: string
  user_id: string
  type: string
  reported_user_id: string
  reported_user_name: string
  reported_user_email: string
  for_url: string
}

const UserReport: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  propData,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const currprofile = useSelector((state: RootState) => state.user.profileData)

  const [data, setData] = useState<reportData>({
    description: '',
    name: '',
    email: '',
    user_id: '',
    type: '',
    reported_user_id: '',
    reported_user_name: '',
    reported_user_email: '',
    for_url: '',
  })
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)
  const currentUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/profile/${currprofile.profile_url}`
  const [inputErrs, setInputErrs] = useState<{ error: string | null }>({
    error: null,
  })
  const [initialData, setInitialData] = useState<reportData>({
    description: '',
    name: user.full_name,
    email: user?.public_email,
    user_id: user._id,
    type: 'user',
    reported_user_id: currprofile?._id,
    reported_user_name: currprofile?.full_name,
    reported_user_email: currprofile?.public_email,
    for_url: propData?.reported_url ? propData?.reported_url : currentUrl,
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
      type: 'user',
      reported_user_id: currprofile?._id,
      reported_user_name: currprofile?.full_name,
      reported_user_email: currprofile?.public_email,
      for_url: propData?.reported_url ? propData?.reported_url : currentUrl,
    })
  }, [user])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, description: value }))
    setInputErrs({ error: null })

    // const hasChanged = value !== initialData.description
    // setIsChanged(hasChanged)

    // if (onStatusChange) {
    //   onStatusChange(hasChanged)
    // }
  }

  const handleSubmit = async () => {
    console.log('next button clicked', data)
    if (!data.description || data.description?.trim() === '') {
      console.log('its empty')
      if (textAreaRef.current) {
        textAreaRef.current?.focus()
      }
      setInputErrs((prev) => {
        return { ...prev, error: 'This field is required!' }
      })

      setIsError(true)

      return
    }

    setSubmitBtnLoading(true)
    const { err, res } = await ReportUser(data)
    if (res?.data.success) {
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Report sent',
      })
      setData({
        description: '',
        name: '',
        email: '',
        user_id: '',
        type: '',
        reported_user_id: '',
        reported_user_name: '',
        reported_user_email: '',
        for_url: '',
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
      type: 'user',
      reported_user_id: currprofile?._id,
      reported_user_name: currprofile?.full_name,
      reported_user_email: currprofile?.public_email,
      for_url: propData?.reported_url ? propData?.reported_url : currentUrl,
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

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if (
          (event?.srcElement?.tagName &&
            event?.srcElement?.tagName?.toLowerCase() === 'textarea') ||
          event?.srcElement?.tagName?.toLowerCase() === 'svg'
        ) {
          return
        }
        nextButtonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [data?.description])

  useEffect(() => {
    if (textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current?.focus()
      }, 50)
    }
  }, [textAreaRef.current])

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
  const isMob = isMobile()

  return (
    <>
      <div
        className={`${styles['modal-wrapper']} ${
          confirmationModal ? styles['ins-active'] : ''
        } ${isKeyboardOpen ? styles['keyboard-open'] : ``} `}
      >
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Report'}</h4>
          {true && (
            <CloseIcon
              className={styles['modal-close-icon']}
              onClick={() =>
                isChanged ? setConfirmationModal(true) : handleClose()
              }
            />
          )}
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
                className={`${styles['long-input-box']} ${
                  isKeyboardOpen ? styles['short-input-box'] : ``
                }`}
                required
                placeholder="Report the issue to the admin for their action."
                name="message"
                onChange={handleInputChange}
                value={data.description}
                ref={textAreaRef}
                onFocus={() => setIsKeyboardOpen(true)}
                onBlur={() => setIsKeyboardOpen(false)}
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

export default UserReport
