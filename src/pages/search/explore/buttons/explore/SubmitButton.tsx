import { isMobile } from '@/utils'
import React from 'react'
import useHandleSubmit from '../../../utils/HandleSubmit'
import styles from './Submit.module.css'
type SubmitButtonProps = {
  selectedCategory: string
  selectedPageType: string
  selectedHobby: string
  selectedLocation: string
}
const SubmitButton: React.FC<SubmitButtonProps> = ({
  selectedCategory,
  selectedPageType,
  selectedHobby,
  selectedLocation,
}) => {
  const isMob = isMobile()
  const handleSubmit = useHandleSubmit()

  return (
    <button
      className={`modal-footer-btn ${styles.submitButtonMobile}`}
      style={{
        width: isMob ? '100%' : 71,
        height: 32,
        marginLeft: 'auto',
      }}
      onClick={() =>
        handleSubmit(
          selectedCategory,
          selectedPageType,
          selectedHobby,
          selectedLocation,
        )
      }
    >
      Explore
    </button>
  )
}
export default SubmitButton
