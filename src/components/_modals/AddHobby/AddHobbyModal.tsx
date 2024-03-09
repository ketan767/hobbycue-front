import React, { useEffect, useRef } from 'react'
import styles from './AddHobbyModal.module.css'
import FilledButton from '@/components/_buttons/FilledButton'
import CloseIcon from '@/assets/icons/CloseIcon'
import { useDispatch } from 'react-redux'

type Props = {
  handleClose?: any
  handleSubmit?: any
  propData?: any
}

const AddHobby: React.FC<Props> = ({ handleClose, handleSubmit, propData }) => {
  const dispatch = useDispatch()
  const wrapperDivRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       wrapperDivRef.current &&
  //       !wrapperDivRef.current.contains(event.target as Node)
  //     ) {
  //       handleClose()
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

  return (
    <div className={`${styles['add-hobby']}`} ref={wrapperDivRef}>
      <div className={styles['header']}>
        <p>Add Hobby</p>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
      </div>
      <hr className={styles['modal-hr']} />
      <div className={styles['content']}>
        <p>
          Add <span>{propData?.defaultValue ?? 'Pickleball'}</span> as a hobby
          so that we can grow this as a community
        </p>
        <div className={styles['buttons']}>
          <FilledButton className={styles['button1']} onClick={handleSubmit}>
            Send Request
          </FilledButton>
        </div>
      </div>
    </div>
  )
}

export default AddHobby
