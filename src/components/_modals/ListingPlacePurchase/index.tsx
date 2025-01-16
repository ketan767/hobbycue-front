import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import { CircularProgress, TextField, useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import {
  addProductVariant,
  getPlaceVariant,
  getProductVariant,
  purchasePlaceMembership,
  purchaseProduct,
  updateProductVariant,
} from '@/services/listing.service'
import CloseIcon from '@/assets/icons/CloseIcon'
import NextIcon from '@/assets/svg/Next.svg'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
// import { DropdownOption } from '../CreatePost/Dropdown/DropdownOption'
import InputSelect from '@/components/_formElements/Select/Select'
import DropdownOption from './dropdown/Dropdown'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  onStatusChange?: (isChanged: boolean) => void
  onBoarding?: boolean
  propData?: any
  modalType?: any
}

const initialEventHour = {
  from_date: new Date().toISOString(),
  to_date: new Date().toISOString(),
  from_time: '8:00 am',
  to_time: '9:00 pm',
}

const ListingPlacePurchase: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  onBoarding,
  propData,
  modalType,
}) => {
  console.log({ propData })
  const dispatch = useDispatch()
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const { user } = useSelector((state: RootState) => state.user)
  const [submitBtnTxt, setSubmitBtnTxt] = useState('Join')

  const [showConfirmRegister, setshowConfirmRegister] = useState(false)
  const [RegisterCheck, SetRegisterCheck] = useState<any>(null)
  const [RegisterError, SetRegisterError] = useState<boolean>(false)

  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [showDays, setShowDays] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<string>('Select')
  const [openDropdown, setOpenDropdown] = useState(false)

  const [data, setData] = useState<{
    _id?: string
    variant_tag: string
    membership_identifier: string
    variations: { name: string }[]
    note: string
  }>({ variant_tag: '', membership_identifier: '', variations: [], note: '' })

  const [formData, setFormData] = useState<any>({
    variant_value: 'Select',
    memberIdentifierValue: '',
    note: '',
  })

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  useEffect(() => {
    if (propData && propData.currentListing && propData.currentListing._id) {
      getPlaceVariant(propData.currentListing._id)
        .then((result) => {
          if (result.res && result.res.data && result.res.data.data) {
            if (result.res?.data?.data.variations)
              setData({
                ...result.res?.data?.data,
                variations: result.res?.data?.data.variations,
              })
            else {
              setData({ ...result.res?.data?.data, variations: [] })
            }
            console.log('result.res?.data?.data', result.res?.data?.data)
          } else if (result.err) {
            console.log({ err: result.err })
          }
        })
        .catch((err) => {
          console.log({ err })
        })
    }
  }, [propData])

  useEffect(() => {
    if (listingModalData.type == 4) {
      setshowConfirmRegister(true)
    }
  }, [])

  const handleSubmit = async () => {
    if(formData?.variant_value ==='Select'){
      return setSnackbar({
        display: true,
        type: 'warning',
        message: 'Please select the required field.',
      })
    }
    const apiFunc = purchasePlaceMembership
    setSubmitBtnLoading(true)
    const { err, res } = await apiFunc(data._id as string, {
      ...formData,
    })
    if (err) {
      return setSnackbar({
        display: true,
        type: 'warning',
        message: 'Some error occured during purchase',
      })
    }
    console.log('res', res?.data.data.listing)

    if (onComplete) onComplete()
    else {
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Registered Successfully',
      })
      setTimeout(() => {
        dispatch(closeModal())
      }, 2000)
    }
  }
  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const isMobile = useMediaQuery('(max-width:1100px)')
  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}

        <section className={styles['body']}>
          <div
            className={`${styles['container']} ${
              listingModalData?.page_type?.includes('Online Access') &&
              styles['container-qr']
            }`}
          >
            <div className={styles['img-and-label']}>
              {listingModalData.profile_image ? (
                <img src={listingModalData?.profile_image} alt="" />
              ) : (
                <div
                  className={`${styles['default-img']} default-program-listing-icon`}
                ></div>
              )}
              <div>
                <strong>{listingModalData?.title}</strong>
                <p>{listingModalData?.tagline}</p>
              </div>
            </div>
          </div>
          {data?.variations?.length > 0 && (
            <div className={styles['input-container']}>
              <div className={styles['input-field']}>
                <p className={styles['variant-tag']}>
                  {data?.variant_tag}
                  <span className={styles['styles-red']}>*</span>
                </p>
                <div className={styles['input-box']}>
                  <InputSelect
                    onChange={(e: any) => {
                      // let val = e.target.value
                      // setData((prev: any) => ({ ...prev, visibility: val }))
                    }}
                    value={formData.variant_value}
                    className={styles['input-select']}
                    optionsContainerClass={styles['options-container-class']}
                    // style={!isMobile ? { width: '354px' } : {}}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    id={'ListingPlaceAdminHeader'}
                  >
                    {data?.variations?.map((item: any, idx: number) => {
                      return (
                        <>
                          <DropdownOption
                            display={item.name}
                            key={idx}
                            selected={item.name == formData.variant_value}
                            onChange={() =>
                              setFormData((prev: any) => ({
                                ...prev,
                                variant_value: item.name,
                              }))
                            }
                          />
                        </>
                      )
                    })}
                  </InputSelect>
                </div>
              </div>
              <div className={styles['input-field']}>
                <div className={styles['input-label']}>
                  <p className={styles['variant-tag']}>
                    {data?.membership_identifier}
                  </p>
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder=""
                  value={formData.memberIdentifierValue}
                  className={`${styles['input-member']} ${styles['']}`}
                  onChange={(e) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      memberIdentifierValue: e.target.value,
                    }))
                  }}
                />
              </div>
            </div>
          )}
        </section>

        <footer className={styles['footer']}>
          <div className={styles['price']}>
            <div className={styles['note']}>
              <p>Note</p>
              <textarea
                value={data.note}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                placeholder="You may include Payment Info, Transaction ID, Registration ID, Special Requests, etc"
              />
            </div>
          </div>
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
              submitBtnTxt
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
              className={`modal-footer-btn ${styles['footer-submit-mob']}`}
              onClick={handleSubmit}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                submitBtnTxt
              )}
            </button>
          )}
        </footer>
      </div>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default ListingPlacePurchase
