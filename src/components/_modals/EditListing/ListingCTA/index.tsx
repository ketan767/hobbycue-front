import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'
import { CircularProgress, FormControl } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import InputSelect from '@/components/_formElements/Select/Select'
import { DropdownOption } from '../../CreatePost/Dropdown/DropdownOption'
import DownArrow from '@/assets/svg/chevron-down.svg'
import UpArrow from '@/assets/svg/chevron-up.svg'
import { getMetadata } from '@/services/post.service'

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

const ListingCTAModal: React.FC<Props> = ({
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
  const [list, setList] = useState<{ name: string; description: string }[]>([])

  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [isApprovalRequired, setIsApprovalRequired] = useState<boolean>(true)
  console.log('listingModalData:', listingModalData)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [cta, setCta] = useState('Contact')
  const [url, setUrl] = useState('')
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
    url: '',
  })

  console.log({ metaData })

  useEffect(() => {
    if (url) {
      try {
        const regex =
          /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
        const link = url.match(regex)
        if (link) {
          setUrl(link[0])
        }
        if (link) {
          getMetadata(link[0])
            .then((res: any) => {
              setMetaData(res?.res?.data.data.data)
            })
            .catch((err) => {
              console.log(err)
            })
        }
      } catch (error) {
        console.log({ error })
      }
    }
  }, [url])

  const [listOne, setListOne] = useState<
    { name: string; description: string }[]
  >([
    { name: 'Contact', description: 'Opens a Contact or Message dialogue' },
    { name: 'Claim', description: 'Allows others to Claim this Page' },
  ])

  const [listTwo, setListTwo] = useState<
    { name: string; description: string }[]
  >([
    { name: 'Contact', description: 'Opens a Contact or Message dialogue' },
    { name: 'Claim', description: 'Allows others to Claim this Page' },
    { name: 'Join', description: 'Society or Club Membership' },
  ])

  const [listThree, setListThree] = useState<
    { name: string; description: string }[]
  >([
    { name: 'Contact', description: 'Opens a Contact or Message dialogue' },
    { name: 'Claim', description: 'Allows others to Claim this Page' },
    { name: 'Register', description: 'Allows to Register for the Program' },
  ])

  const [listFour, setListFour] = useState<
    { name: string; description: string }[]
  >([
    {
      name: 'Buy Now',
      description: 'External Page for Online Shop (eg: Amazon)',
    },
  ])

  useEffect(() => {
    if (listingModalData.type === 1) {
      setList(listOne)
    }
    if (listingModalData.type === 2) {
      setList(listTwo)
    }
    if (listingModalData.type === 3) {
      setList(listThree)
    }
    if (listingModalData.type === 4) {
      setList(listFour)
    }
  }, [])
  const [value, setValue] = useState<any>([])
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef: any = useRef()
  const handleChange = (name: any) => {
    setCta(name)
  }
  useEffect(() => {
    if (listingModalData && listingModalData.cta_text) {
      setCta(listingModalData.cta_text)
    }
    if (listingModalData && listingModalData.click_url) {
      setUrl(listingModalData.click_url)
    }
  }, [listingModalData])

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      cta_text: cta,
      click_url: url,
    })
    const updatedData = {
      ...listingModalData,
      cta_text: res?.data.data.listing.cta_text,
      click_url: res?.data.data.listing.click_url,
    }
    dispatch(updateListingModalData(updatedData))
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)

    if (onComplete) onComplete()
    else {
      if (cta === 'Register' || cta === 'Buy Now') {
        dispatch(
          openModal({
            type: 'listing-product-variants-edit',
            closable: true,
            propData: propData,
          }),
        )
        return
      }
      if (cta === 'Join') {
        dispatch(
          openModal({
            type: 'listing-place-variants-edit',
            closable: true,
            propData: propData,
          }),
        )
        return
      }
      window.location.reload()
    }
  }

  const handleBack = async () => {
    setBackBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      cta_text: cta,
    })
    const updatedData = {
      ...listingModalData,
      cta_text: res?.data.data.listing.cta_text,
    }
    dispatch(updateListingModalData(updatedData))
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)
    if (onBackBtnClick) onBackBtnClick()
  }

  const updateCta = (val: string) => {
    setCta(val)
  }

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Choose Action'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <div
            className={styles['input-box']}
            style={value?.length === 0 || !value ? { marginTop: '1rem' } : {}}
          >
            <input hidden required />

            <FormControl variant="outlined" size="small">
              <div className={styles['select-container']} ref={dropdownRef}>
                <div
                  tabIndex={0}
                  className={`${styles['select-input']} ${
                    error ? styles['select-input-error'] : ' '
                  }`}
                  onClick={() =>
                    setShowDropdown((prev) => {
                      if (prev === true) {
                        setHoveredValue(null)
                      }
                      return !prev
                    })
                  }
                  onKeyDown={(e) => {
                    if (['Enter'].includes(e.key) || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      if (
                        e.key === 'Enter' &&
                        showDropdown &&
                        hoveredValue !== null
                      ) {
                        handleChange(list[hoveredValue].name)
                        setShowDropdown(false)
                        setHoveredValue(null)
                      } else if (!showDropdown) {
                        setShowDropdown(true)
                        setHoveredValue(0)
                      }
                    } else if (
                      e.key === 'ArrowUp' &&
                      showDropdown &&
                      hoveredValue !== null
                    ) {
                      setHoveredValue((prev) => {
                        if (prev === 0) {
                          return list.length - 1
                        } else {
                          return (prev as number) - 1
                        }
                      })
                    } else if (
                      e.key === 'ArrowDown' &&
                      showDropdown &&
                      hoveredValue !== null
                    ) {
                      setHoveredValue((prev) => {
                        if (prev === list.length - 1) {
                          return 0
                        } else {
                          return (prev as number) + 1
                        }
                      })
                    }
                  }}
                >
                  <p>{cta ?? 'Select Category'}</p>
                  <Image src={showDropdown ? UpArrow : DownArrow} alt="down" />
                </div>
                {showDropdown && (
                  <div
                    className={
                      styles['options-container'] + ' custom-scrollbar'
                    }
                  >
                    {list.map(
                      (
                        item: { name: string; description: string },
                        idx: number,
                      ) => {
                        const desc = item.description.trim()

                        if (desc !== '' && desc !== null && desc !== undefined)
                          return (
                            <div
                              className={`${styles['single-option']}  ${
                                cta === item.name
                                  ? styles['selcted-option']
                                  : ''
                              }
                                ${
                                  hoveredValue === idx &&
                                  styles['hovered-single-option']
                                }
                                `}
                              key={item.name}
                              onClick={() => {
                                handleChange(item.name)
                                setShowDropdown(false)
                                setHoveredValue(null)
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
          {(cta === 'Register' || cta === 'Buy Now') && (
            <div className={styles['input-box']}>
              <label>Click URL</label>
              <input
                placeholder="External link if any to Register, Book, etc."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                }}
                type="text"
                autoComplete="new"
              />
            </div>
          )}
          {(cta === 'Register' || cta === 'Buy Now') &&
            metaData?.title &&
            metaData?.title !== '' && (
              <div className={styles['metadata']}>
                <img src={metaData.image ?? metaData.icon ?? ''} alt="" />
                <div>
                  <h5>{metaData?.title}</h5>
                  <p>{metaData?.description}</p>
                </div>
              </div>
            )}
          {cta === 'Join' && (
            <div className={styles['approval-box']}>
              <p>Approval required </p>
              <div className={styles.radioLabel}>
                <input
                  type="radio"
                  name="approval"
                  checked={isApprovalRequired === true}
                  onChange={() => setIsApprovalRequired(true)}
                />
                <span className={styles.span}>Yes</span>
              </div>
              <div className={styles.radioLabel}>
                <input
                  type="radio"
                  name="approval"
                  checked={isApprovalRequired === false}
                  onChange={() => setIsApprovalRequired(false)}
                />
                <span className={styles.span}>No</span>
              </div>
            </div>
          )}
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel" onClick={handleBack}>
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
            ) : onComplete ||
              cta === 'Register' ||
              cta === 'Buy Now' ||
              cta === 'Join' ? (
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
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : onComplete || cta === 'Register' || cta === 'Join' ? (
                'Next'
              ) : (
                'Save'
              )}
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ListingCTAModal
