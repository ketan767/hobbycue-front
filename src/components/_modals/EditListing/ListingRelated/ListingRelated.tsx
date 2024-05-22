import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material'
import Image from 'next/image'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal, openModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import {
  getListingPages,
  updateListing,
  deleteRelatedListingLeft,
  searchPages,
  getAllListingRelationTypes,
} from '@/services/listing.service'
import {
  updateListingModalData,
  updateRelatedListingsLeft,
} from '@/redux/slices/site'
import { listingData } from './data'
import DefaultProfile from '@/assets/svg/default-images/default-people-listing-icon.svg'
import CrossIcon from '@/assets/svg/cross.svg'
import SaveModal from '../../SaveModal/saveModal'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  onStatusChange?: (isChanged: boolean) => void
}

const RelatedListingEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [relation, setRelation] = useState<any>('')
  const [selectedlisting, setselectedListing] = useState<
    { _id: string; name: string; description: string }[]
  >([])
  const [error, setError] = useState<string | null>(null)
  const [relatedListingData, setRelatedListingData] = useState(listingData)
  const [allListingPages, setAllListingPages] = useState([])
  const [allDropdownValues, setAllDropdownValues] = useState<any>([])
  const [pageInputValue, setPageInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [tableData, setTableData] = useState<any>([])
  const [addPageLoading, setAddPageLoading] = useState(false)
  const [selectedPage, setSelectedPage] = useState<any>({})
  const [relatedListingsLeft, setRelatedListingsLeft] = useState<any>([])
  const [dropdownLoading, setDropdownLoading] = useState<boolean>(true)
  const [options, setOptions] = useState<
    {
      Side: 'Left' | 'Right'
      Show: 'Y' | 'N' | ''
      pageType: string
      relationType: string
    }[]
  >([])

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])

  const [initialData, setInitialData] = useState({})
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    if (listingModalData && listingModalData._id) {
      const updated = listingData.filter(
        (item: any) =>
          item.type === listingModalData.type && item.side === 'left',
      )
      setRelatedListingData(updated)
    }
  }, [listingModalData?._id])

  console.log('relatedlisting', listingModalData)
  useEffect(() => {
    if (
      listingModalData.related_listings_left?.relation &&
      listingModalData.related_listings_left?.relation
    ) {
      setRelation(listingModalData.related_listings_left.relation)
    }
    setRelatedListingsLeft(listingModalData.related_listings_left?.listings)
  }, [listingModalData])
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    const jsonData = {
      related_listings_left: {
        relation: relation,
        listings: [...relatedListingsLeft],
      },
    }
    if (listingModalData && listingModalData._id) {
      const { err, res } = await updateListing(listingModalData._id, jsonData)
      console.log('res', res)
      setSubmitBtnLoading(false)
      if (err) return console.log(err)

      if (res?.data.success) {
        dispatch(updateListingModalData(res.data.data.listing))
        if (onComplete) onComplete()
        else {
          window.location.reload()
          dispatch(closeModal())
        }
      }
    }
  }

  const handleSearchPages = async (e: any) => {
    setShowDropdown(true)
    setDropdownLoading(true)
    const { res, err } = await searchPages({
      title: pageInputValue,
    })
    console.log(res)

    setAllDropdownValues(res?.data)
    setAllListingPages(res?.data)
    setDropdownLoading(false)
  }

  const handleAddPage = async () => {
    setShowDropdown(false)
    if (!relation || relation.trim() === '') {
      setError('Please select Relation')
    } else {
      const jsonData = {
        related_listings_left: {
          relation: relation,
          listings: [...relatedListingsLeft, selectedPage],
        },
      }
      setAddPageLoading(true)
      if (listingModalData && listingModalData._id) {
        const { err, res } = await updateListing(listingModalData._id, jsonData)
        setAddPageLoading(false)
        if (err) return console.log(err)
        console.log('resp', res?.data.data.listing)
        setRelatedListingsLeft(
          res?.data.data.listing?.related_listings_left.listings,
        )
        if (onComplete) onComplete()
        else {
          // window.location.reload()
          // dispatch(closeModal())
        }
      }
      setPageInputValue('')
    }
  }

  const handleRemovePage = async (id: string) => {
    console.log('payloadid', id)

    // First, locally update the relatedListingsLeft state by filtering out the listing with the given id
    const updatedListings = relatedListingsLeft.filter(
      (listingId: any) => listingId !== id,
    )
    setRelatedListingsLeft(updatedListings)

    // Now, send this updated list to the backend
    const jsonData = {
      related_listings_left: {
        relation: relation,
        listings: updatedListings,
      },
    }

    if (listingModalData && listingModalData._id) {
      const { err, res } = await updateListing(listingModalData._id, jsonData)

      if (err) return console.log(err)
      console.log('resp', res?.data.data.listing)

      if (res?.data.data.listing) {
        setRelatedListingsLeft(
          res?.data.data.listing?.related_listings_left.listings,
        )
      }
    }
  }

  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    setLoading(true)
    const { res, err } = await searchPages('')
    setAllListingPages(res?.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    const matchedListings = allListingPages?.filter((item: any) =>
      relatedListingsLeft?.includes(item._id),
    )
    console.log({ matchedListings })
    const matchedTitles = matchedListings?.map((listing: any) => ({
      id: listing._id,
      title: listing.title,
    }))

    setTableData(matchedTitles)
  }, [allListingPages, relatedListingsLeft])

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  useEffect(() => {
    getAllListingRelationTypes()
      .then((result) => {
        const { res, err } = result
        if (err) {
          console.log({ err })
        } else if (res?.data && res?.data?.data) {
          setOptions(res.data.data)
          console.log({ d: res.data.data })
        }
      })
      .catch((err) => {
        console.log({ err })
      })
  }, [])

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
      />
    )
  }

  const ArrowDown = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '30px', marginRight: '12px' }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_14129_154950)">
        <path
          d="M10.5876 6.19305L8.00096 8.77971L5.4143 6.19305C5.1543 5.93305 4.7343 5.93305 4.4743 6.19305C4.2143 6.45305 4.2143 6.87305 4.4743 7.13305L7.5343 10.193C7.7943 10.453 8.2143 10.453 8.4743 10.193L11.5343 7.13305C11.7943 6.87305 11.7943 6.45305 11.5343 6.19305C11.2743 5.93971 10.8476 5.93305 10.5876 6.19305Z"
          fill="#6D747A"
        />
      </g>
      <defs>
        <clipPath id="clip0_14129_154950">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clip-path="url(#clip0_14129_154988)">
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_14129_154988">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  const openRightListingRelated = () => {
    dispatch(openModal({ type: 'related-listing-right-edit', closable: true }))
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>
            {'Related Left'}
            <div className={styles['active']}></div>
          </h4>
          <h4 onClick={openRightListingRelated} className={styles['heading']}>
            {'Related Right'}
          </h4>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            <label>Relation</label>
            <input hidden required />

            <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
              <Select
                className={styles['select-relation']}
                placeholder="Select"
                value={relation}
                onChange={(e) => {
                  let val = e.target.value
                  setRelation(val)
                }}
                displayEmpty
                inputProps={{
                  'aria-label': 'Without label',
                  IconComponent: ArrowDown,
                }}
              >
                <MenuItem value="">Select</MenuItem>
                {options
                  .filter((obj) => obj.Show === 'Y' && obj.Side === 'Left')
                  .map((item: any, idx: number) => {
                    return (
                      <MenuItem key={idx} value={item.relationType}>
                        <div className={styles.tagContainer}>
                          <p className={styles.tagText}>{item.relationType}</p>
                        </div>
                      </MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
            {error && <p className={styles['helper-text']}>{error}</p>}
          </div>

          <section className={styles['added-hobby-list']}>
            {
              <table>
                <thead>
                  <tr>
                    <td>Listing Page</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((item: any) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                          <div className={styles['plus-button']}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className={styles['delete-hobby-btn']}
                              onClick={() => {
                                handleRemovePage(item.id)
                              }}
                            >
                              <g clip-path="url(#clip0_173_49175)">
                                <path
                                  d="M6.137 19C6.137 20.1 7.00002 21 8.05481 21H15.726C16.7808 21 17.6439 20.1 17.6439 19V7H6.137V19ZM18.6028 4H15.2466L14.2877 3H9.49317L8.53427 4H5.1781V6H18.6028V4Z"
                                  fill="#8064A2"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_173_49175">
                                  <rect
                                    width="23.0137"
                                    height="24"
                                    fill="white"
                                    transform="translate(0.383545)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  <tr>
                    <td>
                      <div className={styles['search-input']}>
                        <input
                          type="text"
                          placeholder="Search listing page..."
                          autoComplete="name"
                          required
                          value={pageInputValue}
                          onClick={() => setShowDropdown(true)}
                          ref={inputRef}
                          onChange={(e) => {
                            handleSearchPages(e)
                            setPageInputValue(e.target.value)
                          }}
                          onFocus={() => {
                            setShowDropdown(true)
                          }}
                        />
                        {showDropdown && (
                          <div
                            className={styles['dropdown-list']}
                            ref={dropdownRef}
                          >
                            {dropdownLoading ? (
                              <div className={styles.dropdownItem}>
                                Loading...
                              </div>
                            ) : allDropdownValues?.length !== 0 ? (
                              allDropdownValues?.map((item: any) => {
                                return (
                                  <div
                                    key={item?._id}
                                    onClick={() => {
                                      setSelectedPage(item._id)
                                      setPageInputValue(item.title)
                                      setShowDropdown(false)
                                    }}
                                    className={styles.dropdownItem}
                                  >
                                    <div>
                                      {item.profile_image ? (
                                        <img
                                          src={item?.profile_image}
                                          alt="profile"
                                          width={40}
                                          height={40}
                                        />
                                      ) : (
                                        <Image
                                          src={DefaultProfile}
                                          alt="profile"
                                          width={40}
                                          height={40}
                                        />
                                      )}

                                      <p>{item?.title}</p>
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <div className={styles.dropdownItem}>
                                No results found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div
                        onClick={handleAddPage}
                        className={styles['plus-button']}
                      >
                        {plusIcon}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            }
          </section>
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
            ref={nextButtonRef}
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

export default RelatedListingEditModal
