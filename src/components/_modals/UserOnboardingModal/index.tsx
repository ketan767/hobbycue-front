import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { closeModal, openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import {
  updateMyProfileDetail,
  getMyProfileDetail,
} from '@/services/user.service'
import CloseIcon from '@/assets/icons/CloseIcon'
import ProfileGeneralEditModal from '../EditProfile/General'
import ProfileAboutEditModal from '../EditProfile/About'
import ProfileAddressEditModal from '../EditProfile/Address'
import ProfileHobbyEditModal from '../EditProfile/Hobby'
import ProfileContactEditModal from '../EditProfile/ProfileContact'
import SaveModal from '../SaveModal/saveModal'
import hobbycueLogo from '../../../assets/svg/Search/hobbycue.svg'
import Image from 'next/image'
import styles from './styles.module.css'
import { updateUser } from '@/redux/slices/user'
import { sendWelcomeMail } from '@/services/auth.service'

type steps = 'General' | 'About' | 'Contact' | 'Address' | 'Hobbies'
const totalSteps: steps[] = [
  'General',
  'About',
  'Contact',
  'Address',
  'Hobbies',
]

export const UserOnboardingModal: React.FC<PropTypes> = (props) => {
  const dispatch = useDispatch()
  const [activeStep, setActiveStep] = useState<steps>('General')
  const [furthestStepIndex, setFurthestStepIndex] = useState<number>(0)
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)
  const { activeModal, closable } = useSelector(
    (state: RootState) => state.modal,
  )

  const { user } = useSelector((state: RootState) => state.user)

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
    const payload: InviteToCommunityPayload = {
      to: user?.public_email,
      name: user.full_name,
    }
    await sendWelcomeMail(payload)
    const data = { is_onboarded: true }
    const { err, res } = await updateMyProfileDetail(data)
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(updateUser(res.data.data.user))
      dispatch(closeModal())

      window.location.href = `/profile/${user.profile_url}`
    }
  }
  function handleClose() {
    if (confirmationModal) {
      setConfirmationModal(false)
    } else if (hasChanges) {
      setConfirmationModal(true)
    } else if (!user.is_onboarded) {
      setConfirmationModal(true)
    } else {
      dispatch(closeModal())
    }
  }
  const handleStatusChange = (isChanged: boolean) => {
    setHasChanges(isChanged)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed')
        setConfirmationModal((prevState) => !prevState)
      }
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setConfirmationModal(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    const updateStepsFunc = async () => {
      const { err: error, res: response } = await getMyProfileDetail()
      if (error) {
        return console.log(error)
      }
      if (response?.data.success) {
        setActiveStep(
          totalSteps[Number(response.data.data.user?.onboarding_step)],
        )
        setFurthestStepIndex(Number(response.data.data.user?.onboarding_step))
      }
    }
    updateStepsFunc()
  }, [])

  return (
    <div
      ref={modalRef}
      className={`${confirmationModal ? '' : styles['modal-container']} ${
        confirmationModal ? styles['ins-active'] : ''
      }`}
    >
      {!confirmationModal && (
        <header className={styles['header']}>
          <Image
            className={styles['responsive-logo']}
            src={hobbycueLogo}
            alt="hobbycue"
          />
          <h2 className={styles['modal-heading']}>
            Complete your User Profile
          </h2>
        </header>
      )}

      {activeStep === 'General' && (
        <ProfileGeneralEditModal
          onComplete={handleNext}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onStatusChange={handleStatusChange}
        />
      )}
      {activeStep === 'About' && (
        <ProfileAboutEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onStatusChange={handleStatusChange}
          showSkip
        />
      )}
      {activeStep === 'Contact' && (
        <ProfileContactEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onStatusChange={handleStatusChange}
          showSkip
        />
      )}
      {activeStep === 'Address' && (
        <ProfileAddressEditModal
          onComplete={handleNext}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onStatusChange={handleStatusChange}
        />
      )}
      {activeStep === 'Hobbies' && (
        <ProfileHobbyEditModal
          onComplete={handleCompleteOnboarding}
          onBackBtnClick={handleBack}
          setConfirmationModal={setConfirmationModal}
          confirmationModal={confirmationModal}
          handleClose={handleClose}
          onStatusChange={handleStatusChange}
        />
      )}

      {!confirmationModal && (
        <section className={styles['step-indicators']}>
          {totalSteps.map((step, index) => {
            const isClickable = index <= furthestStepIndex

            return (
              <span
                tabIndex={isClickable ? 0 : -1}
                key={step}
                className={`${styles['step']} ${
                  isClickable ? styles['active'] : ''
                }`}
                onClick={
                  isClickable
                    ? () => setActiveStep(totalSteps[index])
                    : undefined
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation()
                    if (isClickable) {
                      setActiveStep(totalSteps[index])
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
}
