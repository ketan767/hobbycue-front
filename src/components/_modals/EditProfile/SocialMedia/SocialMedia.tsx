import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { CircularProgress, FormControl, MenuItem, Select } from '@mui/material'
import DeleteIcon from '@/assets/svg/trash-icon-colored.svg'
import AddIcon from '@/assets/svg/add.svg'
import Image from 'next/image'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { updateListing } from '@/services/listing.service'
import FacebookIcon from '@/assets/svg/social-media/facebook.svg'
import TwitterIcon from '@/assets/svg/social-media/twitter.svg'
import InstagramIcon from '@/assets/svg/social-media/instagram.svg'
import BehanceIcon from '@/assets/svg/social-media/behance.svg'
import BGGIcon from '@/assets/svg/social-media/bgg.svg'
import ChessIcon from '@/assets/svg/social-media/chess.com.svg'
import DeviantArtIcon from '@/assets/svg/social-media/DeviantArt.svg'
import GoodreadsIcon from '@/assets/svg/social-media/GoodReads.svg'
import PinterestIcon from '@/assets/svg/social-media/pinterest.svg'
import SmuleIcon from '@/assets/svg/social-media/smule.svg'
import SoundCloudIcon from '@/assets/svg/social-media/soundcloud.svg'
import StravaIcon from '@/assets/svg/social-media/strava.svg'
import TripAdvisorIcon from '@/assets/svg/social-media/tripadvisor.svg'
import UltimateGuitarIcon from '@/assets/svg/social-media/Ultimate-Guitar.svg'
import YouTubeIcon from '@/assets/svg/social-media/youtube.svg'
import OthersIcon from '@/assets/svg/social-media/other.svg'
import MediumIcon from '@/assets/svg/social-media/MediumWeb.svg'
import TelegramIcon from '@/assets/svg/social-media/Telegram.svg'
import SaveModal from '../../SaveModal/saveModal'

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
  'Youtube',
  'SoundCloud',
  'Pinterest',
  'Medium',
  'Telegram',
  'TripAdvisor',
  'Ultimate Guitar',
  'Strava',
  'DeviantArts',
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

const socialMediaIcons: Record<SocialMediaOption, any> = {
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
  Instagram: InstagramIcon,
  Youtube: YouTubeIcon,
  SoundCloud: SoundCloudIcon,
  Pinterest: PinterestIcon,
  Medium: MediumIcon,
  Telegram: TelegramIcon,
  TripAdvisor: TripAdvisorIcon,
  'Ultimate Guitar': UltimateGuitarIcon,
  Strava: StravaIcon,
  DeviantArts: DeviantArtIcon,
  Behance: BehanceIcon,
  GoodReads: GoodreadsIcon,
  Smule: SmuleIcon,
  'Chess.com': ChessIcon,
  BGG: BGGIcon,
  Others: OthersIcon,
}

const defaultSocialMediaURLs: Record<SocialMediaOption, string> = {
  Facebook: 'https://facebook.com/',
  Twitter: 'https://twitter.com/',
  Instagram: 'https://instagram.com/',
  Youtube: 'https://youtube.com/',
  SoundCloud: 'https://soundcloud.com/',
  Pinterest: 'https://pinterest.com/',
  Medium: 'https://medium.com/',
  Telegram: 'https://telegram.com/',
  TripAdvisor: 'https://tripadvisor.com/profile/',
  'Ultimate Guitar': 'https://ultimate-guitar.com/u/',
  Strava: 'https://strava.com/athletes/',
  DeviantArts: 'https://deviantart.com/',
  Behance: 'https://behance.net/',
  GoodReads: 'https://goodreads.com/',
  Smule: 'https://smule.com/',
  'Chess.com': 'https://chess.com/member/',
  BGG: 'https://boardgamegeek.com/user/',
  Others: 'https://',
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
  const [initialData, setInitialData] = useState<SocialMediaData[]>([])
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    if (!user.social_media_urls) return

    let arr = []
    const userSocialMediaUrls = user.social_media_urls
    console.log({userSocialMediaUrls})
    for (const key in userSocialMediaUrls) {
      const value = userSocialMediaUrls[key]
      if (typeof value === 'string' && value !== '') {
        switch (true) {
          case key.startsWith('facebook'):
            arr.push({
              socialMedia: 'Facebook',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('instagram'):
            arr.push({
              socialMedia: 'Instagram',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('twitter'):
            arr.push({
              socialMedia: 'Twitter',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('youtube'):
            arr.push({
              socialMedia: 'Youtube',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('soundcloud'):
            arr.push({
              socialMedia: 'SoundCloud',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('pinterest'):
            arr.push({
              socialMedia: 'Pinterest',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('medium'):
            arr.push({
              socialMedia: 'Medium',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('telegram'):
            arr.push({
              socialMedia: 'Telegram',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('tripadvisor'):
            arr.push({
              socialMedia: 'TripAdvisor',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('ultimate_guitar'):
            arr.push({
              socialMedia: 'Ultimate Guitar',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('strava'):
            arr.push({
              socialMedia: 'Strava',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('deviantarts'):
            arr.push({
              socialMedia: 'DeviantArts',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('behance'):
            arr.push({
              socialMedia: 'Behance',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('goodreads'):
            arr.push({
              socialMedia: 'GoodReads',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('smule'):
            arr.push({
              socialMedia: 'Smule',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('chess'):
            arr.push({
              socialMedia: 'Chess.com',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('bgg'):
            arr.push({
              socialMedia: 'BGG',
              url: userSocialMediaUrls[key],
            })
            break
          case key.startsWith('others'):
            arr.push({
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
    },
  ])
  console.log({mediaData})

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
    const newSocialMedia = { socialMedia: '', url: '' }
    setMediaData((prevMediaData) => [...prevMediaData.slice(), newSocialMedia])
  }

  const getValue = (key: any) => {
    const socialMediaItem = mediaData.find((item) => item.socialMedia === key)
    return socialMediaItem ? socialMediaItem.url : ''
  }
  const handleDelete = (item: any) => {
    let updated = mediaData.filter(
      (media: any) => item.socialMedia !== media.socialMedia,
    )
    setMediaData(updated)
  }
  console.log('item', mediaData)

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    let reqBody: any = {};
    let socialMediaCounts: { [key: string]: number } = {};
    for (let i = 0; i < mediaData.length; i++) {
      const socialMediaItem = mediaData[i];
      const socialMedia = socialMediaItem.socialMedia;
      const url = socialMediaItem.url;
    
      // Increment the count for the current social media
      socialMediaCounts[socialMedia] = (socialMediaCounts[socialMedia] || 0) + 1;
    
      let key;
      switch (socialMedia) {
        case 'Facebook':
          key = socialMediaCounts[socialMedia] === 1 ? 'facebook' : `facebook${socialMediaCounts[socialMedia]}`;
          break;
        case 'Instagram':
          key = socialMediaCounts[socialMedia] === 1 ? 'instagram' : `instagram${socialMediaCounts[socialMedia]}`;
          break;
        case 'Twitter':
          key = socialMediaCounts[socialMedia] === 1 ? 'twitter' : `twitter${socialMediaCounts[socialMedia]}`;
          break;
        case 'Youtube':
          key = socialMediaCounts[socialMedia] === 1 ? 'youtube' : `youtube${socialMediaCounts[socialMedia]}`;
          break;
        case 'SoundCloud':
          key = socialMediaCounts[socialMedia] === 1 ? 'soundcloud' : `soundcloud${socialMediaCounts[socialMedia]}`;
          break;
        case 'Pinterest':
          key = socialMediaCounts[socialMedia] === 1 ? 'pinterest' : `pinterest${socialMediaCounts[socialMedia]}`;
          break;
        case 'Medium':
          key = socialMediaCounts[socialMedia] === 1 ? 'medium' : `medium${socialMediaCounts[socialMedia]}`;
          break;
        case 'Telegram':
          key = socialMediaCounts[socialMedia] === 1 ? 'telegram' : `telegram${socialMediaCounts[socialMedia]}`;
          break;
        case 'TripAdvisor':
          key = socialMediaCounts[socialMedia] === 1 ? 'tripadvisor' : `tripadvisor${socialMediaCounts[socialMedia]}`;
          break;
        case 'Ultimate Guitar':
          key = socialMediaCounts[socialMedia] === 1 ? 'ultimate_guitar' : `ultimate_guitar${socialMediaCounts[socialMedia]}`;
          break;
        case 'Strava':
          key = socialMediaCounts[socialMedia] === 1 ? 'strava' : `strava${socialMediaCounts[socialMedia]}`;
          break;
        case 'DeviantArts':
          key = socialMediaCounts[socialMedia] === 1 ? 'deviantarts' : `deviantarts${socialMediaCounts[socialMedia]}`;
          break;
        case 'Behance':
          key = socialMediaCounts[socialMedia] === 1 ? 'behance' : `behance${socialMediaCounts[socialMedia]}`;
          break;
        case 'GoodReads':
          key = socialMediaCounts[socialMedia] === 1 ? 'goodreads' : `goodreads${socialMediaCounts[socialMedia]}`;
          break;
        case 'Smule':
          key = socialMediaCounts[socialMedia] === 1 ? 'smule' : `smule${socialMediaCounts[socialMedia]}`;
          break;
        case 'Chess.com':
          key = socialMediaCounts[socialMedia] === 1 ? 'chess' : `chess${socialMediaCounts[socialMedia]}`;
          break;
        case 'BGG':
          key = socialMediaCounts[socialMedia] === 1 ? 'bgg' : `bgg${socialMediaCounts[socialMedia]}`;
          break;
        case 'Others':
          key = socialMediaCounts[socialMedia] === 1 ? 'others' : `others${socialMediaCounts[socialMedia]}`;
          break;
        default:
          break;
      }
      
      if(key){
      reqBody[key] = url;
    }
  }
    const { err, res } = await updateMyProfileDetail({social_media_urls:reqBody})

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

  useEffect(() => {
    const changesMade =
      JSON.stringify(mediaData) !== JSON.stringify(initialData)
    setIsChanged(changesMade)
    if (onStatusChange) {
      onStatusChange(changesMade)
    }
  }, [mediaData, initialData])
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
    <div className={styles['modal-wrapper']}>
      {/* Modal Header */}
      <header className={styles['header']}>
        <h4 className={styles['heading']}>{'Social Media'}</h4>
      </header>

      <hr className={styles['modal-hr']} />

      <section className={styles['body']}>
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
        {mediaData.map((item: any, idx: any) => {
          return (
            <div className={styles.inputContainer} key={idx}>
              <Select
                value={item.socialMedia}
                onChange={(e) => {
                  let selectedSocialMedia = e.target.value as SocialMediaOption
                  let defaultUrl = defaultSocialMediaURLs[selectedSocialMedia]

                  let updatedMediaData = [...mediaData]
                  updatedMediaData[idx] = {
                    ...item,
                    socialMedia: selectedSocialMedia,
                    url: defaultUrl,
                  }

                  setMediaData(updatedMediaData)
                }}
                className={styles.dropdown}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {options.map((option) => {
                  return (
                    <MenuItem key={option} value={option}>
                      <div className={styles['menu-item']}>
                        <Image
                          src={socialMediaIcons[option]}
                          alt={option}
                          width={24}
                          height={24}
                        />
                        <p
                          className={styles.iconText}
                          style={{ marginLeft: '8px' }}
                        >
                          {option}
                        </p>
                      </div>
                    </MenuItem>
                  )
                })}
              </Select>

              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder={`URL`}
                  value={item.url}
                  name="url"
                  autoComplete="url"
                  onChange={(e) => {
                    let val = e.target.value
                    onChange(idx, 'url', val)
                  }}
                />
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
          Save
        </button>
      </footer>
    </div>
  )
}

export default ListingSocialMediaEditModal
