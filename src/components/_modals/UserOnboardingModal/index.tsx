import React, { useState } from 'react'
import styles from './UserOnboardingModal.module.css'

import { useDispatch } from 'react-redux'

import { Modal } from '@mui/material'
import { closeModal } from '@/redux/slices/modal'
import AuthForm from '@/components/AuthForm/AuthForm'
import FormInput from '@/components/_formElements/Input'
import FilledButton from '@/components/_buttons/FilledButton'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'

export const UserOnboardingModal: React.FC<PropTypes> = (props) => {
  const [activeStep, setActiveStep] = useState(0)
  const [open, setOpen] = useState(true)

  const steps = ['Step 1', 'Step 2', 'Step 3']

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setActiveStep(0)
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <div className={styles['modal-wrapper']}>
      <header>
        <h2>Complete your User Profile</h2>
      </header>

      <section></section>

      <footer>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep !== 0 && (
          <Button onClick={handleBack} color="primary">
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleClose}>
            Finish
          </Button>
        )}
      </footer>
    </div>
  )
}

type PropTypes = {
  closeModal?: () => void
}
