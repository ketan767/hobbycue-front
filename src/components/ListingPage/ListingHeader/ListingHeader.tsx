import React, { useEffect, useRef, useState } from 'react'
import styles from './ListingHeader.module.css'
import Image from 'next/image'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import CameraIcon from '@/assets/icons/CameraIcon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'
import {
  updateListing,
  updateListingCover,
  updateListingProfile,
} from '@/services/listing.service'
import { updatePhotoEditModalData } from '@/redux/slices/site'
import { openModal, updateImageUrl, updateShareUrl } from '@/redux/slices/modal'
import { dateFormat } from '@/utils'
import CustomTooltip from '@/components/Tooltip/ToolTip'
import Calendar from '@/assets/svg/calendar-light.svg'
import Time from '@/assets/svg/clock-light.svg'
import EditIcon from '@/assets/svg/edit-colored.svg'
import ShareIcon from '../../../assets/icons/ShareIcon'
import MailIcon from '@/assets/svg/mailicon.svg'
import ListingGeneralEditModal from '@/components/_modals/EditListing/ListingGeneral'
import FilledButton from '@/components/_buttons/FilledButton'
import CoverPhotoLayout from '@/layouts/CoverPhotoLayout/CoverPhotoLayout'
import ProfileImageLayout from '@/layouts/ProfileImageLayout/ProfileImageLayout'
import claimSvg from '@/assets/svg/claimedsvg.svg'
import EditWhite from '@/assets/svg/edit_white.svg'
import Dropdown from './DropDown'
import { listingTypes } from '@/constants/constant'
import ListingPageLayout from '@/layouts/ListingPageLayout'
import RepostIcon from '@/assets/icons/RepostIcon'
import { ClaimListing } from '@/services/auth.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { showProfileError } from '@/redux/slices/user'
import { useRouter } from 'next/router'
import smallPencilSvg from '@/assets/svg/small-pencil.svg'
import { useMediaQuery } from '@mui/material'
import VerticalSlider from './VerticalSlider'
import { uploadImage } from '@/services/post.service'
import ReactPlayer from 'react-player'
import InputSelect from '@/components/InputSelect/inputSelect'
import ProductImageSlider from './ProductImageSlider'

type Props = {
  data: ListingPageData['pageData']
  activeTab: ListingPageTabs
  setpageTypeErr?: React.Dispatch<React.SetStateAction<boolean>>
  setHobbyError?: React.Dispatch<React.SetStateAction<boolean>>
  setHAboutErr?: React.Dispatch<React.SetStateAction<boolean>>
  setContactInfoErr?: React.Dispatch<React.SetStateAction<boolean>>
  setLocationErr?: React.Dispatch<React.SetStateAction<boolean>>
  setTitleError?: React.Dispatch<React.SetStateAction<boolean>>
}

const ListingHeader: React.FC<Props> = ({
  data,
  activeTab,
  setContactInfoErr,
  setHAboutErr,
  setHobbyError,
  setLocationErr,
  setpageTypeErr,
  setTitleError,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const { listingLayoutMode } = useSelector((state: any) => state.site)
  const [showDays, setShowDays] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [HighlightRed, SetHiglightRed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const [VarientData, setVarientData] = useState<{
    _id?: string
    variant_tag?: string
    variations?: { name: string; value: string; quantity: number }[]
    note?: string
  }>({
    variant_tag: '',
    variations: [],
    note: '',
  })

  const [inpSelectValues, setInpSelectValues] = useState<{
    name?: string
    value?: any
  }>({})
  console.warn('inputselect', inpSelectValues)
  const { active_img_product } = useSelector((state: RootState) => state.site)
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }
  const isMobile = useMediaQuery('(max-width:1100px)')
  const onInputChange = (e: any, type: 'profile' | 'cover') => {
    e.preventDefault()
    let files = e.target.files

    if (files.length === 0) return

    console.log('data', data?.pageData)
    const reader = new FileReader()
    reader.onload = () => {
      dispatch(
        updatePhotoEditModalData({
          type,
          image: reader.result,
          onComplete:
            type === 'profile'
              ? handleUserProfileUpload
              : type === 'cover'
              ? handleUserCoverUpload
              : () => {},
        }),
      )
      dispatch(
        openModal({
          type: 'upload-image',
          closable: true,
        }),
      )
    }
    reader.readAsDataURL(files[0])
  }
  console.warn('inpSelectValues', inpSelectValues)
  const handleUserProfileUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('listing-profile', blob)
    const { err, res } = await updateListingProfile(data._id, formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
      // dispatch(closeModal())
    }
  }

  const handleUserCoverUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('listing-cover', blob)
    const { err, res } = await updateListingCover(data._id, formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
      // dispatch(closeModal())
    }
  }

  const handleEventEditClick = () => {
    dispatch(
      openModal({
        type: 'listing-event-hours-edit',
        closable: true,
      }),
    )
  }

  const openTitleEditModal = () => {
    dispatch(
      openModal({
        type: 'listing-general-edit',
        closable: true,
      }),
    )
  }

  const openAboutEditModal = () => {
    dispatch(
      openModal({
        type: 'listing-about-edit',
        closable: true,
      }),
    )
  }

  const OpenProductPurchaseModal = () => {
    dispatch(
      openModal({
        type: 'listing-product-variants-edit',
        closable: true,
        propData: { currentListing: data },
      }),
    )
  }

  const handlePublish = async () => {
    if (data.is_published !== true) {
      let hasError = false
      if (data._hobbies.length === 0) {
        hasError = true
        setHobbyError?.(true)
      }
      if (data.page_type.length === 0) {
        hasError = true
        setpageTypeErr?.(true)
      }
      if (!data.phone && !data.public_email) {
        hasError = true
        setContactInfoErr?.(true)
      }
      if (data.type !== 4) {
        if (!data?._address?.url && !data?._address?.city) {
          setLocationErr?.(true)
          hasError = true
        }
      }
      if (data.type === 4) {
        if (!data.title) {
          setTitleError?.(true)
          SetHiglightRed(true)
          hasError = true
        }
      }

      if (hasError) {
        setSnackbar({
          display: true,
          type: 'warning',
          message: 'Fill up the mandatory fields.',
        })
        return
      }
    }
    const { err, res } = await updateListing(data._id, {
      is_published: data.is_published === true ? false : true,
    })
    if (err) return console.log(err)
    else {
      window.location.reload()
    }
  }

  const handleContact = () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({ type: 'Listing-Contact-To-Owner', closable: true }),
        )
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const handleClaim = async () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(openModal({ type: 'claim-listing', closable: true }))
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const handleRegister = async () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({
            type: 'listing-product-purchase',
            closable: true,
            propData: { currentListing: data },
          }),
        )
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const handleBuy = async () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({
            type: 'listing-product-purchase',
            closable: true,
            propData: { currentListing: data },
          }),
        )
        if (data.click_url) {
          window.open(data.click_url, '_blank', 'noopener,noreferrer')
        }
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const handleCtaText = (ctaText: string) => {
    if (ctaText === 'Buy Now') {
      if (data.click_url) {
        window.open(data.click_url, '_blank', 'noopener,noreferrer')
      } else {
        setSnackbar({
          type: 'warning',
          display: true,
          message: 'No Buy Now URL available',
        })
      }
    }
  }

  const handleShare = () => {
    dispatch(updateShareUrl(window.location.href))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const [open, setOpen] = useState(false)

  const handleDropdown = () => {
    if (open) {
      setOpen(false)
      if (!isAuthenticated) {
        dispatch(openModal({ type: 'auth', closable: true }))
      }
    } else {
      setOpen(true)
    }
  }

  const OpenProfileImage = () => {
    console.log('pro', data.profile_image)
    dispatch(updateImageUrl(data?.profile_image))
    dispatch(
      openModal({
        type: 'View-Image-Modal',
        closable: false,
        imageurl: data?.profile_image,
      }),
    )
  }

  const OpenCoverImage = () => {
    dispatch(updateImageUrl(data?.cover_image))
    dispatch(
      openModal({
        type: 'View-Image-Modal',
        closable: false,
        imageurl: data?.cover_image,
      }),
    )
  }

  const handleUpdateCTA = () => {
    if (isLoggedIn) {
      if (user.is_onboarded) {
        dispatch(
          openModal({
            type: 'listing-cta-edit',
            closable: true,
            propData: { currentListing: data },
          }),
        )
      } else {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      }
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

  const ctaText = data.cta_text
  const isEditMode = listingLayoutMode === 'edit'

  let button
  if (!ctaText || ctaText === 'Contact') {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : handleContact}
      >
        <p>Contact</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
      </FilledButton>
    )
  } else if (ctaText === 'Claim') {
    button = (
      <FilledButton
        className={isEditMode ? styles.contactBtn : styles.contactBtnpublic}
        onClick={isEditMode ? handleUpdateCTA : handleClaim}
      >
        <p>Claim</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
      </FilledButton>
    )
  } else if (ctaText === 'Register') {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : handleRegister}
      >
        <p>{ctaText}</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
      </FilledButton>
    )
  } else if (ctaText === 'Buy Now') {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : handleBuy}
      >
        <p>{ctaText}</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
      </FilledButton>
    )
  } else {
    button = (
      <FilledButton
        className={styles.contactBtn}
        onClick={isEditMode ? handleUpdateCTA : () => handleCtaText(ctaText)}
      >
        <p>{ctaText}</p>
        {isEditMode && (
          <img
            width={16}
            height={16}
            src={smallPencilSvg.src}
            alt="small pencil"
          />
        )}
      </FilledButton>
    )
  }

  function formatDateRange(
    fromDate: string | number | Date,
    toDate: string | number | Date,
  ): string {
    try {
      const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric' }
      const monthYearOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
      }

      const from = new Date(fromDate)
      const to = new Date(toDate)

      const fromDay = new Intl.DateTimeFormat('en-US', dayOptions).format(from)
      const toDay = new Intl.DateTimeFormat('en-US', dayOptions).format(to)
      const fromMonthYear = new Intl.DateTimeFormat(
        'en-US',
        monthYearOptions,
      ).format(from)
      const toMonthYear = new Intl.DateTimeFormat(
        'en-US',
        monthYearOptions,
      ).format(to)

      if (
        from.getMonth() === to.getMonth() &&
        from.getFullYear() === to.getFullYear() &&
        from.getDate() !== to.getDate()
      ) {
        return `${fromDay} - ${toDay} ${fromMonthYear}`
      } else if (
        from.getMonth() === to.getMonth() &&
        from.getFullYear() === to.getFullYear() &&
        from.getDate() === to.getDate()
      ) {
        return `${fromDay} ${fromMonthYear}`
      } else {
        return `${fromDay} ${fromMonthYear} - ${toDay} ${toMonthYear}`
      }
    } catch (error) {
      return ''
    }
  }
  const location = typeof window !== 'undefined' ? window.location.href : ''
  const handleRepost = () => {
    if (!isAuthenticated) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    if (isLoggedIn) {
      if (!user.is_onboarded) {
        router.push(`/profile/${user.profile_url}`)
        dispatch(showProfileError(true))
      } else {
        dispatch(
          openModal({
            type: 'create-post',
            closable: true,
            propData: { defaultValue: location },
          }),
        )
      }
    } else {
      dispatch(
        openModal({
          type: 'auth',
          closable: true,
        }),
      )
    }
  }
  const Dropdownref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        Dropdownref.current &&
        !Dropdownref.current.contains(event.target as Node)
      ) {
        setOpen(false) // Close the dropdown when clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [Dropdownref])

  useEffect(() => {
    setVarientData(data.product_variant)

    setInpSelectValues(data?.product_variant?.variations?.[0])
  }, [])
  console.warn('variendata', VarientData)
  const handleImageChange = (e: any) => {
    const images = [...e?.target?.files]
    const image = e?.target?.files[0]
    handleImageUpload(image, false)
  }

  const handleImageUpload = async (image: any, isVideo: boolean) => {
    const formData = new FormData()
    formData.append('post', image)
    console.log('formData', formData)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      console.log(res.data)
      const img = res.data.data.url
      updateListingPage(img)
    }
  }
  const updateListingPage = async (url: string) => {
    let arr: any = []
    if (data?.images) {
      arr = data.images
    }
    const { err, res } = await updateListing(data._id, {
      images: [...arr, url],
    })
    if (err) return console.log(err)
    window.location.reload()
    console.log(res)
  }

  const idx = active_img_product?.idx ?? 0

  const incQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decQuantity = () => {
    if (quantity !== 1) setQuantity(quantity - 1)
  }

  const uploadIcon = (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.0811" cy="11.3848" r="11" fill="#8064A2" />
      <g clip-path="url(#clip0_16381_26510)">
        <path
          d="M15.293 10.2553C14.9034 8.27878 13.1674 6.79492 11.082 6.79492C9.4263 6.79492 7.98828 7.7345 7.27214 9.1095C5.54766 9.29284 4.20703 10.7538 4.20703 12.5241C4.20703 14.4204 5.74818 15.9616 7.64453 15.9616H15.0924C16.6737 15.9616 17.957 14.6783 17.957 13.097C17.957 11.5845 16.7826 10.3585 15.293 10.2553ZM12.2279 11.9512V14.2428H9.9362V11.9512H8.21745L11.082 9.08659L13.9466 11.9512H12.2279Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_16381_26510">
          <rect
            width="13.75"
            height="13.75"
            fill="white"
            transform="translate(4.20703 4.50488)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const dropdownIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      cursor={'pointer'}
    >
      <path
        d="M2.7313 13.0784H13.5506C13.6601 13.078 13.7675 13.0478 13.8612 12.991C13.9548 12.9341 14.0312 12.8529 14.0821 12.7558C14.1329 12.6588 14.1564 12.5498 14.1499 12.4404C14.1434 12.3311 14.1073 12.2256 14.0453 12.1353L8.63563 4.32134C8.41143 3.99736 7.87167 3.99736 7.64687 4.32134L2.23722 12.1353C2.1746 12.2254 2.13788 12.331 2.13105 12.4405C2.12421 12.55 2.14753 12.6593 2.19846 12.7565C2.24939 12.8538 2.32598 12.9351 2.41992 12.9919C2.51386 13.0486 2.62156 13.0785 2.7313 13.0784Z"
        fill="#6D747A"
      />
    </svg>
  )

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

  const minusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M11.9997 8.61895H3.99967C3.63301 8.61895 3.33301 8.34038 3.33301 7.99991C3.33301 7.65943 3.63301 7.38086 3.99967 7.38086H11.9997C12.3663 7.38086 12.6663 7.65943 12.6663 7.99991C12.6663 8.34038 12.3663 8.61895 11.9997 8.61895Z"
        fill="#8064A2"
      />
    </svg>
  )
  const rupeesIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9545 6.40909L15.1477 9.38636H0.0681819L0.886364 6.40909H15.9545ZM8.375 24L0.420455 14.4318L0.409091 11.9091H4.34091C5.2803 11.9091 6.06439 11.7538 6.69318 11.4432C7.32955 11.125 7.81061 10.6818 8.13636 10.1136C8.4697 9.53788 8.63636 8.86364 8.63636 8.09091C8.63636 6.93182 8.29545 6 7.61364 5.29545C6.93182 4.59091 5.84091 4.23864 4.34091 4.23864H0.0681819L0.954545 0.727272H4.34091C6.25 0.727272 7.82955 1.02273 9.07955 1.61364C10.3371 2.19697 11.2765 3.02273 11.8977 4.09091C12.5265 5.15909 12.8409 6.40909 12.8409 7.84091C12.8409 9.10606 12.6098 10.2348 12.1477 11.2273C11.6856 12.2197 10.9583 13.0341 9.96591 13.6705C8.97348 14.3068 7.67424 14.7311 6.06818 14.9432L5.93182 14.9886L13.1136 23.7955V24H8.375ZM15.9773 0.727272L15.1477 3.75L2.92045 3.70454L3.75 0.727272H15"
        fill="#08090A"
      />
    </svg>
  )
  return (
    <>
      <header
        className={`site-container ${styles['header']} ${
          data.type === 4 && styles['product-header']
        }`}
      >
        {/* Profile Picture */}
        <div className={styles['profile-img-wrapper']}>
          <div className={styles['relative']}>
            {data.type === 4 ? (
              !isMobile && <VerticalSlider data={data} />
            ) : data?.profile_image && data.type !== 4 ? (
              <img
                onClick={OpenProfileImage}
                className={`${styles['img']} imageclick`}
                src={data?.profile_image}
                alt=""
                width={160}
                height={160}
              />
            ) : (
              <div className={`${styles['img']}`}>
                <ProfileImageLayout
                  onChange={(e: any) => onInputChange(e, 'profile')}
                  profileLayoutMode={listingLayoutMode}
                  type={'page'}
                  typeId={data?.type}
                ></ProfileImageLayout>
              </div>
            )}

            {listingLayoutMode === 'edit' && data.type !== 4 && (
              <label className={styles['edit-btn']}>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => onInputChange(e, 'profile')}
                />
                <CameraIcon />
              </label>
            )}
          </div>
          {data.type !== 4 && (
            <div className={styles['name-container']}>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <h1 className={styles['name']}>{data?.title} </h1>
                {listingLayoutMode === 'edit' && (
                  <Image
                    className={styles['edit-icon']}
                    src={EditIcon}
                    alt="edit"
                    onClick={openTitleEditModal}
                  />
                )}
              </div>
              {data?.tagline ? (
                <p className={styles['tagline']}>{data?.tagline}</p>
              ) : (
                <p className={styles['tagline']}>&nbsp;</p>
              )}
            </div>
          )}
        </div>
        <div className={styles['event-date-container-responsive']}>
          {data?.type === listingTypes.PROGRAM && data?.event_date_time ? (
            <div className={styles['eventDate-parent']}>
              <div
                className={
                  styles.eventDate + ` ${showDays && styles['eventDate-open']}`
                }
              >
                <Image className={styles['im']} src={Calendar} alt="calendar" />
                <div className={styles['event-dates']}>
                  {data.event_date_time && data?.event_date_time?.length > 0
                    ? (showDays
                        ? data.event_date_time
                        : data.event_date_time.slice(0, 1)
                      ).map((obj: any, i: number, arr: any[]) => (
                        <p key={i} className={styles.date}>
                          {formatDateRange(obj?.from_date, obj?.to_date)}

                          {isMobile &&
                          showDays === false &&
                          data.event_date_time?.length > 1 &&
                          (!data.event_weekdays ||
                            data.event_weekdays.length <= 1) ? (
                            <>
                              ...{' '}
                              <span
                                onClick={() => setShowDays((prev) => !prev)}
                              >
                                more
                              </span>
                            </>
                          ) : null}
                          {isMobile &&
                            showDays &&
                            data.event_date_time.length - 1 === i && (
                              <>
                                {' '}
                                <span
                                  onClick={() => setShowDays((prev) => !prev)}
                                >
                                  Less
                                </span>
                              </>
                            )}
                        </p>
                      ))
                    : ''}
                </div>
                {(data.event_weekdays && data.event_weekdays.length > 0) ||
                  (data.event_date_time &&
                    data?.event_date_time?.length > 0 && (
                      <Image className={styles['im']} src={Time} alt="Time" />
                    ))}
                <div className={styles['flex-col-4']}>
                  {data.event_weekdays && data?.event_weekdays?.length > 0
                    ? (showDays
                        ? data.event_weekdays
                        : data.event_weekdays.slice(0, 1)
                      ).map((obj: any, i: number, arr: any[]) =>
                        i > 0 && !showDays ? null : (
                          <p
                            key={i}
                            className={
                              isEditMode
                                ? styles.time
                                : styles.editTime +
                                  ` ${
                                    i !== 0 && showDays === false
                                      ? styles['hide']
                                      : ''
                                  }`
                            }
                          >
                            {obj?.from_day}{' '}
                            {obj?.to_day !== obj?.from_day &&
                              ' - ' + obj?.to_day}
                            , {obj?.from_time}
                            {isMobile && showDays === false ? (
                              <>
                                ...{' '}
                                <span
                                  onClick={() => setShowDays((prev) => !prev)}
                                >
                                  more
                                </span>
                              </>
                            ) : (
                              <>
                                {' '}
                                -
                                {showDays === false &&
                                !isMobile &&
                                data.event_weekdays.length > 1 ? (
                                  <>
                                    {' ... '}
                                    <span
                                      onClick={() =>
                                        setShowDays((prev) => !prev)
                                      }
                                      className={styles['purpleText']}
                                    >
                                      more
                                    </span>
                                  </>
                                ) : (
                                  obj?.to_time
                                )}
                                {data.event_weekdays.length - 1 === i &&
                                  isMobile && (
                                    <>
                                      {' '}
                                      <span
                                        onClick={() =>
                                          setShowDays((prev) => !prev)
                                        }
                                      >
                                        Less
                                      </span>
                                    </>
                                  )}
                              </>
                            )}
                          </p>
                        ),
                      )
                    : data.event_date_time &&
                      data?.event_date_time?.length > 0 && (
                        <>
                          {(showDays
                            ? data.event_date_time
                            : data.event_date_time.slice(0, 1)
                          ).map((obj: any, i: number) => (
                            <p
                              key={i}
                              className={
                                isEditMode ? styles.time : styles.editTime
                              }
                            >
                              {obj?.from_time} - {obj?.to_time}
                            </p>
                          ))}
                        </>
                      )}
                </div>
                {listingLayoutMode === 'edit' ? (
                  <>
                    <Image
                      className={styles['edit-icon']}
                      src={EditIcon}
                      alt="edit"
                      onClick={handleEventEditClick}
                    />
                    {((data.event_weekdays &&
                      data?.event_weekdays?.length > 1) ||
                      (data?.event_date_time &&
                        data?.event_date_time?.length > 1)) > 0 && (
                      <div
                        onClick={() => setShowDays((prev) => !prev)}
                        className={`${showDays ? '' : styles['rotate']} ${
                          styles['flex-col-start']
                        }`}
                      >
                        {dropdownIcon}
                      </div>
                    )}
                  </>
                ) : (
                  listingLayoutMode !== 'edit' &&
                  ((data.event_weekdays && data?.event_weekdays?.length > 1) ||
                    (data?.event_date_time &&
                      data?.event_date_time?.length > 1)) &&
                  !isMobile && (
                    <div
                      onClick={() => setShowDays((prev) => !prev)}
                      className={`${showDays ? '' : styles['rotate']} ${
                        styles['flex-col-start']
                      }`}
                    >
                      {dropdownIcon}
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className={styles['display-desktop']}>{button}</div>
        </div>

        {/* Center Elements */}
        {data.type !== 4 ? (
          <section className={styles['center-container']}>
            <div className={styles['cover-img-wrapper']}>
              <div
                className={styles['background']}
                style={{ backgroundImage: `url(${data?.cover_image})` }}
              ></div>
              {data?.cover_image ? (
                <img
                  onClick={OpenCoverImage}
                  className={`${styles['img']} imageclick`}
                  src={data?.cover_image}
                  alt=""
                  height={296}
                  width={1000}
                />
              ) : (
                <div className={styles['img']}>
                  <CoverPhotoLayout
                    type="page"
                    onChange={(e: any) => onInputChange(e, 'cover')}
                    profileLayoutMode={listingLayoutMode}
                    typeId={data?.type}
                  ></CoverPhotoLayout>
                </div>
              )}

              {listingLayoutMode === 'edit' && (
                <label className={styles['edit-btn']}>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => onInputChange(e, 'cover')}
                  />
                  <CameraIcon />
                </label>
              )}
            </div>
            <div className={styles['content-container']}>
              <div className={styles['name-container']}>
                <h1 className={styles['name']}>
                  {data?.title}
                  {data?.is_verified ? (
                    <Image alt="claim" src={claimSvg} />
                  ) : (
                    ''
                  )}
                  {listingLayoutMode === 'edit' && (
                    <Image
                      className={styles['edit-icon']}
                      src={EditIcon}
                      alt="edit"
                      onClick={openTitleEditModal}
                    />
                  )}
                </h1>
                {data?.tagline ? (
                  <p className={styles['tagline']}>{data?.tagline}</p>
                ) : (
                  <p className={styles['tagline']}>&nbsp;</p>
                )}
              </div>
              <div className={styles['event-date-container']}>
                {data?.type === listingTypes.PROGRAM &&
                data?.event_date_time ? (
                  <div className={styles['eventDate-parent']}>
                    <div
                      className={
                        styles.eventDate +
                        ` ${showDays && styles['eventDate-open']}`
                      }
                    >
                      <Image
                        className={styles['im']}
                        src={Calendar}
                        alt="calendar"
                      />
                      <div className={styles['event-dates']}>
                        {data.event_date_time &&
                        data?.event_date_time?.length > 0
                          ? (showDays
                              ? data.event_date_time
                              : data.event_date_time.slice(0, 1)
                            ).map((obj: any, i: number, arr: any[]) => (
                              <p key={i} className={styles.date}>
                                {formatDateRange(obj?.from_date, obj?.to_date)}

                                {isMobile &&
                                showDays === false &&
                                data.event_date_time?.length > 1 &&
                                (!data.event_weekdays ||
                                  data.event_weekdays.length <= 1) ? (
                                  <>
                                    ...{' '}
                                    <span
                                      onClick={() =>
                                        setShowDays((prev) => !prev)
                                      }
                                    >
                                      more
                                    </span>
                                  </>
                                ) : null}
                                {isMobile &&
                                  showDays &&
                                  data.event_date_time.length - 1 === i && (
                                    <>
                                      {' '}
                                      <span
                                        onClick={() =>
                                          setShowDays((prev) => !prev)
                                        }
                                      >
                                        Less
                                      </span>
                                    </>
                                  )}
                              </p>
                            ))
                          : ''}
                      </div>
                      {(data.event_weekdays &&
                        data.event_weekdays.length > 0) ||
                        (data.event_date_time &&
                          data?.event_date_time?.length > 0 && (
                            <Image
                              className={styles['im']}
                              src={Time}
                              alt="Time"
                            />
                          ))}
                      <div className={styles['flex-col-4']}>
                        {data.event_weekdays && data?.event_weekdays?.length > 0
                          ? (showDays
                              ? data.event_weekdays
                              : data.event_weekdays.slice(0, 1)
                            ).map((obj: any, i: number, arr: any[]) =>
                              i > 0 && !showDays ? null : (
                                <p
                                  key={i}
                                  className={
                                    isEditMode
                                      ? styles.time
                                      : styles.editTime +
                                        ` ${
                                          i !== 0 && showDays === false
                                            ? styles['hide']
                                            : ''
                                        }`
                                  }
                                >
                                  {obj?.from_day}{' '}
                                  {obj?.to_day !== obj?.from_day &&
                                    ' - ' + obj?.to_day}
                                  , {obj?.from_time}
                                  {isMobile && showDays === false ? (
                                    <>
                                      ...{' '}
                                      <span
                                        onClick={() =>
                                          setShowDays((prev) => !prev)
                                        }
                                      >
                                        more
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {' '}
                                      -
                                      {showDays === false &&
                                      !isMobile &&
                                      data.event_weekdays.length > 1 ? (
                                        <>
                                          {' ... '}
                                          <span
                                            onClick={() =>
                                              setShowDays((prev) => !prev)
                                            }
                                            className={styles['purpleText']}
                                          >
                                            more
                                          </span>
                                        </>
                                      ) : (
                                        obj?.to_time
                                      )}
                                      {data.event_weekdays.length - 1 === i &&
                                        isMobile && (
                                          <>
                                            {' '}
                                            <span
                                              onClick={() =>
                                                setShowDays((prev) => !prev)
                                              }
                                            >
                                              Less
                                            </span>
                                          </>
                                        )}
                                    </>
                                  )}
                                </p>
                              ),
                            )
                          : data.event_date_time &&
                            data?.event_date_time?.length > 0 && (
                              <>
                                {(showDays
                                  ? data.event_date_time
                                  : data.event_date_time.slice(0, 1)
                                ).map((obj: any, i: number) => (
                                  <p
                                    key={i}
                                    className={
                                      isEditMode ? styles.time : styles.editTime
                                    }
                                  >
                                    {obj?.from_time} - {obj?.to_time}
                                  </p>
                                ))}
                              </>
                            )}
                      </div>
                      {listingLayoutMode === 'edit' ? (
                        <>
                          <Image
                            className={styles['edit-icon']}
                            src={EditIcon}
                            alt="edit"
                            onClick={handleEventEditClick}
                          />
                          {((data.event_weekdays &&
                            data?.event_weekdays?.length > 1) ||
                            (data?.event_date_time &&
                              data?.event_date_time?.length > 1)) > 0 && (
                            <div
                              onClick={() => setShowDays((prev) => !prev)}
                              className={`${showDays ? '' : styles['rotate']} ${
                                styles['flex-col-start']
                              }`}
                            >
                              {dropdownIcon}
                            </div>
                          )}
                        </>
                      ) : (
                        listingLayoutMode !== 'edit' &&
                        ((data.event_weekdays &&
                          data?.event_weekdays?.length > 1) ||
                          (data?.event_date_time &&
                            data?.event_date_time?.length > 1)) &&
                        !isMobile && (
                          <div
                            onClick={() => setShowDays((prev) => !prev)}
                            className={`${showDays ? '' : styles['rotate']} ${
                              styles['flex-col-start']
                            }`}
                          >
                            {dropdownIcon}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className={styles['display-desktop']}>{button}</div>
              </div>
            </div>
          </section>
        ) : (
          <section className={styles['product-header-content']}>
            {isMobile ? (
              <VerticalSlider data={data} />
            ) : active_img_product?.type === 'image' && data?.profile_image ? (
              <img
                className={styles['active-image']}
                src={
                  active_img_product?.idx === 0
                    ? data?.profile_image
                    : data.images[active_img_product?.idx - 1]
                }
              />
            ) : active_img_product?.type === 'video' ? (
              <div className={styles['active-image']}>
                {data?.video_url && (
                  <div className={styles['videos']}>
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={data?.video_url}
                      controls={true}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`${styles.item} ${
                  !isEditMode ? styles['item-view'] : ''
                }`}
              >
                {listingLayoutMode === 'edit' ? (
                  <>
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      className={styles.hidden}
                      onChange={(e: any) => onInputChange(e, 'profile')}
                      ref={inputRef}
                    />
                    {uploadIcon}
                    <p>Add Image</p>
                  </>
                ) : (
                  ''
                )}
              </div>
            )}

            <div className={styles['product-name-container']}>
              <div>
                <h1 className={styles['name']}>
                  <div
                    className={`${!data?.title && styles['default-text']}
                        ${HighlightRed && styles['error-red']}`}
                  >
                    {data?.title || 'Title of the Product'}
                    {!data?.title && (
                      <span className={styles['required-asterisk']}>*</span>
                    )}
                    {data?.is_verified ? (
                      <Image alt="claim" src={claimSvg} />
                    ) : (
                      ''
                    )}
                  </div>

                  {listingLayoutMode === 'edit' && (
                    <Image
                      className={styles['edit-icon']}
                      src={EditIcon}
                      alt="edit"
                      onClick={openTitleEditModal}
                    />
                  )}
                </h1>
                {
                  data?.tagline && (
                    <p className={styles['tagline']}>{data?.tagline}</p>
                  )
                  // : (
                  //   !isMobile && <p className={styles['tagline']}>&nbsp;</p>
                  // )
                }
                <div className={styles['edit-field-wrapper']}>
                  {data?.description ? (
                    <div className={styles['about-text']}>
                      <div
                        dangerouslySetInnerHTML={{ __html: data?.description }}
                      />
                    </div>
                  ) : listingLayoutMode === 'edit' ? (
                    <div className={styles['about-text']}>
                      About
                      <span className={styles['required-asterisk']}>*</span>
                    </div>
                  ) : (
                    ''
                  )}
                  {listingLayoutMode === 'edit' && (
                    <Image
                      className={styles['edit-icon']}
                      src={EditIcon}
                      alt="edit"
                      onClick={openAboutEditModal}
                    />
                  )}
                </div>
              </div>
              <div className={styles['varient-price-container']}>
                <div className={styles['price-and-qunaitity']}>
                  <div className="">
                    <div className={styles['flex-container']}>
                      {inpSelectValues && (
                        <div style={{ width: '100%' }}>
                          <InputSelect
                            options={
                              VarientData?.variations?.map(
                                (item) => item.name,
                              ) || []
                            }
                            value={inpSelectValues?.['name'] || ''}
                            onChange={(selectedName: string) => {
                              if (VarientData) {
                                const selectedVariation =
                                  VarientData?.variations?.find(
                                    (item) => item.name === selectedName,
                                  )
                                setInpSelectValues({
                                  name: selectedName,
                                  value: selectedVariation?.value || '',
                                })
                              }
                            }}
                          />
                        </div>
                      )}
                      {listingLayoutMode === 'edit' && (
                        <Image
                          className={styles['edit-icon']}
                          src={EditIcon}
                          alt="edit"
                          onClick={OpenProductPurchaseModal}
                        />
                      )}
                    </div>

                    <div
                      className={styles.varientpirce}
                      style={{ marginTop: 20 }}
                    >
                      {rupeesIcon}
                      {quantity !== 0
                        ? (
                            inpSelectValues?.['value'] * quantity
                          ).toLocaleString('en-IN') || 0
                        : quantity == 0
                        ? inpSelectValues?.['value']
                        : 0 || 0}
                    </div>
                  </div>
                  <div className="">
                    {inpSelectValues && (
                      <div className={styles['flex-container']}>
                        <label>Quantity:</label>
                        <div className={styles['qunatity']}>
                          <div className={styles['quantity']}>
                            <button
                              onClick={() => {
                                decQuantity()
                              }}
                            >
                              {minusIcon}
                            </button>
                            <p>{quantity}</p>
                            <button
                              onClick={() => {
                                incQuantity()
                              }}
                            >
                              {plusIcon}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className={styles['cta-product-btn']}>{button}</div>
              )}
            </div>
          </section>
        )}
        <div className={styles['actions-container-desktop']}>
          {listingLayoutMode === 'edit' && (
            <FilledButton
              className={
                data.is_published ? styles.unpublishBtn : styles.publishBtn
              }
              onClick={handlePublish}
            >
              {data.is_published ? 'Unpublish' : 'Publish'}
            </FilledButton>
          )}
          {/* Action Buttons */}
          <div className={styles['action-btn-wrapper']}>
            {/* Send Email Button  */}
            <div onClick={handleRepost}>
              <CustomTooltip title="Repost">
                <div
                  onClick={(e) => console.log(e)}
                  className={styles['action-btn']}
                >
                  <RepostIcon />
                </div>
              </CustomTooltip>
            </div>

            {/* Bookmark Button */}
            <CustomTooltip title="Bookmark">
              <div
                onClick={showFeatureUnderDevelopment}
                className={styles['action-btn']}
              >
                <BookmarkBorderRoundedIcon color="primary" />
              </div>
            </CustomTooltip>

            {/* Share Button */}
            <CustomTooltip title="Share">
              <div
                onClick={(e) => handleShare()}
                className={styles['action-btn']}
              >
                <ShareIcon />
              </div>
            </CustomTooltip>

            {/* More Options Button */}
            <div
              className={styles['action-btn-dropdown-wrapper']}
              ref={Dropdownref}
            >
              <CustomTooltip title="Click to view options">
                <div
                  onClick={(e) => handleDropdown()}
                  className={styles['action-btn']}
                >
                  <MoreHorizRoundedIcon color="primary" />
                </div>
              </CustomTooltip>
              {listingLayoutMode === 'edit'
                ? open && (
                    <Dropdown
                      userType={'edit'}
                      handleClose={handleDropdown}
                      showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                    />
                  )
                : open && (
                    <Dropdown
                      userType={'anonymous'}
                      handleClose={handleDropdown}
                      showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                    />
                  )}
            </div>
          </div>
        </div>
      </header>
      <div className={styles['actions-container-mobile']}>
        {listingLayoutMode === 'edit' && (
          <div className={styles['publish-btn-container']}>
            <FilledButton
              className={
                data.is_published ? styles.unpublishBtn : styles.publishBtn
              }
              onClick={handlePublish}
            >
              {data.is_published ? 'Unpublish' : 'Publish'}
            </FilledButton>
          </div>
        )}
        {/* Action Buttons */}
        <div className={styles['action-btn-wrapper']}>
          {/* Send Email Button  */}
          <CustomTooltip title="Repost">
            <div
              onClick={(e) => handleRepost()}
              className={styles['action-btn']}
            >
              <RepostIcon />
            </div>
          </CustomTooltip>

          {/* Bookmark Button */}
          <CustomTooltip title="Bookmark">
            <div
              onClick={showFeatureUnderDevelopment}
              className={styles['action-btn']}
            >
              <BookmarkBorderRoundedIcon color="primary" />
            </div>
          </CustomTooltip>

          {/* Share Button */}
          <CustomTooltip title="Share">
            <div
              onClick={(e) => handleShare()}
              className={styles['action-btn']}
            >
              <ShareIcon />
            </div>
          </CustomTooltip>

          {/* More Options Button */}
          <div className={styles['action-btn-dropdown-wrapper']}>
            <CustomTooltip title="Click to view options">
              <div
                onClick={(e) => handleDropdown()}
                className={styles['action-btn']}
              >
                <MoreHorizRoundedIcon color="primary" />
              </div>
            </CustomTooltip>
            {listingLayoutMode === 'edit'
              ? open && (
                  <Dropdown
                    showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                    userType={'edit'}
                    handleClose={handleDropdown}
                  />
                )
              : open && (
                  <Dropdown
                    userType={'anonymous'}
                    handleClose={handleDropdown}
                    showFeatureUnderDevelopment={showFeatureUnderDevelopment}
                  />
                )}
          </div>
          {button}
        </div>
      </div>
      {
        <CustomSnackbar
          message={snackbar.message}
          triggerOpen={snackbar.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default ListingHeader
