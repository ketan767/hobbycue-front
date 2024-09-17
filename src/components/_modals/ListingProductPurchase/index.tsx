import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import { CircularProgress, TextField, useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import {
  addProductVariant,
  getProductVariant,
  purchaseProduct,
  updateProductVariant,
} from '@/services/listing.service'
import CloseIcon from '@/assets/icons/CloseIcon'
import NextIcon from '@/assets/svg/Next.svg'
import hcLogo from '@/assets/image/logo-full.png'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import InputSelect from '@/components/InputSelect/inputSelect'
import { formatPrice } from '@/utils'
import Calendar from '@/assets/svg/calendar-light.svg'
import Time from '@/assets/svg/clock-light.svg'
import rupeesIcon from '@/assets/svg/rupees.svg'
import RadioUnselected from '../../../assets/svg/radio-unselected.svg'
import RadioSelected from '../../../assets/svg/radio-selected.svg'
import bhaskarQr from '../../../assets/image/bhaskarQr.jpeg'

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

const ListingProductPurchase: React.FC<Props> = ({
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
  const [submitBtnTxt, setSubmitBtnTxt] = useState(
    listingModalData.type === 4 ? 'Confirm' : 'Register',
  )

  const [showConfirmRegister, setshowConfirmRegister] = useState(false)
  const [RegisterCheck, SetRegisterCheck] = useState<any>(null)
  const [RegisterError, SetRegisterError] = useState<boolean>(false)

  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [showDays, setShowDays] = useState(true)
  const [data, setData] = useState<{
    _id?: string
    variant_tag: string
    variations: { name: string; value: string; quantity: number }[]
    note: string
  }>({ variant_tag: '', variations: [], note: '' })
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  useEffect(() => {
    if (propData && propData.currentListing && propData.currentListing._id) {
      getProductVariant(propData.currentListing._id)
        .then((result) => {
          if (result.res && result.res.data && result.res.data.data) {
            if (result.res?.data?.data.variations)
              setData({
                ...result.res?.data?.data,
                variations: result.res?.data?.data.variations.map(
                  (obj: any) => ({ ...obj, quantity: 1 }),
                ),
              })
            else {
              setData({ ...result.res?.data?.data, variations: [] })
            }
            // console.log(result.res)
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
    if (listingModalData?.click_url) {
      if (!showConfirmRegister) {
        setshowConfirmRegister(true)
        setSubmitBtnTxt('Confirm')
        if (listingModalData && listingModalData.click_url) {
          window.open(
            listingModalData.click_url,
            '_blank',
            'noopener,noreferrer',
          )
        }
        return
      }

      if (showConfirmRegister) {
        if (RegisterCheck === null) {
          SetRegisterError(true)
          return
        }
      }
    } else {
      const apiFunc = purchaseProduct
      setSubmitBtnLoading(true)
      const { err, res } = await apiFunc(data._id as string, {
        ...data,
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
        if (listingModalData.type !== 4) {
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
    }

    if (RegisterCheck) {
      const apiFunc = purchaseProduct
      setSubmitBtnLoading(true)
      const { err, res } = await apiFunc(data._id as string, {
        ...data,
      })
      if (err) {
        setSubmitBtnLoading(false)
        return setSnackbar({
          display: true,
          type: 'warning',
          message: 'Some error occured during purchase',
        })
      }
      console.log('res', res?.data.data.listing)

      if (onComplete) onComplete()
      if (listingModalData.type !== 4) {
        setSnackbar({
          display: true,
          type: 'success',
          message: 'Registered Successfully',
        })
        setTimeout(() => {
          dispatch(closeModal())
        }, 2000)
      }
      if (listingModalData.type === 4) {
        setTimeout(() => {
          dispatch(closeModal())
        }, 2000)
      }
    } else {
      dispatch(closeModal())
    }
  }
  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const isMobile = useMediaQuery('(max-width:1100px)')

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_14513_208561)">
        <path
          d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_14513_208561">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  const minusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M11.9997 8.61895H3.99967C3.63301 8.61895 3.33301 8.34038 3.33301 7.99991C3.33301 7.65943 3.63301 7.38086 3.99967 7.38086H11.9997C12.3663 7.38086 12.6663 7.65943 12.6663 7.99991C12.6663 8.34038 12.3663 8.61895 11.9997 8.61895Z"
        fill="#8064A2"
      />
    </svg>
  )

  const calculateTotalPrice = (
    variations: { name: string; value: string; quantity: number }[],
  ) => {
    // 1. Validate and convert variation quantities to numbers:
    const validVariations = variations.map((variation) => ({
      ...variation,
      quantity: Number(variation.quantity) || 0, // Set default quantity to 0 if not a number
    }))

    // 2. Calculate total price with error handling:
    let totalPrice = 0
    for (const variation of validVariations) {
      const price = Number(variation.value) || 0 // Handle potential non-numeric values
      totalPrice += price * variation.quantity
    }

    // 3. Return the total price as a number:
    return totalPrice
  }

  const totalPrice = calculateTotalPrice(data.variations)

  const incQuantity = (i: number) => {
    let newArr = [...data.variations]
    if (Number(newArr[i].quantity) < 9) {
      newArr[i] = { ...newArr[i], quantity: Number(newArr[i].quantity) + 1 }
      setData((prev) => ({ ...prev, variations: newArr }))
    }
  }

  const decQuantity = (i: number) => {
    let newArr = [...data.variations]
    newArr[i] = {
      ...newArr[i],
      quantity:
        Number(newArr[i].quantity) === 0 ? 0 : Number(newArr[i].quantity) - 1,
    }
    setData((prev) => ({ ...prev, variations: newArr }))
  }

  function formatDateRange(
    fromDate: string | number | Date,
    toDate: string | number | Date,
  ): string {
    console.log({ fromDate, toDate })
    const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric' }
    const monthYearOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    }

    const from = new Date(fromDate)
    const to = new Date(toDate)

    const fromDay = new Intl.DateTimeFormat('en-US', dayOptions).format(from)
    const toDay = new Intl.DateTimeFormat('en-US', dayOptions).format(to)
    const fromMonthYear = new Intl.DateTimeFormat(
      'en-US',
      monthYearOptions,
    ).format(from)
    const toMonthYear = new Intl.DateTimeFormat(
      'en-US',
      monthYearOptions,
    ).format(to)

    if (
      from.getMonth() === to.getMonth() &&
      from.getFullYear() === to.getFullYear() &&
      from.getDate() !== to.getDate()
    ) {
      return `${fromDay} - ${toDay} ${fromMonthYear}`
    } else if (
      from.getMonth() === to.getMonth() &&
      from.getFullYear() === to.getFullYear() &&
      from.getDate() === to.getDate()
    ) {
      return `${fromDay} ${fromMonthYear}`
    } else {
      return `${fromDay} ${fromMonthYear} - ${toDay} ${toMonthYear}`
    }
  }
  const dropdownIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      cursor={'pointer'}
    >
      <path
        d="M2.7313 13.0784H13.5506C13.6601 13.078 13.7675 13.0478 13.8612 12.991C13.9548 12.9341 14.0312 12.8529 14.0821 12.7558C14.1329 12.6588 14.1564 12.5498 14.1499 12.4404C14.1434 12.3311 14.1073 12.2256 14.0453 12.1353L8.63563 4.32134C8.41143 3.99736 7.87167 3.99736 7.64687 4.32134L2.23722 12.1353C2.1746 12.2254 2.13788 12.331 2.13105 12.4405C2.12421 12.55 2.14753 12.6593 2.19846 12.7565C2.24939 12.8538 2.32598 12.9351 2.41992 12.9919C2.51386 13.0486 2.62156 13.0785 2.7313 13.0784Z"
        fill="#6D747A"
      />
    </svg>
  )
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

            <div className={styles['event-date-container']}>
              {listingModalData?.type === 3 &&
              listingModalData?.event_date_time ? (
                <div className={styles['eventDate-parent']}>
                  <div
                    className={
                      styles.eventDate +
                      ` ${showDays && styles['eventDate-open']}`
                    }
                  >
                    <Image
                      className={styles['im']}
                      src={Calendar}
                      alt="calendar"
                    />
                    <div className={styles['event-dates']}>
                      {listingModalData.event_date_time &&
                      listingModalData?.event_date_time?.length > 0
                        ? (showDays
                            ? listingModalData.event_date_time
                            : listingModalData.event_date_time.slice(0, 1)
                          ).map((obj: any, i: number, arr: any[]) => (
                            <p key={i} className={styles.date}>
                              {formatDateRange(obj?.from_date, obj?.to_date)}
                              {isMobile &&
                              showDays === false &&
                              listingModalData?.event_date_time &&
                              listingModalData?.event_date_time?.length > 1 &&
                              (!listingModalData?.event_weekdays ||
                                listingModalData?.event_weekdays?.length <=
                                  1) ? (
                                <>... </>
                              ) : null}
                              {isMobile &&
                                showDays &&
                                listingModalData?.event_date_time &&
                                listingModalData?.event_date_time?.length -
                                  1 ===
                                  i && <> </>}
                            </p>
                          ))
                        : ''}
                    </div>
                    {(listingModalData.event_weekdays &&
                      listingModalData.event_weekdays.length > 0) ||
                      (listingModalData.event_date_time &&
                        listingModalData?.event_date_time?.length > 0 && (
                          <Image
                            className={styles['im']}
                            src={Time}
                            alt="Time"
                          />
                        ))}
                    <div className={styles['flex-col-4']}>
                      {listingModalData.event_weekdays &&
                      listingModalData?.event_weekdays?.length > 0
                        ? (showDays
                            ? listingModalData.event_weekdays
                            : listingModalData.event_weekdays.slice(0, 1)
                          ).map((obj: any, i: number, arr: any[]) =>
                            i > 0 && !showDays ? null : (
                              <p
                                key={i}
                                className={
                                  styles.editTime +
                                  ` ${
                                    i !== 0 && showDays === false
                                      ? styles['hide']
                                      : ''
                                  }`
                                }
                              >
                                {obj?.from_day}
                                {obj?.to_day !== obj?.from_day &&
                                  ' - ' + obj?.to_day}
                                , {obj?.from_time}
                                {isMobile && showDays === false ? (
                                  <>... </>
                                ) : (
                                  <>
                                    {' '}
                                    -
                                    {showDays === false &&
                                    !isMobile &&
                                    listingModalData?.event_weekdays &&
                                    listingModalData?.event_weekdays?.length >
                                      1 ? (
                                      <>{' ... '}</>
                                    ) : (
                                      obj?.to_time
                                    )}
                                  </>
                                )}
                              </p>
                            ),
                          )
                        : listingModalData.event_date_time &&
                          listingModalData?.event_date_time?.length > 0 && (
                            <>
                              {(showDays
                                ? listingModalData.event_date_time
                                : listingModalData.event_date_time.slice(0, 1)
                              ).map((obj: any, i: number) => (
                                <p key={i} className={styles.editTime}>
                                  {obj?.from_time} - {obj?.to_time}
                                </p>
                              ))}
                            </>
                          )}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {listingModalData?.page_type?.includes('Online Access') ? (
              <Image src={bhaskarQr} alt="Qr" width={330} />
            ) : (
              <div className={styles['variations']}>
                <div className={styles['variations-list']}>
                  {data.variations.map((obj, i) => (
                    <div key={i} className={styles['variant']}>
                      <div>
                        {obj.name === 'No value' ? 'Quantity' : obj.name}
                      </div>

                      <div className={styles['quantity']}>
                        <button
                          onClick={() => {
                            decQuantity(i)
                          }}
                        >
                          {minusIcon}
                        </button>
                        <p>{obj.quantity}</p>
                        <button
                          onClick={() => {
                            incQuantity(i)
                          }}
                        >
                          {plusIcon}
                        </button>
                      </div>
                      <div
                        className={styles['show-value']}
                        // onChange={(e)=>{handleVariationChange(e.target.value,'value',i)}}
                      >
                        <p>
                          {
                            <Image
                              className={styles['rupees-icon']}
                              src={rupeesIcon}
                              alt="rupeesIcon"
                            />
                          }{' '}
                          {formatPrice(obj.value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <footer className={styles['footer']}>
          <div className={styles['price']}>
            <div className={styles['note']}>
              <p>Note</p>
              <textarea
                value={data.note}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="You may include Payment Info, Transaction ID, Registration ID, Special Requests, etc"
              />
            </div>
            <p>
              {
                <Image
                  className={styles['rupees-icon-big']}
                  src={rupeesIcon}
                  alt="rupeesIcon"
                />
              }{' '}
              {formatPrice(totalPrice)}
            </p>
          </div>
          {showConfirmRegister && (
            <div className={styles['register-confirmation-wrapper']}>
              <p
                className={RegisterError ? styles['register-error'] : ''}
                style={{ width: 'content-fit' }}
              >
                Did you{' '}
                {listingModalData?.page_type?.includes('Online Access')
                  ? 'pay'
                  : !listingModalData?.page_type?.includes('Online Access')
                  ? 'buy'
                  : 'Register'}
              </p>
              <div>
                <span>
                  <Image
                    src={
                      RegisterCheck === null
                        ? RadioUnselected
                        : RegisterCheck
                        ? RadioSelected
                        : RadioUnselected
                    }
                    width={16}
                    height={16}
                    alt="radio"
                    className={styles.addIcon}
                    onClick={() => SetRegisterCheck(true)}
                  />{' '}
                  Yes
                </span>
                <span>
                  <Image
                    src={
                      RegisterCheck === null
                        ? RadioUnselected
                        : RegisterCheck
                        ? RadioUnselected
                        : RadioSelected
                    }
                    width={16}
                    height={16}
                    alt="radio"
                    className={styles.addIcon}
                    onClick={() => SetRegisterCheck(false)}
                  />{' '}
                  No
                </span>
              </div>
            </div>
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

export default ListingProductPurchase
