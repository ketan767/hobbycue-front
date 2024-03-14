import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material'

import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import Image from 'next/image'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { closeModal, openModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListingModalData } from '@/redux/slices/site'
import { updateListing } from '@/services/listing.service'

import DownArrow from '@/assets/svg/chevron-down.svg'
import TickIcon from '@/assets/svg/tick.svg'
import CrossIcon from '@/assets/svg/cross.svg'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
}

const ListingTypeEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData, listingTypeModalMode } = useSelector(
    (state: RootState) => state.site,
  )
  const [list, setList] = useState<{ name: string; description: string }[]>([])
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [value, setValue] = useState<any>([])
  const [error, setError] = useState<string | null>(null)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef: any = useRef()
  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))
  const [initialData, setInitialData] = useState<any>([])
  const [isChanged, setIsChanged] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!value || value === '' || value.length === 0) {
      return setError('Select a Category!')
    }
    if (listingTypeModalMode === 'edit') {
      handleEdit()
    } else {
      dispatch(
        updateListingModalData({ ...listingModalData, page_type: value }),
      )
      dispatch(openModal({ type: 'listing-onboarding', closable: false }))
    }
  }
  const handleEdit = async () => {
    // setSubmitBtnLoading(true)
    if (onComplete) {
      dispatch(
        updateListingModalData({ ...listingModalData, page_type: value }),
      )
      dispatch(openModal({ type: 'listing-onboarding', closable: false }))
    } else {
      const { err, res } = await updateListing(listingModalData._id, {
        page_type: value,
      })
      setSubmitBtnLoading(false)
      if (err) return console.log(err)
      if (res?.data.success) {
        dispatch(updateListingModalData(res.data.data.listing))
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }
  const peoplePageTypeList: PeoplePageType = [
    {
      name: 'Teacher',
      description: 'Trainer, Instructor - usually for an Art',
    },
    // {
    //   name: 'Trainer',
    //   description: '',
    // },
    {
      name: 'Coach',
      description: 'Trainer, Instructor - usually for a Sport',
    },
    // {
    //   name: 'Instructor',
    //   description: '',
    // },
    {
      name: 'Academia',
      description: 'Expert, Researcher',
    },
    {
      name: 'Professional',
      description: 'Artist, Sportsperson as source of income',
    },
    {
      name: 'Seller',
      description: 'Seller or Online Store',
    },
    {
      name: 'Specialist',
      description: 'Anchor, MC, Technician, etc.',
    },
    {
      name: 'Ensemble',
      description: 'A group that performs together',
    },
    // {
    //   name: 'Company',
    //   description: '',
    // },
    {
      name: 'Business',
      description: 'Company or Organization',
    },
    // {
    //   name: 'Society',
    //   description: '',
    // },
    {
      name: 'Association',
      description: 'Club, Society, Trust, Sabha or other Organization',
    },
    // {
    //   name: 'Organization',
    //   description: 'Sabha',
    // },
  ]

  const placePageTypeList: ProgramPageType = [
    {
      name: 'Shop',
      description: 'Buy or Rent Items or Services',
    },
    // {
    //   name: 'Gallery',
    //   description: 'View Exhibits',
    // },
    {
      name: 'School',
      description: 'Institute or Academy',
    },
    {
      name: 'Auditorium',
      description: 'Performance Venue',
    },
    {
      name: 'Clubhouse',
      description: 'Practice or Play Area for Club member',
    },
    {
      name: 'Studio',
      description: 'Practice area for artists and others',
    },
    {
      name: 'Play Area',
      description: 'Court, Field, or Stadium for Sports',
    },
    // {
    //   name: 'Campus',
    //   description: '',
    // },
    {
      name: 'Apartment',
      description: 'Flat or Condo with shared amenities',
    },
  ]

  const programPageTypeList: { name: string; description: string }[] = [
    {
      name: 'Classes',
      description: 'Recurring Classes',
    },
    {
      name: 'Workshop',
      description: 'Seminar, Webinar or Class',
    },
    {
      name: 'Performance',
      description: 'Live Show',
    },
    // {
    //   name: 'Competition',
    //   description: 'Contests to Rank and/or give Prizes',
    // },
    {
      name: 'Event',
      description: 'Other types of Events',
    },
    {
      name: 'Other',
      description: 'Request addition of options',
    },
  ]

  const productPageTypeList: ProductPageType = [
    {
      name: 'Item Sale',
      description: 'Shippable product',
    },
    // {
    //   name: 'Item Rental',
    //   description: 'Equipment on rent',
    // },
    // {
    //   name: 'Space Rental',
    //   description: 'Book a play court or studio',
    // },
    // {
    //   name: 'Consult / Service',
    //   description: 'Consultation or service appointment',
    // },
    // {
    //   name: 'Live Classes',
    //   description: 'Recurring classes registration',
    // },
    // {
    //   name: 'Online Access',
    //   description: 'To view or download digital content',
    // },
    {
      name: 'Event Ticket',
      description: 'Scheduled programs',
    },
    {
      name: 'Voucher',
      description: 'Redeemable code',
    },
  ]

  useEffect(() => {
    switch (listingModalData.type) {
      case 1:
        setList(peoplePageTypeList)
        break
      case 2:
        setList(placePageTypeList)
        break
      case 3:
        setList(programPageTypeList)
        break
      case 4:
        setList(productPageTypeList)
        break
      default:
        setList([])
        break
    }
    setValue(listingModalData.page_type as string)
    setInitialData(listingModalData.page_type as string)
  }, [listingModalData])

  const handleChange = (itemToChange: any) => {
    if (value?.includes(itemToChange)) {
      setError('') // Clear error when removing a value
      setValue((prev: any) => prev.filter((item: any) => item !== itemToChange))
    } else {
      if (value?.length >= 2) {
        setError('You can select only two Categories')
      } else {
        setError('') // Clear error when adding a value within the limit
        if (value) {
          setValue((prev: any) => [...prev, itemToChange])
        } else {
          setValue((prev: any) => [itemToChange])
        }
      }
    }
  }
  const HandleSaveError = async () => {
    if (!value || value === '' || value.length === 0) {
      setIsError(true)
    }
  }

  useEffect(() => {
    const hasChanges = JSON.stringify(value) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)

    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }, [value, initialData, onStatusChange])

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
      <div className={styles['modal-container']}>
        <div className={styles['modal-wrapper']}>
          <CloseIcon
            className={styles['modal-close-icon']}
            onClick={handleClose}
          />
          {/* Modal Header */}
          <header className={styles['header']}>
            <h4 className={styles['heading']}>{'Category'}</h4>
          </header>

          <hr className={styles['modal-hr']} />

          <section className={styles['body']}>
            <p className={styles['info']}>
              Please select two of the most appropriate categories. One type is
              recommended. Use another type only if it is significantly
              different
            </p>
            <div className={styles['selected-values']}>
              {value?.map((item: any) => {
                return (
                  <div key={item} className={styles['selected-value']}>
                    <p>{item}</p>
                    <Image
                      src={CrossIcon}
                      alt="cancel"
                      onClick={() => handleChange(item)}
                    />
                  </div>
                )
              })}
            </div>
            <div
              className={styles['input-box']}
              style={value?.length === 0 || !value ? { marginTop: '1rem' } : {}}
            >
              <input hidden required />

              <FormControl variant="outlined" size="small">
                <div className={styles['select-container']} ref={dropdownRef}>
                  <div
                    className={styles['select-input']}
                    onClick={() => setShowDropdown(true)}
                  >
                    <p> Select Category </p>
                    <Image src={DownArrow} alt="down" />
                  </div>
                  {showDropdown && (
                    <div className={styles['options-container']}>
                      {list.map(
                        (
                          item: { name: string; description: string },
                          idx: number,
                        ) => {
                          const desc = item.description.trim()

                          if (
                            desc !== '' &&
                            desc !== null &&
                            desc !== undefined
                          )
                            return (
                              <div
                                className={`${styles['single-option']}  ${
                                  value?.includes(item.name)
                                    ? styles['selcted-option']
                                    : ''
                                }`}
                                key={item.name}
                                onClick={() => {
                                  handleChange(item.name)
                                  setShowDropdown(false)
                                }}
                              >
                                <p className={styles.tagDesc}>{item.name}</p>
                                <p className={styles.tagDesc}>
                                  {item.description}
                                </p>
                              </div>
                            )
                        },
                      )}
                    </div>
                  )}
                </div>

                <p className={styles.error}>{error}</p>
              </FormControl>
            </div>
          </section>

          <footer className={styles['footer']}>
            {Boolean(onBackBtnClick) && (
              <>
                <button
                  className="modal-footer-btn cancel"
                  onClick={onBackBtnClick}
                >
                  {backBtnLoading ? (
                    <CircularProgress color="inherit" size={'24px'} />
                  ) : onBackBtnClick ? (
                    'Back'
                  ) : (
                    'Back'
                  )}
                </button>
                {/* SVG Button for Mobile */}
                <div onClick={onBackBtnClick}>
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
              ) : listingTypeModalMode === 'edit' ? (
                'Save'
              ) : (
                'Next'
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
                {submitBtnLoading ? (
                  <CircularProgress color="inherit" size={'16px'} />
                ) : listingTypeModalMode === 'edit' ? (
                  'Save'
                ) : (
                  'Next'
                )}
              </button>
            )}
          </footer>
        </div>
      </div>
    </>
  )
}

export default ListingTypeEditModal
