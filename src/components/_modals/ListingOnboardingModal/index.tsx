import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import Image from 'next/image'
import styles from './styles.module.css'
import ListingGeneralEditModal from '../EditListing/ListingGeneral'
import ListingAboutEditModal from '../EditListing/ListingAbout'
import ListingAddressEditModal from '../EditListing/ListingAddress'
import ListingContactEditModal from '../EditListing/ListingContact'
import ListingHobbyEditModal from '../EditListing/ListingHobby'
import hobbycueLogo from '../../../assets/svg/Search/hobbycue.svg'
import { getListingPages, updateListing } from '@/services/listing.service'
import ListingWorkingHoursEditModal from '../EditListing/ListingWorkingHours'
import ListingEventHoursEditModal from '../EditListing/ListingEventHours'
import { updateListingTypeModalMode } from '@/redux/slices/site'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'
import { listingTypes } from '@/constants/constant'
import { updateUserListing } from '@/redux/slices/user'
import ListingCopyModal from '../EditListing/ListingCopyModal'
import SaveModal from '../SaveModal/saveModal'
import { pageType } from '@/utils'

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

export const ListingOnboardingModal: React.FC<PropTypes> = ({
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  showAddHobbyModal,
  showAddGenreModal,
  setShowAddGenreModal,
  setShowAddHobbyModal,
}) => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState<Step>('General')
  const [furthestStepIndex, setFurthestStepIndex] = useState<number>(0)

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

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep: Step) =>
        totalSteps[totalSteps.indexOf(prevActiveStep) - 1],
    )
  }

  const handleCompleteOnboarding = async () => {
    const { err, res } = await updateListing(listingModalData._id, {
      is_onboarded: true,
      is_claimed: true,
    })
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(closeModal())
      console.log(res)

      window.location.href = `/${pageType(res.data.data.listing?.type)}/${
        res.data.data.listing.page_url
      }`
    }
  }
  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setConfirmationModal(true)
      // console.log(confirmationModal)
    }
  }

  return (
    <div
      ref={modalRef}
      className={`
    ${confirmationModal ? styles['ins-active'] : ''}
    ${showAddHobbyModal ? styles['hobby-active'] : ''}
    ${showAddGenreModal ? styles['genre-active'] : ''}
    ${
      !confirmationModal && !showAddHobbyModal && !showAddGenreModal
        ? styles['modal-container']
        : ''
    }
  `}
    >
      {!confirmationModal && !showAddHobbyModal && !showAddGenreModal && (
        <>
          <header className={styles['header']}>
            <Image
              className={styles['responsive-logo']}
              src={hobbycueLogo}
              alt="hobbycue"
            />
            <h2 className={styles['modal-heading']}>
              Complete your Listing Page
            </h2>
          </header>
        </>
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
          onBoarding={true}
        />
      )}

      {activeStep === 'About' && (
        <ListingAboutEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onBoarding={true}
        />
      )}

      {activeStep === 'Contact' && (
        <ListingContactEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onBoarding={true}
        />
      )}

      {activeStep === 'Address' && (
        <ListingAddressEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onBoarding={true}
        />
      )}

      {activeStep === 'WorkingHours' && (
        <ListingWorkingHoursEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onBoarding={true}
        />
      )}
      {activeStep === 'EventHours' && (
        <ListingEventHoursEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onBoarding={true}
        />
      )}
      {activeStep === 'Hobbies' && (
        <ListingHobbyEditModal
          onComplete={handleCompleteOnboarding}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onBoarding={true}
          showAddHobbyModal={showAddHobbyModal}
          showAddGenreModal={showAddGenreModal}
          setShowAddGenreModal={setShowAddGenreModal}
          setShowAddHobbyModal={setShowAddHobbyModal}
        />
      )}

      {!confirmationModal && !showAddHobbyModal && !showAddGenreModal && (
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
                tabIndex={isClickable ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation()
                    if (isClickable) {
                      setActiveStep(step)
                    }
                  }
                }}
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
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  showAddHobbyModal: any
  showAddGenreModal: any
  setShowAddGenreModal: any
  setShowAddHobbyModal: any

  onStatusChange?: (isChanged: boolean) => void
}
