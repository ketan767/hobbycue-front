import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import { updateMyProfileDetail } from '@/services/user.service'

import ProfileGeneralEditModal from '../EditProfile/General'
import ProfileAboutEditModal from '../EditProfile/About'
import ProfileAddressEditModal from '../EditProfile/Address'
import ProfileHobbyEditModal from '../EditProfile/Hobby'
import ProfileContactEditModal from '../EditProfile/ProfileContact'

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

type steps = 'General' | 'About' | 'Contact' | 'Address' | 'Hobbies'

export const UserOnboardingModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState<steps>('General')
  const [furthestStepIndex, setFurthestStepIndex] = useState<number>(0)
  const [confirmationModal, setConfirmationModal] = useState(false)

  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)

  const { user } = useSelector((state: RootState) => state.user)

  const totalSteps: steps[] = [
    'General',
    'About',
    'Contact',
    'Address',
    'Hobbies',
  ]

  const handleNext = () => {
    const newIndex = totalSteps.indexOf(activeStep) + 1
    setActiveStep(totalSteps[newIndex])

    if (newIndex > furthestStepIndex) {
      setFurthestStepIndex(newIndex)
    }
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
      router.push('/community')
      window.location.reload()
      // router.push(`/profile/${res?.data?.data?.user?.profile_url}`)
    }
  }
  function handleClose() {
    if (confirmationModal) {
      setConfirmationModal(false)
    } else {
      dispatch(closeModal())
    }
  }
  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setConfirmationModal(true)
      console.log(confirmationModal)
    }
  }

  // Set up the event listener when the component mounts
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div
      ref={modalRef}
      className={`${styles['modal-container']} ${
        confirmationModal ? styles['ins-active'] : ''
      }`}
    >
      <header className={styles['header']}>
        <h2 className={styles['modal-heading']}>Complete your User Profile</h2>
      </header>

      {activeStep === 'General' && (
        <ProfileGeneralEditModal
          onComplete={handleNext}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}
      {activeStep === 'About' && (
        <ProfileAboutEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}
      {activeStep === 'Contact' && (
        <ProfileContactEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}
      {activeStep === 'Address' && (
        <ProfileAddressEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
        />
      )}
      {activeStep === 'Hobbies' && (
        <ProfileHobbyEditModal
          onComplete={handleCompleteOnboarding}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClosee={handleClose}
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
