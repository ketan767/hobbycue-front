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

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ProfileGeneralData = {
  full_name: string
  tagline: string
  display_name: string
  profile_url: string
  gender: 'male' | 'female' | null
  year_of_birth: string
}

const ProfileGeneralEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.user)
  const fullNameRef = useRef<HTMLInputElement>(null)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)

  const [data, setData] = useState<ProfileGeneralData>({
    full_name: '',
    tagline: '',
    display_name: '',
    profile_url: '',
    gender: null,
    year_of_birth: '',
  })

  const [inputErrs, setInputErrs] = useState<{ [key: string]: string | null }>({
    full_name: null,
    tagline: null,
    display_name: null,
    profile_url: null,
    gender: null,
    year_of_birth: null,
  })

  const handleInputChange = (event: any) => {
    setData((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
    setInputErrs((prev) => {
      return { ...prev, [event.target.name]: null }
    })
  }

  const handleSubmit = async () => {
    if (isEmptyField(data.full_name)) {
      return setInputErrs((prev) => {
        return { ...prev, full_name: 'This field is required!' }
      })
    }
    if (checkFullname(data.full_name)) {
      return setInputErrs((prev) => {
        return {
          ...prev,
          full_name: 'First name should not contain any numbers!',
        }
      })
    }
    if (!data.display_name || data.display_name === '') {
      return setInputErrs((prev) => {
        return { ...prev, display_name: 'This field is required!' }
      })
    }
    if (isEmptyField(data.profile_url)) {
      return setInputErrs((prev) => {
        return { ...prev, profile_url: 'This field is required!' }
      })
    }
    if (
      !containOnlyNumbers(data.year_of_birth) &&
      data.year_of_birth &&
      data.year_of_birth !== ''
    ) {
      return setInputErrs((prev) => {
        return { ...prev, year_of_birth: 'Enter a valid year of birth' }
      })
    }

    setSubmitBtnLoading(true)
    const { err, res } = await updateMyProfileDetail(data)
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
      if (onComplete) onComplete()
      else {
        window.location.reload()
        dispatch(closeModal())
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

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/check-profile-url/${data.profile_url}`,
        { headers },
      )
      .then((res) => {
        setInputErrs((prev) => {
          return { ...prev, profile_url: null }
        })
      })
      .catch((err) => {
        setInputErrs((prev) => {
          return { ...prev, profile_url: 'This profile url is already taken' }
        })
      })
  }, [data.profile_url])

  useEffect(() => {
    if (onComplete !== undefined) {
      let profileUrl = data.full_name
      profileUrl = profileUrl?.toLowerCase()
      profileUrl = profileUrl?.replace(/ /g, '-')
      setData((prev) => {
        return { ...prev, profile_url: profileUrl }
      })
    }
  }, [data.full_name])

  useEffect(() => {
    setData({
      full_name: user.full_name,
      tagline: user.tagline,
      display_name: user.display_name,
      profile_url: user.profile_url,
      gender: user.gender,
      year_of_birth: user.year_of_birth,
    })
  }, [user])

  useEffect(() => {
    fullNameRef?.current?.focus()
  }, [])
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'General'}</h4>
        </header>

        <hr />

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
                placeholder="Something catchy..."
                value={data.tagline}
                name="tagline"
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{inputErrs.tagline}</p>
            </div>

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
              />
              <p className={styles['helper-text']}>{inputErrs.display_name}</p>
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
                  value={data.profile_url}
                  name="profile_url"
                  onChange={handleInputChange}
                />
                <span>https://hobbycue.com/profile/</span>
              </div>
              <p className={styles['helper-text']}>{inputErrs.profile_url}</p>
            </div>

            <div className={styles['year-gender-wrapper']}>
              {/* Year Of Birth*/}
              <div className={styles['input-box']}>
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

              {/* Gender */}
              <div className={styles['input-box']}>
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

          <button
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
        </footer>
      </div>
    </>
  )
}

export default ProfileGeneralEditModal
