import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material'
import DeleteIcon from '@/assets/svg/trash-icon-colored.svg'
import AddIcon from '@/assets/svg/add.svg'
import Image from 'next/image'
import { updateMyProfileDetail } from '@/services/user.service'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import SaveModal from '../../SaveModal/saveModal'
import { getSocialNetworks } from '@/services/socialnetworks.service'
import DropdownComponent from './Dropdown'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

type Props = {
  data?: ProfilePageData['pageData']
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  onStatusChange?: (isChanged: boolean) => void
}

interface SocialMediaData {
  socialMedia: string
  url: string
}

const options: SocialMediaOption[] = [
  'Facebook',
  'Twitter',
  'Instagram',
  'YouTube',
  'SoundCloud',
  'Pinterest',
  'Medium',
  'Telegram',
  'TripAdvisor',
  'Ultimate Guitar',
  'Strava',
  'DeviantArt',
  'Behance',
  'GoodReads',
  'Smule',
  'Chess.com',
  'BGG',
  'Others',
]

type SocialMediaOption =
  | 'Facebook'
  | 'Twitter'
  | 'Instagram'
  | 'YouTube'
  | 'SoundCloud'
  | 'Pinterest'
  | 'Medium'
  | 'Telegram'
  | 'TripAdvisor'
  | 'Ultimate Guitar'
  | 'Strava'
  | 'DeviantArt'
  | 'Behance'
  | 'GoodReads'
  | 'Smule'
  | 'Chess.com'
  | 'BGG'
  | 'Others'

const socialMediaIcons: Record<SocialMediaOption, any> = {
  Facebook:
    'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/facebook.svg',
  Twitter:
    'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/X.png',
  Instagram:
    'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/instagram.svg',
  YouTube:
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
    'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/Ultimate+Guitar.png',
  Strava:
    'https://s3.ap-south-1.amazonaws.com/app-data-prod-hobbycue.com/strava.svg',
  DeviantArt:
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

const defaultSocialMediaURLs: Record<SocialMediaOption, string> = {
  Facebook: 'https://facebook.com/',
  Twitter: 'https://twitter.com/',
  Instagram: 'https://instagram.com/',
  YouTube: 'https://youtube.com/',
  SoundCloud: 'https://soundcloud.com/',
  Pinterest: 'https://pinterest.com/',
  Medium: 'https://medium.com/',
  Telegram: 'https://telegram.com/',
  TripAdvisor: 'https://tripadvisor.com/profile/',
  'Ultimate Guitar': 'https://ultimate-guitar.com/u/',
  Strava: 'https://strava.com/athletes/',
  DeviantArt: 'https://deviantart.com/',
  Behance: 'https://behance.net/',
  GoodReads: 'https://goodreads.com/',
  Smule: 'https://smule.com/',
  'Chess.com': 'https://chess.com/member/',
  BGG: 'https://boardgamegeek.com/user/',
  Others: 'https://',
}

const desiredOrder = [
  'Facebook',
  'Instagram',
  'Twitter',
  'YouTube',
  'SoundCloud',
  'Pinterest',
  'TripAdvisor',
  'Ultimate Guitar',
  'Strava',
  'DeviantArt',
  'Behance',
  'GoodReads',
  'Smule',
  'Chess.com',
  'BGG',
  'Medium',
]

// Type for social media data
type SocialMediaData1 = {
  Mouseover: string
  Show: 'Y' | 'N' | '' // This is already the expected type for Show
  socialMedia: string
  urlPrompt: string
}

const reorderSocialMedia = (data: SocialMediaData1[]): SocialMediaData1[] => {
  const orderedData: SocialMediaData1[] = []
  const remainingData: SocialMediaData1[] = []

  // Iterate through the data and sort accordingly
  data.forEach((item) => {
    // Ensure Show is valid
    if (!['Y', 'N', ''].includes(item.Show)) {
      item.Show = '' // Default to empty string if Show is invalid
    }

    const index = desiredOrder.indexOf(item.socialMedia)
    if (index !== -1) {
      orderedData[index] = item
    } else {
      remainingData.push(item)
    }
  })

  const compactOrderedData = orderedData.filter(Boolean) // Remove undefined items
  return [...compactOrderedData, ...remainingData] // Append remaining items that are not in the desired order
}

const ListingSocialMediaEditModal: React.FC<Props> = ({
  data,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
}: Props) => {
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.user)
  const [allOptions, setAllOptions] = useState<
    {
      Mouseover: string
      Show: 'Y' | 'N' | ''
      socialMedia: string
      urlPrompt: string
    }[]
  >([])
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    if (!user.social_media_urls) return

    let arr = []
    const userSocialMediaUrls = user.social_media_urls
    console.log({ userSocialMediaUrls })
    for (const key in userSocialMediaUrls) {
      const value = userSocialMediaUrls[key]
      if (typeof value === 'string' && value !== '') {
        switch (true) {
          case key.startsWith('facebook'):
            arr.push({
              error : false,
              socialMedia: 'Facebook',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('instagram'):
            arr.push({
              error : false,
              socialMedia: 'Instagram',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('twitter'):
            arr.push({
              error : false,
              socialMedia: 'Twitter',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('youtube'):
            arr.push({
              error : false,
              socialMedia: 'Youtube',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('soundcloud'):
            arr.push({
              error : false,
              socialMedia: 'SoundCloud',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('pinterest'):
            arr.push({
              error : false,
              socialMedia: 'Pinterest',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('medium'):
            arr.push({
              error : false,
              socialMedia: 'Medium',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('telegram'):
            arr.push({
              error : false,
              socialMedia: 'Telegram',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('tripadvisor'):
            arr.push({
              error : false,
              socialMedia: 'TripAdvisor',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('ultimate_guitar'):
            arr.push({
              error : false,
              socialMedia: 'Ultimate Guitar',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('strava'):
            arr.push({
              error : false,
              socialMedia: 'Strava',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('deviantarts'):
            arr.push({
              error : false,
              socialMedia: 'DeviantArts',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('behance'):
            arr.push({
              error : false,
              socialMedia: 'Behance',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('goodreads'):
            arr.push({
              error : false,
              socialMedia: 'GoodReads',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('smule'):
            arr.push({
              error : false,
              socialMedia: 'Smule',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('chess'):
            arr.push({
              error : false,
              socialMedia: 'Chess.com',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('bgg'):
            arr.push({
              error : false,
              socialMedia: 'BGG',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('others'):
            arr.push({
              error : false,
              socialMedia: 'Others',
              url: userSocialMediaUrls[key],
            })
            break
          // Add more cases for other social media URLs if needed
          default:
            break
        }
      }
    }
    if (arr.length > 0) {
      setMediaData(arr)
      setInitialData(arr)
    }
  }, [user])

  const [mediaData, setMediaData] = useState([
    {
      socialMedia: '',
      url: '',
      error: false,
    },
  ])

  const [initialData, setInitialData] = useState([
    {
      socialMedia: '',
      url: '',
    },
  ])

  const dispatch = useDispatch()

  const onChange = (idxToChange: any, key: any, value: any) => {
    let temp = mediaData.map((item: any, idx: any) => {
      if (idx === idxToChange) {
        return {
          ...item,
          [key]: value,
        }
      } else {
        return item
      }
    })
    setMediaData(temp)
  }

  const addSocialMedia = () => {
    const newSocialMedia = { socialMedia: '', url: '', error: false }
    setMediaData((prevMediaData) => [...prevMediaData.slice(), newSocialMedia])
  }

  const getValue = (key: any) => {
    const socialMediaItem = mediaData.find((item) => item.socialMedia === key)
    return socialMediaItem ? socialMediaItem.url : ''
  }
  const handleDelete = (itemToDelete: SocialMediaData) => {
    const indexToDelete = mediaData.findIndex(
      (item) =>
        item.socialMedia === itemToDelete.socialMedia &&
        item.url === itemToDelete.url,
    )

    if (indexToDelete !== -1) {
      const updatedMediaData = [...mediaData]
      updatedMediaData.splice(indexToDelete, 1)
      setMediaData(updatedMediaData)
    }
  }

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const handleSubmit = async () => {
    let errorSaving = false
    setSubmitBtnLoading(true)
    let reqBody: any = {}
    let socialMediaCounts: { [key: string]: number } = {}
    for (let i = 0; i < mediaData.length; i++) {
      const socialMediaItem = mediaData[i]
      const socialMedia = socialMediaItem.socialMedia
      const url = socialMediaItem.url

      // Increment the count for the current social media
      socialMediaCounts[socialMedia] = (socialMediaCounts[socialMedia] || 0) + 1

      const defaultURL = defaultSocialMediaURLs[socialMedia as SocialMediaOption]
      const isValidUrl =
        url !== defaultURL && url.startsWith(defaultURL) && url.length > defaultURL.length

      if (!isValidUrl) {
        setMediaData((prev: any) => {
          const updatedMediaData = [...prev]; 
          updatedMediaData[i].error = true; 
          return updatedMediaData; 
        });
        errorSaving = true
      }
      let key
      switch (socialMedia) {
        case 'Facebook':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'facebook'
              : `facebook${socialMediaCounts[socialMedia]}`
          break
        case 'Instagram':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'instagram'
              : `instagram${socialMediaCounts[socialMedia]}`
          break
        case 'Twitter':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'twitter'
              : `twitter${socialMediaCounts[socialMedia]}`
          break
        case 'Youtube':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'youtube'
              : `youtube${socialMediaCounts[socialMedia]}`
          break
        case 'SoundCloud':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'soundcloud'
              : `soundcloud${socialMediaCounts[socialMedia]}`
          break
        case 'Pinterest':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'pinterest'
              : `pinterest${socialMediaCounts[socialMedia]}`
          break
        case 'Medium':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'medium'
              : `medium${socialMediaCounts[socialMedia]}`
          break
        case 'Telegram':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'telegram'
              : `telegram${socialMediaCounts[socialMedia]}`
          break
        case 'TripAdvisor':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'tripadvisor'
              : `tripadvisor${socialMediaCounts[socialMedia]}`
          break
        case 'Ultimate Guitar':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'ultimate_guitar'
              : `ultimate_guitar${socialMediaCounts[socialMedia]}`
          break
        case 'Strava':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'strava'
              : `strava${socialMediaCounts[socialMedia]}`
          break
        case 'DeviantArts':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'deviantarts'
              : `deviantarts${socialMediaCounts[socialMedia]}`
          break
        case 'Behance':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'behance'
              : `behance${socialMediaCounts[socialMedia]}`
          break
        case 'GoodReads':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'goodreads'
              : `goodreads${socialMediaCounts[socialMedia]}`
          break
        case 'Smule':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'smule'
              : `smule${socialMediaCounts[socialMedia]}`
          break
        case 'Chess.com':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'chess'
              : `chess${socialMediaCounts[socialMedia]}`
          break
        case 'BGG':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'bgg'
              : `bgg${socialMediaCounts[socialMedia]}`
          break
        case 'Others':
          key =
            socialMediaCounts[socialMedia] === 1
              ? 'others'
              : `others${socialMediaCounts[socialMedia]}`
          break
        default:
          break
      }

      if (key) {
        reqBody[key] = url
      }
    }
    if(errorSaving === true){
      setSubmitBtnLoading(false)
      return
    } else {
      const { err, res } = await updateMyProfileDetail({
        social_media_urls: reqBody,
      })
  
      if (err) {
        setSubmitBtnLoading(false)
        return console.log(err)
      }
  
      if (err) return console.log(err)
      if (res?.data.success) {
        console.log('res', res)
        window.location.reload()
        dispatch(closeModal())
      }
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
  console.log(user)

  const searchref = useRef<HTMLInputElement | null>(null)
  const [showSocialMediaDowpdown, setShowSocialMediaDowpdown] = useState(false)

  useEffect(() => {
    const changesMade =
      JSON.stringify(mediaData) !== JSON.stringify(initialData)
    setIsChanged(changesMade)
    if (onStatusChange) {
      onStatusChange(changesMade)
    }
  }, [mediaData, initialData])

  useEffect(() => {
    getSocialNetworks()
      .then((result) => {
        const { res, err } = result
        if (err) {
          console.error({ err })
        } else if (res?.data?.data) {
          const reorderedData = reorderSocialMedia(
            res.data.data as SocialMediaData1[],
          )
          setAllOptions(reorderedData)
          console.log({ reorderedData })
        }
      })
      .catch((err) => {
        console.error({ err })
      })
  }, [])

  const isMobile = useMediaQuery('(max-width:1100px)')

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
      />
    )
  }

  const selectFieldRefs = useRef<(HTMLDivElement | null)[]>([]) // Array of refs for each Select
  const [optionsHeight, setOptionsHeight] = useState<string[]>([]) // Heights for each dropdown

  useEffect(() => {
    const updateOptionsHeights = () => {
      const newHeights = mediaData.map((_, idx) => {
        const ref = selectFieldRefs.current[idx]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const availableHeight = window.innerHeight - rect.bottom // Calculate available space
          return `${Math.max(availableHeight - 32, 100)}px` // Add padding and enforce min height
        }
        return '25rem' // Default height
      })
      setOptionsHeight(newHeights)
    }

    // Initial calculation
    updateOptionsHeights()

    // Recalculate on resize
    window.addEventListener('resize', updateOptionsHeights)
    return () => {
      window.removeEventListener('resize', updateOptionsHeights)
    }
  }, [mediaData])
  return (
    <div className={styles['modal-wrapper']}>
      {/* Modal Header */}
      <header className={styles['header']}>
        <h4 className={styles['heading']}>{'Social Media'}</h4>
        {isMobile && (
          <div className={styles['header-add-new']} onClick={addSocialMedia}>
            <Image
              src={AddIcon}
              alt="add"
              width={12}
              height={12}
              className={styles.deleteIcon}
            />
            <p>Add New</p>
          </div>
        )}
      </header>

      <hr className={styles['modal-hr']} />

      <section className={styles['body'] + ' ' + 'custom-scrollbar-two'}>
        {!isMobile && (
          <div className={styles['body-header']} onClick={addSocialMedia}>
            <Image
              src={AddIcon}
              alt="add"
              width={12}
              height={12}
              className={styles.deleteIcon}
            />
            Add New
          </div>
        )}
        {/* 700: Social media icon sequence */}
        {mediaData.map((item: any, idx: any) => {
          return (
            <div ref={(el) => (selectFieldRefs.current[idx] = el)} className={styles.inputContainer} key={idx}>
              {/* <Select
                value={item.socialMedia}
                onChange={(e) => {
                  const selectedSocialMedia = e.target.value as SocialMediaOption;
                  const defaultUrl = defaultSocialMediaURLs[selectedSocialMedia];
                
                  const updatedMediaData = [...mediaData];
                  updatedMediaData[idx] = {
                    ...item,
                    socialMedia: selectedSocialMedia,
                    url: defaultUrl,
                  };
                
                  setMediaData(updatedMediaData);
                }}
                className={styles.dropdown}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={{
                  PaperProps: {
                    className:  'custom-scrollbar',
                    style: {
                      maxHeight: optionsHeight[idx] || 200, 
                      overflowY: 'auto',
                    },
                  },
                }}
              >
                {allOptions
                  .filter((obj) => obj.Show === 'Y')
                  .map((option, i) => {
                    return (
                      <MenuItem key={i} value={option.socialMedia}>
                        <div className={styles['menu-item']}>
                          <img
                            src={
                              socialMediaIcons[option.socialMedia as SocialMediaOption]
                            }
                            alt={option.socialMedia}
                            width={24}
                            height={24}
                          />
                          <p
                            className={styles.iconText}
                            style={{ marginLeft: '8px' }}
                          >
                            {option.socialMedia}
                          </p>
                        </div>
                      </MenuItem>
                    );
                  })}
              </Select> */}
            <div style={{width:"184px", height:"40px"}}>
              <DropdownComponent
                options={allOptions}
                placeholder={'Select Social Media'}
                value={item.socialMedia}
                onChange={(e) => {
                  const selectedSocialMedia = e as SocialMediaOption;
                  const defaultUrl = defaultSocialMediaURLs[selectedSocialMedia];

                  console.log({ e, selectedSocialMedia, defaultUrl });
              
                  const updatedMediaData = [...mediaData];
                  updatedMediaData[idx] = {
                    ...item,
                    socialMedia: selectedSocialMedia,
                    url: defaultUrl,
                    error: true
                  };
                  setMediaData(updatedMediaData);
                }}
              />
            </div>

              <div className={styles['input-box']}>
                <input
                  type="text"
                  autoComplete="new"
                  placeholder={`URL`}
                  value={item.url}
                  name="url"
                  onChange={(e) => {
                    let val = e.target.value;
                    onChange(idx, 'url', val);
                    setMediaData((prev: any) => {
                      const updatedMediaData = [...prev]; 
                      updatedMediaData[idx].error = false; 
                      return updatedMediaData;
                    });
                  }}
                  style={item?.error === true ? { borderColor: "red" } : {}}
                />
                {
                  item?.error === true ? <p style={{color: "#c0504d", fontSize: "12px", position:"absolute", bottom:"-17px", left:"5px"}}>Please enter a valid URL</p> : null
                }
              </div>
              <Image
                src={DeleteIcon}
                alt="delete"
                className={styles.deleteIcon}
                onClick={() => handleDelete(item)}
              />
            </div>
          )
        })}
      </section>

      <footer className={styles['footer']}>
        <button
          ref={nextButtonRef}
          className="modal-footer-btn submit"
          onClick={handleSubmit}
          disabled={submitBtnLoading}
        >
          {submitBtnLoading ? (
            <CircularProgress color="inherit" size={'24px'} />
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
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </div>
  )
}

export default ListingSocialMediaEditModal
