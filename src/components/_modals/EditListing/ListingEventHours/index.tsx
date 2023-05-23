import React, { useState, useEffect } from 'react'
import styles from './style.module.css'
import { Button, CircularProgress } from '@mui/material'
import { addUserAddress, getMyProfileDetail, updateUserAddress } from '@/services/user.service'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { getListingAddress, updateListingAddress } from '@/services/listing.service'
import Image from 'next/image'
import AddIcon from '../../../../assets/svg/add.svg'
import InputSelect from '@/components/InputSelect/inputSelect'
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
      fromDay: '',
      toDay: '',
      fromTime: '',
      toTime: ''
   }
]
const days = [
   'Monday',
   'Tuesday',
]
const ListingEventHoursEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
   const dispatch = useDispatch()
   const { user } = useSelector((state: RootState) => state.user)

   const { listingModalData } = useSelector((state: RootState) => state.site)
   console.log('listingModalData:', listingModalData)

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
         return { ...prev, [event.target.name]: { value: event.target.value, error: null } }
      })
   }

   const handleSubmit = async () => {
      if (isEmptyField(data.street.value)) {
         return setData((prev) => {
            return { ...prev, street: { ...prev.street, error: 'This field is required!' } }
         })
      }
      if (isEmptyField(data.city.value)) {
         return setData((prev) => {
            return { ...prev, city: { ...prev.city, error: 'This field is required!' } }
         })
      }
      if (isEmptyField(data.pin_code.value)) {
         return setData((prev) => {
            return { ...prev, pin_code: { ...prev.pin_code, error: 'This field is required!' } }
         })
      }
      if (isEmptyField(data.state.value)) {
         return setData((prev) => {
            return { ...prev, state: { ...prev.state, error: 'This field is required!' } }
         })
      }
      if (isEmptyField(data.country.value)) {
         return setData((prev) => {
            return { ...prev, country: { ...prev.country, error: 'This field is required!' } }
         })
      }

      const jsonData = {
         street: data.street.value,
         society: data.society.value,
         locality: data.locality.value,
         city: data.city.value,
         pin_code: data.pin_code.value,
         state: data.state.value,
         country: data.country.value,
         latitude: data.latitude.value,
         longitude: data.longitude.value,
      }
      setSubmitBtnLoading(true)
      const { err, res } = await updateListingAddress(listingModalData._address, jsonData)
      if (err) return console.log(err)
      if (onComplete) onComplete()
      else {
         window.location.reload()
         dispatch(closeModal())
      }
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
                  <p>
                     Event Hours
                  </p>
                  <div className={styles.sectionHeadRight}>
                     <Image src={AddIcon} width={14} height={14} alt='add' />
                     <p> Add event hour </p>
                  </div>
               </div>
               <div className={styles.listContainer}>
                  {workingHoursData.map((item: any) => {
                     return <div className={styles.listItem}>
                        <div className={styles.listSubItem}>
                           <label> From Day </label>
                           <InputSelect options={days} />
                        </div>
                        <div className={styles.listSubItem}>
                           <label> To Day </label>
                           <InputSelect options={days} />
                        </div>
                        <div className={styles.listSubItem}>
                           <label> From Time </label>
                           <InputSelect options={days} />
                        </div>
                        <div className={styles.listSubItem}>
                           <label> From Time </label>
                           <InputSelect options={days} />
                        </div>
                     </div>
                  })}
               </div>
            </section>

            <footer className={styles['footer']}>
               {Boolean(onBackBtnClick) && (
                  <button className="modal-footer-btn cancel" onClick={onBackBtnClick}>
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
