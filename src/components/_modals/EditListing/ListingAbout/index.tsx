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
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})
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
  onBoarding?: boolean
  propData?: any
}

type ListingAboutData = {
  description: InputData<string>
  about?: InputData<string>
}

const ListingAboutEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  onBoarding,
  propData,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  console.warn('propsdata', propData)
  const [data, setData] = useState<ListingAboutData>({
    description: { value: '', error: null },
    about: { value: '', error: null },
  })
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [initialData, setInitialData] = useState('')
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    const initialValue =
      (propData === 'productDescription'
        ? listingModalData?.about
        : listingModalData?.description) || ''

    setInitialData(initialValue)
    setData((prev) => ({
      ...prev,
      [propData === 'productDescription' ? 'about' : 'description']: {
        value: initialValue,
        error: null,
      },
    }))
  }, [listingModalData.description, listingModalData.about, propData])

  const handleInputChange = (value: string) => {
    console.warn('handleinputtt', value)
    setData((prev) => ({
      ...prev,
      [propData === 'productDescription' ? 'about' : 'description']: {
        value,
        error: null,
      },
    }))
    setIsChanged(value !== initialData)
    if (onStatusChange) {
      onStatusChange(value !== initialData)
    }
  }

  const handleBack = async () => {
    const key = propData === 'productDescription' ? 'about' : 'description'
    const fieldValue = data[key]?.value

    if (!fieldValue || fieldValue === '' || fieldValue === '<p><br></p>') {
      if (onBackBtnClick) onBackBtnClick()
      return
    }

    setBackBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      [key]: fieldValue,
    })
    setBackBtnLoading(false)
    if (err) {
      console.log(err)
      return
    }
    if (res?.data.success) {
      dispatch(updateListingModalData(res.data.data.listing))
      if (onBackBtnClick) onBackBtnClick()
    }
  }

  const cleanString = (string: string) => {
    return string
      .replaceAll('<br>', '')
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .trim()
  }
  useEffect(() => {
    console.warn({ listingModalData }, { data })
  }, [data, listingModalData])

  const handleSubmit = async () => {
    const key = propData === 'productDescription' ? 'about' : 'description'
    const fieldValue = data?.[key]?.value || ''

    if (!fieldValue || fieldValue === '') {
      if (fieldValue !== listingModalData[key]) {
        setSubmitBtnLoading(true)
        const { err, res } = await updateListing(listingModalData._id, {
          [key]: fieldValue,
        })
        setSubmitBtnLoading(false)
        if (err) return console.log(err)
        if (res?.data.success) {
          dispatch(updateListingModalData(res.data.data.listing))
          if (onComplete) onComplete()
          else {
            window.location.reload()
            dispatch(closeModal())
          }
        }
      } else if (listingModalData.is_onboarded) dispatch(closeModal())
      else if (onComplete) onComplete()
    } else {
      setSubmitBtnLoading(true)
      const { err, res } = await updateListing(listingModalData._id, {
        [key]: fieldValue.trim(),
      })
      setSubmitBtnLoading(false)
      if (err) return console.log(err)
      if (res?.data.success) {
        dispatch(updateListingModalData(res.data.data.listing))
        if (onComplete) onComplete()
        else {
          window.location.reload()
          dispatch(closeModal())
        }
      }
    }
  }

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if (event?.srcElement?.tagName === 'svg') {
          return
        } else if (
          typeof event?.srcElement?.className?.includes === 'function' &&
          event?.srcElement?.className?.includes('ql-editor')
        ) {
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

  useEffect(() => {
    const key: 'about' | 'description' =
      propData === 'productDescription' ? 'about' : 'description'

    setData((prev) => {
      return {
        ...prev,
        [key]: {
          ...prev[key],
          value: listingModalData?.[key] || '',
        },
      }
    })
  }, [user, propData, listingModalData])

  useEffect(() => {
    if (isEmpty(data.description.value)) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])
  const HandleSaveError = async () => {
    const key: 'about' | 'description' =
      propData === 'productDescription' ? 'about' : 'description'

    if (
      !data[key]?.value ||
      data[key]?.value === '' ||
      data[key]?.value === '<p><br></p>'
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
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isError])
  console.log(isChanged)

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
        OnBoarding={onBoarding}
      />
    )
  }

  return (
    <>
      <div
        className={`${styles['modal-wrapper']} ${
          propData === 'productDescription' && styles['product-model-wrapper']
        }`}
      >
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={() =>
            isChanged ? setConfirmationModal(true) : handleClose()
          }
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>
            {propData === 'productDescription' ? 'Description' : 'About'}
          </h4>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            {/* <label>About</label> */}
            <input hidden required />
            {/* <CustomCKEditor value={data.description.value as string} onChange={handleInputChange} placeholder='Briefly describe your listing page' /> */}
            <AboutEditor
              value={
                propData === 'productDescription'
                  ? (data?.about?.value as string)
                  : (data?.description?.value as string)
              }
              onChange={handleInputChange}
              placeholder="Briefly describe your listing page"
              error={
                propData === 'productDescription'
                  ? data?.about?.error
                    ? true
                    : false
                  : data.description.error
                  ? true
                  : false
              }
            />
            {data.description.error ||
              (data?.about?.error && (
                <p className={styles['error-msg']}>
                  {data.description.error || data?.about?.error}
                </p>
              ))}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel" onClick={handleBack}>
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={handleBack}>
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
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Save'
              )}
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ListingAboutEditModal
