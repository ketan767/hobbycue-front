import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import { getMyProfileDetail, updateMyProfileDetail } from '@/services/user.service'
import { isEmptyField } from '@/utils'
import { closeModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateUser } from '@/redux/slices/user'
import FilledButton from '@/components/_buttons/FilledButton'

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

const ProfileGeneralEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.user)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

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

  const handleSubmit = () => {
    if (isEmptyField(data.full_name)) {
      return setInputErrs((prev) => {
        return { ...prev, full_name: 'This field is required!' }
      })
    }
    if (isEmptyField(data.display_name)) {
      return setInputErrs((prev) => {
        return { ...prev, display_name: 'This field is required!' }
      })
    }
    if (isEmptyField(data.profile_url)) {
      return setInputErrs((prev) => {
        return { ...prev, profile_url: 'This field is required!' }
      })
    }
    if (isEmptyField(data.year_of_birth)) {
      return setInputErrs((prev) => {
        return { ...prev, year_of_birth: 'This field is required!' }
      })
    }
    if (!data.gender) {
      return setInputErrs((prev) => {
        return { ...prev, gender: 'This field is required!' }
      })
    }

    setSubmitBtnLoading(true)
    updateMyProfileDetail(data, async (err, res) => {
      if (err) {
        setSubmitBtnLoading(false)
        return console.log(err)
      }
      if (!res.data.success) {
        setSubmitBtnLoading(false)
        return alert('Something went wrong!')
      }

      const { err: error, res: response } = await getMyProfileDetail()
      setSubmitBtnLoading(false)
      if (error) return console.log(error)
      if (response?.data.success) {
        dispatch(updateUser(response?.data.data.user))
        if (onComplete) onComplete()
        else dispatch(closeModal())
      }
    })
  }

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
            <div className={styles['input-box']}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                required
                value={data.full_name}
                name="full_name"
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{inputErrs.full_name}</p>
            </div>

            {/* Tagline */}
            <div className={styles['input-box']}>
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
            <div className={styles['input-box']}>
              <label>Display Name</label>
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
            <div className={styles['input-box']}>
              <label>Profile URL</label>
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
                <p className={styles['helper-text']}>{inputErrs.year_of_birth}</p>
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
                      {data.gender === 'male' && <circle cx="8" cy="8" r="4" fill="#8064A2" />}
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
                      {data.gender === 'female' && <circle cx="8" cy="8" r="4" fill="#8064A2" />}
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

export default ProfileGeneralEditModal
