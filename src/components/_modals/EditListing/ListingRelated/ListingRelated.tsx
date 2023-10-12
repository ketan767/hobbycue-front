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
import { getListingPages, updateListing } from '@/services/listing.service'
import {
  updateListingModalData,
  updateRelatedListingsLeft,
} from '@/redux/slices/site'
import { listingData } from './data'
import DefaultProfile from '@/assets/svg/default-images/default-people-listing-icon.svg'
import CrossIcon from '@/assets/svg/cross.svg'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const RelatedListingEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
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
  const [selectedRelated, setSelectedRelated] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const updateRelatedList = async () => {}
  useEffect(() => {
    inputRef?.current?.focus()
  }, [])
  useEffect(() => {
    const updated = listingData.filter(
      (item: any) =>
        item.type === listingModalData.type && item.side === 'left',
    )
    setRelatedListingData(updated)
  }, [listingModalData?._id])

  useEffect(() => {
    setRelatedListingsLeft(listingModalData.related_listings_left?.listings)
  }, [])
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    const jsonData = {
      related_listings_left: {
        relation: relation,
        listings: [...relatedListingsLeft],
      },
    }
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

  useEffect(() => {
    setDropdownLoading(true)
    getListingPages(``)
      .then((res: any) => {
        console.log('listing', res.res.data)

        setAllDropdownValues(res.res.data.data.listings)
        setAllListingPages(res.res.data.data.listings)
        setDropdownLoading(false)
      })
      .catch((err: any) => {
        console.log(err)
        setDropdownLoading(false)
      })
  }, [pageInputValue])

  const handleAddPage = async () => {
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
      const { err, res } = await updateListing(listingModalData._id, jsonData)
      setAddPageLoading(false)
      if (err) return console.log(err)
      console.log('resp', res?.data.data.listing)
      setRelatedListingsLeft(
        res?.data.data.listing.related_listings_left.listings,
      )
      if (onComplete) onComplete()
      else {
        // window.location.reload()
        // dispatch(closeModal())
      }
    }
  }

  const handleRemovePage = async (id: any) => {
    console.log('before', relatedListingsLeft)
    const filteredListings = relatedListingsLeft.filter(
      (item: any) => item !== id,
    )
    console.log('After', filteredListings)
    const jsonData = {
      related_listings_left: {
        relation: relation,
        listings: filteredListings,
      },
    }

    const { err, res } = await updateListing(listingModalData._id, jsonData)

    if (err) return console.log(err)
    console.log('resp', res?.data.data.listing)
    setRelatedListingsLeft(
      res?.data.data.listing.related_listings_left.listings,
    )
    // dispatch(
    //   updateRelatedListingsLeft(
    //     res?.data.data.listing.related_listings_left.listings,
    //   ),
    // )
    if (onComplete) onComplete()
    else {
      // window.location.reload()
      // dispatch(closeModal())
    }
  }

  useEffect(() => {
    const matchedListings = allListingPages.filter((item: any) =>
      relatedListingsLeft.includes(item._id),
    )

    const matchedTitles = matchedListings.map((listing: any) => ({
      id: listing._id,
      title: listing.title,
    }))
    setTableData(matchedTitles)
  }, [relatedListingsLeft, allListingPages])

  // console.log(tableData)
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Related Listing'}</h4>
        </header>
        <hr />
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
                {relatedListingData.map((item: any, idx) => {
                  return (
                    <MenuItem key={item._id} value={item.relation}>
                      <div className={styles.tagContainer}>
                        <p className={styles.tagText}>{item.relation}</p>
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
                placeholder="Search listing page..."
                autoComplete="name"
                required
                value={pageInputValue}
                onClick={() => setShowDropdown(true)}
                ref={inputRef}
                onBlur={() =>
                  setTimeout(() => {
                    setShowDropdown(false)
                  }, 300)
                }
                onChange={(e) => setPageInputValue(e.target.value)}
              />
              {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
            </div>
            {showDropdown && (
              <div className={styles['dropdown']}>
                {dropdownLoading ? (
                  <div className={styles.dropdownItem}>Loading...</div>
                ) : allDropdownValues.length !== 0 ? (
                  allDropdownValues.map((item: any) => {
                    return (
                      <div
                        key={item?._id}
                        onClick={() => {
                          setSelectedPage(item._id)
                          setPageInputValue(item.title)
                        }}
                        className={styles.dropdownItem}
                      >
                        <Image
                          src={
                            item.profile_image
                              ? item.profile_image
                              : DefaultProfile
                          }
                          alt="profile"
                          width={40}
                          height={40}
                        />
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
                    <tr key={item._id}>
                      <td>{item.title}</td>

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

export default RelatedListingEditModal
