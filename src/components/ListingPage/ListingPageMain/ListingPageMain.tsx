import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import Tooltip from '@/components/Tooltip/ToolTip'
import styles from './styles.module.css'
import AdminSvg from '@/assets/svg/adminSvg.svg'
import ListingPageLayout from '../../../layouts/ListingPageLayout'
import {
  GetListingEvents,
  getListingPages,
  getListingTags,
} from '@/services/listing.service'
import { getAllUserDetail } from '@/services/user.service'
import { dateFormat, pageType } from '@/utils'
import {
  updateContactOpenStates,
  updateHobbyOpenState,
  updateListingTypeModalMode,
  updateLocationOpenStates,
  updateSocialMediaOpenStates,
  updateSaleOpenStates,
  updateRelatedListingsOpenStates,
  updateTagsOpenStates,
  updateWorkingHoursOpenStates,
  updateRelatedListingsOpenStates2,
  updateTotalEvents,
} from '@/redux/slices/site'
import WhatsappIcon from '@/assets/svg/whatsapp.svg'
import { listingTypes } from '@/constants/constant'
import Link from 'next/link'
import DirectionIcon from '@/assets/svg/direction.svg'
import DefaultPageImage from '@/assets/svg/default-images/default-people-listing-icon.svg'
import peopleSvg from '@/assets/svg/People.svg'
import placeSvg from '@/assets/svg/Place.svg'
import programSvg from '@/assets/svg/Program.svg'

import dynamic from 'next/dynamic'
import MapComponent from '@/components/Gmap'
import { RootState } from '@/redux/store'
import { SetLinkviaAuth } from '@/redux/slices/user'
import { useMediaQuery } from '@mui/material'

interface Props {
  data: ListingPageData['pageData']
  children: any
  hobbyError?: boolean
  pageTypeErr?: boolean
  AboutErr?: boolean
  ContactInfoErr?: boolean
  LocationErr?: boolean
  PageAdmin?: any
  full_name?: string
  profile_url?: string
  activeTab?: any
  expandAll?: boolean
}

type SocialMediaOption =
  | 'Facebook'
  | 'Twitter'
  | 'Instagram'
  | 'Youtube'
  | 'SoundCloud'
  | 'Pinterest'
  | 'Medium'
  | 'Telegram'
  | 'TripAdvisor'
  | 'Ultimate Guitar'
  | 'Strava'
  | 'DeviantArts'
  | 'Behance'
  | 'GoodReads'
  | 'Smule'
  | 'Chess.com'
  | 'BGG'
  | 'Others'

const ListingPageMain: React.FC<Props> = ({
  data,
  children,
  hobbyError,

  pageTypeErr,
  AboutErr,
  ContactInfoErr,
  LocationErr,
  activeTab,
  expandAll,
}) => {
  const dispatch = useDispatch()
  const [tags, setTags] = useState([])
  const {
    listingLayoutMode,
    hobbyStates,
    contactStates,
    socialMediaStates,
    saleStates,
    locationStates,
    relatedListingsStates,
    relatedListingsStates2,
    tagsStates,
    workingHoursStates,
  } = useSelector((state: RootState) => state.site)
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )

  console.log('page', data)
  const [showSale, setShowSale] = useState(true)
  const [selectedTags, setSelectedTags] = useState([])
  const [listingPagesLeft, setListingPagesLeft] = useState([])
  const [listingPagesRight, setListingPagesRight] = useState([])
  const [relation, setRelation] = useState('')
  const [relationRight, setRelationRight] = useState('')
  const [PageAdmin, setPageAdmin] = useState(null)
  const lat = parseFloat(data._address?.latitude)
  const lng = parseFloat(data._address?.longitude)

  const [showHobbies, setShowHobbies] = useState(true)
  const [showTags, setShowTags] = useState(false)
  const [showRelatedListing1, setShowRelatedListing1] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [showWorkingHours, setShowWorkingHours] = useState(false)
  const [showRelatedListing2, setShowRelatedListing2] = useState(false)
  const [showSocialMedia, setShowSocialMedia] = useState(false)
  const [showAside, setShowAside] = useState(true)
  const [isRelatedLoading, SetisRelatedLoading] = useState(true)

  function renderSocialLink(url: any, iconSrc: any, altText: any) {
    if (!url) return null
    return (
      <Tooltip title={altText}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={iconSrc} alt={altText} />
        </a>
      </Tooltip>
    )
  }

  function extractDomainName(url: any) {
    if (!url) return 'Others'

    let domain
    if (url.indexOf('://') > -1) {
      domain = url.split('/')[2]
    } else {
      domain = url.split('/')[0]
    }
    domain = domain.split(':')[0]
    domain = domain.split('?')[0]

    let subDomains = domain.split('.')
    if (subDomains.length > 2) {
      domain = subDomains[subDomains.length - 2]
    } else {
      domain = subDomains[0]
    }
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  }
  const FetchAdmin = async () => {
    let adminId = data.admin
    const admin: any = await getAllUserDetail(`_id=${adminId}`)
    setPageAdmin(admin.res?.data.data.users[0])
  }

  useEffect(() => {
    if (saleStates && typeof saleStates[data?._id] === 'boolean') {
      setShowHobbies(saleStates[data?._id])
    } else if (data._id) {
      dispatch(updateSaleOpenStates({ [data._id]: showSale }))
    }
  }, [data._id, saleStates])

  console.warn({ showHobbies })

  useEffect(() => {
    if (hobbyStates && typeof hobbyStates[data?._id] === 'boolean') {
      setShowHobbies(hobbyStates[data?._id])
    } else if (data._id) {
      dispatch(updateHobbyOpenState({ [data._id]: showHobbies }))
    }
  }, [data._id, hobbyStates])

  useEffect(() => {
    if (contactStates && typeof contactStates[data?._id] === 'boolean') {
      setShowContact(contactStates[data?._id])
    } else if (data._id) {
      dispatch(updateContactOpenStates({ [data._id]: showContact }))
    }
  }, [data._id, contactStates])

  useEffect(() => {
    if (locationStates && typeof locationStates[data?._id] === 'boolean') {
      setShowLocation(locationStates[data?._id])
    } else if (data._id) {
      dispatch(updateLocationOpenStates({ [data._id]: showLocation }))
    }
  }, [data._id, locationStates])

  useEffect(() => {
    if (
      socialMediaStates &&
      typeof socialMediaStates[data?._id] === 'boolean'
    ) {
      setShowSocialMedia(socialMediaStates[data?._id])
    } else if (data._id) {
      dispatch(updateSocialMediaOpenStates({ [data._id]: showSocialMedia }))
    }
  }, [data._id, socialMediaStates])

  useEffect(() => {
    if (
      relatedListingsStates &&
      typeof relatedListingsStates[data?._id] === 'boolean'
    ) {
      setShowRelatedListing1(relatedListingsStates[data?._id])
    } else if (data._id) {
      dispatch(
        updateRelatedListingsOpenStates({ [data._id]: showRelatedListing1 }),
      )
    }
  }, [data._id, relatedListingsStates])

  useEffect(() => {
    if (
      relatedListingsStates2 &&
      typeof relatedListingsStates2[data?._id] === 'boolean'
    ) {
      setShowRelatedListing2(relatedListingsStates2[data?._id])
    } else if (data._id) {
      dispatch(
        updateRelatedListingsOpenStates2({ [data._id]: showRelatedListing2 }),
      )
    }
  }, [data._id, relatedListingsStates2])

  useEffect(() => {
    if (tagsStates && typeof tagsStates[data?._id] === 'boolean') {
      setShowTags(tagsStates[data?._id])
    } else if (data._id) {
      dispatch(updateTagsOpenStates({ [data._id]: showTags }))
    }
  }, [data._id, tagsStates])

  useEffect(() => {
    if (
      workingHoursStates &&
      typeof workingHoursStates[data?._id] === 'boolean'
    ) {
      setShowWorkingHours(workingHoursStates[data?._id])
    } else if (data._id) {
      dispatch(updateWorkingHoursOpenStates({ [data._id]: showWorkingHours }))
    }
  }, [data._id, workingHoursStates])

  useEffect(() => {
    getListingTags()
      .then((res: any) => {
        const temp = res.res.data.data.tags

        let selected: any = []
        temp.forEach((item: any) => {
          if (data._tags.includes(item._id)) {
            selected.push(item)
          }
        })
        setSelectedTags(selected)
        setTags(temp)
      })
      .catch((err: any) => {
        console.log(err)
      })
    FetchAdmin()
  }, [data._tags])
  console.log('admin', PageAdmin)

  useEffect(() => {
    setListingPagesLeft([])
    if (data.related_listings_left.relation) {
      setRelation(data.related_listings_left.relation)
    }
    if (data.related_listings_right.relation) {
      setRelationRight(data.related_listings_right.relation)
    }
    data.related_listings_left?.listings.map((listing: any) => {
      getListingPages(`_id=${listing}`)
        .then((res: any) => {
          const listingData = res.res.data.data.listings[0]
          setListingPagesLeft((prevArray: any) => {
            const updated: any = [...prevArray, listingData]
            const ids = prevArray.map((item: any) => item?._id)
            if (!ids.includes(listingData?._id)) {
              return updated
            } else {
              return prevArray
            }
          })
        })
        .catch((err: any) => {
          console.log(err)
        })
    })

    data.related_listings_right?.listings.map((listing: any) => {
      getListingPages(`_id=${listing}`)
        .then((res: any) => {
          const listingData = res.res.data.data.listings[0]
          setListingPagesRight((prevArray: any) => {
            const updated: any = [...prevArray, listingData]
            const ids = prevArray.map((item: any) => item._id)
            if (!ids.includes(listingData._id)) {
              return updated
            } else {
              return prevArray
            }
          })
        })
        .catch((err: any) => {
          console.log(err)
        })
    })
    SetisRelatedLoading(false)
  }, [data?.related_listings_left?.listings])

  useEffect(() => {
    if (expandAll !== undefined) {
      setShowAside(expandAll)
    }
  }, [expandAll])

  console.log('listingPagesRight', listingPagesRight)
  const openGoogleMaps = () => {
    let addressText = ''
    if (data?._address.street) {
      addressText += `${data?._address.street}, `
    }
    if (data?._address.society) {
      addressText += `${data?._address.society}, `
    }
    if (data?._address.city) {
      addressText += `${data?._address.city}, `
    }
    if (data?._address.state) {
      addressText += `${data?._address.state}, `
    }
    if (data?._address.country) {
      addressText += `${data?._address.country}, `
    }
    console.log('addressText', addressText)
    const mapsUrl = `https://www.google.com/maps/dir//${encodeURIComponent(
      addressText,
    )}`

    window.open(mapsUrl, '_blank')
  }

  const openModalHobbiesModal = () => {
    if (window.innerWidth > 1100) {
      setShowHobbies(true)
    }
  }
  const updateEventBadge = async () => {
    const response = await GetListingEvents(data?._id)

    if (response.res) {
      dispatch(updateTotalEvents(response.res.data?.event_count ?? 0))
      console.warn('event_COuntssssssssss', response.res.data?.event_count)
    }
  }
  useEffect(() => {
    updateEventBadge()
  }, [])
  const socialMediaIcons: Record<SocialMediaOption, any> = {
    Facebook:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/facebook.svg',
    Twitter:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/twitter.svg',
    Instagram:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/instagram.svg',
    Youtube:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/youtube.svg',
    SoundCloud:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/soundcloud.svg',
    Pinterest:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/pinterest.svg',
    Medium:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/MediumWeb.svg',
    Telegram:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/Telegram.svg',
    TripAdvisor:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/tripadvisor.svg',
    'Ultimate Guitar':
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/Ultimate-Guitar.svg',
    Strava:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/strava.svg',
    DeviantArts:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/DeviantArt.svg',
    Behance:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/behance.svg',
    GoodReads:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/GoodReads.svg',
    Smule:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/smule.svg',
    'Chess.com':
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/chess.com.svg',
    BGG: 'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/bgg.svg',
    Others:
      'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/other.svg',
  }

  // useEffect(() => {
  //   openModalHobbiesModal()
  //   window.addEventListener('resize', openModalHobbiesModal)
  //   return window.removeEventListener('resize', openModalHobbiesModal)
  // }, [])

  // console.log('data', data)

  const openAuthModal = () =>
    dispatch(openModal({ type: 'auth', closable: true }))

  const isMobile = useMediaQuery('(max-width:1100px)')

  const laptopIcon = (
    <svg
      width="23"
      height="24"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_15761_244939"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="23"
        height="24"
      >
        <path
          d="M22.9997 0.246094H0.142578V23.1032H22.9997V0.246094Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_15761_244939)">
        <path
          d="M19.5999 6.08936H3.55078V18.751H19.5999V6.08936Z"
          fill="#8064A2"
        />
        <path
          d="M19.1902 18.4961C20.2378 18.4961 21.0949 17.5961 21.0949 16.4961V6.4961C21.0949 5.39609 20.2378 4.49609 19.1902 4.49609H3.9521C2.90449 4.49609 2.04734 5.39609 2.04734 6.4961V16.4961C2.04734 17.5961 2.90449 18.4961 3.9521 18.4961H1.09496C0.57115 18.4961 0.142578 18.9461 0.142578 19.4961C0.142578 20.0461 0.57115 20.4961 1.09496 20.4961H22.0474C22.5711 20.4961 22.9997 20.0461 22.9997 19.4961C22.9997 18.9461 22.5711 18.4961 22.0474 18.4961H19.1902ZM4.90449 6.4961H18.2378C18.7617 6.4961 19.1902 6.9461 19.1902 7.4961V15.496C19.1902 16.0461 18.7617 16.4961 18.2378 16.4961H4.90449C4.38067 16.4961 3.9521 16.0461 3.9521 15.496V7.4961C3.9521 6.9461 4.38067 6.4961 4.90449 6.4961Z"
          fill="#8064A2"
        />
        <g clip-path="url(#clip0_15761_244939)">
          <path
            d="M13.1661 10.0496V9.18837C13.1661 8.70629 13.7961 8.46254 14.1636 8.80379L16.8411 11.29C17.0686 11.5013 17.0686 11.8425 16.8411 12.0538L14.1636 14.54C13.7961 14.8813 13.1661 14.643 13.1661 14.1609V13.2455C10.2494 13.2455 8.20776 14.1121 6.74943 16.008C7.33276 13.2996 9.08276 10.5913 13.1661 10.0496Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_15761_244939">
          <rect
            width="14"
            height="13"
            rx="3"
            transform="matrix(-1 0 0 1 19 5.1748)"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const redCartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M22.5011 7.63479V7.76479L21.0411 13.1648C20.8685 13.8057 20.4883 14.3713 19.9599 14.773C19.4315 15.1748 18.7848 15.3899 18.1211 15.3848H10.4711C9.72006 15.3878 8.99522 15.1091 8.43977 14.6036C7.88431 14.0982 7.53865 13.4028 7.47106 12.6548L6.82106 5.29479C6.79853 5.04547 6.68331 4.81366 6.49816 4.64518C6.31301 4.47669 6.0714 4.38377 5.82106 4.38479H3.65106C3.38585 4.38479 3.13149 4.27943 2.94396 4.0919C2.75642 3.90436 2.65106 3.65001 2.65106 3.38479C2.65106 3.11957 2.75642 2.86522 2.94396 2.67768C3.13149 2.49015 3.38585 2.38479 3.65106 2.38479H5.82106C6.57207 2.38174 7.2969 2.66049 7.85236 3.16595C8.40781 3.67141 8.75348 4.36682 8.82106 5.11479V5.38479H20.5111C20.7961 5.38255 21.0784 5.44128 21.3389 5.55705C21.5994 5.67281 21.8322 5.84293 22.0216 6.056C22.211 6.26907 22.3526 6.52017 22.437 6.79246C22.5215 7.06475 22.5467 7.35195 22.5111 7.63479H22.5011Z"
        fill="#C0504D"
      />
      <path
        d="M9.65106 22.3848C11.0318 22.3848 12.1511 21.2655 12.1511 19.8848C12.1511 18.5041 11.0318 17.3848 9.65106 17.3848C8.27035 17.3848 7.15106 18.5041 7.15106 19.8848C7.15106 21.2655 8.27035 22.3848 9.65106 22.3848Z"
        fill="#C0504D"
      />
      <path
        d="M17.6511 22.3848C19.0318 22.3848 20.1511 21.2655 20.1511 19.8848C20.1511 18.5041 19.0318 17.3848 17.6511 17.3848C16.2704 17.3848 15.1511 18.5041 15.1511 19.8848C15.1511 21.2655 16.2704 22.3848 17.6511 22.3848Z"
        fill="#C0504D"
      />
    </svg>
  )

  return (
    <>
      <PageGridLayout
        column={activeTab === 'home' || activeTab === 'posts' ? 3 : 2}
      >
        {isMobile && activeTab !== 'home' ? (
          ''
        ) : (
          <aside
            className={`custom-scrollbar ${styles['page-left-aside']} ${
              showAside ? styles['display-initial'] : styles['display-none']
            }`}
          >
            <div className={styles['display-desktop']}>
              <PageContentBox
                className={`${pageTypeErr ? styles.errorBorder : ''} ${
                  styles['page-type-container']
                }`}
                showEditButton={listingLayoutMode === 'edit'}
                onEditBtnClick={() => {
                  dispatch(
                    openModal({ type: 'listing-type-edit', closable: true }),
                  )
                  dispatch(updateListingTypeModalMode({ mode: 'edit' }))
                }}
              >
                <div className={styles['page-types']}>
                  {data.page_type.map((type: any, idx: any) => {
                    return (
                      <div className={styles['listing-page-type']} key={idx}>
                        <Image
                          alt="page type icon"
                          width={24}
                          height={24}
                          src={
                            data.type === 1
                              ? peopleSvg
                              : data.type === 2
                              ? placeSvg
                              : data.type === 3
                              ? programSvg
                              : peopleSvg
                          }
                        />
                        <p
                          className={
                            data.type === 1
                              ? styles['people-color']
                              : data.type === 2
                              ? styles['place-color']
                              : data.type === 3
                              ? styles['program-color']
                              : styles['abv-color']
                          }
                        >
                          {type}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </PageContentBox>
            </div>

            {/* <PageContentBox
              className={hobbyError ? styles.error : ''}
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({ type: 'listing-hobby-edit', closable: true }),
                )
              }
              initialShowDropdown
              setDisplayData={(arg0: boolean) => {
                dispatch(updateSaleOpenStates({ [data._id]: !showSale }))
              }}
              expandData={showSale}
            >
              <h4
                className={
                  styles['heading'] + ` ${hobbyError && styles['error-label']}`
                }
              >
                {redCartIcon}
                <p>Item Sale</p>
              </h4>
              <div className={`${styles['display-desktop']}`}></div>
            </PageContentBox> */}
            {/* Listing Hobbies */}
            <PageContentBox
              className={hobbyError ? styles.error : ''}
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({ type: 'listing-hobby-edit', closable: true }),
                )
              }
              initialShowDropdown
              setDisplayData={(arg0: boolean) => {
                dispatch(updateHobbyOpenState({ [data._id]: !showHobbies }))
              }}
              expandData={showHobbies}
            >
              <h4
                className={
                  styles['heading'] + ` ${hobbyError && styles['error-label']}`
                }
              >
                Interests
              </h4>
              {hobbyError && showHobbies && (
                <p
                  className={
                    styles['error-text'] + ` ${styles['absolute-text']}`
                  }
                >
                  At least one hobby is mandatory
                </p>
              )}
              <div
                className={`${styles['display-desktop']}${
                  hobbyStates?.[data?._id] ? ' ' + styles['display-mobile'] : ''
                }`}
              >
                {
                  <ul className={styles['hobby-list']}>
                    {data?._hobbies?.map((item: any) => {
                      if (typeof item === 'string') return
                      return (
                        <Link
                          href={`/hobby/${
                            item?.genre?.slug ?? item?.hobby?.slug
                          }`}
                          className={styles.textGray}
                          key={item._id}
                        >
                          {item?.hobby?.display}
                          {item?.genre && ` - ${item?.genre?.display} `}
                        </Link>
                      )
                    })}
                  </ul>
                }
              </div>
            </PageContentBox>
            {/* Tags */}
            {(data?._tags?.length > 0 && listingLayoutMode !== 'edit') ||
            listingLayoutMode === 'edit' ? (
              <PageContentBox
                showEditButton={listingLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'listing-tags-edit', closable: true }),
                  )
                }
                setDisplayData={(arg0: boolean) => {
                  dispatch(updateTagsOpenStates({ [data._id]: !showTags }))
                }}
                expandData={showTags}
              >
                <h4 className={styles['heading']}>Tags</h4>
                <ul
                  className={`${styles['hobby-list']} ${styles['tags-list']} ${
                    styles['display-desktop']
                  }${showTags ? ' ' + styles['display-mobile'] : ''}`}
                >
                  {selectedTags?.map((item: any) => {
                    if (typeof item === 'string') return null
                    return (
                      <li key={item._id} className={styles.textGray}>
                        {item?.name}
                      </li>
                    )
                  })}
                </ul>
              </PageContentBox>
            ) : (
              <></>
            )}
            {/* Related Listing */}
            {listingLayoutMode !== 'edit' &&
            (!listingPagesLeft ||
              data?.related_listings_left.listings?.length === 0) ? null : (
              <PageContentBox
                showEditButton={listingLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({
                      type: 'related-listing-left-edit',
                      closable: true,
                    }),
                  )
                }
                setDisplayData={(arg0: boolean) => {
                  dispatch(
                    updateRelatedListingsOpenStates({
                      [data._id]: !showRelatedListing1,
                    }),
                  )
                }}
                expandData={showRelatedListing1}
              >
                <h4 className={styles['heading']}>
                  {' '}
                  {data?.related_listings_left.relation
                    ? data?.related_listings_left.relation
                    : 'Related Listing'}{' '}
                </h4>
                <div
                  className={`${styles['display-desktop']}${
                    relatedListingsStates?.[data?._id]
                      ? ' ' + styles['display-mobile']
                      : ''
                  }`}
                >
                  {!listingPagesLeft || listingPagesLeft.length === 0 ? null : (
                    <ul className={styles['related-list']}>
                      {listingPagesLeft?.map((item: any) => {
                        if (typeof item === 'string') return null
                        return (
                          <li key={item?._id}>
                            <Link
                              className={styles.textGray}
                              href={`/${pageType(item?.type)}/${
                                item?.page_url
                              }`}
                            >
                              <div className={styles['related']}>
                                {item?.profile_image ? (
                                  <img
                                    src={item?.profile_image}
                                    alt={item?.title}
                                    width="32"
                                    height="32"
                                  />
                                ) : (
                                  <Image
                                    src={DefaultPageImage}
                                    alt={item?.title}
                                    width="32"
                                    height="32"
                                  />
                                )}
                                <span className={styles['item-title']}>
                                  {item?.title}
                                </span>
                              </div>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </PageContentBox>
            )}

            <div className={styles['display-mobile-initial']}>
              {/* User Contact Details */}
              <PageContentBox
                className={ContactInfoErr ? styles.errorBorder : ''}
                showEditButton={listingLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({
                      type: 'listing-contact-edit',
                      closable: true,
                    }),
                  )
                }
                setDisplayData={(arg0: boolean) => {
                  dispatch(
                    updateContactOpenStates({ [data._id]: !showContact }),
                  )
                }}
                expandData={showContact}
              >
                <h4 className={styles['heading']}>
                  {data?.type === 4 ? 'Contact Seller' : 'Contact Information'}
                </h4>
                <ul
                  className={`${styles['contact-wrapper']} ${
                    styles['display-desktop']
                  }${
                    contactStates?.[data?._id]
                      ? ' ' + styles['display-mobile']
                      : ''
                  }`}
                >
                  {!isLoggedIn && (
                    <li
                      onClick={openAuthModal}
                      className={styles['signInText']}
                    >
                      Sign in to view full contact details
                    </li>
                  )}
                  {data?.type === 4 ? (
                    <>
                      {/* Page Admin */}
                      {(PageAdmin as any)?.full_name && isLoggedIn && (
                        <Link
                          href={`/profile/${(PageAdmin as any)?.profile_url}`}
                        >
                          <Image
                            src={AdminSvg}
                            alt="whatsapp"
                            width={24}
                            height={24}
                          />
                          <span className={styles.textdefault}>
                            {(PageAdmin as any)?.full_name}
                          </span>
                        </Link>
                      )}
                      {(PageAdmin as any)?.full_name && !isLoggedIn && (
                        <a
                          onClick={(e) => {
                            dispatch(
                              SetLinkviaAuth(
                                `/profile/${(PageAdmin as any)?.profile_url}`,
                              ),
                            )
                            dispatch(
                              openModal({ type: 'auth', closable: true }),
                            )
                          }}
                        >
                          <Image
                            src={AdminSvg}
                            alt="whatsapp"
                            width={24}
                            height={24}
                          />
                          <span className={styles.textdefault}>
                            {(PageAdmin as any)?.full_name}
                          </span>
                        </a>
                      )}
                      {/* Phone */}
                      {data?.parent_page?.name && isLoggedIn && (
                        <Link href={`tel:${data?.name}`}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_230_34018)">
                              <path
                                d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                                fill="#8064A2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_230_34018">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          <span className={styles.textdefault}>
                            {data?.parent_page?.name}{' '}
                          </span>
                        </Link>
                      )}
                      {data?.parent_page?.phone?.number && isLoggedIn && (
                        <Link href={`tel:${data?.parent_page?.phone?.number}`}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_230_34018)">
                              <path
                                d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                                fill="#8064A2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_230_34018">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          <span className={styles.textdefault}>
                            {`${data?.parent_page?.phone?.prefix} ${data?.parent_page?.phone.number}`}{' '}
                          </span>
                        </Link>
                      )}

                      {/* WhatsApp Number */}
                      {data?.parent_page?.whatsapp_number?.number &&
                        isLoggedIn && (
                          <Link
                            href={`https://wa.me/${data?.whatsapp_number.number}`}
                          >
                            <Image
                              src={WhatsappIcon}
                              alt="whatsapp11"
                              width={24}
                              height={24}
                            />
                            <span className={styles.textdefault}>
                              {`${data?.parent_page?.whatsapp_number.prefix}+' '+${data?.parent_page?.whatsapp_number.number}`}{' '}
                            </span>
                          </Link>
                        )}

                      {/* Email */}
                      {data?.parent_page?.public_email && isLoggedIn && (
                        <Link
                          href={`mailto:${data?.parent_page?.public_email}`}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_230_34011)">
                              <path
                                d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                                fill="#8064A2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_230_34011">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                          <span className={styles.textdefault}>
                            {data?.parent_page?.public_email}{' '}
                          </span>
                        </Link>
                      )}

                      {/* Website */}
                      {data?.parent_page?.website && (
                        <Link href={data?.parent_page?.website}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="12" fill="#8064A2" />
                            <path
                              d="M17.3333 15.9974C18.0667 15.9974 18.6667 15.3974 18.6667 14.6641V7.9974C18.6667 7.26406 18.0667 6.66406 17.3333 6.66406H6.66667C5.93333 6.66406 5.33333 7.26406 5.33333 7.9974V14.6641C5.33333 15.3974 5.93333 15.9974 6.66667 15.9974H4.66667C4.3 15.9974 4 16.2974 4 16.6641C4 17.0307 4.3 17.3307 4.66667 17.3307H19.3333C19.7 17.3307 20 17.0307 20 16.6641C20 16.2974 19.7 15.9974 19.3333 15.9974H17.3333ZM7.33333 7.9974H16.6667C17.0333 7.9974 17.3333 8.2974 17.3333 8.66406V13.9974C17.3333 14.3641 17.0333 14.6641 16.6667 14.6641H7.33333C6.96667 14.6641 6.66667 14.3641 6.66667 13.9974V8.66406C6.66667 8.2974 6.96667 7.9974 7.33333 7.9974Z"
                              fill="white"
                            />
                          </svg>

                          <span className={styles.textdefault}>
                            {data?.parent_page?.website}{' '}
                          </span>
                        </Link>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {/* Page Admin */}
                  {(PageAdmin as any)?.full_name && isLoggedIn && (
                    <Link href={`/profile/${(PageAdmin as any)?.profile_url}`}>
                      <Image
                        src={AdminSvg}
                        alt="whatsapp"
                        width={24}
                        height={24}
                      />
                      <span className={styles.textdefault}>
                        {(PageAdmin as any)?.full_name}
                      </span>
                    </Link>
                  )}
                  {(PageAdmin as any)?.full_name && !isLoggedIn && (
                    <a
                      onClick={(e) => {
                        dispatch(
                          SetLinkviaAuth(
                            `/profile/${(PageAdmin as any)?.profile_url}`,
                          ),
                        )
                        dispatch(openModal({ type: 'auth', closable: true }))
                      }}
                    >
                      <Image
                        src={AdminSvg}
                        alt="whatsapp"
                        width={24}
                        height={24}
                      />
                      <span className={styles.textdefault}>
                        {(PageAdmin as any)?.full_name}
                      </span>
                    </a>
                  )}
                  {/* Phone */}
                  {data?.name && isLoggedIn && (
                    <Link href={`tel:${data?.name}`}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_230_34018)">
                          <path
                            d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_230_34018">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span className={styles.textdefault}>{data?.name} </span>
                    </Link>
                  )}
                  {data?.phone?.number && isLoggedIn && (
                    <Link href={`tel:${data?.phone?.number}`}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_230_34018)">
                          <path
                            d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_230_34018">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span className={styles.textdefault}>
                        {`${data.phone?.prefix} ${data?.phone.number}`}{' '}
                      </span>
                    </Link>
                  )}

                  {/* WhatsApp Number */}
                  {data?.whatsapp_number?.number && isLoggedIn && (
                    <Link
                      href={`https://wa.me/${data?.whatsapp_number.number}`}
                    >
                      <Image
                        src={WhatsappIcon}
                        alt="whatsapp11"
                        width={24}
                        height={24}
                      />
                      <span className={styles.textdefault}>
                        {`${data?.whatsapp_number.prefix}+' '+${data?.whatsapp_number.number}`}{' '}
                      </span>
                    </Link>
                  )}

                  {/* Email */}
                  {data?.public_email && isLoggedIn && (
                    <Link href={`mailto:${data?.public_email}`}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_230_34011)">
                          <path
                            d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_230_34011">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span className={styles.textdefault}>
                        {data?.public_email}{' '}
                      </span>
                    </Link>
                  )}

                  {/* Website */}
                  {data?.website && (
                    <Link href={data.website}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="12" fill="#8064A2" />
                        <path
                          d="M17.3333 15.9974C18.0667 15.9974 18.6667 15.3974 18.6667 14.6641V7.9974C18.6667 7.26406 18.0667 6.66406 17.3333 6.66406H6.66667C5.93333 6.66406 5.33333 7.26406 5.33333 7.9974V14.6641C5.33333 15.3974 5.93333 15.9974 6.66667 15.9974H4.66667C4.3 15.9974 4 16.2974 4 16.6641C4 17.0307 4.3 17.3307 4.66667 17.3307H19.3333C19.7 17.3307 20 17.0307 20 16.6641C20 16.2974 19.7 15.9974 19.3333 15.9974H17.3333ZM7.33333 7.9974H16.6667C17.0333 7.9974 17.3333 8.2974 17.3333 8.66406V13.9974C17.3333 14.3641 17.0333 14.6641 16.6667 14.6641H7.33333C6.96667 14.6641 6.66667 14.3641 6.66667 13.9974V8.66406C6.66667 8.2974 6.96667 7.9974 7.33333 7.9974Z"
                          fill="white"
                        />
                      </svg>

                      <span className={styles.textdefault}>
                        {data?.website}{' '}
                      </span>
                    </Link>
                  )}
                </ul>
              </PageContentBox>

              {/* Seller Details */}
              {/* <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({ type: 'listing-contact-edit', closable: true }),
                )
              }
            >
              <h4 className={styles['heading']}>Seller Information</h4>
              <ul className={styles['seller-info-wrapper']}>
     
                <li>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_173_56271)">
                      <rect width="24" height="24" fill="#8064A2" />
                      <path
                        d="M10 12C12.21 12 14 10.21 14 8C14 5.79 12.21 4 10 4C7.79 4 6 5.79 6 8C6 10.21 7.79 12 10 12ZM10 6C11.1 6 12 6.9 12 8C12 9.1 11.1 10 10 10C8.9 10 8 9.1 8 8C8 6.9 8.9 6 10 6Z"
                        fill="white"
                      />
                      <path
                        d="M4 18.003C4.22 17.283 7.31 16.003 10 16.003C10 15.303 10.13 14.633 10.35 14.013C7.62 13.913 2 15.273 2 18.003V20.003H11.54C11.02 19.423 10.61 18.753 10.35 18.003H4Z"
                        fill="white"
                      />
                      <path
                        d="M19.43 18.02C19.79 17.43 20 16.74 20 16C20 13.79 18.21 12 16 12C13.79 12 12 13.79 12 16C12 18.21 13.79 20 16 20C16.74 20 17.43 19.78 18.02 19.43C18.95 20.36 19.64 21.05 20.59 22L22 20.59C20.5 19.09 21.21 19.79 19.43 18.02ZM16 18C14.9 18 14 17.1 14 16C14 14.9 14.9 14 16 14C17.1 14 18 14.9 18 16C18 17.1 17.1 18 16 18Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_173_56271">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p>KYC</p>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="15"
                      height="15"
                      rx="1.5"
                      fill="white"
                      stroke="#8064A2"
                    />
                  </svg>
                </li>

          
                <li>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" fill="#8064A2" />
                    <path
                      d="M12.37 2.15375L21.37 5.75373C21.72 5.89373 22 6.31372 22 6.68372V10.0037C22 10.5537 21.55 11.0037 21 11.0037H3C2.45 11.0037 2 10.5537 2 10.0037V6.68372C2 6.31372 2.28 5.89373 2.63 5.75373L11.63 2.15375C11.83 2.07375 12.17 2.07375 12.37 2.15375Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22 22H2V19C2 18.45 2.45 18 3 18H21C21.55 18 22 18.45 22 19V22Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M20 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1 22H23"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p>Bank</p>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="15"
                      height="15"
                      rx="1.5"
                      fill="white"
                      stroke="#8064A2"
                    />
                  </svg>
                </li>
              </ul>
            </PageContentBox> */}

              {/* User Location Details */}
              <PageContentBox
                className={LocationErr ? styles.error : ''}
                showEditButton={listingLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'listing-address-edit', closable: true }),
                  )
                }
                setDisplayData={(arg0: boolean) => {
                  dispatch(
                    updateLocationOpenStates({ [data._id]: !showLocation }),
                  )
                }}
                expandData={showLocation}
              >
                <div
                  className={`${styles['location-heading']}  ${
                    LocationErr && styles['error-text']
                  }`}
                >
                  <h4 className={`${hobbyError && styles['error-label']}`}>
                    Location
                  </h4>
                  {listingLayoutMode === 'view' && data?._address?.virtual && (
                    <Link
                      href={data?._address?.url ?? '#'}
                      className={styles['join-online']}
                    >
                      {laptopIcon}
                      <p>Join Online</p>
                    </Link>
                  )}
                  {LocationErr && showLocation && (
                    <p
                      className={
                        styles['error-text'] + ` ${styles['absolute-text']}`
                      }
                    >
                      Fill up the mandatory fields
                    </p>
                  )}
                </div>
                {data?._address?.virtual ? (
                  <>
                    {showLocation && (
                      <p className={styles['desc']}>
                        {data?._address?.description}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className={`${styles['display-desktop']}${
                        locationStates?.[data?._id]
                          ? ' ' + styles['display-mobile']
                          : ''
                      }`}
                    >
                      {listingLayoutMode === 'view' && (
                        <div
                          className={styles['direction-container']}
                          onClick={openGoogleMaps}
                        >
                          <Image src={DirectionIcon} alt="direction" />
                          <p> Get Direction </p>
                        </div>
                      )}
                      <ul className={`${styles['location-wrapper']}`}>
                        {/* Address */}
                        {data?._address && (
                          <li>
                            {LocationErr ? null : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_173_56226)">
                                  <path
                                    d="M12 2C7.8 2 4 5.22 4 10.2C4 13.38 6.45 17.12 11.34 21.43C11.72 21.76 12.29 21.76 12.67 21.43C17.55 17.12 20 13.38 20 10.2C20 5.22 16.2 2 12 2ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
                                    fill="#8064A2"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_173_56226">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            )}

                            <span className={styles.textdefault}>
                              {data?.wp_data?.location_str}
                              {/* {`${
                        data?._address.street ? data._address.street + ',' : ''
                      }
                      
                      ${
                        data?._address.society ? data._address.society + ',' : ''
                      } 
                      ${
                        data?._address.locality
                        ? data._address.locality + ','
                        : ''
                      } 
                      ${data?._address.city ? data._address.city + ',' : ''} 
                      ${data?._address.state ? data._address.state + ',' : ''} 
                      ${data?._address.country ? data._address.country : ''}
                      ${
                        data?._address?.pin_code
                        ? ' - ' + data?._address?.pin_code
                        : ''
                      }`} */}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                    {isNaN(lat) || isNaN(lng) ? null : (
                      <div
                        className={`${styles['location-map']} ${
                          styles['display-desktop']
                        }${showLocation ? ' ' + styles['display-mobile'] : ''}`}
                      >
                        <MapComponent lat={lat} lng={lng} />
                      </div>
                    )}
                  </>
                )}
              </PageContentBox>
              {data?.type === listingTypes.PLACE && (
                <PageContentBox
                  showEditButton={listingLayoutMode === 'edit'}
                  onEditBtnClick={() =>
                    dispatch(
                      openModal({
                        type: 'listing-working-hours-edit',
                        closable: true,
                      }),
                    )
                  }
                  setDisplayData={(arg0: boolean) => {
                    dispatch(
                      updateWorkingHoursOpenStates({
                        [data._id]: !showWorkingHours,
                      }),
                    )
                  }}
                  expandData={showWorkingHours}
                >
                  <h4 className={styles['heading']}>Working Hours</h4>
                  <div
                    className={`${styles['working-hours-wrapper']} ${
                      styles['display-desktop']
                    }${
                      workingHoursStates?.[data?._id]
                        ? ' ' + styles['display-mobile']
                        : ''
                    }`}
                  >
                    {/* Working Hours  */}
                    {data?.work_hours && (
                      <ul>
                        {data?.work_hours.map((item: any, idx: number) => {
                          return (
                            <li key={idx} className={styles.workingListItem}>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_173_56222)">
                                  <path
                                    d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM15.55 15.8L11.47 13.29C11.17 13.11 10.99 12.79 10.99 12.44V7.75C11 7.34 11.34 7 11.75 7C12.16 7 12.5 7.34 12.5 7.75V12.2L16.34 14.51C16.7 14.73 16.82 15.2 16.6 15.56C16.38 15.91 15.91 16.02 15.55 15.8Z"
                                    fill="#8064A2"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_173_56222">
                                    <rect width="24" height="24" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                              <p className={styles.workingHour}>
                                {item.from_day} - {item.to_day},{' '}
                                {item.from_time} - {item.to_time}
                              </p>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </PageContentBox>
              )}

              {/* Related Listing */}
              {listingLayoutMode !== 'edit' &&
              (!listingPagesRight ||
                data?.related_listings_right.listings?.length === 0) ? null : (
                <PageContentBox
                  showEditButton={listingLayoutMode === 'edit'}
                  onEditBtnClick={() =>
                    dispatch(
                      openModal({
                        type: 'related-listing-right-edit',
                        closable: true,
                      }),
                    )
                  }
                  setDisplayData={setShowRelatedListing2}
                >
                  <h4 className={styles['heading']}>
                    {relationRight && relationRight.trim() !== ''
                      ? relationRight
                      : 'Related Listing'}
                  </h4>

                  <div
                    className={`${styles['display-desktop']}${
                      showRelatedListing2 ? ' ' + styles['display-mobile'] : ''
                    }`}
                  >
                    {!listingPagesRight || listingPagesRight.length === 0 ? (
                      <span className={styles.textGray}></span>
                    ) : (
                      <ul className={styles['related-list']}>
                        {listingPagesRight?.map((item: any) => {
                          if (typeof item === 'string') return null
                          return (
                            <li key={item._id}>
                              <Link
                                className={styles.textGray}
                                href={`/${pageType(item?.type)}/${
                                  item.page_url
                                }`}
                              >
                                <div className={styles['related']}>
                                  {item.profile_image ? (
                                    <img
                                      src={item.profile_image}
                                      alt={item?.title}
                                      width="32"
                                      height="32"
                                    />
                                  ) : (
                                    <Image
                                      src={DefaultPageImage}
                                      alt={item?.title}
                                      width="32"
                                      height="32"
                                    />
                                  )}
                                  <span className={styles['item-title']}>
                                    {item?.title}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </PageContentBox>
              )}

              {data?.social_media_urls || listingLayoutMode === 'edit' ? (
                <PageContentBox
                  showEditButton={listingLayoutMode === 'edit'}
                  onEditBtnClick={() =>
                    dispatch(
                      openModal({
                        type: 'listing-social-media-edit',
                        closable: true,
                      }),
                    )
                  }
                  setDisplayData={(arg0: boolean) => {
                    dispatch(
                      updateSocialMediaOpenStates({
                        [data._id]: !showSocialMedia,
                      }),
                    )
                  }}
                  expandData={showSocialMedia}
                >
                  <h4 className={styles['heading']}>Social Media</h4>

                  <ul
                    className={`${styles['social-contact-wrapper']} ${
                      styles['display-desktop']
                    }${
                      socialMediaStates?.[data?._id]
                        ? ' ' + styles['display-mobile']
                        : ''
                    }`}
                  >
                    {data?.social_media_urls && (
                      <>
                        {Object.entries(data.social_media_urls).map(
                          ([key, url]) => {
                            let socialMediaName = ''
                            let socialMediaIcon = null

                            switch (true) {
                              case key.startsWith('facebook'):
                                socialMediaName = 'Facebook'
                                socialMediaIcon = socialMediaIcons['Facebook']
                                break
                              case key.startsWith('twitter'):
                                socialMediaName = 'Twitter'
                                socialMediaIcon = socialMediaIcons['Twitter']
                                break
                              case key.startsWith('instagram'):
                                socialMediaName = 'Instagram'
                                socialMediaIcon = socialMediaIcons['Instagram']
                                break
                              case key.startsWith('behance'):
                                socialMediaName = 'Behance'
                                socialMediaIcon = socialMediaIcons['Behance']
                                break
                              case key.startsWith('bgg'):
                                socialMediaName = 'BoardGameGeek'
                                socialMediaIcon = socialMediaIcons['BGG']
                                break
                              case key.startsWith('chess'):
                                socialMediaName = 'Chess'
                                socialMediaIcon = socialMediaIcons['Chess.com']
                                break
                              case key.startsWith('deviantarts'):
                                socialMediaName = 'DeviantArt'
                                socialMediaIcon =
                                  socialMediaIcons['DeviantArts']
                                break
                              case key.startsWith('goodreads'):
                                socialMediaName = 'Goodreads'
                                socialMediaIcon = socialMediaIcons['GoodReads']
                                break
                              case key.startsWith('pinterest'):
                                socialMediaName = 'Pinterest'
                                socialMediaIcon = socialMediaIcons['Pinterest']
                                break
                              case key.startsWith('smule'):
                                socialMediaName = 'Smule'
                                socialMediaIcon = socialMediaIcons['Smule']
                                break
                              case key.startsWith('soundcloud'):
                                socialMediaName = 'SoundCloud'
                                socialMediaIcon = socialMediaIcons['SoundCloud']
                                break
                              case key.startsWith('strava'):
                                socialMediaName = 'Strava'
                                socialMediaIcon = socialMediaIcons['Strava']
                                break
                              case key.startsWith('tripadvisor'):
                                socialMediaName = 'TripAdvisor'
                                socialMediaIcon =
                                  socialMediaIcons['TripAdvisor']
                                break
                              case key.startsWith('telegram'):
                                socialMediaName = 'Telegram'
                                socialMediaIcon = socialMediaIcons['Telegram']
                                break
                              case key.startsWith('medium'):
                                socialMediaName = 'Medium'
                                socialMediaIcon = socialMediaIcons['Medium']
                                break
                              case key.startsWith('ultimate_guitar'):
                                socialMediaName = 'Ultimate Guitar'
                                socialMediaIcon =
                                  socialMediaIcons['Ultimate Guitar']
                                break
                              case key.startsWith('youtube'):
                                socialMediaName = 'YouTube'
                                socialMediaIcon = socialMediaIcons['Youtube']
                                break
                              case key.startsWith('others'):
                                socialMediaName = extractDomainName(url)
                                socialMediaIcon = socialMediaIcons['Others']
                                break
                              // Add cases for other social media URLs as needed
                              default:
                                break
                            }

                            if (socialMediaIcon && socialMediaName) {
                              return renderSocialLink(
                                url,
                                socialMediaIcon,
                                socialMediaName,
                              )
                            }

                            return null // If no matching social media key is found, return null
                          },
                        )}
                      </>
                    )}
                  </ul>
                </PageContentBox>
              ) : (
                <></>
              )}
            </div>
          </aside>
        )}

        {children}

        <aside
          className={`${styles['page-right-aside']}
            ${
              activeTab === 'home' || activeTab === 'posts'
                ? styles['display-desktop']
                : styles['display-none']
            }`}
        >
          {/* User Contact Details */}
          <PageContentBox
            className={ContactInfoErr ? styles.errorBorder : ''}
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({
                  type: 'listing-contact-edit',
                  closable: true,
                }),
              )
            }
            setDisplayData={setShowContact}
          >
            <h4 className={styles['heading']}>
              {data?.type === 4 ? 'Contact Seller' : 'Contact Information'}
            </h4>
            <ul
              className={`${styles['contact-wrapper']} ${
                styles['display-desktop']
              }${showContact ? ' ' + styles['display-mobile'] : ''}`}
            >
              {!isLoggedIn && (
                <li onClick={openAuthModal} className={styles['signInText']}>
                  Sign in to view full contact details
                </li>
              )}
              {data?.type === 4 ? (
                <>
                  {/* Page Admin */}
                  {data?.seller?.title && isLoggedIn && (
                    <Link
                      href={`/${pageType(data?.seller?.type)}/${
                        data.seller?.page_url
                      }`}
                    >
                      <Image
                        src={AdminSvg}
                        alt="page admin"
                        width={24}
                        height={24}
                      />
                      <span className={styles.textdefault}>
                        {data?.seller?.title}
                      </span>
                    </Link>
                  )}
                  {data?.seller?.title && !isLoggedIn && (
                    <a
                      onClick={(e) => {
                        dispatch(
                          SetLinkviaAuth(
                            `/${pageType(data?.seller?.type)}/${
                              data?.seller?.profile_url
                            }`,
                          ),
                        )
                        dispatch(openModal({ type: 'auth', closable: true }))
                      }}
                    >
                      <Image
                        src={AdminSvg}
                        alt="whatsapp"
                        width={24}
                        height={24}
                      />
                      <span className={styles.textdefault}>
                        {data?.seller?.title}
                      </span>
                    </a>
                  )}
                  {/* Phone */}
                  {data?.seller?.phone.number && isLoggedIn && (
                    <Link href={`tel:${data?.seller?.phone.number}`}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_230_34018)">
                          <path
                            d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_230_34018">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span className={styles.textdefault}>
                        {data?.parent_page?.name}{' '}
                      </span>
                    </Link>
                  )}
                  {data?.parent_page?.number && isLoggedIn && (
                    <Link
                      href={`tel:${data.phone.prefix + data?.phone?.number}`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_230_34018)">
                          <path
                            d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_230_34018">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span className={styles.textdefault}>
                        {`${data?.parent_page?.prefix} ${data?.parent_page?.number}`}
                      </span>
                    </Link>
                  )}

                  {/* WhatsApp Number */}
                  {data?.seller?.whatsapp_number?.number && isLoggedIn && (
                    <Link
                      href={`https://wa.me/${
                        data?.seller?.whatsapp_number?.prefix +
                        data?.seller?.whatsapp_number?.number
                      }`}
                    >
                      <Image
                        src={WhatsappIcon}
                        alt="whatsapp11"
                        width={24}
                        height={24}
                      />
                      <span className={styles.textdefault}>
                        {`${data?.seller?.whatsapp_number?.prefix} ${data?.seller?.whatsapp_number?.number}`}
                      </span>
                    </Link>
                  )}

                  {/* Email */}
                  {data?.seller?.public_email && isLoggedIn && (
                    <Link href={`mailto:${data?.seller?.public_email}`}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_230_34011)">
                          <path
                            d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                            fill="#8064A2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_230_34011">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <span className={styles.textdefault}>
                        {data?.seller?.public_email}{' '}
                      </span>
                    </Link>
                  )}

                  {/* Website */}
                  {data?.seller?.website && (
                    <Link href={data?.seller?.website}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="12" fill="#8064A2" />
                        <path
                          d="M17.3333 15.9974C18.0667 15.9974 18.6667 15.3974 18.6667 14.6641V7.9974C18.6667 7.26406 18.0667 6.66406 17.3333 6.66406H6.66667C5.93333 6.66406 5.33333 7.26406 5.33333 7.9974V14.6641C5.33333 15.3974 5.93333 15.9974 6.66667 15.9974H4.66667C4.3 15.9974 4 16.2974 4 16.6641C4 17.0307 4.3 17.3307 4.66667 17.3307H19.3333C19.7 17.3307 20 17.0307 20 16.6641C20 16.2974 19.7 15.9974 19.3333 15.9974H17.3333ZM7.33333 7.9974H16.6667C17.0333 7.9974 17.3333 8.2974 17.3333 8.66406V13.9974C17.3333 14.3641 17.0333 14.6641 16.6667 14.6641H7.33333C6.96667 14.6641 6.66667 14.3641 6.66667 13.9974V8.66406C6.66667 8.2974 6.96667 7.9974 7.33333 7.9974Z"
                          fill="white"
                        />
                      </svg>

                      <span className={styles.textdefault}>
                        {data?.seller?.website}{' '}
                      </span>
                    </Link>
                  )}
                </>
              ) : (
                <></>
              )}
              {/* Page Admin */}
              {(PageAdmin as any)?.full_name && isLoggedIn && (
                <Link href={`/profile/${(PageAdmin as any)?.profile_url}`}>
                  <Image
                    src={AdminSvg}
                    alt="page admin"
                    width={24}
                    height={24}
                  />
                  <span className={styles.textdefault}>
                    {(PageAdmin as any)?.full_name}
                  </span>
                </Link>
              )}
              {(PageAdmin as any)?.full_name && !isLoggedIn && (
                <a
                  onClick={(e) => {
                    dispatch(
                      SetLinkviaAuth(
                        `/profile/${(PageAdmin as any)?.profile_url}`,
                      ),
                    )
                    dispatch(openModal({ type: 'auth', closable: true }))
                  }}
                >
                  <Image src={AdminSvg} alt="whatsapp" width={24} height={24} />
                  <span className={styles.textdefault}>
                    {(PageAdmin as any)?.full_name}
                  </span>
                </a>
              )}
              {/* Phone */}
              {data?.name && isLoggedIn && (
                <Link href={`tel:${data?.name}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_230_34018)">
                      <path
                        d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_230_34018">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className={styles.textdefault}>{data?.name} </span>
                </Link>
              )}
              {data?.phone?.number && isLoggedIn && (
                <Link href={`tel:${data.phone.prefix + data?.phone?.number}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_230_34018)">
                      <path
                        d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_230_34018">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className={styles.textdefault}>
                    {`${data?.phone?.prefix} ${data?.phone?.number}`}
                  </span>
                </Link>
              )}

              {/* WhatsApp Number */}
              {data?.whatsapp_number?.number && isLoggedIn && (
                <Link
                  href={`https://wa.me/${
                    data?.whatsapp_number?.prefix +
                    data?.whatsapp_number?.number
                  }`}
                >
                  <Image
                    src={WhatsappIcon}
                    alt="whatsapp11"
                    width={24}
                    height={24}
                  />
                  <span className={styles.textdefault}>
                    {`${data?.whatsapp_number?.prefix} ${data?.whatsapp_number?.number}`}
                  </span>
                </Link>
              )}

              {/* Email */}
              {data?.public_email && isLoggedIn && (
                <Link href={`mailto:${data?.public_email}`}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_230_34011)">
                      <path
                        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                        fill="#8064A2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_230_34011">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className={styles.textdefault}>
                    {data?.public_email}{' '}
                  </span>
                </Link>
              )}

              {/* Website */}
              {data?.website && (
                <Link href={data.website}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="12" fill="#8064A2" />
                    <path
                      d="M17.3333 15.9974C18.0667 15.9974 18.6667 15.3974 18.6667 14.6641V7.9974C18.6667 7.26406 18.0667 6.66406 17.3333 6.66406H6.66667C5.93333 6.66406 5.33333 7.26406 5.33333 7.9974V14.6641C5.33333 15.3974 5.93333 15.9974 6.66667 15.9974H4.66667C4.3 15.9974 4 16.2974 4 16.6641C4 17.0307 4.3 17.3307 4.66667 17.3307H19.3333C19.7 17.3307 20 17.0307 20 16.6641C20 16.2974 19.7 15.9974 19.3333 15.9974H17.3333ZM7.33333 7.9974H16.6667C17.0333 7.9974 17.3333 8.2974 17.3333 8.66406V13.9974C17.3333 14.3641 17.0333 14.6641 16.6667 14.6641H7.33333C6.96667 14.6641 6.66667 14.3641 6.66667 13.9974V8.66406C6.66667 8.2974 6.96667 7.9974 7.33333 7.9974Z"
                      fill="white"
                    />
                  </svg>

                  <span className={styles.textdefault}>{data?.website} </span>
                </Link>
              )}
            </ul>
          </PageContentBox>

          {/* Seller Details */}
          {/* <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({ type: 'listing-contact-edit', closable: true }),
                )
              }
            >
              <h4 className={styles['heading']}>Seller Information</h4>
              <ul className={styles['seller-info-wrapper']}>
     
                <li>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_173_56271)">
                      <rect width="24" height="24" fill="#8064A2" />
                      <path
                        d="M10 12C12.21 12 14 10.21 14 8C14 5.79 12.21 4 10 4C7.79 4 6 5.79 6 8C6 10.21 7.79 12 10 12ZM10 6C11.1 6 12 6.9 12 8C12 9.1 11.1 10 10 10C8.9 10 8 9.1 8 8C8 6.9 8.9 6 10 6Z"
                        fill="white"
                      />
                      <path
                        d="M4 18.003C4.22 17.283 7.31 16.003 10 16.003C10 15.303 10.13 14.633 10.35 14.013C7.62 13.913 2 15.273 2 18.003V20.003H11.54C11.02 19.423 10.61 18.753 10.35 18.003H4Z"
                        fill="white"
                      />
                      <path
                        d="M19.43 18.02C19.79 17.43 20 16.74 20 16C20 13.79 18.21 12 16 12C13.79 12 12 13.79 12 16C12 18.21 13.79 20 16 20C16.74 20 17.43 19.78 18.02 19.43C18.95 20.36 19.64 21.05 20.59 22L22 20.59C20.5 19.09 21.21 19.79 19.43 18.02ZM16 18C14.9 18 14 17.1 14 16C14 14.9 14.9 14 16 14C17.1 14 18 14.9 18 16C18 17.1 17.1 18 16 18Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_173_56271">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p>KYC</p>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="15"
                      height="15"
                      rx="1.5"
                      fill="white"
                      stroke="#8064A2"
                    />
                  </svg>
                </li>

          
                <li>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" fill="#8064A2" />
                    <path
                      d="M12.37 2.15375L21.37 5.75373C21.72 5.89373 22 6.31372 22 6.68372V10.0037C22 10.5537 21.55 11.0037 21 11.0037H3C2.45 11.0037 2 10.5537 2 10.0037V6.68372C2 6.31372 2.28 5.89373 2.63 5.75373L11.63 2.15375C11.83 2.07375 12.17 2.07375 12.37 2.15375Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22 22H2V19C2 18.45 2.45 18 3 18H21C21.55 18 22 18.45 22 19V22Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M20 18V11"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1 22H23"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p>Bank</p>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="15"
                      height="15"
                      rx="1.5"
                      fill="white"
                      stroke="#8064A2"
                    />
                  </svg>
                </li>
              </ul>
            </PageContentBox> */}

          {/* User Location Details */}
          <PageContentBox
            className={LocationErr ? styles.errorBorder : ''}
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'listing-address-edit', closable: true }),
              )
            }
            setDisplayData={setShowLocation}
          >
            <div className={`${styles['location-heading']} `}>
              <h4>Location</h4>
              {listingLayoutMode === 'view' && data?._address?.virtual && (
                <Link
                  href={data?._address?.url ?? '#'}
                  className={styles['join-online']}
                >
                  {laptopIcon}
                  <p>Join Online</p>
                </Link>
              )}
              {listingLayoutMode === 'view' && !data?._address?.virtual && (
                <div
                  className={styles['direction-container']}
                  onClick={openGoogleMaps}
                >
                  <Image src={DirectionIcon} alt="direction" />
                  <p> Get Direction </p>
                </div>
              )}
            </div>
            {!data?._address?.virtual && (
              <>
                <div
                  className={`${styles['display-desktop']}${
                    showLocation ? ' ' + styles['display-mobile'] : ''
                  }`}
                >
                  <ul className={`${styles['location-wrapper']}`}>
                    {/* Address */}
                    {data?._address && (
                      <li>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_173_56226)">
                            <path
                              d="M12 2C7.8 2 4 5.22 4 10.2C4 13.38 6.45 17.12 11.34 21.43C11.72 21.76 12.29 21.76 12.67 21.43C17.55 17.12 20 13.38 20 10.2C20 5.22 16.2 2 12 2ZM12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12Z"
                              fill="#8064A2"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_173_56226">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <span className={styles.textdefault}>
                          {data?.wp_data?.location_str}
                          {/* {`${
                        data?._address.street ? data._address.street + ',' : ''
                      }
                      
                      ${
                        data?._address.society ? data._address.society + ',' : ''
                      } 
                      ${
                        data?._address.locality
                        ? data._address.locality + ','
                        : ''
                      } 
                      ${data?._address.city ? data._address.city + ',' : ''} 
                      ${data?._address.state ? data._address.state + ',' : ''} 
                      ${data?._address.country ? data._address.country : ''}
                      ${
                        data?._address?.pin_code
                        ? ' - ' + data?._address?.pin_code
                        : ''
                      }`} */}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                <div
                  className={`${styles['location-map']} ${
                    styles['display-desktop']
                  }${showLocation ? ' ' + styles['display-mobile'] : ''}`}
                >
                  <MapComponent lat={lat} lng={lng} />
                </div>
              </>
            )}
            {data?._address?.virtual && (
              <p className={styles['desc']}>{data?._address?.description}</p>
            )}
          </PageContentBox>
          {data?.type === listingTypes.PLACE && (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'listing-working-hours-edit',
                    closable: true,
                  }),
                )
              }
              setDisplayData={setShowWorkingHours}
            >
              <h4 className={styles['heading']}>Working Hours</h4>
              <div
                className={`${styles['working-hours-wrapper']} ${
                  styles['display-desktop']
                }${showWorkingHours ? ' ' + styles['display-mobile'] : ''}`}
              >
                {/* Working Hours  */}
                {data?.work_hours && (
                  <ul>
                    {data?.work_hours.map((item: any, idx: number) => {
                      return (
                        <li key={idx} className={styles.workingListItem}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_173_56222)">
                              <path
                                d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM15.55 15.8L11.47 13.29C11.17 13.11 10.99 12.79 10.99 12.44V7.75C11 7.34 11.34 7 11.75 7C12.16 7 12.5 7.34 12.5 7.75V12.2L16.34 14.51C16.7 14.73 16.82 15.2 16.6 15.56C16.38 15.91 15.91 16.02 15.55 15.8Z"
                                fill="#8064A2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_173_56222">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <p className={styles.workingHour}>
                            {item.from_day} - {item.to_day}, {item.from_time} -{' '}
                            {item.to_time}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </PageContentBox>
          )}

          {/* Related Listing */}
          {listingLayoutMode !== 'edit' &&
          (!listingPagesRight || listingPagesRight.length === 0) ? null : (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'related-listing-right-edit',
                    closable: true,
                  }),
                )
              }
              setDisplayData={(arg0: boolean) => {
                dispatch(
                  updateRelatedListingsOpenStates2({
                    [data._id]: !showRelatedListing2,
                  }),
                )
              }}
              expandData={showRelatedListing2}
            >
              <h4 className={styles['heading']}>
                {relationRight && relationRight.trim() !== ''
                  ? relationRight
                  : 'Related Listing'}
              </h4>

              <div
                className={`${styles['display-desktop']}${
                  relatedListingsStates2?.[data?._id]
                    ? ' ' + styles['display-mobile']
                    : ''
                }`}
              >
                {!listingPagesRight || listingPagesRight.length === 0 ? null : (
                  <ul className={styles['related-list']}>
                    {listingPagesRight?.map((item: any) => {
                      if (typeof item === 'string') return null
                      return (
                        <li key={item._id}>
                          <Link
                            className={styles.textGray}
                            href={`/${pageType(item?.type)}/${item.page_url}`}
                          >
                            <div className={styles['related']}>
                              {item.profile_image ? (
                                <img
                                  src={item.profile_image}
                                  alt={item?.title}
                                  width="32"
                                  height="32"
                                />
                              ) : (
                                <Image
                                  src={DefaultPageImage}
                                  alt={item?.title}
                                  width="32"
                                  height="32"
                                />
                              )}
                              <span className={styles['item-title']}>
                                {item?.title}
                              </span>
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </PageContentBox>
          )}

          {data?.social_media_urls || listingLayoutMode === 'edit' ? (
            <PageContentBox
              showEditButton={listingLayoutMode === 'edit'}
              onEditBtnClick={() =>
                dispatch(
                  openModal({
                    type: 'listing-social-media-edit',
                    closable: true,
                  }),
                )
              }
              setDisplayData={setShowSocialMedia}
            >
              <h4 className={styles['heading']}>Social Media</h4>

              <ul
                className={`${styles['social-contact-wrapper']} ${
                  styles['display-desktop']
                }${showSocialMedia ? ' ' + styles['display-mobile'] : ''}`}
              >
                {data.social_media_urls && (
                  <>
                    {Object.entries(data.social_media_urls).map(
                      ([key, url]) => {
                        let socialMediaName = ''
                        let socialMediaIcon = null

                        switch (true) {
                          case key.startsWith('facebook'):
                            socialMediaName = 'Facebook'
                            socialMediaIcon = socialMediaIcons['Facebook']
                            break
                          case key.startsWith('twitter'):
                            socialMediaName = 'Twitter'
                            socialMediaIcon = socialMediaIcons['Twitter']
                            break
                          case key.startsWith('instagram'):
                            socialMediaName = 'Instagram'
                            socialMediaIcon = socialMediaIcons['Instagram']
                            break
                          case key.startsWith('behance'):
                            socialMediaName = 'Behance'
                            socialMediaIcon = socialMediaIcons['Behance']
                            break
                          case key.startsWith('bgg'):
                            socialMediaName = 'BoardGameGeek'
                            socialMediaIcon = socialMediaIcons['BGG']
                            break
                          case key.startsWith('chess'):
                            socialMediaName = 'Chess'
                            socialMediaIcon = socialMediaIcons['Chess.com']
                            break
                          case key.startsWith('deviantarts'):
                            socialMediaName = 'DeviantArt'
                            socialMediaIcon = socialMediaIcons['DeviantArts']
                            break
                          case key.startsWith('goodreads'):
                            socialMediaName = 'Goodreads'
                            socialMediaIcon = socialMediaIcons['GoodReads']
                            break
                          case key.startsWith('pinterest'):
                            socialMediaName = 'Pinterest'
                            socialMediaIcon = socialMediaIcons['Pinterest']
                            break
                          case key.startsWith('smule'):
                            socialMediaName = 'Smule'
                            socialMediaIcon = socialMediaIcons['Smule']
                            break
                          case key.startsWith('soundcloud'):
                            socialMediaName = 'SoundCloud'
                            socialMediaIcon = socialMediaIcons['SoundCloud']
                            break
                          case key.startsWith('strava'):
                            socialMediaName = 'Strava'
                            socialMediaIcon = socialMediaIcons['Strava']
                            break
                          case key.startsWith('tripadvisor'):
                            socialMediaName = 'TripAdvisor'
                            socialMediaIcon = socialMediaIcons['TripAdvisor']
                            break
                          case key.startsWith('telegram'):
                            socialMediaName = 'Telegram'
                            socialMediaIcon = socialMediaIcons['Telegram']
                            break
                          case key.startsWith('medium'):
                            socialMediaName = 'Medium'
                            socialMediaIcon = socialMediaIcons['Medium']
                            break
                          case key.startsWith('ultimate_guitar'):
                            socialMediaName = 'Ultimate Guitar'
                            socialMediaIcon =
                              socialMediaIcons['Ultimate Guitar']
                            break
                          case key.startsWith('youtube'):
                            socialMediaName = 'YouTube'
                            socialMediaIcon = socialMediaIcons['Youtube']
                            break
                          case key.startsWith('others'):
                            socialMediaName = extractDomainName(url)
                            socialMediaIcon = socialMediaIcons['Others']
                            break
                          // Add cases for other social media URLs as needed
                          default:
                            break
                        }

                        if (socialMediaIcon && socialMediaName) {
                          return renderSocialLink(
                            url,
                            socialMediaIcon,
                            socialMediaName,
                          )
                        }

                        return null // If no matching social media key is found, return null
                      },
                    )}
                  </>
                )}
              </ul>
            </PageContentBox>
          ) : (
            <></>
          )}
        </aside>
      </PageGridLayout>
    </>
  )
}

export default ListingPageMain
