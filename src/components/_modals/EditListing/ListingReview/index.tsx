import React, { useState, useEffect, useRef } from 'react'
import { CircularProgress } from '@mui/material'
import styles from './styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { addListingReview } from '@/services/listing.service'
import { closeModal } from '@/redux/slices/modal'
import { useRouter } from 'next/router'
import { pageType } from '@/utils'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
}

type reviewData = {
  user_id: any
  description: string
}

const ListingReview: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const [data, setData] = useState<reviewData>({
    user_id: user._id,
    description: '',
  })
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)
  const listingPageData = useSelector(
    (state: RootState) => state.site.listingPageData,
  )
  const currentUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/${pageType(
    listingPageData?.type,
  )}/${listingPageData.page_url}`
  const [inputErrs, setInputErrs] = useState<{ error: string | null }>({
    error: null,
  })
  const [isChanged, setIsChanged] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const router = useRouter()
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, description: value }))
    setInputErrs({ error: null })
  }

  const handleSubmit = async () => {
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
    let jsonData = { user_id: data.user_id, text: data.description }
    const { err, res } = await addListingReview(listingPageData._id, jsonData)
    if (res?.data.success) {
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Review Sent',
      })
      setData({
        user_id: user._id,
        description: '',
      })
      setSubmitBtnLoading(false)
      setTimeout(() => {
        router.reload()
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
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    }
  }, [textareaRef.current])

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
        } `}
      >
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Review'}</h4>
          <CloseIcon
            className={styles['modal-close-icon']}
            onClick={() =>
              isChanged ? setConfirmationModal(true) : handleClose()
            }
          />
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
                placeholder="Write your review.  It will be sent to the page admin for their approval to publish."
                name="message"
                onChange={handleInputChange}
                value={data.description}
                // onFocus={() => setIsKeyboardOpen(true)}
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
              'Send'
            ) : (
              'Send'
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
                'Send'
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

export default ListingReview
