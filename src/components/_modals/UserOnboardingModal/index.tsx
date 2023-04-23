import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal } from '@/redux/slices/modal'
import { updateMyUserDetail } from '@/services/userService'

import ProfileGeneralEditModal from '../EditProfile/General'
import ProfileAboutEditModal from '../EditProfile/About'
import ProfileAddressEditModal from '../EditProfile/Address'
import ProfileHobbyEditModal from '../EditProfile/Hobby'

import styles from './styles.module.css'
import { RootState } from '@/redux/store'

type steps = 'General' | 'About' | 'Address' | 'Hobbies'

export type onboardingDataType = {
  full_name: string
  tagline: string
  display_name: string
  profile_url: string
  gender: 'male' | 'female' | null
  year_of_birth: string
  phone: string
  website: string
  about: string
  street: string
  society: string
  locality: string
  city: string
  pin_code: string
  state: string
  country: string
  latitude: string
  longitude: string
  is_onboarded: boolean
}

export const UserOnboardingModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState<steps>('General')

  const router = useRouter()

  const { userDetail } = useSelector((state: RootState) => state.user)

  const totalSteps: steps[] = ['General', 'About', 'Address', 'Hobbies']

  const handleNext = () => {
    setActiveStep((prevActiveStep: steps) => totalSteps[totalSteps.indexOf(prevActiveStep) + 1])
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep: steps) => totalSteps[totalSteps.indexOf(prevActiveStep) - 1])
  }

  const [data, setData] = useState<onboardingDataType>({
    full_name: '',
    tagline: '',
    display_name: '',
    profile_url: '',
    gender: null,
    year_of_birth: '',
    phone: '',
    website: '',
    about: '',
    street: '',
    society: '',
    locality: '',
    city: '',
    pin_code: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    is_onboarded: false,
  })

  const handleCompleteOnboarding = () => {
    const data = { is_onboarded: true }
    updateMyUserDetail(data, (err, res) => {
      if (err) return console.log(err)
      if (res.data.success) {
        dispatch(closeModal())
        console.log(res.data.data.user.profile_url)
        router.push(`/profile/${res.data.data.user.profile_url}`)
      }
    })
  }

  return (
    <div className={styles['modal-container']}>
      <header className={styles['header']}>
        <h2 className={styles['modal-heading']}>Complete your User Profile</h2>
      </header>

      {activeStep === 'General' && <ProfileGeneralEditModal onComplete={handleNext} />}
      {activeStep === 'About' && (
        <ProfileAboutEditModal onComplete={handleNext} onBackBtnClick={handleBack} />
      )}
      {activeStep === 'Address' && (
        <ProfileAddressEditModal onComplete={handleNext} onBackBtnClick={handleBack} />
      )}
      {activeStep === 'Hobbies' && (
        <ProfileHobbyEditModal onComplete={handleCompleteOnboarding} onBackBtnClick={handleBack} />
      )}

      {/* <Stepper activeStep={totalSteps.indexOf(activeStep)}>
        {totalSteps.map((label, index) => (
          <Step key={label}>
            <StepLabel></StepLabel>
          </Step>
        ))}
      </Stepper> */}
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
