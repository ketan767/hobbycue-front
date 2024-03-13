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

const AboutEditor = dynamic(
  () => import('@/components/AboutEditor/AboutEditor'),
  {
    ssr: false,
    loading: () => <h1>Loading...</h1>,
  },
)

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
}

type ProfileAboutData = {
  about: string
  onboarding_step?: string
}

const ProfileAboutEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const [data, setData] = useState<ProfileAboutData>({
    about: '',
    onboarding_step: '2',
  })
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)

  const [inputErrs, setInputErrs] = useState<{ about: string | null }>({
    about: null,
  })
  const [initialData, setInitialData] = useState<ProfileAboutData>({
    about: '',
  })
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    // Set initial data when the component mounts
    setInitialData({ about: user.about })
  }, [user])

  const handleInputChange = (value: string) => {
    setData((prev) => ({ ...prev, about: value }))
    setInputErrs({ about: null })

    const hasChanged = value !== initialData.about
    setIsChanged(hasChanged)

    if (onStatusChange) {
      onStatusChange(hasChanged)
    }
  }

  const Backsave = async () => {
    setBackBtnLoading(true)
    if (
      !data.about ||
      data.about?.trim() === '' ||
      data.about === '<p><br></p>'
    ) {
      if (onBackBtnClick) onBackBtnClick()
      setBackBtnLoading(false)
    } else {
      const newOnboardingStep =
        Number(user?.onboarding_step) > 1 ? user?.onboarding_step : '0'
      const { err, res } = await updateMyProfileDetail({
        ...data,
        onboarding_step: newOnboardingStep,
      })

      if (err) {
        return console.log(err)
      }
      setBackBtnLoading(true)
      const { err: error, res: response } = await getMyProfileDetail()

      if (error) return console.log(error)
      if (response?.data.success) {
        dispatch(updateUser(response.data.data.user))

        if (onBackBtnClick) onBackBtnClick()
        setBackBtnLoading(false)
      }
    }
  }

  const cleanString = (string: string) => {
    return string
      .replaceAll('<br>', '')
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .trim()
  }

  const handleSubmit = async () => {
    if (!data.about || cleanString(data.about) === '') {
      if (data.about !== user.about) {
        const newData = { about: cleanString(data.about) }
        setSubmitBtnLoading(true)
        const newOnboardingStep =
          Number(user?.onboarding_step) > 1 ? user?.onboarding_step : '0'
        const { err, res } = await updateMyProfileDetail({
          ...newData,
          onboarding_step: newOnboardingStep,
        })
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
            return
          }
        }
      } else if (user.isOnboarded) dispatch(closeModal())
      else if (onComplete) onComplete()
    } else {
      const newData = { about: data.about.trim() }
      setSubmitBtnLoading(true)
      const newOnboardingStep =
        Number(user?.onboarding_step) > 1 ? user?.onboarding_step : '0'
      const { err, res } = await updateMyProfileDetail({
        ...newData,
        onboarding_step: newOnboardingStep,
      })
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
  }
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      about: user.about,
    }))
  }, [user])

  const HandleSaveError = async () => {
    if (
      !data.about ||
      data.about?.trim() === '' ||
      data.about === '<p><br></p>'
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
        if (event?.srcElement?.className?.includes('ql-editor')) {
          return
        } else {
          nextButtonRef.current?.click()
        }
        console.log({ event })
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
          <h4 className={styles['heading']}>{'About'}</h4>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            {/* <label>About</label> */}
            <input hidden required />
            {/* <CustomCKEditor value={data.about} onChange={handleInputChange} placeholder='Briefly describe about yourself' /> */}
            <AboutEditor
              value={data.about}
              onChange={handleInputChange}
              error={inputErrs.about ? true : false}
              placeholder="Briefly describe about yourself"
            />
            {inputErrs.about && (
              <p className={styles['error-msg']}>{inputErrs.about}</p>
            )}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel" onClick={Backsave}>
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={Backsave}>
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
              'Next'
            ) : (
              'Save'
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
              Save
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ProfileAboutEditModal

/**
 * @TODO:
 * 1. Loading component untill the CK Editor loads.
 * 2. Underline option in the editor
 */
