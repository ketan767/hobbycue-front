import React, { useState } from 'react'
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

  const router = useRouter()

  const { listingModalData } = useSelector((state: RootState) => state.site)

  const totalSteps: Step[] = [
    'General',
    'About',
    'Contact',
    'Address',
    'Hobbies',
  ]
  let steps = [...totalSteps]
  if (listingModalData.type === listingTypes.PLACE) {
    steps = [
      'General',
      'About',
      'Contact',
      'Address',
      'WorkingHours',
      'Hobbies',
    ]
  }
  if (listingModalData.type === listingTypes.MakeMyPage) {
    steps = [
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
    steps = ['General', 'About', 'Contact', 'Address', 'EventHours', 'Hobbies']
  }

  const handleNext = () => {
    const newIndex = totalSteps.indexOf(activeStep) + 1
    setActiveStep(totalSteps[newIndex])

    if (newIndex > furthestStepIndex) {
      setFurthestStepIndex(newIndex)
    }
  }
  const handleBack = () => {
    setActiveStep(
      (prevActiveStep: Step) => steps[steps.indexOf(prevActiveStep) - 1],
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

  return (
    <div className={styles['modal-container']}>
      <header className={styles['header']}>
        <h2 className={styles['modal-heading']}>Complete your Listing Page</h2>
      </header>

      {/* <ProgressBar total={steps.length} current={steps.findIndex((str : any) => str === activeStep) + 1} /> */}

      {activeStep === 'General' && (
        <ListingGeneralEditModal
          onComplete={handleNext}
          onBackBtnClick={() => {
            dispatch(openModal({ type: 'listing-type-edit', closable: true }))
            dispatch(updateListingTypeModalMode({ mode: 'create' }))
          }}
        />
      )}

      {activeStep === 'About' && (
        <ListingAboutEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
        />
      )}

      {activeStep === 'Contact' && (
        <ListingContactEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
        />
      )}

      {activeStep === 'Address' && (
        <ListingAddressEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
        />
      )}

      {activeStep === 'WorkingHours' && (
        <ListingWorkingHoursEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
        />
      )}
      {activeStep === 'EventHours' && (
        <ListingEventHoursEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
        />
      )}
      {activeStep === 'Hobbies' && (
        <ListingHobbyEditModal
          onComplete={handleCompleteOnboarding}
          onBackBtnClick={handleBack}
        />
      )}

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
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
