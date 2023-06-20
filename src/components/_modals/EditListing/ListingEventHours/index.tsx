import React, { useState, useEffect } from 'react'
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
type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
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
  '12:00 am',
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
  '12:00 pm',
]
const ListingEventHoursEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData } = useSelector((state: RootState) => state.site)

  console.log('listingModalData:', listingModalData.event_date_time)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [eventData, setEventData] = useState(initialEventHour)

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
        setEventData({from_time, to_time, from_date, to_date})
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

  console.log({ eventData })
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Event Date And Time'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <div className={styles.sectionHead}>
            <p>Event Date & Time</p>
          </div>
          <div className={styles.listContainer}>
            <div className={styles.listItem}>
              <div className={styles.listSubItem}>
                <label> From Day </label>
                {/* <InputSelect
                  options={days}
                  value={workingHoursData.fromDay}
                  onChange={(item: any) => onChangeFromday(item, 'fromDay')}
                /> */}
                <input
                  value={eventData.from_date}
                  className={styles.inputField}
                  type="date"
                  onChange={(e: any) =>
                    onChangeFromday(e.target.value, 'from_date')
                  }
                />
              </div>
              <div className={styles.listSubItem}>
                <label> To Day </label>
                {/* <InputSelect
                  options={days}
                  value={eventData.toDay}
                  onChange={(item: any) => onChangeFromday(item, 'toDay')}
                /> */}
                <input
                  value={eventData.to_date}
                  className={styles.inputField}
                  type="date"
                  onChange={(e: any) =>
                    onChangeFromday(e.target.value, 'to_date')
                  }
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
                  options={timings}
                  onChange={(item: any) => onChangeFromday(item, 'to_time')}
                />
              </div>
            </div>
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button
              className="modal-footer-btn cancel"
              onClick={onBackBtnClick}
            >
              Back
            </button>
          )}

          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Next'
            ) : (
              'Save'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default ListingEventHoursEditModal
