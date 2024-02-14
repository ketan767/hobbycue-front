import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import { MenuItem, Select } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import {
  containOnlyNumbers,
  isEmpty,
  isEmptyField,
  validatePhone,
  validateUrl,
} from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import Checkbox from '@mui/material/Checkbox'
import { listingTypes } from '@/constants/constant'
import CustomTooltip from '@/components/Tooltip/ToolTip'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import { countryData } from '@/utils/countrydata'
import Image from 'next/image'
import DropdownMenu from '@/components/DropdownMenu'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  onBoarding?: boolean
}
type ListingContactData = {
  public_email: InputData<string>
  phone: {
    number: string
    prefix: string
    error?: string | null
  }
  website: InputData<string>
  whatsapp_number: {
    number: string
    prefix: string
    error?: string | null
  }
  page_admin: InputData<string>
}

const ListingContactEditModal: React.FC<Props> = ({
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

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [tick, setTick] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<ListingContactData>({
    phone: { number: '', prefix: '', error: null },
    public_email: { value: '', error: null },
    website: { value: '', error: null },
    whatsapp_number: { number: '', prefix: '', error: null },
    page_admin: { value: '', error: null },
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const WhtphoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const websiteRef = useRef<HTMLInputElement>(null)
  const [initialData, setInitialData] = useState<ListingContactData>({
    phone: { number: '', prefix: '', error: null },
    public_email: { value: '', error: null },
    website: { value: '', error: null },
    whatsapp_number: { number: '', prefix: '', error: null },
    page_admin: { value: '', error: null },
  })
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91')
  const [selectedWpCountryCode, setWpSelectedCountryCode] = useState('+91')
  const [isChanged, setIsChanged] = useState(false)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    setInitialData((prev) => {
      return {
        public_email: {
          ...prev.public_email,
          value: listingModalData.public_email as string,
        },
        phone: {
          ...prev.phone,
          number: listingModalData.phone?.number as string,
          prefix: listingModalData.phone?.prefix as string,
        },
        whatsapp_number: {
          ...prev.whatsapp_number,
          number: listingModalData.whatsapp_number?.number as string,
          prefix: listingModalData.whatsapp_number?.prefix as string,
        },

        website: { ...prev.website, value: listingModalData.website as string },
        page_admin: {
          ...prev.page_admin,
          value: user.display_name,
        },
      }
    })
  }, [user])

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])
  const handleInputChange = (event: any) => {
    const { name, value } = event.target

    // Check if the input is for phone or whatsapp number
    if (name === 'phone' || name === 'whatsapp_number') {
      setData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name as keyof ListingContactData],
          number: value || '',
          error: null,
        },
      }))
    } else {
      // For other input fields
      setData((prev) => ({
        ...prev,
        [name]: { value, error: null },
      }))
    }

    const currentData = { ...data }
    const hasChanges =
      JSON.stringify(currentData) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)

    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }

  const handleBack = async () => {
    setBackBtnLoading(true)
    const { phone, public_email, website, whatsapp_number } = data

    if (
      !phone.number &&
      !public_email.value &&
      !website.value &&
      !whatsapp_number.number
    ) {
      onBackBtnClick && onBackBtnClick()
      return
    } else {
      const jsonData = {
        phone: data.phone.number,
        public_email: data.public_email.value,
        website: data.website.value,
        whatsapp_number: data.whatsapp_number.number,
      }

      const { err, res } = await updateListing(listingModalData._id, jsonData)
      setBackBtnLoading(false)
      if (err) return console.log(err)
      if (res?.data.success) {
        dispatch(updateListingModalData(res?.data.data.listing))
      }

      if (onBackBtnClick) onBackBtnClick()
    }
  }
  const handleWpPrefixChange = (element: any) => {
    const id = element?.id
    setWpSelectedCountryCode(countryData[id]?.phonePrefix)
  }
  const handlePrefixChange = (element: any) => {
    const id = element?.id
    setSelectedCountryCode(countryData[id]?.phonePrefix)
  }
  const handleSubmit = async () => {
    console.log(data.website)
    if (!data.phone.number && !data.public_email.value) {
      emailRef.current?.focus()
      return setData((prev) => {
        return {
          ...prev,
          phone: {
            ...prev.phone,
            error: 'Enter a valid phone number or email',
          },
          public_email: {
            ...prev.public_email,
            error: 'Enter a valid phone number or email',
          },
        }
      })
    }
    if (data.phone.number) {
      if (
        !containOnlyNumbers(data.phone.number.toString().trim()) ||
        data.phone.number.toString().trim().length !== 10
      ) {
        phoneRef.current?.focus()
        return setData((prev) => {
          return {
            ...prev,
            phone: { ...prev.phone, error: 'Enter a valid phone number' },
          }
        })
      }
    }
    if (data.whatsapp_number.number) {
      if (
        !containOnlyNumbers(data.whatsapp_number.number.toString().trim()) ||
        data.whatsapp_number.number.toString().trim().length !== 10
      ) {
        WhtphoneRef.current?.focus()
        return setData((prev) => {
          return {
            ...prev,
            whatsapp_number: {
              ...prev.whatsapp_number,
              error: 'Enter a valid phone number',
            },
          }
        })
      }
    }
    if (data.public_email.value) {
      if (
        data.public_email.value &&
        !emailRegex.test(data.public_email.value.trim())
      ) {
        emailRef.current?.focus()
        return setData((prev) => ({
          ...prev,
          public_email: {
            ...prev.public_email,
            error: 'Enter a valid email address',
          },
        }))
      }
    }
    if (data.website.value && data.website.value !== '') {
      websiteRef.current?.focus()
      if (!validateUrl(data.website.value)) {
        return setData((prev) => {
          return {
            ...prev,
            website: {
              ...prev.website,
              error: 'Please enter a valid website!',
            },
          }
        })
      }
    }
    const jsonData = {
      phone: {
        number: data.phone.number,
        prefix: selectedCountryCode,
      },
      public_email: data.public_email.value,
      website: data.website.value,
      whatsapp_number: {
        number: data.whatsapp_number.number,
        prefix: selectedWpCountryCode,
      },
    }
    console.log('jsonData', jsonData)

    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, jsonData)
    setSubmitBtnLoading(false)
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(updateListingModalData(res?.data.data.listing))
      if (onComplete) onComplete()
      else {
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }

  useEffect(() => {
    emailRef?.current?.focus()
    setData((prev) => {
      return {
        public_email: {
          ...prev.public_email,
          value: listingModalData.public_email as string,
        },
        phone: {
          ...prev.phone,
          number: listingModalData.phone?.number as string,
          prefix: listingModalData.phone?.prefix as string,
        },
        whatsapp_number: {
          ...prev.whatsapp_number,
          number: listingModalData.whatsapp_number?.number as string,
          prefix: listingModalData.whatsapp_number?.prefix as string,
        },
        website: { ...prev.website, value: listingModalData.website as string },
        page_admin: {
          ...prev.page_admin,
          value: user.display_name,
        },
      }
    })
    if (listingModalData.phone?.prefix)
      setSelectedCountryCode(listingModalData.phone?.prefix)

    if (listingModalData.phone?.prefix)
      setWpSelectedCountryCode(
        listingModalData.whatsapp_number?.prefix as string,
      )
  }, [user])

  useEffect(() => {
    if (tick) {
      setData((prev) => {
        return {
          ...prev,
          whatsapp_number: {
            number: data.phone.number,
            prefix: selectedCountryCode,
          },
        }
      })
      setWpSelectedCountryCode(selectedCountryCode)
    }
  }, [tick, data.phone.number, selectedCountryCode])

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
  const HandleSaveError = async () => {
    if (!data.phone.number && !data.public_email.value) {
      setIsError(true)
    }
  }

  useEffect(() => {
    if (
      listingModalData.whatsapp_number?.number === '' &&
      listingModalData.phone?.number === ''
    ) {
      setTick(true)
    } else if (
      listingModalData.phone?.number ===
        listingModalData.whatsapp_number?.number &&
      listingModalData.phone?.prefix ===
        listingModalData.whatsapp_number?.prefix
    ) {
      setTick(true)
    } else {
      setTick(false)
    }
  }, [
    listingModalData.phone?.number,
    listingModalData.phone?.prefix,
    listingModalData.whatsapp_number?.number,
    listingModalData.whatsapp_number?.prefix,
  ])

  useEffect(() => {
    if (confirmationModal) {
      HandleSaveError()
    }
  }, [confirmationModal])

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isError])

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
        OnBoarding={onBoarding}
      />
    )
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Contact Information'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <>
            {/* Public Email */}
            {listingModalData.type === listingTypes.PEOPLE ||
            listingModalData.type === listingTypes.PROGRAM ||
            listingModalData.type === listingTypes.PLACE ? (
              <div className={styles.useEmailContainer}>
                <p>Either Phone Number or Email ID is required.</p>
                <OutlinedButton
                  className={styles['use-mine-button']}
                  onClick={() =>
                    setData((prev) => {
                      return {
                        ...prev,
                        public_email: { value: user.email, error: null },
                        phone: {
                          number: data.phone.number,
                          prefix: selectedCountryCode,
                          error: null,
                        },
                        website: { value: user.website, error: null },
                      }
                    })
                  }
                >
                  Use Mine
                </OutlinedButton>
              </div>
            ) : (
              <></>
            )}

            <div className={styles['two-column-grid']}>
              <div
                className={`${styles['input-box-admin']} ${styles['input-box']}`}
              >
                <label> Page Admin </label>
                <input
                  type="text"
                  placeholder={`Page Admin`}
                  value={data.page_admin.value}
                  name="page_admin"
                  autoComplete="page_admin"
                  ref={inputRef}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className={styles['input-box']}>
                <label>Email ID if different </label>
                <input
                  type="text"
                  placeholder={`Alternate email ID`}
                  value={data.public_email.value}
                  name="public_email"
                  autoComplete="email"
                  onChange={handleInputChange}
                  ref={emailRef}
                />
                <p className={styles['helper-text']}>
                  {data.public_email.error}
                </p>
              </div>
            </div>

            <section className={styles['two-column-grid']}>
              <div
                className={`${styles['input-box']} ${
                  data.phone.error ? styles['input-box-error'] : ''
                }`}
              >
                <label>Phone Number</label>
                <div className={styles['phone-prefix-input']}>
                  <DropdownMenu
                    value={selectedCountryCode}
                    valueIndex={countryData.findIndex(
                      (country, idx) =>
                        country.phonePrefix === selectedCountryCode,
                    )}
                    options={countryData.map(
                      (country, idx) =>
                        `${country.name} (${country.phonePrefix})`,
                    )}
                    onOptionClick={handlePrefixChange}
                    optionsPosition="bottom"
                    search={true}
                  />
                  <input
                    type="text"
                    placeholder={`Phone number`}
                    value={data.phone.number}
                    name="phone"
                    autoComplete="phone"
                    required
                    ref={phoneRef}
                    onChange={handleInputChange}
                    className={styles['phone-input']}
                  />
                </div>

                <p className={styles['helper-text']}>{data.phone.error}</p>
              </div>
              <div className={styles['input-box']}>
                <label className={styles['whatsapp-label']}>
                  WhatsApp Number
                  <CustomTooltip title="Use same">
                    <div>
                      <Checkbox
                        size="small"
                        color="primary"
                        name="rememberMe"
                        className={styles.checkbox}
                        value={!tick}
                        checked={tick}
                        onChange={(e) => {
                          if (tick === true) {
                            setData((prev) => {
                              return {
                                ...prev,
                                whatsapp_number: {
                                  number: '',
                                  prefix: '+91',
                                },
                              }
                            })
                            setWpSelectedCountryCode('+91')
                          }
                          setTick(!tick)
                        }}
                      />
                    </div>
                  </CustomTooltip>
                </label>
                <div className={styles['phone-prefix-input']}>
                  <DropdownMenu
                    value={selectedWpCountryCode}
                    valueIndex={countryData.findIndex(
                      (country, idx) =>
                        country.phonePrefix === selectedWpCountryCode,
                    )}
                    options={countryData.map(
                      (country, idx) =>
                        `${country.name} (${country.phonePrefix})`,
                    )}
                    onOptionClick={handleWpPrefixChange}
                    optionsPosition="bottom"
                    search={true}
                  />
                  <input
                    type="text"
                    placeholder={`Phone number`}
                    value={data.whatsapp_number.number}
                    autoComplete="phone"
                    name="whatsapp_number"
                    onChange={handleInputChange}
                    ref={WhtphoneRef}
                    className={styles['phone-input']}
                  />
                </div>
                <p className={styles['helper-text']}>
                  {data.whatsapp_number.error}
                </p>
              </div>
            </section>

            {/* Website */}
            <div
              className={`${styles['input-box']} ${
                styles['input-box-website']
              } ${data.website.error ? styles['input-box-error'] : ''}`}
            >
              <label>Website</label>
              <input
                type="text"
                placeholder={`URL`}
                value={data.website.value}
                name="website"
                autoComplete="website"
                ref={websiteRef}
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{data.website.error}</p>
            </div>
            <hr className={styles['hr-line']} />

            <p className={styles.kycText}>
              After updating the Listing Page, it can be Transferred to a
              different Page Admin
            </p>
          </>
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
              <div onClick={handleBack}>
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
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
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
              disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
            >
              Save
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ListingContactEditModal
