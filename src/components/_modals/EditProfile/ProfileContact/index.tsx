import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserAddress,
  getMyProfileDetail,
  updateMyProfileDetail,
  updateUserAddress,
} from '@/services/user.service'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
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
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  console.log('🚀 ~ file: index.tsx:34 ~ user:', user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [data, setData] = useState<ProfileContactData>({
    phone: { value: '', error: null },
    public_email: { value: '', error: null },
    website: { value: '', error: null },
    whatsapp_number: { value: '', error: null },
  })

  const handleInputChange = (event: any) => {
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: { value: event.target.value, error: null },
      }
    })
  }

  const handleSubmit = async () => {
    if (isEmptyField(data.public_email.value)) {
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
    if (isEmptyField(data.phone.value)) {
      return setData((prev) => {
        return {
          ...prev,
          phone: { ...prev.phone, error: 'This field is required!' },
        }
      })
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
    setData((prev) => {
      return {
        public_email: {
          ...prev.public_email,
          value: user.public_email as string,
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

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Contact Information'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <>
            {/* Public Email */}
            <div className={styles.emailContainer}>
              <div className={styles['input-box']}>
                <label>Email ID (public)</label>
                <input
                  type="text"
                  placeholder={`Enter email ID`}
                  value={data.public_email.value}
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
              <div className={styles['input-box']}>
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder={`Enter Phone Number`}
                  value={data.phone.value}
                  name="phone"
                  autoComplete="phone"
                  required
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.phone.error}</p>
              </div>

              {/* WhatsApp Number */}
              <div className={styles['input-box']}>
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  placeholder={`Enter WhatsApp Number`}
                  value={data.whatsapp_number.value}
                  autoComplete="phone"
                  name="whatsapp_number"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>
                  {data.whatsapp_number.error}
                </p>
              </div>
            </section>

            {/* Website */}
            <div className={styles['input-box']}>
              <label>Website</label>
              <input
                type="text"
                placeholder={`URL`}
                value={data.website.value}
                name="website"
                autoComplete="website"
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{data.website.error}</p>
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

export default ProfileContactEditModal
