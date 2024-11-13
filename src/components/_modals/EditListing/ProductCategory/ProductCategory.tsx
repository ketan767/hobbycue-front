import React, { useState, useEffect, useRef } from 'react'
import default_image from '../../../../assets/svg/default-images/default-people-listing-icon.svg'
import dynamic from 'next/dynamic'
import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  colors,
} from '@mui/material'

import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import Image from 'next/image'
import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import {
  createNewListing,
  getAllListingCategories,
  getListingPages,
  getListingTags,
  getPages,
  updateListing,
} from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import InputSelect from '@/components/_formElements/Select/Select'
import DownArrow from '@/assets/svg/chevron-down.svg'
import TickIcon from '@/assets/svg/tick.svg'
import CrossIcon from '@/assets/svg/cross.svg'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import SaveModal from '../../SaveModal/saveModal'
import { useRouter } from 'next/router'
import { DropdownOption } from '../../CreatePost/Dropdown/DropdownOption'
import { CommunityDropdownOption } from '@/components/_formElements/CommunityDropdownOption/CommunityDropdownOption'

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
  propData?: any
}

const ProductCategoryModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  propData,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { page_url } = router.query
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [categories, secategories] = useState<
    {
      Description: string
      Show: 'Y' | 'N' | ''
      pageType: string
      listingCategory: string
    }[]
  >([])
  const [selectedCategory, setSelectedCategory] = useState<any>([])
  const [selectedCategoryError, setSelectedCategoryError] = useState(false)
  const [selectedPage, setSelectedPage] = useState<any | []>([])
  const [selectedPageError, setSelectedPageError] = useState(false)
  const [myPages, setMyPages] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef: any = useRef()
  const [error, setError] = useState<string | null>(null)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))
  const [initialData, setInitialData] = useState<any | null>(null)
  const [isChanged, setIsChanged] = useState(false)

  const handleSubmit = async () => {
    if (selectedCategory.length === 0) {
      setSelectedCategoryError(true)
    }
    if (selectedPage.length === 0) {
      setSelectedPageError(true)
      return
    }
    if (propData === 'new') {
      const jsonData = {
        seller: selectedPage,
        page_type: selectedCategory,
        type: 4,
        cta_text: 'Buy Now',
      }

      setSubmitBtnLoading(true)
      const { err, res } = await createNewListing(jsonData)
      if (err) return console.log(err)

      if (onComplete) onComplete()
      else {
        window.location.href = `/product/${res?.data?.data?.listing?.page_url}`
        dispatch(closeModal())
      }
    } else {
      const jsonData = {
        seller: selectedPage,
        page_type: selectedCategory,
      }

      const { err, res } = await updateListing(listingModalData?._id, jsonData)
      if (err) return console.log(err)
      else {
        router.reload()
      }
    }
  }

  useEffect(() => {
    if (propData !== 'new') {
      if (listingModalData?.page_type?.length) {
        setSelectedCategory(
          selectedCategory.concat(listingModalData?.page_type),
        )
      }
      setSelectedPage(listingModalData?.seller._id)
    }
  }, [])

  useEffect(() => {
    getAllListingCategories()
      .then((result) => {
        const { res, err } = result
        if (err) {
          console.log({ err })
        } else if (res?.data && res?.data?.data) {
          secategories(res.data.data)
        }
      })
      .catch((err) => {
        console.log({ err })
      })
  }, [])

  useEffect(() => {
    if (user?._id) {
      const getAllPages = async () => {
        const { res, err } = await getListingPages(`admin=${user?._id}`)
        const totalPages =
          res?.data?.data?.listings.filter((data: any) => data.type !== 4) || []
        setMyPages(totalPages)
      }
      getAllPages()
    }
  }, [user?._id])

  useEffect(() => {
    const hasChanges =
      JSON.stringify(selectedCategory) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)

    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }, [selectedCategory, initialData, onStatusChange])
  const handleCategoryChange = (idToChange: any) => {
    setError('')

    if (
      selectedCategory?.length >= 2 &&
      !selectedCategory.includes(idToChange)
    ) {
      setError('You can select only two Categories')
    } else if (selectedCategory.includes(idToChange)) {
      setSelectedCategory((prev: any) =>
        prev.filter((item: any) => item !== idToChange),
      )
    } else {
      setSelectedCategory([...selectedCategory, idToChange])
    }
  }

  const handleAddListing = () => {
    dispatch(closeModal())
    router.push('/add-listing')
  }

  const handlePageChange = (id: string) => {
    setSelectedPage(id)
  }

  const parentPage = myPages?.find((obj) => obj?._id === selectedPage)

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

  console.warn('selectedcategoryyyy', selectedCategory)

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M19.5811 13.3848H13.5811V19.3848H11.5811V13.3848H5.58105V11.3848H11.5811V5.38477H13.5811V11.3848H19.5811V13.3848Z"
        fill="#8064A2"
      />
    </svg>
  )

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
      />
    )
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Product Category'}</h4>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            <label>Seller / Parent Page</label>
            <input hidden required />
            <InputSelect
              selectText="Select Page"
              type="page"
              className={styles['parent-page']}
              img={parentPage?.profile_image}
              value={parentPage?.title}
            >
              {myPages?.map((obj, i) => {
                if (!obj?.title) return <></>
                const profileImage = obj?.profile_image || default_image
                return (
                  <>
                    <DropdownOption
                      key={i}
                      type={'hobby'}
                      value={obj._id}
                      display={obj.title}
                      image={profileImage}
                      options={null}
                      onChange={handlePageChange}
                      item={obj._id}
                      _id={obj._id}
                    />
                  </>
                )
              })}
            </InputSelect>
          </div>
          <div className={styles['no-page']}>
            <p>If you don’t have a page then...</p>
            <div onClick={handleAddListing} className={styles['add-listing']}>
              {plusIcon}
              <p>Add Listing Page</p>
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Product Category</label>
            <input hidden required />
            <div className={styles['selected-values']}>
              {selectedCategory.length > 0 &&
                selectedCategory.map((el: any) => (
                  <div key={el} className={styles['selected-value']}>
                    <p>{el}</p>
                    <Image
                      src={CrossIcon}
                      alt="cancel"
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory.filter((item: any) => item !== el),
                        )
                      }
                    />
                  </div>
                ))}
            </div>
            <div className={styles['select-container']} ref={dropdownRef}>
              <div
                className={styles['select-input']}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <p>
                  {/* {' '}
                  {selectedCategory?.length === 0
                    ? 'Select Category'
                    : selectedCategory} */}
                  Select Category
                </p>
                <Image src={DownArrow} alt="down" />
              </div>
              {showDropdown && (
                <div className={styles['options-container']}>
                  <div className={styles['vertical-line']}></div>
                  {categories
                    .filter(
                      (cat) => cat.pageType === 'Product' && cat.Show === 'Y',
                    )
                    .map((item, idx: number) => {
                      return (
                        <div
                          className={`${styles['single-option']} ${
                            selectedCategory?.includes(item.listingCategory)
                              ? `${styles['chosen-option']} ${styles['selcted-option']}`
                              : ''
                          }`}
                          key={idx}
                          onClick={() => {
                            handleCategoryChange(item.listingCategory)
                            setShowDropdown(false)
                          }}
                        >
                          {selectedCategory === item.listingCategory ? (
                            <div className={styles['selected-bg']}></div>
                          ) : null}
                          <p className={`${styles.tagText}`}>
                            {item.listingCategory}
                          </p>
                          <p className={styles.tagDesc}>
                            {item.Description}
                            <Image
                              src={TickIcon}
                              alt="down"
                              className={styles['tick-icon']}
                            />
                          </p>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
            <p className={styles.error}>{error}</p>
            {/* <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
              <Select
                value={selectedCategory}
                multiple={true}
                onChange={(e) => {
                  let val: any = e.target.value
                  if (val) {
                    setSelectedCategory((prev: any) => [...val])
                  }
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {tags.map((item: any, idx) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      <div className={styles.tagContainer}>
                        <p className={styles.tagText}>{item.name}</p>
                        <p className={styles.tagDesc}>{item.description}</p>
                      </div>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl> */}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button
              className={'modal-footer-btn cancel'}
              onClick={onBackBtnClick}
            >
              Back
            </button>
          )}

          <button
            ref={nextButtonRef}
            className={'modal-footer-btn submit'}
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
        </footer>
      </div>
    </>
  )
}

export default ProductCategoryModal
