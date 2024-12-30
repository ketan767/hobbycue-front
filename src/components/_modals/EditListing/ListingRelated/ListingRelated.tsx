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
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import {
  getListingPages,
  updateListing,
  deleteRelatedListingLeft,
  searchPages,
  getAllListingRelationTypes,
  searchPagesRelated,
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
  const listingPageData = useSelector(
    (state: RootState) => state.site.listingPageData,
  )
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

        if (onComplete) {
          onComplete()
        } else {
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
      searchValue: pageInputValue.toString(),
      page: 1,
      limit: 50,
    })

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
        console.log('respcc', res?.data.data.listing)
        setRelatedListingsLeft(
          res?.data.data.listing?.related_listings_left.listings,
        )
        dispatch(updateListingModalData(res?.data?.data?.listing))
        GetTableData()
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
        dispatch(updateListingModalData(res?.data?.data?.listing))
        GetTableData()
      }
    }
  }

  const [loading, setLoading] = useState(true)

  const GetTableData = async () => {
    const listingsIds = listingModalData?.related_listings_left?.listings
    const relatedString =
      listingsIds?.map((id: any) => `_id=${id}`).join('&') || 'abc'

    const { err, res } = await getListingPages(`${relatedString}`)
    if (res?.data?.data?.listings) {
      setTableData(res?.data?.data?.listings)
      setLoading(false)
    }
  }
  useEffect(() => {}, [tableData])

  useEffect(() => {
    GetTableData()
  }, [])

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
  const getPageType = async () => {
    if (listingModalData.type === 1) return 'People'
    if (listingModalData.type === 2) return 'Place'
    if (listingModalData.type === 3) return 'Program'
    if (listingModalData.type === 4) return 'Product'
  }
  useEffect(() => {
    const fetchRelations = async () => {
      const pageType = await getPageType()
      let query = `pageType=${pageType}&Side=Left&Show=Y`
      const { err, res } = await getAllListingRelationTypes(query)

      if (err) {
        console.log({ err })
      } else if (res?.data && res?.data?.data) {
        setOptions(res.data.data)
        console.log({ d: res.data.data })
      }
    }
    fetchRelations()
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

  // console.log(tableData)
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Related Listings'}</h4>
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
                inputProps={{ 'aria-label': 'Without label' }}
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
            <p className={styles['helper-text']}>{error}</p>
          </div>

          <section className={styles['dropdown-warpper']}>
            <div
              className={`${styles['input-box']} ${styles['dropdown-input-box']}`}
            >
              <label>Listing Page</label>

              <input
                type="text"
                autoComplete="new"
                placeholder="Search listing page..."
                required
                value={pageInputValue}
                onClick={() => setShowDropdown(true)}
                ref={inputRef}
                onChange={(e) => {
                  handleSearchPages(e)
                  setPageInputValue(e.target.value)
                }}
              />
              {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
            </div>
            {showDropdown && (
              <div className={styles['dropdown']} ref={dropdownRef}>
                {dropdownLoading ? (
                  <div className={styles.dropdownItem}>Loading...</div>
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
                    )
                  })
                ) : (
                  <div className={styles.dropdownItem}>No results found</div>
                )}
              </div>
            )}

            <button
              disabled={addPageLoading}
              className={styles['add-btn']}
              onClick={handleAddPage}
            >
              {addPageLoading ? (
                <CircularProgress color="inherit" size={'22px'} />
              ) : (
                'Add'
              )}
            </button>
          </section>

          {/* <div className={styles['input-box']}>
            <label>Add Listing Page</label>
            <input hidden required />

            <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
              <Select
                value={relation}
                onChange={(e) => {
                  let val = e.target.value
                  setRelation(val)
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {relatedListingData.map((item: any, idx) => {
                  return (
                    <MenuItem key={item._id} value={idx}>
                      <div className={styles.tagContainer}>
                        <p className={styles.tagText}>{item.relation}</p>
                      </div>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </div> */}
          <section className={styles['added-hobby-list']}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              tableData && (
                <table>
                  <thead>
                    <tr>
                      <td>Listing Page</td>
                      <td></td>
                      <td></td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((item: any) => {
                      return (
                        <tr key={item.id}>
                          <td>{item?.title}</td>

                          <td></td>
                          <td></td>
                          <td>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className={styles['delete-hobby-btn']}
                              onClick={() => {
                                handleRemovePage(item._id)
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
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )
            )}
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
