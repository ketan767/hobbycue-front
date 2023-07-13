import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
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

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}
type ListingContactData = {
  public_email: InputData<string>
  phone: InputData<string>
  website: InputData<string>
  whatsapp_number: InputData<string>
  page_admin: InputData<string>
}

const ListingContactEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [tick, setTick] = useState(false)
  const [data, setData] = useState<ListingContactData>({
    phone: { value: '', error: null },
    public_email: { value: '', error: null },
    website: { value: '', error: null },
    whatsapp_number: { value: '', error: null },
    page_admin: { value: '', error: null },
  })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
   inputRef?.current?.focus()
 }, [])
  const handleInputChange = (event: any) => {
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: { value: event.target.value, error: null },
      }
    })
  }

  const handleSubmit = async () => {
    console.log(data.website);
    if (
      !data.phone.value ||
      !containOnlyNumbers(data.phone.value.toString().trim()) ||
      !data.phone.value
    ) {
      return setData((prev) => {
        return {
          ...prev,
          phone: { ...prev.phone, error: 'Enter a valid phone number' },
        }
      })
    }
    if (data.website.value && data.website.value !== '') {
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
      phone: data.phone.value,
      public_email: data.public_email.value,
      website: data.website.value,
      whatsapp_number: data.whatsapp_number.value,
    }
    console.log('jsonData', jsonData);

    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, jsonData)
    setSubmitBtnLoading(false)
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(updateListingModalData(res?.data.data.listing))
      if (onComplete) onComplete()
      else {
        // window.location.reload()
        dispatch(closeModal())
      }
    }
  }

  useEffect(() => {
    setData((prev) => {
      return {
        public_email: {
          ...prev.public_email,
          value: listingModalData.public_email as string,
        },
        phone: { ...prev.phone, value: listingModalData.phone as string },
        whatsapp_number: {
          ...prev.whatsapp_number,
          value: listingModalData.whatsapp_number as string,
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
    if (isEmpty(data.phone.value)) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

  useEffect(() => {
    if (tick) {
      setData((prev) => {
        return {
          ...prev,
          whatsapp_number: { value: data.phone.value, error: null },
        }
      })
    }
  }, [tick])

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
            {listingModalData.type === 1 ||
            listingModalData.type === 4 ||
            listingModalData.type === 2 ? (
              <div className={styles.useEmailContainer}>
                <p>Either Phone Number or Email ID is required.</p>
                <OutlinedButton
                className={styles['button']}
                  onClick={() =>
                    setData((prev) => {
                      return {
                        ...prev,
                        public_email: { value: user.email, error: null },
                        phone: { value: user.phone, error: null },
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
            {listingModalData.type === 2 ? (
              <div className={styles['two-column-grid']}>
                {listingModalData.type === 2 ? (
                  <div className={styles['input-box']}>
                    <label> Page Admin </label>
                    <input
                      type="text"
                      placeholder={`Page Admin`}
                      value={data.page_admin.value}
                      name="page_admin"
                      autoComplete="page_admin"
                      ref={inputRef}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className={styles['input-box']}>
                  <label>Email ID if different </label>
                  <input
                    type="text"
                    placeholder={`Enter alternate email ID`}
                    value={data.public_email.value}
                    name="public_email"
                    autoComplete="email"
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>
                    {data.public_email.error}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles['input-box']}>
                <label>Email ID</label>
                <input
                  type="text"
                  placeholder={`Enter alternate email ID`}
                  value={data.public_email.value}
                  name="public_email"
                  autoComplete="email"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>
                  {data.public_email.error}
                </p>
              </div>
            )}

            <section className={styles['two-column-grid']}>
              <div className={styles['input-box']}>
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder={`+91`}
                  value={data.phone.value}
                  name="phone"
                  autoComplete="phone"
                  required
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.phone.error}</p>
              </div>
              <div className={styles['input-box']}>
                <label className={styles['whatsapp-label']}>
                  WhatsApp Number
                  <Checkbox
                    size="small"
                    color="primary"
                    name="rememberMe"
                    className={styles.checkbox}
                    value={!tick}
                    checked={tick}
                    onChange={(e) => setTick(!tick)}
                  />{' '}
                </label>
                <input
                  type="text"
                  placeholder={`-91`}
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

            <p className={styles.kycText}>
              {' '}
              {/* Seller KYC and Bank details can be entered only on claimed and
              verified listing pages{' '} */}
            </p>
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

export default ListingContactEditModal
