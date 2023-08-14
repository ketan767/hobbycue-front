import React, { useState, useEffect } from 'react'
import styles from './workingHours.module.css'
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
import { updateListingModalData } from '@/redux/slices/site'
import DeleteIcon from '@/assets/svg/trash-icon-colored.svg'

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
const initialWorkingHour = [
  {
    fromDay: 'Monday',
    toDay: 'Friday',
    fromTime: '8:00 am',
    toTime: '9:00 pm',
  },
]
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
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
const ListingWorkingHoursEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [data, setData] = useState<ListingAddressData>({
    street: { value: '', error: null },
    society: { value: '', error: null },
    locality: { value: '', error: null },
    city: { value: '', error: null },
    pin_code: { value: '', error: null },
    state: { value: '', error: null },
    country: { value: '', error: null },
    latitude: { value: '', error: null },
    longitude: { value: '', error: null },
  })
  const [workingHoursData, setWorkingHoursData] = useState(initialWorkingHour)

  const handleInputChange = (event: any) => {
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: { value: event.target.value, error: null },
      }
    })
  }

  const handleSubmit = async () => {
    const jsonData = workingHoursData.map((item: any) => {
      const { fromDay, toDay, fromTime, toTime } = item
      return {
        from_day: fromDay,
        to_day: toDay,
        from_time: fromTime,
        to_time: toTime,
      }
    })

    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      work_hours: jsonData,
    })
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)
    const updatedData = { ...listingModalData, work_hours: res?.data.data.listing.work_hours }

    dispatch(updateListingModalData(updatedData))
    if (onComplete) onComplete()
    else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

  useEffect(() => {
    const workData = listingModalData.work_hours?.map((item: any) => {
      const { from_day, to_day, from_time, to_time } = item
      return {
        fromDay: from_day,
        toDay: to_day,
        fromTime: from_time,
        toTime: to_time,
      }
    })
    if(workData){
      setWorkingHoursData(workData)
    }

  }, [listingModalData])

  const addWorkingHour = () => {
    setWorkingHoursData((prev: any) => [...prev, ...initialWorkingHour])
  }
  const updateAddress = async () => {
    const { err, res } = await getListingAddress(listingModalData._address)
    if (err) return console.log(err)

    setData({
      street: { value: res?.data.data.address.street, error: null },
      society: { value: res?.data.data.address.society, error: null },
      locality: { value: res?.data.data.address.locality, error: null },
      city: { value: res?.data.data.address.city, error: null },
      pin_code: { value: res?.data.data.address.pin_code, error: null },
      state: { value: res?.data.data.address.state, error: null },
      country: { value: res?.data.data.address.country, error: null },
      latitude: { value: res?.data.data.address.latitude, error: null },
      longitude: { value: res?.data.data.address.longitude, error: null },
    })
  }

  useEffect(() => {
    setData({
      street: { value: '', error: null },
      society: { value: '', error: null },
      locality: { value: '', error: null },
      city: { value: '', error: null },
      pin_code: { value: '', error: null },
      state: { value: '', error: null },
      country: { value: '', error: null },
      latitude: { value: '', error: null },
      longitude: { value: '', error: null },
    })
    updateAddress()
  }, [user])

  const onChangeFromday = (updatedItem: any, key: any, idxToChange: any) => {
    const temp = workingHoursData.map((item: any, idx: any) => {
      if (idxToChange === idx) {
        return { ...item, [key]: updatedItem }
      } else {
        return { ...item }
      }
    })
    setWorkingHoursData(temp)
  }

  const handleDelete = (index:any) => {
    let updatedData = workingHoursData.filter((item: any, idx: any) => idx !== index)
    setWorkingHoursData(updatedData)
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Working Hours'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <div className={styles.sectionHead}>
            <p>Working Hours</p>
            <div className={styles.sectionHeadRight} onClick={addWorkingHour}>
              <Image src={AddIcon} width={14} height={14} alt="add" />
              <p> Add another </p>
            </div>
          </div>
          <div className={styles.listContainer}>
            {workingHoursData.map((item: any, idx) => {
              return (
                <div key={idx} className={styles.listItem} >
                  <div className={styles.listSubItem}>
                    <label> From Day </label>
                    <InputSelect
                      options={days}
                      value={item.fromDay}
                      onChange={(item: any) =>
                        onChangeFromday(item, 'fromDay', idx)
                      }
                    />
                  </div>
                  <div className={styles.listSubItem}>
                    <label> To Day </label>
                    <InputSelect
                      options={days}
                      value={item.toDay}
                      onChange={(item: any) =>
                        onChangeFromday(item, 'toDay', idx)
                      }
                    />
                  </div>
                  <div className={styles.listSubItem}>
                    <label> From Time </label>
                    <InputSelect
                      options={timings}
                      value={item.fromTime}
                      onChange={(item: any) =>
                        onChangeFromday(item, 'fromTime', idx)
                      }
                    />
                  </div>
                  <div className={styles.listSubItem}>
                    <label> To Time </label>
                    <InputSelect
                      value={item.toTime}
                      options={timings}
                      onChange={(item: any) =>
                        onChangeFromday(item, 'toTime', idx)
                      }
                    />
                  </div>
                  <Image src={DeleteIcon} alt='delete' className={styles['delete-icon']}  onClick={()=>handleDelete(idx)} />
                </div>
              )
            })}
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

export default ListingWorkingHoursEditModal
