import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import {
  getListingAddress,
  updateListingAddress,
} from '@/services/listing.service'
import Image from 'next/image'
import AddIcon from '../../../../assets/svg/add.svg'
import InputSelect from '@/components/InputSelect/inputSelect'
import { updateListing } from '@/services/listing.service'
import {
  updateEventDateTime,
  updateListingModalData,
} from '@/redux/slices/site'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  onStatusChange?: (isChanged: boolean) => void
  onBoarding?: boolean
}

type ListingAddressData = {
  street: InputData<string>
  society: InputData<string>
  locality: InputData<string>
  city: InputData<string>
  pin_code: InputData<string>
  state: InputData<string>
  country: InputData<string>
  latitude: InputData<string>
  longitude: InputData<string>
}

const initialEventHour = {
  from_date: '02/02/2002',
  to_date: '02/02/2002',
  from_time: '8:00 am',
  to_time: '9:00 pm',
}

const timings = [
  '12:00 am',
  '1:00 am',
  '2:00 am',
  '3:00 am',
  '4:00 am',
  '5:00 am',
  '6:00 am',
  '7:00 am',
  '8:00 am',
  '9:00 am',
  '10:00 am',
  '11:00 am',
  '12:00 pm',
  '1:00 pm',
  '2:00 pm',
  '3:00 pm',
  '4:00 pm',
  '5:00 pm',
  '6:00 pm',
  '7:00 pm',
  '8:00 pm',
  '9:00 pm',
  '10:00 pm',
  '11:00 pm',
]
const ListingEventHoursEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  onBoarding,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData } = useSelector((state: RootState) => state.site)

  console.log('listingModalData:', listingModalData.event_date_time)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true)
  const [eventData, setEventData] = useState(initialEventHour)
  const today = new Date().toISOString().split('T')[0]
  const [initialData, setInitialData] = useState({})
  const [isChanged, setIsChanged] = useState(false)

  const handleDateSelection = (selectedDate: string) => {
    if (isSelectingStartDate) {
      setEventData((prevData) => ({ ...prevData, from_date: selectedDate }))
      setIsSelectingStartDate(false)
    } else {
      setEventData((prevData) => ({ ...prevData, to_date: selectedDate }))
      setIsSelectingStartDate(true)
    }
  }

  const handleSubmit = async () => {
    const jsonData = {
      ...eventData,
    }
    console.log({ jsonData })
    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      event_date_time: jsonData,
    })
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)
    dispatch(updateEventDateTime(res?.data.data.listing.event_date_time))
    if (onComplete) onComplete()
    else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

  useEffect(() => {
    if (listingModalData.event_date_time) {
      const { from_time, to_time, from_date, to_date } =
        listingModalData.event_date_time
      setEventData({ from_time, to_time, from_date, to_date })
      setInitialData({ from_time, to_time, from_date, to_date })
    }
  }, [])

  useEffect(() => {
    if (listingModalData.event_date_time === undefined) {
      const initial = {
        from_time: 'Monday',
        to_time: '8:00 pm',
        from_date: '02/08/2002',
        to_date: '02/04/2008',
      }

      dispatch(updateEventDateTime(initial))
    }
  }, [])

  const onChangeFromday = (updatedItem: any, key: any) => {
    const updated = {
      ...eventData,
      [key]: updatedItem,
    }
    setEventData(updated)
    console.log(updated)

    // setWorkingHoursData(updated)
  }


  useEffect(() => {
    const hasChanges = JSON.stringify(eventData) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)

    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }, [eventData, initialData, onStatusChange])


  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        OnBoarding={onBoarding}
      />
    )
  }

  console.log({ eventData })
  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Schedule'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <div className={styles.sectionHead}></div>
          <div className={styles.listContainer}>
            <div className={styles.listItem}>
              <div className={styles.listSubItem}>
                <label> From Date </label>

                <input
                  value={eventData.from_date}
                  className={styles.inputField}
                  type="date"
                  min={today}
                  onChange={(e: any) => handleDateSelection(e.target.value)}
                />
              </div>
              <div className={styles.listSubItem}>
                <label> To Date </label>

                <input
                  value={eventData.to_date}
                  className={styles.inputField}
                  type="date"
                  min={eventData.from_date}
                  onChange={(e: any) => handleDateSelection(e.target.value)}
                />
              </div>
              <div className={styles.listSubItem}>
                <label> From Time </label>
                <InputSelect
                  options={timings}
                  value={eventData.from_time}
                  onChange={(item: any) => onChangeFromday(item, 'from_time')}
                />
              </div>
              <div className={styles.listSubItem}>
                <label> To Time </label>
                <InputSelect
                  value={eventData.to_time}
                  options={timings.slice(
                    timings.indexOf(eventData.from_time) + 1,
                  )}
                  onChange={(item: any) => onChangeFromday(item, 'to_time')}
                />
              </div>
            </div>
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button
                className="modal-footer-btn cancel"
                onClick={onBackBtnClick}
              >
                Back
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={onBackBtnClick}>
                <Image
                  src={BackIcon}
                  alt="Back"
                  className="modal-mob-btn cancel"
                />
              </div>
            </>
          )}

          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleSubmit}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Next'
            ) : (
              'Save'
            )}
          </button>
          {/* SVG Button for Mobile */}
          {onComplete ? (
            <div onClick={handleSubmit}>
              <Image
                src={NextIcon}
                alt="back"
                className="modal-mob-btn cancel"
              />
            </div>
          ) : (
            <button
              ref={nextButtonRef}
              className="modal-mob-btn-save"
              onClick={handleSubmit}
            >
              Save
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ListingEventHoursEditModal
