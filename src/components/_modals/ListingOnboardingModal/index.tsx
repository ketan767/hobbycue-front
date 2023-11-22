import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './styles.module.css'
import ListingGeneralEditModal from '../EditListing/ListingGeneral'
import ListingAboutEditModal from '../EditListing/ListingAbout'
import ListingAddressEditModal from '../EditListing/ListingAddress'
import ListingContactEditModal from '../EditListing/ListingContact'
import ListingHobbyEditModal from '../EditListing/ListingHobby'
import { getListingPages, updateListing } from '@/services/listing.service'
import ListingWorkingHoursEditModal from '../EditListing/ListingWorkingHours'
import ListingEventHoursEditModal from '../EditListing/ListingEventHours'
import { updateListingTypeModalMode } from '@/redux/slices/site'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'
import { listingTypes } from '@/constants/constant'
import { updateUserListing } from '@/redux/slices/user'
import ListingCopyModal from '../EditListing/ListingCopyModal'
import SaveModal from '../SaveModal/saveModal'

// type OnboardingData = {
//   full_name: string
//   tagline: string
//   display_name: string
//   profile_url: string
//   gender: 'male' | 'female' | null
//   year_of_birth: string
//   phone: string
//   website: string
//   about: string
//   street: string
//   society: string
//   locality: string
//   city: string
//   pin_code: string
//   state: string
//   country: string
//   latitude: string
//   longitude: string
//   is_onboarded: boolean
// }

type Step =
  | 'General'
  | 'About'
  | 'Contact'
  | 'Address'
  | 'Hobbies'
  | 'WorkingHours'
  | 'EventHours'
  | 'CopyProfileDataModal'

export const ListingOnboardingModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState<Step>('General')
  const [furthestStepIndex, setFurthestStepIndex] = useState<number>(0)
  const [confirmationModal, setConfirmationModal] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const { listingModalData } = useSelector((state: RootState) => state.site)

  let totalSteps: Step[] = ['General', 'About', 'Contact', 'Address', 'Hobbies']

  if (listingModalData.type === listingTypes.PLACE) {
    totalSteps = [
      'General',
      'About',
      'Contact',
      'Address',
      'WorkingHours',
      'Hobbies',
    ]
  }
  if (listingModalData.type === listingTypes.MakeMyPage) {
    totalSteps = [
      'CopyProfileDataModal',
      'General',
      'About',
      'Contact',
      'Address',
      'WorkingHours',
      'Hobbies',
    ]
  }
  if (listingModalData.type === listingTypes.PROGRAM) {
    totalSteps = [
      'General',
      'About',
      'Contact',
      'Address',
      'EventHours',
      'Hobbies',
    ]
  }

  const handleNext = () => {
    const newIndex = totalSteps.indexOf(activeStep) + 1
    setActiveStep(totalSteps[newIndex])
    console.log('listingModalData', listingModalData)

    if (newIndex > furthestStepIndex) {
      setFurthestStepIndex(newIndex)
    }
  }
  function handleClose() {
    if (confirmationModal) {
      setConfirmationModal(false)
    } else {
      setConfirmationModal(true)
    }
  }
  const handleBack = () => {
    setActiveStep(
      (prevActiveStep: Step) =>
        totalSteps[totalSteps.indexOf(prevActiveStep) - 1],
    )
  }

  const handleCompleteOnboarding = async () => {
    const { err, res } = await updateListing(listingModalData._id, {
      is_onboarded: true,
    })
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(closeModal())
      console.log(res)

      window.location.href = `/page/${res.data.data.listing.page_url}`
    }
  }
  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setConfirmationModal(true)
      console.log(confirmationModal)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape') {
        setConfirmationModal((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [confirmationModal])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  if (confirmationModal) {
    return <SaveModal OnBoarding={true} />
  }

  return (
    <div
      ref={modalRef}
      className={`${confirmationModal ? '' : styles['modal-container']} ${
        confirmationModal ? styles['ins-active'] : ''
      }`}
    >
      {!confirmationModal && (
        <header className={styles['header']}>
          <h2 className={styles['modal-heading']}>
            Complete your Listing Page
          </h2>
        </header>
      )}

      {/* <ProgressBar total={totalSteps.length} current={totalSteps.findIndex((str : any) => str === activeStep) + 1} /> */}

      {activeStep === 'General' && (
        <ListingGeneralEditModal
          onComplete={handleNext}
          onBackBtnClick={() => {
            dispatch(openModal({ type: 'listing-type-edit', closable: true }))
            dispatch(updateListingTypeModalMode({ mode: 'create' }))
          }}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}

      {activeStep === 'About' && (
        <ListingAboutEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}

      {activeStep === 'Contact' && (
        <ListingContactEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}

      {activeStep === 'Address' && (
        <ListingAddressEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}

      {activeStep === 'WorkingHours' && (
        <ListingWorkingHoursEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}
      {activeStep === 'EventHours' && (
        <ListingEventHoursEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}
      {activeStep === 'Hobbies' && (
        <ListingHobbyEditModal
          onComplete={handleCompleteOnboarding}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}

      {!confirmationModal && (
        <section className={styles['step-indicators']}>
          {totalSteps.map((step, index) => {
            const isClickable = index <= furthestStepIndex

            return (
              <span
                key={step}
                className={`${styles['step']} ${
                  isClickable ? styles['active'] : ''
                }`}
                onClick={isClickable ? () => setActiveStep(step) : undefined}
              ></span>
            )
          })}
        </section>
      )}
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
