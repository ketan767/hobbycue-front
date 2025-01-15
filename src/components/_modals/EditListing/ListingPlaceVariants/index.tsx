import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import { CircularProgress, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import {
  addPlaceVariant,
  addProductVariant,
  getPlaceVariant,
  getProductVariant,
  updateListing,
  updatePlaceVariant,
  updateProductVariant,
} from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import InputSelect from '@/components/_formElements/Select/Select'
import { DropdownOption } from '../../CreatePost/Dropdown/DropdownOption'
import { formatPrice, isMobile } from '@/utils'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  onStatusChange?: (isChanged: boolean) => void
  onBoarding?: boolean
  propData?: any
}

const ListingPlaceVariantsModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  onBoarding,
  propData,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  console.log('listingModalData:', listingModalData)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [cta, setCta] = useState('Contact')
  const isMob = isMobile()
  const [data, setData] = useState<{
    _id?: string
    variant_tag: string
    membership_identifier: string
    variations: { name: string; value: string }[]
  }>({
    variant_tag: '',
    membership_identifier: '',
    variations: [{ name: '', value: '' }],
  })

  useEffect(() => {
    if (propData && propData.currentListing && propData.currentListing._id) {
      getPlaceVariant(propData.currentListing._id)
        .then((result) => {
          console.log({ result })
          if (result.res && result.res.data && result.res.data.data) {
            if (result.res?.data?.data.variations)
              setData(result.res?.data?.data)
            else {
              setData({ ...result.res?.data?.data, variations: [] })
            }
            // console.log(result.res)
          } else if (result.err) {
            console.log({ err: result.err })
          }
        })
        .catch((err) => {
          console.log({ err })
        })
    }
  }, [propData])

  const handleSubmit = async () => {
    const apiFunc = data._id ? updatePlaceVariant : addPlaceVariant
    setSubmitBtnLoading(true)
    const filteredVariations = data?.variations.filter(
      (variant) => variant.name !== '',
    )
    const newData = { ...data, variations: filteredVariations }
    const { err, res } = await apiFunc(listingModalData._id as string, {
      ...newData,
    })
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)

    if (onComplete) onComplete()
    else {
      dispatch(closeModal())
      window.location.reload()
    }
  }

  const handleBack = async () => {
    setBackBtnLoading(true)
    const apiFunc = data._id ? updatePlaceVariant : addPlaceVariant
    const { err, res } = await apiFunc(listingModalData._id as string, {
      ...data,
    })
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)
    if (onBackBtnClick) onBackBtnClick()
  }

  const handleDelete = async (i: number) => {
    const newArr = [...data.variations].filter((_, index) => index !== i)
    setData((prev) => {
      return { ...prev, variations: newArr }
    })
  }

  const handleVariationChange = (
    str: string,
    varName: 'value' | 'name',
    i: number,
  ) => {
    setData((prev) => {
      let newArr = [...prev.variations]
      newArr[i] = { ...newArr[i], [varName]: str }
      return { ...prev, variations: newArr }
    })
  }

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_14513_208561)">
        <path
          d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_14513_208561">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
  const deleteSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clip-path="url(#clip0_14226_71091)">
        <path
          d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_14226_71091">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
  const handleVariationChangeNumber = (
    str: string,
    varName: 'value' | 'name',
    i: number,
  ) => {
    // Remove commas from the string and convert it to a number
    const numValue =
      str.replace(/,/g, '') !== '' ? parseInt(str.replace(/,/g, '')) : ''

    setData((prev) => {
      let newArr = [...prev.variations]
      newArr[i] = { ...newArr[i], [varName]: numValue }
      return { ...prev, variations: newArr }
    })
  }

  const OpenCTA = () => {
    dispatch(openModal({ type: 'listing-cta-edit', closable: true }))
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
          <h4 className={styles['heading']}>{'Variants'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <div className={styles['container']}>
            <div className={styles['inputs-container']}>
              <div className={styles['input-and-label']}>
                <p>Variation Tag</p>
                <TextField
                  autoComplete="off"
                  placeholder="eg: Tower number or name"
                  value={
                    data.variant_tag === 'No value' ? '' : data.variant_tag
                  }
                  className={`${styles['input']} ${styles['top-input']}`}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      variant_tag: e.target.value,
                    }))
                  }}
                />
              </div>
              {!isMob && (
                <div className={styles['input-and-label']}>
                  <p>Membership Identifier</p>
                  <TextField
                    autoComplete="off"
                    placeholder="eg: Apartment number"
                    value={
                      data.membership_identifier === 'No value'
                        ? ''
                        : data.membership_identifier
                    }
                    className={`${styles['input']} ${styles['top-input']}`}
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        membership_identifier: e.target.value,
                      }))
                    }}
                  />
                </div>
              )}
            </div>

            <div className={styles['variations']}>
              <div className={styles['add-variation']}>
                <p>Variations</p>
                <div
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      variations: [
                        ...prev.variations,
                        { name: '', value: '0' },
                      ],
                    }))
                  }}
                  className={styles['flex-end']}
                >
                  {plusIcon}
                  <span className={styles['add-another']}>Add another</span>
                </div>
              </div>
              <div className={styles['variations-list']}>
                {data.variations.map((obj, i) => (
                  <div key={i} className={styles['variant']}>
                    <TextField
                      autoComplete="off"
                      placeholder={`Variant name  eg:  Tower ${i + 1}`}
                      value={obj.name === 'No value' ? '' : obj.name}
                      className={styles['input']}
                      onChange={(e) => {
                        handleVariationChange(e.target.value, 'name', i)
                      }}
                    />
                    <button onClick={() => handleDelete(i)}>{deleteSvg}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <hr className={styles['hr-line']} />
        <div className={styles['bottom-txt-container']}>
          <p className={styles['bottom-text']}>
            If there are no Variants, you can leave everything blank.
          </p>
        </div>
        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) ||
            (isMob && (
              <>
                <button className="modal-footer-btn cancel" onClick={OpenCTA}>
                  {backBtnLoading ? (
                    <CircularProgress color="inherit" size={'24px'} />
                  ) : onBackBtnClick ? (
                    'Back'
                  ) : (
                    'Back'
                  )}
                </button>
                {/* SVG Button for Mobile */}
                <div onClick={OpenCTA}>
                  <Image
                    src={BackIcon}
                    alt="Back"
                    className="modal-mob-btn cancel"
                  />
                </div>
              </>
            ))}

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
          {onComplete || isMob ? (
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
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Save'
              )}
            </button>
          )}
        </footer>
      </div>
      {isMob && (
        <section className={styles['step-indicators']}>
          <span className={`${styles['step']}`}></span>
          <span className={`${styles['step']} ${styles['active-step']}`}></span>
        </section>
      )}
    </>
  )
}

export default ListingPlaceVariantsModal
