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
import Image from 'next/image'
import checkedboxChecked from '@/assets/svg/checkbox-checked.svg'
import checkedboxUnChecked from '@/assets/svg/Checkbox-unchecked.svg'
import chechboxDisabled from '@/assets/svg/checkbox-disabled.svg'
import { updateUser } from '@/redux/slices/user'
import { closeModal, openModal } from '@/redux/slices/modal'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'

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
  handleClose?: any
}

type ListingAboutData = {
  description: InputData<string>
}

const ListingAboutEditModal: React.FC<Props> = ({
  handleClose,
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [checkboxes, setCheckboxes] = useState({
    allSections: false,
    profileCoverPhoto: false,
    about: false,
    contactInfo: false,
    location: false,
    hobbies: false,
  })

  const [data, setData] = useState<ListingAboutData>({
    description: { value: '', error: null },
  })
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleInputChange = (value: string) => {
    setData((prev) => {
      return { ...prev, description: { value, error: null } }
    })
  }
  const handleCheckboxToggle = (name: keyof typeof checkboxes) => {
    // if (name === 'allSections') {
    //   const newValue = !checkboxes.allSections
    //   setCheckboxes({
    //     allSections: newValue,
    //     profileCoverPhoto: newValue,
    //     about: newValue,
    //     contactInfo: newValue,
    //     location: newValue,
    //     hobbies: newValue,
    //   })
    // } else {
    //   setCheckboxes((prev) => {
    //     const allSectionsValue = prev[name] ? false : prev.allSections
    //     return { ...prev, [name]: !prev[name], allSections: allSectionsValue }
    //   })
    // }
  }

  const handleBack = async () => {
    if (
      !data.description.value ||
      data.description.value === '' ||
      data.description.value === '<p><br></p>'
    ) {
      if (onBackBtnClick) onBackBtnClick()
      return
    }

    setBackBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      description: data.description.value,
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

  const handleSubmit = async () => {
    dispatch(openModal({ type: 'listing-type-edit', closable: false }))
  }

  useEffect(() => {
    setData((prev) => {
      return {
        description: {
          ...prev.description,
          value: listingModalData.description as string,
        },
      }
    })
  }, [user])
  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if(event?.srcElement?.tagName === "svg"){
          return;
        }
        nextButtonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    if (isEmpty(data.description.value)) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        /> */}
        <section className={styles['header']}>
          <h1>Make My Page</h1>
        </section>
        <label className={styles['heading']}>
          This would create a new Listing page based on your profile
        </label>
        <section className={styles['body']}>
          <h2>What section you would like to copy</h2>

          <hr className={styles['hr-line']} />
          <div
            className={`${styles['checkbox-row']} ${styles['all-available']}`}
          >
            <label>All available Sections</label>

            <Image
              src={
                // checkboxes.allSections ? checkedboxChecked : checkedboxUnChecked
                chechboxDisabled
              }
              width={16}
              height={16}
              alt="radio"
              className={styles.addIcon}
              onClick={() => handleCheckboxToggle('allSections')}
            />
          </div>
          <hr className={styles['hr-line']} />
          <div className={styles['checkbox-row']}>
            <label>Profile and cover photo</label>

            <Image
              src={
                // checkboxes.profileCoverPhoto
                //   ? checkedboxChecked
                //   : checkedboxUnChecked
                chechboxDisabled
              }
              width={16}
              height={16}
              alt="radio"
              className={styles.addIcon}
              onClick={() => handleCheckboxToggle('profileCoverPhoto')}
            />
          </div>
          <hr className={styles['hr-line']} />
          <div className={styles['checkbox-row']}>
            <label>About</label>

            <Image
              src={
                // checkboxes.about ? checkedboxChecked : checkedboxUnChecked
                chechboxDisabled
              }
              width={16}
              height={16}
              alt="radio"
              className={styles.addIcon}
              onClick={() => handleCheckboxToggle('about')}
            />
          </div>
          <hr className={styles['hr-line']} />
          <div className={styles['checkbox-row']}>
            <label>Contact information</label>

            <Image
              src={
                // checkboxes.contactInfo ? checkedboxChecked : checkedboxUnChecked
                chechboxDisabled
              }
              width={16}
              height={16}
              alt="checkbox"
              className={styles.addIcon}
              onClick={() => handleCheckboxToggle('contactInfo')}
            />
          </div>
          <hr className={styles['hr-line']} />
          <div className={styles['checkbox-row']}>
            <label>Location</label>

            <Image
              src={
                // checkboxes.location ? checkedboxChecked : checkedboxUnChecked
                chechboxDisabled
              }
              width={16}
              height={16}
              alt="radio"
              className={styles.addIcon}
              onClick={() => handleCheckboxToggle('location')}
            />
          </div>
          <hr className={styles['hr-line']} />
          <div className={styles['checkbox-row']}>
            <label>Hobbies </label>

            <Image
              src={
                // checkboxes.hobbies ? checkedboxChecked : checkedboxUnChecked
                chechboxDisabled
              }
              width={16}
              height={16}
              alt="radio"
              className={styles.addIcon}
              onClick={() => handleCheckboxToggle('hobbies')}
            />
          </div>

          <hr className={styles['hr-line']} />

          <div className={styles['checkbox-row']}>
            <label>Social Media </label>

            <Image
              src={
                // checkboxes.hobbies ? checkedboxChecked : checkedboxUnChecked
                chechboxDisabled
              }
              width={16}
              height={16}
              alt="radio"
              className={styles.addIcon}
              onClick={() => handleCheckboxToggle('hobbies')}
            />
          </div>

          <hr className={styles['hr-line-temp']} />
          <p className={styles.tempmsg}>
            The copy feature is under development, but you can create a listing
            Page by entering information
          </p>
        </section>

        <footer className={styles['footer']}>
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
              'Next'
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
