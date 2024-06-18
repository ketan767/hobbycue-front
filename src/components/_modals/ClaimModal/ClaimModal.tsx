import React, { useState, useEffect, useRef, SetStateAction } from 'react'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import styles from './style.module.css'
import { useSelector } from 'react-redux'
import { ClaimListing, ClaimRequest } from '@/services/auth.service'
import { CircularProgress } from '@mui/material'
import { RootState } from '@/redux/store'
import DropdownMenu from '@/components/DropdownMenu'
import { countryData } from '@/utils/countrydata'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { SnackbarState } from '../ModalManager'
type Props = {
  data?: ListingPageData['pageData']
  setSnackbar?: React.Dispatch<SetStateAction<SnackbarState>>
}

const ClaimModal = (props: Props) => {
  const { setSnackbar } = props
  const phoneRef = useRef<HTMLInputElement>(null)
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91')
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const pageURL = window.location.href.split('/').reverse()[0]
  const listingUrlSpanRef = useRef<HTMLSpanElement>(null)
  const [listingUrlSpanLength, setListingUrlSpanLength] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  let userData = useSelector((store: any) => store.user.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [formData, setFormData] = useState({
    id: userData._id,
    owner_id: listingModalData.admin,
    listing_id: listingModalData._id,
    profileName: userData.full_name,
    email: userData.email,
    phonenumber: userData.phone?.number,
    phonePrefix: selectedCountryCode,
    pageUrl: String(listingModalData?.page_url),
    userRelation: '',
    websiteLink: 'https://',
    title: listingModalData?.title,
  })

  const [inputErrs, setInputErrs] = useState<{ [key: string]: string | null }>({
    userRelation: null,
  })

  const handleInputChange = (e: any) => {
    let { value, name } = e.target

    if (name === 'phone') {
      setFormData((prevValue) => ({
        ...prevValue,
        phonenumber: value,
      }))
    } else {
      setFormData((prevValue) => ({
        ...prevValue,
        [name]: value,
      }))
    }
  }

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
  const userId = formData.id
  const owner_id = formData.owner_id

  const listingId = formData.listing_id
  const name = formData.profileName
  const email = formData.email
  const phonenumber = formData?.phonenumber
  const phonePrefix = selectedCountryCode
  const pageUrl = formData.pageUrl
  const HowRelated = formData.userRelation
  const link = formData.websiteLink
  const title = formData?.title

  const HandleClaim = async () => {
    if (!formData.userRelation || formData.userRelation === '') {
      setInputErrs((prev) => {
        textareaRef.current?.focus()
        return { ...prev, userRelation: 'This field is Required' }
      })
    } else {
      setSubmitBtnLoading(true)

      if (userData.email === listingModalData.public_email) {
        const { err, res } = await ClaimListing({
          userId,
          owner_id,
          listingId,
          name,
          email,
          phonenumber,
          phonePrefix,
          pageUrl,
          HowRelated,
          link,
          title,
        })
        setSubmitBtnLoading(false)
        if (err === null || err === undefined) {
          setSnackbar?.({
            show: true,
            type: 'success',
            message: 'Page claimed successfully',
          })
          dispatch(closeModal())
          window.location.reload()
        } else {
          setSnackbar?.({
            show: true,
            type: 'error',
            message: 'Claim request error',
          })
        }
      } else {
        const { err, res } = await ClaimRequest({
          userId,
          owner_id,
          listingId,
          name,
          email,
          phonenumber,
          phonePrefix,
          pageUrl,
          HowRelated,
          link,
          title,
        })
        setSubmitBtnLoading(false)
        if (err === null || err === undefined) {
          setSnackbar?.({
            show: true,
            type: 'success',
            message: 'Claim request sent successfully',
          })
          dispatch(closeModal())
        } else {
          setSnackbar?.({
            show: true,
            type: 'error',
            message: 'Claim request not sent',
          })
        }
      }
    }
  }

  const handlePrefixChange = (element: any) => {
    const id = element?.id
    setSelectedCountryCode(countryData[id]?.phonePrefix)
  }

  useEffect(() => {
    setListingUrlSpanLength(listingUrlSpanRef?.current?.offsetWidth || 0)
  }, [])
  console.warn(listingUrlSpanRef.current?.offsetWidth)

  return (
    <>
      <div className={styles['modal-wrapper']}>
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Claim Listing'}</h4>
        </header>

        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          {/* Logged in as  */}
          <div className={styles['input-box']}>
            <label>Logged In As</label>
            <div className={styles['street-input-container']}>
              <input
                type="text"
                required
                name="profileName"
                value={formData.profileName}
                onChange={handleInputChange}
                disabled
                className={styles.disabled}
              />
            </div>
          </div>
          <section className={styles['two-column-grid']}>
            <div className={styles['input-box']}>
              <label>Email ID</label>
              <div className={styles['street-input-container']}>
                <input
                  type="text"
                  required
                  name="email"
                  onChange={handleInputChange}
                  value={formData?.email}
                />
              </div>
            </div>
            <div
              className={`${styles['input-box']} ${
                formData.phonenumber?.error ? styles['input-box-error'] : ''
              }`}
            >
              <label>Phone Number</label>
              <div className={styles['phone-prefix-input']}>
                <DropdownMenu
                  value={selectedCountryCode}
                  valueIndex={countryData.findIndex(
                    (country, idx) =>
                      country.phonePrefix === formData.phonePrefix,
                  )}
                  options={countryData.map(
                    (country, idx) =>
                      `${country.name} (${country.phonePrefix})`,
                  )}
                  onOptionClick={handlePrefixChange}
                  optionsPosition="bottom"
                  search={true}
                  dropdownHeaderClass={''}
                />
                <input
                  type="text"
                  placeholder={`Phone number`}
                  value={formData?.phonenumber}
                  name="phone"
                  autoComplete="phone"
                  required
                  ref={phoneRef}
                  onChange={handleInputChange}
                  className={styles['phone-input']}
                />
              </div>
            </div>
          </section>
          <div className={styles['input-box']}>
            <label>Listing Page URL</label>
            <div className={styles['street-input-container']}>
              <input
                type="text"
                required
                name="pageUrl"
                onChange={handleInputChange}
                value={formData.pageUrl}
                style={{
                  paddingLeft: listingUrlSpanLength + 12 + 'px',
                }}
                className={styles.disabled}
                disabled
              />
              <span ref={listingUrlSpanRef}>{'/page/'}</span>
            </div>
          </div>
          <div
            className={`${styles['input-box']} ${
              inputErrs.userRelation ? styles['input-box-error'] : ''
            }`}
          >
            <label>How are you related to this listing?</label>
            <div className={styles['street-input-container']}>
              <textarea
                ref={textareaRef}
                className={styles['long-input-box']}
                required
                name="userRelation"
                onChange={handleInputChange}
                value={formData.userRelation}
              />
              <p className={styles['helper-text']}>{inputErrs.userRelation}</p>
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Website or Social Media page?</label>
            <div className={styles['street-input-container']}>
              <input
                type="text"
                required
                name="websiteLink"
                onChange={handleInputChange}
                value={formData.websiteLink}
              />
            </div>
          </div>
        </section>
        <footer className={styles['footer']}>
          <button
            ref={nextButtonRef}
            onClick={HandleClaim}
            className="modal-footer-btn submit"
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : (
              'Claim'
            )}
          </button>
          <button
            ref={nextButtonRef}
            className="modal-mob-btn-save"
            onClick={HandleClaim}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'14px'} />
            ) : (
              'Claim'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default ClaimModal
