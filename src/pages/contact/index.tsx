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
import Image from 'next/image'
import { CircularProgress } from '@mui/material'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { addContactUs } from '@/services/user.service'
import { containOnlyNumbers } from '@/utils'

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
  const [data, setData] = useState<ContactUsData>({
    name: { value: '', error: null },
    phone: { number: '', prefix: '', error: null },
    public_email: { value: '', error: null },
    YouAre: { value: '', error: null },
    Regarding: { value: '', error: null },
    message: { value: '', error: null },
    whatsapp_number: { number: '', prefix: '', error: null },
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91')
  const [selectedWpCountryCode, setWpSelectedCountryCode] = useState('+91')
  const [isError, setIsError] = useState(false)
  const [showYouDropdown, setShowYouDropdown] = useState(false)
  const [showRegDropdown, setShowRegDropdown] = useState(false)
  const YoudropdownRef: any = useRef()
  const RegdropdownRef: any = useRef()
  const [tick, setTick] = useState(false)
  const WhtphoneRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const YouAreRef = useRef<HTMLInputElement>(null)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
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
  }
  const handleWpPrefixChange = (element: any) => {
    const id = element?.id
    setWpSelectedCountryCode(countryData[id]?.phonePrefix)
  }

  const handleInputChange = (event: any) => {
    const { name, value } = event.target

    if (name === 'phone' || name === 'whatsapp_number') {
      setData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name as keyof ContactUsData],
          number: value || '',
          error: null,
        },
      }))
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
    const {name,value} = e.target;
      setWpSelectedCountryCode(selectedCountryCode)
    if(name==="phone"){
      setData((prev) => ({
        ...prev,
        "whatsapp_number": {
          ...prev["whatsapp_number"],
          number: value || '',
          error: null,
        },
      }))
    }
  }

  const handleSubmit = async () => {
    if (
      (!data.public_email.value || data.public_email.value === '') &&
      (!data.phone.number || data.phone.number === '')
    ) {
      inputRef.current?.focus()
      return setData((prev) => {
        return {
          ...prev,
          public_email: {
            ...prev.public_email,
            error: 'This field is required!',
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

    const name = data.name.value
    const email = data.public_email.value
    const phone = {
      number: data.phone.number,
      prefix: selectedCountryCode,
    }
    const whatsapp_number = {
      number: data.whatsapp_number.number,
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

  return (
    <>
      <PageGridLayout column={3}>
        {isLoggedIn ? <ProfileSwitcher /> : <div></div>}
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
                    <input
                      type="text"
                      placeholder={`Name`}
                      value={data.name.value}
                      ref={inputRef}
                      name="name"
                      onChange={handleInputChange}
                    />
                    <p className={styles['helper-text']}>
                      {data.public_email.error}
                    </p>
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
                      ref={inputRef}
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
                      onBlur={handleBlur}
                    />
                  </div>
                  <p className={styles['helper-text']}>{data.phone.error}</p>
                </div>

                {/* WhatsApp Number */}
                <div className={styles['input-box']}>
                  <label className={styles['whatsapp-label']}>
                    WhatsApp
                    {/* <CustomTooltip title="Use same">
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
                            }
                            setTick(!tick)
                          }}
                        />{' '}
                      </div>
                    </CustomTooltip> */}
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
                    <div
                      className={styles['select-container']}
                      ref={YoudropdownRef}
                    >
                      <div
                        className={styles['select-input']}
                        onClick={() => setShowYouDropdown(true)}
                      >
                        <p>{data.YouAre.value || 'Select You Are...'}</p>
                        <Image src={DownArrow} alt="down" />
                      </div>
                      {showYouDropdown && (
                        <div className={styles['options-container']}>
                          <div className={styles['vertical-line']}></div>
                          {YouareData.map((item: any, idx) => (
                            <div
                              className={`${styles['single-option']}  ${
                                data.YouAre.value === item.value
                                  ? styles['selcted-option']
                                  : ''
                              }`}
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
                    <div
                      className={styles['select-container']}
                      ref={RegdropdownRef}
                    >
                      <div
                        className={styles['select-input']}
                        onClick={() => setShowRegDropdown(true)}
                      >
                        <p>{data.Regarding.value || 'Select Regarding...'}</p>
                        <Image src={DownArrow} alt="down" />
                      </div>
                      {showRegDropdown && (
                        <div className={styles['options-container']}>
                          <div className={styles['vertical-line']}></div>
                          {Regarding.map((item: any, idx) => (
                            <div
                              className={`${styles['single-option']}  ${
                                data.Regarding.value === item.value
                                  ? styles['selcted-option']
                                  : ''
                              }`}
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
                    <p className={styles['helper-text']}>{data.YouAre.error}</p>
                  </div>
                </div>
              </section>
              {/* Message */}
              <div
                className={`${styles['input-box']} ${
                  data.Regarding.error ? styles['input-box-error'] : ''
                }`}
              >
                <label>Message</label>
                <div className={styles['street-input-container']}>
                  <textarea
                    className={styles['long-input-box']}
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
      </PageGridLayout>
    </>
  )
}

export default Contact
