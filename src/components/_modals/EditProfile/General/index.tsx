import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import {
  checkFullname,
  containOnlyNumbers,
  isEmpty,
  isEmptyField,
} from '@/utils'
import { closeModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateUser } from '@/redux/slices/user'
import FilledButton from '@/components/_buttons/FilledButton'
import axios from 'axios'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  CheckIsOnboarded?: any
}

type ProfileGeneralData = {
  full_name: string
  tagline: string
  display_name: string
  profile_url: string
  gender: 'male' | 'female' | null
  year_of_birth: string
  onboarding_step?: string
  completed_onboarding_steps?: any
}

const ProfileGeneralEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  CheckIsOnboarded,
}) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.user)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [isError, setIsError] = useState(false)
  const [initialData, setInitialData] = useState<ProfileGeneralData>()
  const [isChanged, setIsChanged] = useState(false)

  const fullNameRef = useRef<HTMLInputElement>(null)
  const displayNameRef = useRef<HTMLInputElement>(null)
  const profileUrlRef = useRef<HTMLInputElement>(null)
  const dobRef = useRef<HTMLInputElement>(null)
  const [urlSpanLength, setUrlSpanLength] = useState<number>(0)
  const urlSpanRef = useRef<HTMLSpanElement>(null)

  const [data, setData] = useState<ProfileGeneralData>({
    full_name: '',
    tagline: '',
    display_name: '',
    profile_url: '',
    gender: null,
    year_of_birth: '',

    completed_onboarding_steps: 'General',
  })

  const [inputErrs, setInputErrs] = useState<{ [key: string]: string | null }>({
    full_name: null,
    tagline: null,
    display_name: null,
    profile_url: null,
    gender: null,
    year_of_birth: null,
  })

  const yearOfBirthCheck = (year: any) => {
    if (isNaN(year)) {
      return false
    }
    const currentYear = new Date().getFullYear()
    return currentYear - year
  }

  const handleInputChange = (event: any) => {
    const { name, value } = event.target
    if (name === 'profile_url') {
      // Only apply this modification for the profile_url field
      // Replace special characters with '-'
      const modifiedValue = value.replace(/[^a-zA-Z0-9-]/g, '-')
      setData((prev) => ({ ...prev, [name]: modifiedValue }))
      setInputErrs((prev) => ({ ...prev, [name]: null }))
    } else {
      setData((prev) => ({ ...prev, [name]: value }))
      setInputErrs((prev) => ({ ...prev, [name]: null }))
    }

    // Compare current data with initial data to check for changes
    const currentData = { ...data, [name]: value }
    const hasChanges =
      JSON.stringify(currentData) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)
    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }

  const baseURL =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '')

  const handleSubmit = async () => {
    if (isEmptyField(data.full_name) || !data.full_name) {
      fullNameRef.current?.focus()
      return setInputErrs((prev) => {
        return { ...prev, full_name: 'This field is required!' }
      })
    }

    if (!data.display_name || data.display_name === '') {
      displayNameRef.current?.focus()
      return setInputErrs((prev) => {
        return { ...prev, display_name: 'This field is required!' }
      })
    }
    if (isEmptyField(data.profile_url) || !data.profile_url) {
      profileUrlRef.current?.focus()
      return setInputErrs((prev) => {
        return { ...prev, profile_url: 'This field is required!' }
      })
    }
    if (data.year_of_birth && data.year_of_birth !== '') {
      if (containOnlyNumbers(data?.year_of_birth)) {
        var check = yearOfBirthCheck(data.year_of_birth)
        dobRef.current?.focus()
        if (check !== false) {
          if (check >= 100) {
            return setInputErrs((prev) => {
              return { ...prev, year_of_birth: 'Maximum age: 100' }
            })
          }

          if (check < 13) {
            return setInputErrs((prev) => {
              return { ...prev, year_of_birth: 'Minimum age is 13' }
            })
          }
        } else {
          return setInputErrs((prev) => {
            return { ...prev, year_of_birth: 'Enter a valid year' }
          })
        }
      } else {
        return setInputErrs((prev) => {
          return { ...prev, year_of_birth: 'Enter a valid year' }
        })
      }
    }

    setSubmitBtnLoading(true)
    const newOnboardingStep =
      Number(user?.onboarding_step) > 0 ? user?.onboarding_step : '1'

    let updatedCompletedSteps = [...user.completed_onboarding_steps]

    if (!updatedCompletedSteps.includes('General')) {
      updatedCompletedSteps.push('General')
    }
    const { err, res } = await updateMyProfileDetail({
      ...data,
      onboarding_step: newOnboardingStep,
      completed_onboarding_steps: updatedCompletedSteps,
    })
    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }
    if (!res?.data.success) {
      setSubmitBtnLoading(false)
      return alert('Something went wrong!')
    }

    const { err: error, res: response } = await getMyProfileDetail()
    setSubmitBtnLoading(false)
    if (error) return console.log(error)
    if (response?.data.success) {
      dispatch(updateUser(response?.data.data.user))
      if (onComplete) {
        onComplete()
      } else {
        if (!user.is_onboarded) {
          await CheckIsOnboarded()
          const newUrl = `/profile/${data.profile_url}`
          window.location.href = newUrl
          return
        } else {
          const newUrl = `/profile/${data.profile_url}`
          window.location.href = newUrl
          dispatch(closeModal())
        }
      }
    }
  }

  useEffect(() => {
    if (
      isEmpty(data.full_name) ||
      isEmpty(data.display_name) ||
      isEmpty(data.profile_url)
    ) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

  const checkProfileUrl = () => {
    const token = localStorage.getItem('token')
    if (!user.profile_url) return
    if (!data.profile_url) return
    const headers = { Authorization: `Bearer ${token}` }
    if (user.profile_url !== data.profile_url) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/check-profile-url/${data.profile_url}`,
          { headers },
        )
        .then((res) => {
          console.log('res', res)
          setInputErrs((prev) => {
            return { ...prev, profile_url: null }
          })
        })
        .catch((err) => {
          console.log('err', err)
          setInputErrs((prev) => {
            return { ...prev, profile_url: 'This profile url is already taken' }
          })
        })
    } else {
      setInputErrs((prev) => {
        return { ...prev, profile_url: null }
      })
    }
  }

  useEffect(() => {
    checkProfileUrl()
  }, [data.profile_url, user.profile_url])

  useEffect(() => {
    if (onComplete !== undefined && /^\d+$/.test(user.profile_url)) {
      let profileUrl = data.full_name
      profileUrl = profileUrl
        ?.toLowerCase()
        .replace(/\s+/g, '-') // Replace consecutive spaces with a single hyphen
        .replace(/[^\w\s-]/g, '-') // Replace special characters with a single hyphen
        .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
      setData((prev) => ({ ...prev, profile_url: profileUrl }))
      if (!user.display_name) {
        setData((prev) => ({
          ...prev,
          display_name: profileUrl.split('-')[0], // Use modified profileUrl for display_name
        }))
      }
    }
  }, [data.full_name])

  console.log('type', typeof user.profile_url)
  useEffect(() => {
    // Set initial data with user's current profile data
    const initialProfileData = {
      full_name: user.full_name || '',
      tagline: user.tagline || '',
      display_name: user.display_name || '',
      profile_url: user.profile_url || '',
      gender: user.gender || null,
      year_of_birth: user.year_of_birth || '',
      onboarding_step: user.onboarding_step || '0',
    }
    setInitialData(initialProfileData)
    setData(initialProfileData)
  }, [user])

  console.log('data', data)

  useEffect(() => {
    fullNameRef?.current?.focus()
    const length = urlSpanRef.current?.offsetWidth ?? 0
    setUrlSpanLength(length + 12)
  }, [])
  const HandleSaveError = async () => {
    if (
      isEmptyField(data.full_name) ||
      !data.full_name ||
      !data.display_name ||
      data.display_name === '' ||
      isEmptyField(data.profile_url) ||
      !data.profile_url
    ) {
      setIsError(true)
    }
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
          onClick={() =>
            isChanged ? setConfirmationModal(true) : handleClose()
          }
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'General'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <>
            {/* Full Name */}
            <div
              className={`${styles['input-box']} ${
                inputErrs.full_name ? styles['input-box-error'] : ''
              }`}
            >
              <label className={styles['label-required']}>Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                required
                value={data.full_name}
                name="full_name"
                onChange={handleInputChange}
                ref={fullNameRef}
              />
              <p className={styles['helper-text']}>{inputErrs.full_name}</p>
            </div>

            {/* Tagline */}
            <div
              className={`${styles['input-box']} ${
                inputErrs.tagline ? styles['input-box-error'] : ''
              }`}
            >
              <label>Tagline</label>
              <input
                type="text"
                placeholder="Something catchy... that also appears in search results"
                value={data.tagline}
                name="tagline"
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{inputErrs.tagline}</p>
            </div>

            {/* Profile URL */}
            <div
              className={`${styles['input-box']} ${
                inputErrs.profile_url ? styles['input-box-error'] : ''
              }`}
            >
              <label className={styles['label-required']}>Profile URL</label>
              <div className={styles['profile-url-input']}>
                <input
                  type="text"
                  placeholder="profile-url"
                  required
                  value={data.profile_url as string}
                  name="profile_url"
                  onChange={handleInputChange}
                  ref={profileUrlRef}
                  style={{
                    paddingLeft: urlSpanLength + 'px',
                    paddingTop: '13px',
                  }}
                />
                <span ref={urlSpanRef}>{'/profile/'}</span>
              </div>
              <p className={styles['helper-text']}>{inputErrs.profile_url}</p>
            </div>
            <section className={styles['three-column-grid']}>
              {/* Display Name */}
              <div
                className={`${styles['input-box']} ${
                  inputErrs.display_name ? styles['input-box-error'] : ''
                }`}
              >
                <label className={styles['label-required']}>Display Name</label>
                <input
                  type="text"
                  placeholder="Display Name"
                  required
                  autoComplete="nickname"
                  value={data.display_name}
                  name="display_name"
                  onChange={handleInputChange}
                  ref={displayNameRef}
                />
                <p className={styles['helper-text']}>
                  {inputErrs.display_name}
                </p>
              </div>

              <div className={styles['year-gender-wrapper']}>
                {/* Year Of Birth*/}
                <div
                  className={`${styles['input-box']} ${
                    inputErrs.year_of_birth ? styles['input-box-error'] : ''
                  }`}
                >
                  <label>Year of Birth</label>
                  <input
                    type="text"
                    placeholder="Year"
                    required
                    autoComplete="bday-year"
                    value={data.year_of_birth}
                    name="year_of_birth"
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>
                    {inputErrs.year_of_birth}
                  </p>
                </div>
              </div>
            </section>
            {/* Gender */}
            <div className={styles['gender-box']}>
              <label>Gender</label>
              <div className={styles['gender-radio-btns']}>
                <p
                  onClick={(e) => {
                    setData((prev) => {
                      return { ...prev, gender: 'male' }
                    })
                    setInputErrs((prev) => {
                      return { ...prev, gender: null }
                    })
                  }}
                >
                  <svg
                    tabIndex={0}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle cx="8" cy="8" r="7.5" stroke="#8064A2" />
                    {data.gender === 'male' && (
                      <circle cx="8" cy="8" r="4" fill="#8064A2" />
                    )}
                  </svg>
                  Male
                  <input type="radio" required />
                </p>

                <p
                  onClick={(e) => {
                    setData((prev) => {
                      return { ...prev, gender: 'female' }
                    })
                    setInputErrs((prev) => {
                      return { ...prev, gender: null }
                    })
                  }}
                >
                  <svg
                    tabIndex={0}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <circle cx="8" cy="8" r="7.5" stroke="#8064A2" />
                    {data.gender === 'female' && (
                      <circle cx="8" cy="8" r="4" fill="#8064A2" />
                    )}
                  </svg>
                  Female
                  <input type="radio" required />
                </p>
              </div>
              <p className={styles['helper-text']}>{inputErrs.gender}</p>
            </div>
          </>
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
          <div onClick={onBackBtnClick}>
            <Image src={BackIcon} alt="Back" className={styles['Back-btn']} />
          </div>

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
                alt="next"
                className={`${styles['next-genral-btn']} modal-mob-btn submit`}
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

export default ProfileGeneralEditModal
