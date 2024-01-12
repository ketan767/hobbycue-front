import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress, MenuItem, Select } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import { containOnlyNumbers } from '@/utils'
import { isEmptyField, validateUrl } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import Checkbox from '@mui/material/Checkbox'
import CustomTooltip from '@/components/Tooltip/ToolTip'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'
import { countryData } from '@/utils/countrydata'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
}
type ProfileContactData = {
  public_email: InputData<string>
  phone: InputData<string>
  website: InputData<string>
  whatsapp_number: InputData<string>
}

const ProfileContactEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [tick, setTick] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const websiteRef = useRef<HTMLInputElement>(null)
  const WhtphoneRef = useRef<HTMLInputElement>(null)
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91')
  const [selectedWpCountryCode, setWpSelectedCountryCode] = useState('+91')

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)
  const phoneRef = useRef<HTMLInputElement>(null)

  const [data, setData] = useState<ProfileContactData>({
    phone: { value: '', error: null },
    public_email: { value: '', error: null },
    website: { value: '', error: null },
    whatsapp_number: { value: '', error: null },
  })

  const [initialData, setInitialData] = useState<ProfileContactData>()
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    setInitialData({
      public_email: { value: user.public_email, error: null },
      phone: { value: user.phone, error: null },
      website: { value: user.website, error: null },
      whatsapp_number: { value: user.whatsapp_number, error: null },
    })
  }, [user])

  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: { value: event.target.value, error: null },
      }
    })

    const currentData = { ...data, [name]: value }
    const hasChanges =
      JSON.stringify(currentData) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)
    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }

  const Backsave = async () => {
    setBackBtnLoading(true)
    if (
      (!data.public_email.value || data.public_email.value === '') &&
      (!data.phone.value || data.phone.value === '')
    ) {
      if (onBackBtnClick) onBackBtnClick()
      setBackBtnLoading(false)
    } else {
      const jsonData = {
        phone: data.phone.value,
        public_email: data.public_email.value,
        website: data.website.value,
        whatsapp_number: data.whatsapp_number.value,
      }

      setBackBtnLoading(true)

      const { err, res } = await updateMyProfileDetail(jsonData)

      if (err) {
        setBackBtnLoading(false)
        return console.log(err)
      }

      const { err: error, res: response } = await getMyProfileDetail()
      setBackBtnLoading(true)

      if (error) return console.log(error)
      if (response?.data.success) {
        dispatch(updateUser(response.data.data.user))
        if (onBackBtnClick) onBackBtnClick()
        setBackBtnLoading(false)
      }
    }
  }

  const handleSubmit = async () => {
    if (
      (!data.public_email.value || data.public_email.value === '') &&
      (!data.phone.value || data.phone.value === '')
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
    if (data.phone.value) {
      if (
        !containOnlyNumbers(data.phone.value.toString().trim()) ||
        data.phone.value.toString().trim().length !== 10
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
    if (data.whatsapp_number.value) {
      if (
        !containOnlyNumbers(data.whatsapp_number.value.toString().trim()) ||
        data.whatsapp_number.value.toString().trim().length !== 10
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
    if (data.website.value && data.website.value !== '') {
      if (!validateUrl(data.website.value)) {
        websiteRef.current?.focus()
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
      phone: data.phone.value,
      public_email: data.public_email.value,
      website: data.website.value,
      whatsapp_number: data.whatsapp_number.value,
    }

    setSubmitBtnLoading(true)

    const { err, res } = await updateMyProfileDetail(jsonData)

    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }

    const { err: error, res: response } = await getMyProfileDetail()
    setSubmitBtnLoading(false)

    if (error) return console.log(error)
    if (response?.data.success) {
      dispatch(updateUser(response.data.data.user))
      if (onComplete) onComplete()
      else {
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }
  useEffect(() => {
    if (tick) {
      setData((prev) => {
        return {
          ...prev,
          whatsapp_number: { value: data.phone.value, error: null },
        }
      })
      setWpSelectedCountryCode(selectedCountryCode)
    }
  }, [tick])

  useEffect(() => {
    setData((prev) => {
      let publicEmail = ''
      if (user.public_email) {
        publicEmail = user.public_email
      } else if (user.email) {
        publicEmail = user.email
      }
      return {
        public_email: {
          ...prev.public_email,
          value: publicEmail as string,
        },
        phone: { ...prev.phone, value: user.phone as string },
        whatsapp_number: {
          ...prev.whatsapp_number,
          value: user.whatsapp_number as string,
        },
        website: { ...prev.website, value: user.website as string },
      }
    })
  }, [user])

  const HandleSaveError = async () => {
    if (
      (!data.public_email.value || data.public_email.value === '') &&
      (!data.phone.value || data.phone.value === '')
    ) {
      setIsError(true)
    }
  }

  const handlePrefixChange = (value: string) => {
    setSelectedCountryCode(value)
  }
  const handleWpPrefixChange = (value: string) => {
    setWpSelectedCountryCode(value)
  }

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

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
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

        <hr />

        <section className={styles['body']}>
          <>
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
                  placeholder={`Enter email ID`}
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
              <div className={styles['input-box']}></div>
            </div>
            <section className={styles['two-column-grid']}>
              {/* Phone Number */}
              <div
                className={`${styles['input-box']} ${
                  data.phone.error ? styles['input-box-error'] : ''
                }`}
              >
                <label>Phone Number</label>
                <div className={styles['phone-prefix-input']}>
                  <Select
                    value={selectedCountryCode}
                    className={styles['country-select']}
                    onChange={(event) =>
                      handlePrefixChange(event.target.value as string)
                    }
                  >
                    {countryData.map((country, idx) => (
                      <MenuItem key={idx} value={country.phonePrefix}>
                        {country.phonePrefix}
                      </MenuItem>
                    ))}
                  </Select>
                  <input
                    type="text"
                    placeholder={`Enter Phone Number`}
                    value={data.phone.value}
                    name="phone"
                    autoComplete="phone"
                    onChange={handleInputChange}
                    ref={phoneRef}
                    className={styles['phone-input']}
                  />
                </div>
                <p className={styles['helper-text']}>{data.phone.error}</p>
              </div>

              {/* WhatsApp Number */}
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
                        onChange={(e) => setTick(!tick)}
                      />{' '}
                    </div>
                  </CustomTooltip>
                </label>
                <div className={styles['phone-prefix-input']}>
                  <Select
                    value={selectedWpCountryCode}
                    className={styles['country-select']}
                    onChange={(event) =>
                      handleWpPrefixChange(event.target.value as string)
                    }
                  >
                    {countryData.map((country, idx) => (
                      <MenuItem key={idx} value={country.phonePrefix}>
                        {country.phonePrefix}
                      </MenuItem>
                    ))}
                  </Select>
                  <input
                    type="text"
                    placeholder={`Enter WhatsApp Number`}
                    value={data.whatsapp_number.value}
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
                data.website.error ? styles['input-box-error'] : ''
              }`}
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
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel" onClick={Backsave}>
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={Backsave}>
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
              Save
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ProfileContactEditModal
