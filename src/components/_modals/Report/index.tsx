import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import {
  getMyProfileDetail,
  report,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './styles.module.css'
import { isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import SaveModal from '../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'

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
}

const ReportModal: React.FC<Props> = ({
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
  })
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)

  const [inputErrs, setInputErrs] = useState<{ error: string | null }>({
    error: null,
  })
  const [initialData, setInitialData] = useState<reportData>({
    description: '',
    name: user.full_name,
    email: user.public_email,
    user_id: user._id,
    type: 'user',
  })
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    setInitialData({
      description: user.description,
      name: user.full_name,
      email: user.public_email,
      user_id: user._id,
      type: 'user',
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
    if (!data.description || data.description === '') {
      setInputErrs((prev) => {
        return { ...prev, error: 'This field is required!' }
      })
      setIsError(true)
      return
    }

    setSubmitBtnLoading(true)
    const { err, res } = await report(data)

    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }

    const { err: error, res: response } = await getMyProfileDetail()
    setSubmitBtnLoading(false)

    if (error) return console.log(error)
    if (response?.data.success) {
      dispatch(updateUser(response.data.data.user))
      if (onComplete) onComplete()
      else {
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }

  useEffect(() => {
    setData({
      description: '',
      name: user.full_name,
      email: user.public_email,
      user_id: user._id,
      type: 'user',
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
          <h4 className={styles['heading']}>{'Report'}</h4>
        </header>
        <hr />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            <div className={styles['street-input-container']}>
              <textarea
                className={styles['long-input-box']}
                required
                placeholder="Write your description here"
                name="message"
                onChange={handleInputChange}
                value={data.description}
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

export default ReportModal
