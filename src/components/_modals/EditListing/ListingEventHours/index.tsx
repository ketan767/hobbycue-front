import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import { Button, CircularProgress, useMediaQuery } from '@mui/material'
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
  GetListingEvents,
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
  from_date: new Date().toISOString(),
  to_date: new Date().toISOString(),
  from_time: '8:00am',
  to_time: '9:00pm',
}

const timings = [
  '12:00am',
  '12:30am',
  '1:00am',
  '1:30am',
  '2:00am',
  '2:30am',
  '3:00am',
  '3:30am',
  '4:00am',
  '4:30am',
  '5:00am',
  '5:30am',
  '6:00am',
  '6:30am',
  '7:00am',
  '7:30am',
  '8:00am',
  '8:30am',
  '9:00am',
  '9:30am',
  '10:00am',
  '10:30am',
  '11:00am',
  '11:30am',
  '12:00pm',
  '12:30pm',
  '1:00pm',
  '1:30pm',
  '2:00pm',
  '2:30pm',
  '3:00pm',
  '3:30pm',
  '4:00pm',
  '4:30pm',
  '5:00pm',
  '5:30pm',
  '6:00pm',
  '6:30pm',
  '7:00pm',
  '7:30pm',
  '8:00pm',
  '8:30pm',
  '9:00pm',
  '9:30pm',
  '10:00pm',
  '10:30pm',
  '11:00pm',
  '11:30pm',
]

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const initialWeekdays = {
  from_day: 'Monday',
  to_day: 'Friday',
  from_time: '8:00 am',
  to_time: '9:00 pm',
}

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
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  console.log('listingModalData:', listingModalData)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true)
  const [eventData, setEventData] = useState<
    { from_time: string; to_time: string; from_date: string; to_date: string }[]
  >([])
  const [weekdays, setWeekdays] = useState<
    { from_time: string; to_time: string; from_day: string; to_day: string }[]
  >([])
  const today = new Date().toISOString().split('T')[0]
  const [initialData, setInitialData] = useState({})
  const [isChanged, setIsChanged] = useState(false)
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ]
  function formatDate(date: string) {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
    return new Date(date).toLocaleDateString('en-GB', options)
  }
  const handleDateSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index: number,
  ) => {
    const updatedItem = event.target.value // Extract the date string from the input event
    const date = updatedItem?.split('-')
    const month = months[Number(date[1]) - 1]
    const newDate = `${date[0]}/${month}/${date[2]}` // MM/DD/YYYY format

    if (key === 'from_date') {
      setEventData((prevData) =>
        prevData.map(
          (event, i) =>
            i === index ? { ...event, [key]: updatedItem } : event, // store the formatted date
        ),
      )
      setIsSelectingStartDate(false)
    } else {
      if (new Date(newDate) < new Date(eventData[index].from_date)) {
        alert('To Date cannot be before From Date')
        return
      }
      setEventData((prevData) =>
        prevData.map(
          (event, i) =>
            i === index ? { ...event, to_date: updatedItem } : event, // store the formatted date
        ),
      )
      setIsSelectingStartDate(true)
    }
  }

  // useEffect(() => {
  //   if (new Date(eventData.to_date) < new Date(eventData.from_date))
  //     setEventData((prevData) => ({
  //       ...prevData,
  //       to_date: eventData.from_date,
  //     }))
  // }, [eventData.from_date])

  const handleSubmit = async () => {
    const jsonData = {
      ...eventData,
    }
    console.log({ jsonData })
    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      event_date_time: eventData,
      event_weekdays: weekdays,
    })
    const updatedData = {
      ...listingModalData,
      event_date_time: eventData,
      event_weekdays: weekdays,
    }
    dispatch(updateListingModalData(updatedData))
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)

    if (onComplete) onComplete()
    else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

  const handleBack = async () => {
    const jsonData = {
      ...eventData,
    }
    console.log({ jsonData })
    setBackBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      event_date_time: eventData,
      event_weekdays: weekdays,
    })
    const updatedData = {
      ...listingModalData,
      event_date_time: eventData,
      event_weekdays: weekdays,
    }
    dispatch(updateListingModalData(updatedData))
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)
    if (onBackBtnClick) onBackBtnClick()
  }

  useEffect(() => {
    if (listingModalData.event_date_time) {
      setEventData(listingModalData.event_date_time)
      setInitialData(listingModalData.event_date_time)
    }
    if (listingModalData.event_weekdays) {
      setWeekdays(listingModalData.event_weekdays)
    }
    console.log({ listingModalData })
  }, [listingModalData])

  // const updateEventHours = async () => {
  //   const { err, res } = await GetListingEvents(
  //     listingModalData?._id
  //   )
  //   if (err) return console.log(err)
  //     console.warn({res})
  // }

  // useEffect(() => {
  //   updateEventHours()
  // }, [user])

  // console.warn({eventData})

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

  const onChangeFromday = (updatedItem: any, key: any, index: number) => {
    setEventData((prevData) =>
      prevData.map((event, i) =>
        i === index ? { ...event, [key]: updatedItem } : event,
      ),
    )
    // const updated = {
    //   ...eventData,
    //   [key]: updatedItem,
    // }
    // setEventData(updated)
    // console.log(updated)

    // setWorkingHoursData(updated)
  }

  const onChangeWeekday = (updatedItem: string, key: string, index: number) => {
    setWeekdays((prevData) =>
      prevData.map((event, i) =>
        i === index ? { ...event, [key]: updatedItem } : event,
      ),
    )
    console.log(updatedItem, key, index)
  }

  const addWeekday = () => {
    if (weekdays.length === 0) {
      const fromDay = days[new Date(initialEventHour.from_date).getDay()]
      const toDay = days[new Date(initialEventHour.to_date).getDay()]

      setWeekdays([
        {
          from_day: fromDay,
          to_day: toDay,
          from_time: initialEventHour.from_time,
          to_time: initialEventHour.to_time,
        },
      ])
    } else {
      setWeekdays((prevWeekdays) => [
        ...prevWeekdays,
        {
          from_day: 'Mon',
          to_day: 'Fri',
          from_time: '8:00am',
          to_time: '9:00pm',
        },
      ])
    }
  }

  const addDateAndTime = () => {
    // if (eventData.length === 0) {
    //   const fromDay = days[new Date(initialEventHour.from_date).getDay()]
    //   const toDay = days[new Date(initialEventHour.to_date).getDay()]

    //   setEventData([
    //     {
    //       from_date: initialEventHour.from_date,
    //       to_date: initialEventHour.to_date,
    //       from_time: initialEventHour.from_time,
    //       to_time: initialEventHour.to_time,
    //     },
    //   ])
    // } else {
      setEventData((prevdateTime) => [
        ...prevdateTime,
        {
          from_date: '',
          to_date: '',
          from_time: '8:00 am',
          to_time: '9:00 pm',
        },
      ])
    // }
  }

  const deleteWeekday = (index: number) => {
    setWeekdays((prevWeekdays) => prevWeekdays.filter((_, i) => i !== index))
  }
  const deleteDate = (index: number) => {
    setEventData((prevWeekdays) => prevWeekdays.filter((_, i) => i !== index))
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

  const formatDateFunc = (inputDate: string): string => {
    const parts = inputDate.split('-')
    const formattedDate = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
    )

    const day = formattedDate.getDate()
    const month = formattedDate.toLocaleString('default', { month: 'short' })
    const year = formattedDate.getFullYear()
    const returnableString = `${isNaN(day) ? '' : day + '-'}${
      month === 'Invalid Date' ? '' : month + '-'
    }${isNaN(year) ? '' : year}`
    return returnableString
  }

  const isMobile = useMediaQuery('(max-width:1100px)')

  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
    >
      <g clip-path="url(#clip0_15789_420)">
        <path
          d="M13.1429 9.2991H8.85714V13.5848C8.85714 14.0562 8.47143 14.442 8 14.442C7.52857 14.442 7.14286 14.0562 7.14286 13.5848V9.2991H2.85714C2.38571 9.2991 2 8.91338 2 8.44196C2 7.97053 2.38571 7.58481 2.85714 7.58481H7.14286V3.2991C7.14286 2.82767 7.52857 2.44196 8 2.44196C8.47143 2.44196 8.85714 2.82767 8.85714 3.2991V7.58481H13.1429C13.6143 7.58481 14 7.97053 14 8.44196C14 8.91338 13.6143 9.2991 13.1429 9.2991Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_15789_420">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.44165)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const DeleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      cursor={'pointer'}
    >
      <g clip-path="url(#clip0_15789_230)">
        <path
          d="M6 19.4417C6 20.5417 6.9 21.4417 8 21.4417H16C17.1 21.4417 18 20.5417 18 19.4417V7.44165H6V19.4417ZM19 4.44165H15.5L14.5 3.44165H9.5L8.5 4.44165H5V6.44165H19V4.44165Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_15789_230">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.44165)"
          />
        </clipPath>
      </defs>
    </svg>
  )

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
          <div className={styles.listContainer + ` ${styles['mt-32']}`}>
            <div onClick={addDateAndTime} className={styles['adder']}>
              <PlusIcon />
              <p>Add Date</p>
            </div>
            {eventData?.map((obj, i, arr) => (<>
              <div
                key={i}
                className={styles.listItem + ` ${styles['no-wrap']}`}
              >
                <div
                  className={
                    styles['subitem-group'] + ` ${styles['mobile-group']}`
                  }
                >
                  <div
                    className={
                      styles.listSubItem + ` ${styles['mobile-w-auto']}`
                    }
                  >
                    <label className={`${i!==0&&styles['desktop-hidden']}`}> From Date </label>

                    <input
                      value={obj.from_date}
                      className={styles.inputField}
                      type="date"
                      min={today}
                      onChange={(item) =>
                        handleDateSelection(item, 'from_date', i)
                      }
                    />
                    <p className={styles['formatted-date']}>
                      {formatDateFunc(obj.from_date)}
                    </p>
                  </div>
                  <div className={styles['breaker']+` ${i!==0&&!isMobile&&styles['no-margin']}`} />
                  <div className={styles.listSubItem}>
                   <label className={`${i!==0&&styles['desktop-hidden']}`}> To Date </label>

                    <input
                      value={obj.to_date}
                      className={styles.inputField}
                      type="date"
                      min={obj.from_date}
                      onChange={(e: any) =>
                        handleDateSelection(e, 'to_date', i)
                      }
                    />
                    <p
                      className={
                        styles['formatted-date']
                        // + ` ${styles['left-more']}`
                      }
                    >
                      {formatDateFunc(obj.to_date)}
                    </p>
                  </div>
                </div>
                <p className={styles['comma']}>,</p>
                <div className={styles['subitem-group']}>
                  <div className={styles.listSubItem+` ${styles['mob-w-132']}`}>
                 <label className={`${i!==0&&styles['desktop-hidden']}`}> From Time </label>
                    <InputSelect
                      options={timings}
                      value={obj.from_time}
                      onChange={(item: any) =>
                        onChangeFromday(item, 'from_time', i)
                      }
                      className={styles['time-input']}
                      iconClass={styles['input-icon']}
                    />
                  </div>
                  <div className={styles['breaker']+` ${i!==0&&!isMobile&&styles['no-margin']}`} />
                  <div className={styles.listSubItem+` ${styles['mob-w-132']}`}>
                <label className={`${i!==0&&styles['desktop-hidden']}`}> To Time </label>
                    <InputSelect
                      value={obj.to_time}
                      options={timings.slice(
                        timings.indexOf(obj.from_time) + 1,
                      )}
                      onChange={(item: any) =>
                        onChangeFromday(item, 'to_time', i)
                      }
                      className={styles['time-input']}
                      iconClass={styles['input-icon']}
                    />
                  </div>
                </div>
                <div
                  onClick={() => deleteDate(i)}
                  className={styles['self-left']+` ${styles['centered']}`}
                >
                  <DeleteIcon />
                </div>
              </div>
              {isMobile&&i<arr.length-1&&<hr/>}
            </>))}
          </div>
          {/* weekdays */}
          <div className={styles.listContainer + ` ${styles['mt-32']}`}>
            <div onClick={addWeekday} className={styles['adder']}>
              <PlusIcon />
              <p>Add Weekdays</p>
            </div>
            {weekdays.map((obj, i) => (
              <div
                key={i}
                className={styles.listItem + ` ${styles['no-wrap']}`}
              >
                <div
                  className={
                    styles['subitem-group'] + ` ${styles['mobile-group']}`
                  }
                >
                  <div
                    className={
                      styles.listSubItem + ` ${styles['mobile-w-auto']}`
                    }
                  >
                    {i === 0 && <label> From Day </label>}
                    <InputSelect
                      options={days}
                      value={obj.from_day} // Directly set the value
                      onChange={(item: any) =>
                        onChangeWeekday(item, 'from_day', i)
                      }
                      className={styles['weekday-input']}
                      iconClass={styles['input-icon']}
                    />
                  </div>
                  {isMobile ? null : (
                    <div
                      className={
                        styles['breaker'] +
                        ` ${i === 0 ? '' : styles['no-margin']}`
                      }
                    />
                  )}
                  <div
                    className={
                      styles.listSubItem + ` ${styles['mobile-w-auto']}`
                    }
                  >
                    {i === 0 && <label> To Day </label>}
                    <InputSelect
                      options={days}
                      value={obj.to_day} // Directly set the value
                      onChange={(item: any) =>
                        onChangeWeekday(item, 'to_day', i)
                      }
                      className={styles['weekday-input']}
                      iconClass={styles['input-icon']}
                    />
                  </div>
                </div>
                <p className={styles['comma']}>,</p>
                <div
                  className={
                    styles['subitem-group'] + ` ${styles['mobile-group']}`
                  }
                >
                  <div className={styles.listSubItem}>
                    {i === 0 && <label> From Time </label>}
                    <InputSelect
                      options={timings}
                      value={obj.from_time} // Directly set the value
                      onChange={(item: any) =>
                        onChangeWeekday(item, 'from_time', i)
                      }
                      className={styles['weektime-input']}
                      iconClass={styles['input-icon']}
                    />
                  </div>
                  {isMobile ? null : (
                    <div
                      className={
                        styles['breaker'] +
                        ` ${i === 0 ? '' : styles['no-margin']}`
                      }
                    />
                  )}
                  <div className={styles.listSubItem}>
                    {i === 0 && <label> To Time </label>}
                    <InputSelect
                      value={obj.to_time} // Directly set the value
                      options={timings.slice(
                        timings.indexOf(obj.from_time) + 1,
                      )}
                      onChange={(item: any) =>
                        onChangeWeekday(item, 'to_time', i)
                      }
                      className={styles['weektime-input']}
                      iconClass={styles['input-icon']}
                    />
                  </div>
                </div>
                <div
                  onClick={() => deleteWeekday(i)}
                  className={styles['self-left']}
                >
                  <DeleteIcon />
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel" onClick={handleBack}>
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
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
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Save'
              )}
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ListingEventHoursEditModal
