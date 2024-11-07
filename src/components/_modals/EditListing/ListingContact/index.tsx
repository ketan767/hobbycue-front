import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress, debounce } from '@mui/material'
import { MenuItem, Select } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  searchUsers,
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
import {
  searchPages,
  transferListing,
  updateListing,
} from '@/services/listing.service'
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
import DefaultProfile from '@/assets/svg/default-images/default-user-icon.svg'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  onBoarding?: boolean
  propData?: any
}
type ListingContactData = {
  admin_note: InputData<string>
  public_email: InputData<string>
  page_url: InputData<string>
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
  propData,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const isTransferModal = propData?.istransfer
  console.warn('propsdataa', propData)
  const [disableAdmin, SetdisableAdmin] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [tick, setTick] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<ListingContactData>({
    admin_note: { value: '', error: null },
    page_url: { value: '', error: null },
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
  const urlSpanRef = useRef<HTMLSpanElement>(null)
  const [initialData, setInitialData] = useState<ListingContactData>({
    admin_note: { value: '', error: null },
    page_url: { value: '', error: null },
    phone: { number: '', prefix: '', error: null },
    public_email: { value: '', error: null },
    website: { value: '', error: null },
    whatsapp_number: { number: '', prefix: '', error: null },
    page_admin: { value: '', error: null },
  })
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91')
  const [selectedWpCountryCode, setWpSelectedCountryCode] = useState('+91')
  const [isChanged, setIsChanged] = useState(false)
  const [urlSpanLength, setUrlSpanLength] = useState<number>(0)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const profileUrlRef = useRef<HTMLInputElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownLoading, setDropdownLoading] = useState<boolean>(true)
  const [allDropdownValues, setAllDropdownValues] = useState<any>([])
  const [selectedPage, setSelectedPage] = useState<any>({})
  const dropdownRef = useRef<HTMLInputElement>(null)
  const [pageInputValue, setPageInputValue] = useState('')

  useEffect(() => {
    setInitialData((prev) => {
      return {
        admin_note: {
          ...prev.admin_note,
          value: listingModalData.admin_note as string,
        },
        page_url: {
          ...prev.page_url,
          value: listingModalData.page_url as string,
        },
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
          value: user.full_name,
        },
      }
    })
  }, [user])

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])
  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    if (
      (data.phone.error === 'At least one mode of contact is required' ||
        data.public_email.error ===
          'At least one mode of contact is required') &&
      (name === 'phone' || name === 'public_email')
    ) {
      setData((prev) => ({
        ...prev,
        phone: { ...prev.phone, error: null },
        public_email: { ...prev.public_email, error: null },
        [name]: {
          ...prev[name as keyof ListingContactData],
          number: value || '',
          error: null,
        },
      }))
    }
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

  const handleBlur = (e: any) => {
    const { name, value } = e.target
    setWpSelectedCountryCode(selectedCountryCode)
    if (name === 'phone') {
      setData((prev) => ({
        ...prev,
        whatsapp_number: {
          ...prev['whatsapp_number'],
          number: value || '',
          error: null,
        },
      }))
    }
  }
  const handlePhoneBlur = (e: any) => {
    if (tick) {
      handleBlur(e)
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
    if (tick) {
      handleWpPrefixChange(element)
    }
  }
  const handleSubmit = async () => {
    let hasError = false
    console.log(data.website)
    if (!data.whatsapp_number.number) {
      if (!data.phone.number && !data.public_email.value) {
        emailRef.current?.focus()
        hasError = true
        setData((prev) => {
          return {
            ...prev,
            phone: {
              ...prev.phone,
              error: 'At least one mode of contact is required',
            },
            public_email: {
              ...prev.public_email,
              error: 'At least one mode of contact is required',
            },
          }
        })
      }
    }
    if (data.phone.number) {
      if (
        !containOnlyNumbers(data.phone.number.toString().trim()) ||
        data.phone.number.toString().replace(/\s/g, '').length > 12 ||
        data.phone.number.toString().replace(/\s/g, '').length < 7
      ) {
        phoneRef.current?.focus()
        hasError = true
        setData((prev) => {
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
        data.whatsapp_number.number.toString().replace(/\s/g, '').length > 12 ||
        data.whatsapp_number.number.toString().replace(/\s/g, '').length < 7
      ) {
        WhtphoneRef.current?.focus()
        hasError = true
        setData((prev) => {
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
        hasError = true
        setData((prev) => ({
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
        hasError = true
        setData((prev) => {
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
    if (hasError === true) {
      return
    }

    const jsonData = {
      phone: {
        number: data.phone.number?.replace(/\s/g, ''),
        prefix: selectedCountryCode,
      },
      public_email: data.public_email.value,
      website: data.website.value,
      whatsapp_number: {
        number: data.whatsapp_number.number?.replace(/\s/g, ''),
        prefix: selectedWpCountryCode,
      },
      admin_note: data.admin_note.value,

      ...(isTransferModal && { page_url: data.page_url.value }),
    }

    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, jsonData)
    if (isTransferModal) {
      const trasnferdata = {
        userId: selectedPage,
        listingId: listingModalData._id,
        OwnerId: user._id,
      }
      const { err, res } = await transferListing(trasnferdata)
    }
    setSubmitBtnLoading(false)
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(updateListingModalData(res?.data.data.listing))
      if (onComplete) onComplete()
      else {
        if (isTransferModal) {
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${user?.profile_url}/pages`
        } else {
          window.location.reload()
        }
        dispatch(closeModal())
      }
    }
  }

  const debouncedSearch = debounce(async (value: any) => {
    setShowDropdown(true)
    setDropdownLoading(true)
    const { res, err } = await searchUsers({ full_name: value })
    if (res) {
      setAllDropdownValues(res.data)
    } else {
      // Handle error
    }
    setDropdownLoading(false)
  }, 300)

  const handleInputChangeAdmin = (e: any) => {
    const { value } = e.target
    setPageInputValue(value)
    debouncedSearch(value)
  }

  useEffect(() => {
    if (isTransferModal) {
      setTimeout(() => {
        inputRef?.current?.focus()
      }, 100)
    } else {
      emailRef?.current?.focus()
    }
    setData((prev) => {
      return {
        admin_note: {
          ...prev.admin_note,
          value: listingModalData.admin_note as string,
        },
        page_url: {
          ...prev.page_url,
          value: listingModalData.page_url as string,
        },
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
          value: user.full_name,
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

  // client said to remove this checkbox function and add it again
  // useEffect(() => {
  //   if (tick) {
  //     setData((prev) => {
  //       return {
  //         ...prev,
  //         whatsapp_number: {
  //           number: data.phone.number,
  //           prefix: selectedCountryCode,
  //         },
  //       }
  //     })
  //     setWpSelectedCountryCode(selectedCountryCode)
  //   }
  // }, [data.phone.number, selectedCountryCode, tick])

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if (event?.srcElement?.tagName === 'svg') {
          return
        }
        nextButtonRef.current?.click()
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
  useEffect(() => {
    const length = urlSpanRef.current?.offsetWidth ?? 0
    setUrlSpanLength(length + 12)
  }, [])

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
          <h4 className={styles['heading']}>
            {isTransferModal ? 'Transfer Page' : 'Contact Information'}
          </h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <>
            {isTransferModal ? (
              <div
                className={`${styles['input-box']} ${
                  data.page_url.error ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>
                  Listing page URL
                </label>
                <div className={styles['profile-url-input']}>
                  <input
                    type="text"
                    autoComplete="new"
                    placeholder=""
                    required
                    value={data?.page_url.value as string}
                    name="page_url"
                    onChange={handleInputChange}
                    ref={profileUrlRef}
                    style={{
                      paddingLeft: urlSpanLength + 'px',
                      paddingTop: '13px',
                    }}
                  />
                  <span ref={urlSpanRef}>{'/page/'}</span>
                </div>
                <p className={styles['helper-text']}>{data.page_url.error}</p>
              </div>
            ) : (
              <>
                {/* Public Email */}
                {listingModalData.type === listingTypes.PEOPLE ||
                listingModalData.type === listingTypes.PROGRAM ||
                listingModalData.type === listingTypes.PLACE ? (
                  <div className={styles.useEmailContainer}>
                    <p>At least one mode of contact is required</p>
                    <OutlinedButton
                      className={styles['use-mine-button']}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.stopPropagation()
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
                      }}
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
              </>
            )}

            <div className={styles['two-column-grid']}>
              <div
                className={`${
                  isTransferModal
                    ? styles['input-box']
                    : styles['input-box-admin']
                } ${styles['input-box']}`}
              >
                <label> Page Admin </label>
                <input
                  type="text"
                  autoComplete="new"
                  placeholder={`Type and Select...`}
                  value={
                    isTransferModal ? pageInputValue : data.page_admin.value
                  }
                  name="page_admin"
                  ref={inputRef}
                  onChange={(e) => {
                    if (isTransferModal) {
                      handleInputChangeAdmin(e)
                      setPageInputValue(e.target.value)
                    } else {
                      handleInputChange(e)
                    }
                  }}
                  disabled={!isTransferModal ? true : false}
                />
                {showDropdown && (
                  <div className={styles['dropdown']} ref={dropdownRef}>
                    {dropdownLoading ? (
                      <div className={styles.dropdownItem}>Loading...</div>
                    ) : allDropdownValues?.length !== 0 ? (
                      allDropdownValues?.map((item: any) => {
                        return (
                          <div
                            key={item?._id}
                            onClick={() => {
                              setSelectedPage(item._id)
                              setPageInputValue(item.full_name)
                              setShowDropdown(false)
                            }}
                            className={styles.dropdownItem}
                          >
                            {item.profile_image ? (
                              <img
                                src={item?.profile_image}
                                alt="profile"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <Image
                                src={DefaultProfile}
                                alt="profile"
                                width={40}
                                height={40}
                              />
                            )}

                            <p>{item?.full_name}</p>
                          </div>
                        )
                      })
                    ) : (
                      <div className={styles.dropdownItem}>
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`${styles['input-box']} ${
                  data.public_email.error ? styles['input-box-error'] : ''
                }`}
              >
                <label>
                  {isTransferModal ? `Email ID` : `Email ID if different`}{' '}
                </label>
                <input
                  type="text"
                  autoComplete="new"
                  placeholder={`Alternate email ID`}
                  value={data.public_email.value}
                  name="public_email"
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
                    autoComplete="new"
                    placeholder={`Phone number`}
                    value={data.phone.number}
                    name="phone"
                    ref={phoneRef}
                    onChange={handleInputChange}
                    className={styles['phone-input']}
                    onBlur={handlePhoneBlur}
                  />
                </div>

                <p className={styles['helper-text']}>{data.phone.error}</p>
              </div>
              <div
                className={`${styles['input-box']} ${
                  data.whatsapp_number.error ? styles['input-box-error'] : ''
                }`}
              >
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
                          } else {
                            setData((prev) => {
                              return {
                                ...prev,
                                whatsapp_number: {
                                  number: prev['phone'].number,
                                  prefix: selectedCountryCode,
                                },
                              }
                            })
                            setWpSelectedCountryCode(selectedCountryCode)
                          }
                          setTick(!tick)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            e.stopPropagation()
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
                            } else {
                              setData((prev) => {
                                return {
                                  ...prev,
                                  whatsapp_number: {
                                    number: prev['phone'].number,
                                    prefix: selectedCountryCode,
                                  },
                                }
                              })
                              setWpSelectedCountryCode(selectedCountryCode)
                            }
                            setTick(!tick)
                          }
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
                    autoComplete="new"
                    placeholder={`Phone number`}
                    value={data.whatsapp_number.number}
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
                autoComplete="new"
                placeholder={`URL`}
                value={data.website.value}
                name="website"
                ref={websiteRef}
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{data.website.error}</p>
            </div>
            <div className={styles['note-box']}>
              <label>Note</label>
              <textarea
                className={styles['long-input-box']}
                placeholder="This information is visible only to Admins of this Page"
                autoComplete="new"
                value={data.admin_note.value}
                name="admin_note"
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{data.admin_note.error}</p>
            </div>
            <hr className={styles['hr-line']} />

            <p className={styles.kycText}>
              {isTransferModal
                ? 'Once you update the Page Admin, you will lose access to edit the page.'
                : `After updating the Listing Page
              it can be Transferred to a
              different Page Admin`}
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
            ) : isTransferModal ? (
              'Transfer'
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

export default ListingContactEditModal
