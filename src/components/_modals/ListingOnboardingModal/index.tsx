import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import { updateMyProfileDetail } from '@/services/user.service'

import ProfileGeneralEditModal from '../EditProfile/General'
import ProfileAboutEditModal from '../EditProfile/About'
import ProfileAddressEditModal from '../EditProfile/Address'
import ProfileHobbyEditModal from '../EditProfile/Hobby'

import styles from './styles.module.css'
import ListingGeneralEditModal from '../EditListing/ListingGeneral'
import ListingAboutEditModal from '../EditListing/ListingAbout'
import ListingAddressEditModal from '../EditListing/ListingAddress'
import ListingContactEditModal from '../EditListing/ListingContact'
import ListingHobbyEditModal from '../EditListing/ListingHobby'
import { updateListing } from '@/services/listing.service'
import ListingWorkingHoursEditModal from '../EditListing/ListingWorkingHours'
import ListingEventHoursEditModal from '../EditListing/ListingEventHours'
import { updateListingTypeModalMode } from '@/redux/slices/site'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'

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

export const ListingOnboardingModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState<Step>('General')

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
  if (listingModalData.type === 2) {
    steps = [
      'General',
      'About',
      'Contact',
      'Address',
      'WorkingHours',
      'Hobbies',
    ]
  }
  if (listingModalData.type === 4) {
    steps = ['General', 'About', 'Contact', 'Address', 'EventHours', 'Hobbies']
  }

  const handleNext = () => {
    setActiveStep(
      (prevActiveStep: Step) => steps[steps.indexOf(prevActiveStep) + 1],
    )
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
      router.push(`/page/${res.data.data.listing.page_url}`)
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
        {steps.map((step) => {
          return (
            <span
              key={step}
              className={`${styles['step']} ${
                steps.indexOf(step) <= steps.indexOf(activeStep)
                  ? styles['active']
                  : ''
              }`}
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
