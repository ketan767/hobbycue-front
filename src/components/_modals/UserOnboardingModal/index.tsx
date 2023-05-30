import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import { updateMyProfileDetail } from '@/services/user.service'

import ProfileGeneralEditModal from '../EditProfile/General'
import ProfileAboutEditModal from '../EditProfile/About'
import ProfileAddressEditModal from '../EditProfile/Address'
import ProfileHobbyEditModal from '../EditProfile/Hobby'

import styles from './styles.module.css'

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

type steps = 'General' | 'About' | 'Address' | 'Hobbies'

export const UserOnboardingModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState<steps>('General')

  const router = useRouter()

  const { user } = useSelector((state: RootState) => state.user)

  const totalSteps: steps[] = ['General', 'About', 'Address', 'Hobbies']

  const handleNext = () => {
    setActiveStep(
      (prevActiveStep: steps) =>
        totalSteps[totalSteps.indexOf(prevActiveStep) + 1],
    )
  }
  const handleBack = () => {
    setActiveStep(
      (prevActiveStep: steps) =>
        totalSteps[totalSteps.indexOf(prevActiveStep) - 1],
    )
  }

  const handleCompleteOnboarding = async () => {
    const data = { is_onboarded: true }
    const { err, res } = await updateMyProfileDetail(data)
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(closeModal())
      router.push(`/profile/${res?.data?.data?.user?.profile_url}`)
    }
  }

  return (
    <div className={styles['modal-container']}>
      <header className={styles['header']}>
        <h2 className={styles['modal-heading']}>Complete your User Profile</h2>
      </header>

      {activeStep === 'General' && (
        <ProfileGeneralEditModal onComplete={handleNext} />
      )}
      {activeStep === 'About' && (
        <ProfileAboutEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
        />
      )}
      {activeStep === 'Address' && (
        <ProfileAddressEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
        />
      )}
      {activeStep === 'Hobbies' && (
        <ProfileHobbyEditModal
          onComplete={handleCompleteOnboarding}
          onBackBtnClick={handleBack}
        />
      )}

      <section className={styles['step-indicators']}>
        {totalSteps.map((step) => {
          return (
            <span
              key={step}
              className={`${styles['step']} ${
                totalSteps.indexOf(step) <= totalSteps.indexOf(activeStep)
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
