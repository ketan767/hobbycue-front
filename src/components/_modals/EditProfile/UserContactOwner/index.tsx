import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import {
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
import { sendMailtoOwner } from '@/services/auth.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
}

type ContactOwnerData = {
  message: string
  sub: string
  name: string
  senderName: string
  to: string
}

const UserContactToOwner: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const currprofile = useSelector((state: RootState) => state.user.profileData)
  console.log('active profile', currprofile)

  const [data, setData] = useState<ContactOwnerData>({
    message: '',
    sub: '',
    name: currprofile.full_name,
    senderName: user.full_name,
    to: currprofile?.public_email,
  })
  const subref = useRef<HTMLInputElement>(null)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)

  const [inputErrs, setInputErrs] = useState<{ [key: string]: string | null }>({
    message: null,
    sub: null,
    name: null,
    senderName: null,
    to: null,
  })
  const [initialData, setInitialData] = useState<ContactOwnerData>({
    message: '',
    sub: '',
    name: currprofile.full_name,
    senderName: user.full_name,
    to: currprofile?.public_email,
  })
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    setInitialData({
      message: '',
      sub: '',
      name: '',
      senderName: '',
      to: '',
    })
  }, [user])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, sub: value }))
    setInputErrs({ error: null })

    const hasChanged = value !== initialData.sub
    setIsChanged(hasChanged)

    if (onStatusChange) {
      onStatusChange(hasChanged)
    }
  }

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, message: value }))
    setInputErrs({ error: null })

    const hasChanged = value !== initialData.message
    setIsChanged(hasChanged)

    if (onStatusChange) {
      onStatusChange(hasChanged)
    }
  }

  const handleSubmit = async () => {
    console.log('ContactOwner', data)
    if (!data.message || data.message === '') {
      setInputErrs((prev) => {
        return { ...prev, error: 'This field is required!' }
      })
      setIsError(true)
      return
    }

    setSubmitBtnLoading(true)

    const { err, res } = await sendMailtoOwner(data)
    if (res?.data.success) {
      dispatch(closeModal())
    }
  }

  const HandleSaveError = async () => {
    if (
      !data.message ||
      data.message?.trim() === '' ||
      data.message === '<p><br></p>'
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
    subref?.current?.focus()
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

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
          <h4 className={styles['heading']}>{'Message'}</h4>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          {/* Subject */}
          <div
            className={`${styles['input-box']} ${
              inputErrs.sub ? styles['input-box-error'] : ''
            }`}
          >
            <label className={styles['label-required']}>Subject</label>
            <input
              type="text"
              placeholder="Subject"
              autoComplete="name"
              required
              value={data.sub}
              name="full_name"
              onChange={handleInputChange}
              ref={subref}
            />
            <p className={styles['helper-text']}>{inputErrs.full_name}</p>
          </div>
          <div className={styles['input-box']}>
            <div className={styles['street-input-container']}>
              <textarea
                className={styles['long-input-box']}
                required
                placeholder="Write your message here"
                name="message"
                onChange={handleTextAreaChange}
                value={data.message}
              />
            </div>
            {inputErrs.error && (
              <p className={styles['error-msg']}>{inputErrs.error}</p>
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
              Submit
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default UserContactToOwner
