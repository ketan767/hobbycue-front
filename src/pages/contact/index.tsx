import React, { useState, useEffect, useRef } from 'react'
import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './styles.module.css'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import Checkbox from '@mui/material/Checkbox'
import CustomTooltip from '@/components/Tooltip/ToolTip'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import { withAuth } from '@/navigation/withAuth'
import { countryData } from '@/utils/countrydata'
import DropdownMenu from '@/components/DropdownMenu'
import DownArrow from '@/assets/svg/chevron-down.svg'
import UpArrow from '@/assets/svg/chevron-up.svg'
import Image from 'next/image'
import { CircularProgress, useMediaQuery } from '@mui/material'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { addContactUs } from '@/services/user.service'
import { containOnlyNumbers } from '@/utils'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { useRouter } from 'next/router'

type ContactUsData = {
  name: InputData<string>
  public_email: InputData<string>
  phone: {
    number: string
    prefix: string
    error?: string | null
  }
  YouAre: InputData<string>
  Regarding: InputData<string>
  message: InputData<string>
  whatsapp_number: {
    number: string
    prefix: string
    error?: string | null
  }
}

type Props = {}

const Contact: React.FC<Props> = ({}) => {
  const router = useRouter()
  const [data, setData] = useState<ContactUsData>({
    name: { value: '', error: null },
    phone: { number: '', prefix: '', error: null },
    public_email: { value: '', error: null },
    YouAre: { value: 'Site / App user', error: null },
    Regarding: { value: 'My Account', error: null },
    message: { value: '', error: null },
    whatsapp_number: { number: '', prefix: '', error: null },
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const inputEmailRef = useRef<HTMLInputElement>(null)
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91')
  const [selectedWpCountryCode, setWpSelectedCountryCode] = useState('+91')
  const [isError, setIsError] = useState(false)
  const [showYouDropdown, setShowYouDropdown] = useState(false)
  const [showRegDropdown, setShowRegDropdown] = useState(false)
  const [focusedYou, setFocusedYou] = useState<number>(-1)
  const [focusedReg, setFocusedReg] = useState<number>(-1)
  const YoudropdownRef = useRef<HTMLDivElement>(null)
  const RegdropdownRef = useRef<HTMLDivElement>(null)
  const submitBtnRef = useRef<HTMLButtonElement>(null)
  const [tick, setTick] = useState(false)
  const WhtphoneRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const YouAreRef = useRef<HTMLInputElement>(null)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const { isLoggedIn, isAuthenticated, user, activeProfile } = useSelector(
    (state: RootState) => state.user,
  )
  const YouareData: Array<{ value: string }> = [
    { value: 'Site / App user' },
    { value: 'Partner / Seller' },
    { value: 'Others' },
  ]

  const Regarding: Array<{ value: string }> = [
    { value: 'My Account' },
    { value: 'Content Related' },
    { value: 'Community' },
    { value: 'Market Place' },
    { value: 'Site Feedback' },
    { value: 'Other Topics' },
  ]

  const handlePrefixChange = (element: any) => {
    const id = element?.id
    setSelectedCountryCode(countryData[id]?.phonePrefix)
    if (tick) {
      handleWpPrefixChange(element)
    }
  }
  const handleWpPrefixChange = (element: any) => {
    const id = element?.id
    setWpSelectedCountryCode(countryData[id]?.phonePrefix)
  }
  const isEmailValid = (email: string): boolean => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (event: any) => {
    const { name, value } = event.target

    if (
      (data.phone.error === 'At least one mode of contact is required!' ||
        data.public_email.error ===
          'At least one mode of contact is required!') &&
      (name === 'phone' || name === 'public_email')
    ) {
      setData((prev) => ({
        ...prev,
        phone: { ...prev.phone, error: null },
        public_email: { ...prev.public_email, error: null },
        [name]: {
          ...prev[name as keyof ContactUsData],
          number: value || '',
          error: null,
        },
      }))
    }

    if (name === 'phone' || name === 'whatsapp_number') {
      // if(tick===true){
      //   setData((prev) => ({
      //     ...prev,
      //     phone: {
      //       ...prev['phone'],
      //       number: value || '',
      //       error: null,
      //     },
      //     whatsapp_number: {
      //       ...prev['whatsapp_number'],
      //       number: value || '',
      //       error: null,
      //     },
      //   }))
      // }else{
      setData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name as keyof ContactUsData],
          number: value || '',
          error: null,
        },
      }))
      // }
    } else if (name === 'message') {
      setData((prev) => ({
        ...prev,
        [name]: { value, error: null },
      }))
    } else {
      setData((prev) => ({
        ...prev,
        [name]: { value, error: null },
      }))
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

  const handleSubmit = async () => {
    let hasError = false

    if (!data.YouAre.value || data.YouAre.value.length === 0) {
      hasError = true
      setData((prev) => ({
        ...prev,
        YouAre: {
          ...prev.YouAre,
          error: 'This field is mandatory',
        },
      }))
    }
    if (!data.Regarding.value || data.Regarding.value.length === 0) {
      hasError = true
      setData((prev) => ({
        ...prev,
        Regarding: {
          ...prev.Regarding,
          error: 'This field is mandatory',
        },
      }))
    }
    if (data.message.value.trim().length < 1) {
      hasError = true
      setData((prev) => ({
        ...prev,
        message: {
          ...prev.message,
          error: "Message can't be empty",
        },
      }))
      // added this timeout because, on enter clicked this error is not showing, because enter makes a new line and changes textarea
      if (
        data.name.value.length === 0 ||
        !data.public_email.value ||
        !data.phone.number
      )
        messageRef.current?.focus()
    }
    if (
      (!data.public_email.value || data.public_email.value.length === 0) &&
      (!data.phone.number ||
        data.phone.number?.toString()?.replace(/\s/g, '').length === 0)
    ) {
      hasError = true
      inputEmailRef.current?.focus()
      setData((prev) => {
        return {
          ...prev,
          public_email: {
            ...prev.public_email,
            error: 'At least one mode of contact is required!',
          },
          phone: {
            ...prev.phone,
            error: 'At least one mode of contact is required!',
          },
        }
      })
    }
    if (data.name.value.length === 0) {
      hasError = true
      setData((prev) => ({
        ...prev,
        name: { ...prev.name, error: 'This field is required!' },
      }))
      inputRef.current?.focus()
    }
    if (data.public_email.value && !isEmailValid(data.public_email.value)) {
      setData((prev) => ({
        ...prev,
        public_email: {
          ...prev.public_email,
          error: 'Enter a valid email',
        },
      }))
      inputEmailRef.current?.focus()
    }
    if (data.phone.number) {
      if (
        !containOnlyNumbers(data.phone.number.toString().trim()) ||
        data.phone.number.toString().replace(/\s/g, '').length > 12 ||
        data.phone.number.toString().replace(/\s/g, '').length < 7
      ) {
        hasError = true
        phoneRef.current?.focus()
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
        hasError = true
        WhtphoneRef.current?.focus()
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

    if (hasError === true) {
      return
    }
    const name = data.name.value
    const email = data.public_email.value
    const phone = {
      number: data.phone.number?.replace(/\s/g, ''),
      prefix: selectedCountryCode,
    }
    const whatsapp_number = {
      number: data.whatsapp_number.number?.replace(/\s/g, ''),
      prefix: selectedWpCountryCode,
    }
    const YouAre = data.YouAre.value
    const Regarding = data.Regarding.value
    const description = data.message.value
    const user_id = !isLoggedIn
      ? 'Not logged In'
      : activeProfile.type === 'listing'
      ? activeProfile?.data?._id
      : user?._id

    setSubmitBtnLoading(true)

    try {
      const { err, res } = await addContactUs({
        name,
        email,
        phone,
        whatsapp_number,
        YouAre,
        Regarding,
        description,
        user_id,
      })

      if (err) {
        console.error('Error:', err)
        setSnackbar({
          display: true,
          type: 'warning',
          message: 'Something went wrong',
        })
      } else {
        setData((prev) => ({ ...prev, message: { value: '', error: null } }))
        setSnackbar({
          display: true,
          type: 'success',
          message: 'Message sent',
        })
      }
    } catch (error) {
      console.error('Internal Server Error:', error)
    } finally {
      setSubmitBtnLoading(false)
    }
  }
  console.log('uer', user)
  useEffect(() => {
    if (isLoggedIn) {
      setData((prev) => ({
        ...prev,
        name: {
          value:
            activeProfile.type === 'user'
              ? user?.full_name
              : activeProfile?.data?.title,
          error: null,
        },
        public_email: {
          value:
            activeProfile.type === 'user'
              ? user?.public_email
              : activeProfile?.data?.public_email,
          error: null,
        },
        phone: {
          number: activeProfile.data?.phone?.number ?? '',
          prefix: activeProfile.data?.phone?.prefix ?? '',
          error: null,
        },
        whatsapp_number: {
          number: activeProfile.data?.whatsapp_number?.number ?? '',
          prefix: activeProfile.data?.whatsapp_number?.prefix ?? '',
          error: null,
        },
      }))
    }
  }, [user, activeProfile, isLoggedIn])

  useEffect(() => {
    const onOutsideClickHandler = (e: MouseEvent) => {
      if (
        YoudropdownRef.current &&
        !YoudropdownRef.current.contains(e.target as Node)
      ) {
        setShowYouDropdown(false)
      }
      if (
        RegdropdownRef.current &&
        !RegdropdownRef.current.contains(e.target as Node)
      ) {
        setShowRegDropdown(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClickHandler)
    return () => {
      document.removeEventListener('mousedown', onOutsideClickHandler)
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (
          event?.srcElement &&
          (event?.srcElement as Element)?.tagName.toLowerCase() === 'textarea'
        ) {
          return
        }
        submitBtnRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const isMobile = useMediaQuery('(max-width:1100px)')
  const questionSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M7.965 12.2C8.21 12.2 8.4172 12.1153 8.5866 11.9459C8.756 11.7765 8.84047 11.5695 8.84 11.325C8.84 11.08 8.75553 10.8728 8.5866 10.7034C8.41767 10.534 8.21047 10.4495 7.965 10.45C7.72 10.45 7.51303 10.5347 7.3441 10.7041C7.17517 10.8735 7.09047 11.0805 7.09 11.325C7.09 11.57 7.1747 11.7772 7.3441 11.9466C7.5135 12.116 7.72047 12.2005 7.965 12.2ZM7.335 9.505H8.63C8.63 9.12 8.67387 8.81667 8.7616 8.595C8.84933 8.37333 9.09713 8.07 9.505 7.685C9.80833 7.38167 10.0475 7.0928 10.2225 6.8184C10.3975 6.544 10.485 6.21453 10.485 5.83C10.485 5.17667 10.2458 4.675 9.7675 4.325C9.28917 3.975 8.72333 3.8 8.07 3.8C7.405 3.8 6.86553 3.975 6.4516 4.325C6.03767 4.675 5.7488 5.095 5.585 5.585L6.74 6.04C6.79833 5.83 6.9297 5.6025 7.1341 5.3575C7.3385 5.1125 7.65047 4.99 8.07 4.99C8.44333 4.99 8.72333 5.0922 8.91 5.2966C9.09667 5.501 9.19 5.72547 9.19 5.97C9.19 6.20333 9.12 6.4222 8.98 6.6266C8.84 6.831 8.665 7.02047 8.455 7.195C7.94167 7.65 7.62667 7.99417 7.51 8.2275C7.39333 8.46083 7.335 8.88667 7.335 9.505ZM8 15C7.03167 15 6.12167 14.8164 5.27 14.4491C4.41833 14.0818 3.6775 13.583 3.0475 12.9525C2.4175 12.3225 1.91887 11.5817 1.5516 10.73C1.18433 9.87833 1.00047 8.96833 1 8C1 7.03167 1.18387 6.12167 1.5516 5.27C1.91933 4.41833 2.41797 3.6775 3.0475 3.0475C3.6775 2.4175 4.41833 1.91887 5.27 1.5516C6.12167 1.18433 7.03167 1.00047 8 1C8.96833 1 9.87833 1.18387 10.73 1.5516C11.5817 1.91933 12.3225 2.41797 12.9525 3.0475C13.5825 3.6775 14.0814 4.41833 14.4491 5.27C14.8168 6.12167 15.0005 7.03167 15 8C15 8.96833 14.8161 9.87833 14.4484 10.73C14.0807 11.5817 13.582 12.3225 12.9525 12.9525C12.3225 13.5825 11.5817 14.0814 10.73 14.4491C9.87833 14.8168 8.96833 15.0005 8 15ZM8 13.6C9.56333 13.6 10.8875 13.0575 11.9725 11.9725C13.0575 10.8875 13.6 9.56333 13.6 8C13.6 6.43667 13.0575 5.1125 11.9725 4.0275C10.8875 2.9425 9.56333 2.4 8 2.4C6.43667 2.4 5.1125 2.9425 4.0275 4.0275C2.9425 5.1125 2.4 6.43667 2.4 8C2.4 9.56333 2.9425 10.8875 4.0275 11.9725C5.1125 13.0575 6.43667 13.6 8 13.6Z"
        fill="#8064A2"
      />
    </svg>
  )
  return (
    <>
      <PageGridLayout column={3}>
        {isLoggedIn ? (
          <div className={styles['switcher-help-centre']}>
            <ProfileSwitcher className={styles['contact-profile-switcher']} />
            {isMobile && (
              <button
                onClick={() => {
                  router.push('/help')
                }}
                className={styles['help-centre-btn']}
              >
                {questionSvg}
                <p>Help Centre</p>
              </button>
            )}
          </div>
        ) : (
          <div></div>
        )}
        <div className={styles['modal-wrapper']}>
          <header className={styles['header']}>
            <h4 className={styles['heading']}>{'Contact Us'}</h4>
          </header>

          <section className={styles['body']}>
            <>
              <section className={styles['two-column-grid']}>
                {/* Your Name */}
                <div className={styles.emailContainer}>
                  <div
                    className={`${styles['input-box']} ${
                      data.name.error ? styles['input-box-error'] : ''
                    }`}
                  >
                    <label>Your Name</label>
                    <input hidden required />
                    <input
                      type="text"
                      placeholder={`Name`}
                      value={data.name.value}
                      ref={inputRef}
                      name="name"
                      onChange={handleInputChange}
                    />
                    <p className={styles['helper-text']}>{data.name.error}</p>
                  </div>
                </div>

                {/* Public Email */}
                <div className={styles.emailContainer}>
                  <div
                    className={`${styles['input-box']} ${
                      data.public_email.error ? styles['input-box-error'] : ''
                    }`}
                  >
                    <label>Email ID</label>
                    <input
                      type="text"
                      placeholder={`Email ID`}
                      value={data.public_email.value}
                      ref={inputEmailRef}
                      name="public_email"
                      autoComplete="email"
                      onChange={handleInputChange}
                    />
                    <p className={styles['helper-text']}>
                      {data.public_email.error}
                    </p>
                  </div>
                </div>
              </section>

              <section className={styles['two-column-grid']}>
                {/* Phone Number */}
                <div
                  className={`${styles['input-box']} ${
                    data.phone.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>Phone Number</label>
                  <div className={styles['phone-prefix-input']}>
                    <DropdownMenu
                      positionClass={styles['dropdown-abs']}
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
                      placeholder={`Phone Number`}
                      value={data.phone.number}
                      name="phone"
                      autoComplete="phone"
                      onChange={handleInputChange}
                      ref={phoneRef}
                      className={styles['phone-input']}
                      onBlur={handlePhoneBlur}
                    />
                  </div>
                  <p className={styles['helper-text']}>{data.phone.error}</p>
                </div>

                {/* WhatsApp Number */}
                <div
                  className={`${styles['input-box']} ${
                    data.whatsapp_number.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label className={styles['whatsapp-label']}>
                    WhatsApp
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
                        />{' '}
                      </div>
                    </CustomTooltip>
                  </label>
                  <div className={styles['phone-prefix-input']}>
                    <DropdownMenu
                      positionClass={styles['dropdown-abs']}
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
                      placeholder={`WhatsApp Number`}
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

              {/* You are */}
              <section className={styles['two-column-grid']}>
                <div
                  className={`${styles['input-box']} ${
                    data.YouAre.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>You are</label>
                  <div className={styles['input-box']}>
                    <input hidden required />
                    <div className={styles['select-container']}>
                      <div
                        className={`${styles['select-input']}  ${
                          data.YouAre.error ? styles['div-error'] : ''
                        }`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          switch (e.key) {
                            case ' ':
                              setShowYouDropdown(true)
                              break
                            case 'Enter':
                              e.preventDefault()
                              e.stopPropagation()
                              if (showYouDropdown) {
                                if (focusedYou !== -1)
                                  setData((prev: any) => ({
                                    ...prev,
                                    YouAre: {
                                      value: YouareData[focusedYou].value,
                                      error: null,
                                    },
                                  }))
                                setShowYouDropdown(false)
                              } else {
                                setShowYouDropdown(true)
                              }
                              break
                            case 'ArrowDown':
                              if (
                                focusedYou === YouareData.length - 1 ||
                                focusedYou === -1
                              ) {
                                setFocusedYou(0)
                              } else {
                                setFocusedYou((prev) => prev + 1)
                              }
                              break
                            case 'ArrowUp':
                              if (focusedYou === 0) {
                                setFocusedYou(YouareData.length - 1)
                              } else if (focusedYou === -1) {
                                setFocusedYou(0)
                              } else {
                                setFocusedYou((prev) => prev - 1)
                              }
                              break
                            default:
                              break
                          }
                        }}
                        onBlur={() =>
                          setTimeout(() => {
                            setShowYouDropdown(false)
                            setFocusedYou(-1)
                          }, 300)
                        }
                        onClick={() => setShowYouDropdown((prev) => !prev)}
                      >
                        <p>{data.YouAre.value || 'Select You Are...'}</p>
                        <Image
                          src={showYouDropdown ? UpArrow : DownArrow}
                          alt="down"
                        />
                      </div>
                      {showYouDropdown && (
                        <div
                          ref={YoudropdownRef}
                          className={styles['options-container']}
                        >
                          <div className={styles['vertical-line']}></div>
                          {YouareData.map((item: any, idx) => (
                            <div
                              className={`${styles['single-option']}  ${
                                data.YouAre.value === item.value
                                  ? styles['selcted-option']
                                  : ''
                              }
                              ${focusedYou === idx && styles['focused-option']}
                              `}
                              key={idx}
                              onClick={() => {
                                setData((prev: any) => ({
                                  ...prev,
                                  YouAre: { value: item.value, error: null },
                                }))
                                setShowYouDropdown(false)
                              }}
                            >
                              <p className={`${styles.tagText}`}>
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={styles['helper-text']}>{data.YouAre.error}</p>
                  </div>
                </div>

                {/* Regarding */}
                <div
                  className={`${styles['input-box']} ${
                    data.Regarding.error ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>Regarding</label>
                  <div className={styles['input-box']}>
                    <input hidden required />
                    <div className={styles['select-container']}>
                      <div
                        className={`${styles['select-input']}  ${
                          data.Regarding.error ? styles['div-error'] : ''
                        }`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          switch (e.key) {
                            case ' ':
                              setShowRegDropdown(true)
                              break
                            case 'Enter':
                              e.preventDefault()
                              e.stopPropagation()
                              if (showRegDropdown) {
                                if (focusedReg !== -1)
                                  setData((prev: any) => ({
                                    ...prev,
                                    Regarding: {
                                      value: Regarding[focusedReg].value,
                                      error: null,
                                    },
                                  }))
                                setShowRegDropdown(false)
                              } else {
                                setShowRegDropdown(true)
                              }
                              break
                            case 'ArrowDown':
                              if (
                                focusedReg === Regarding.length - 1 ||
                                focusedReg === -1
                              ) {
                                setFocusedReg(0)
                              } else {
                                setFocusedReg((prev) => prev + 1)
                              }
                              break
                            case 'ArrowUp':
                              if (focusedReg === 0) {
                                setFocusedReg(Regarding.length - 1)
                              } else if (focusedReg === -1) {
                                setFocusedReg(0)
                              } else {
                                setFocusedReg((prev) => prev - 1)
                              }
                              break
                            default:
                              break
                          }
                        }}
                        onBlur={() =>
                          setTimeout(() => {
                            setShowRegDropdown(false)
                            setFocusedReg(-1)
                          }, 300)
                        }
                        onClick={() => setShowRegDropdown(true)}
                      >
                        <p>{data.Regarding.value || 'Select Regarding...'}</p>
                        <Image
                          src={showRegDropdown ? UpArrow : DownArrow}
                          alt="down"
                        />
                      </div>
                      {showRegDropdown && (
                        <div
                          ref={RegdropdownRef}
                          className={styles['options-container']}
                        >
                          <div className={styles['vertical-line']}></div>
                          {Regarding.map((item: any, idx) => (
                            <div
                              className={`${styles['single-option']}  ${
                                data.Regarding.value === item.value
                                  ? styles['selcted-option']
                                  : ''
                              }
                              ${focusedReg === idx && styles['focused-option']}
                              `}
                              key={idx}
                              onClick={() => {
                                setData((prev: any) => ({
                                  ...prev,
                                  Regarding: { value: item.value, error: null },
                                }))
                                setShowRegDropdown(false)
                              }}
                            >
                              <p className={`${styles.tagText}`}>
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={styles['helper-text']}>
                      {data.Regarding.error}
                    </p>
                  </div>
                </div>
              </section>
              {/* Message */}
              <div className={`${styles['input-box']}`}>
                <label>Message</label>
                    <input hidden required />
                <div className={styles['street-input-container']}>
                  <textarea
                    ref={messageRef}
                    className={`${styles['long-input-box']} ${
                      data.message.error ? styles['div-error'] : ''
                    }`}
                    required
                    name="message"
                    onChange={handleInputChange}
                    value={data.message.value}
                  />
                  <p className={styles['helper-text']}>{data.message.error}</p>
                </div>
              </div>
              <div className={styles['footer']}>
                <button
                  ref={submitBtnRef}
                  onClick={handleSubmit}
                  className={`modal-footer-btn submit ${styles['submit-btn']}`}
                >
                  {submitBtnLoading ? (
                    <CircularProgress color="inherit" size={'24px'} />
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </>
          </section>
        </div>
        {isMobile ? null : (
          <button
            onClick={() => {
              router.push('/help')
            }}
            className={styles['help-centre-btn']}
          >
            {questionSvg}
            <p>Help Centre</p>
          </button>
        )}
      </PageGridLayout>
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

export default Contact
