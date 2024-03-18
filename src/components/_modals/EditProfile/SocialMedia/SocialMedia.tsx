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
  'TripAdvisor',
  'Ultimate Guitar',
  'Strava',
  'DeviantArts',
  'Behance',
  'GoodReads',
  'Smule',
  'Chess',
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
  | 'TripAdvisor'
  | 'Ultimate Guitar'
  | 'Strava'
  | 'DeviantArts'
  | 'Behance'
  | 'GoodReads'
  | 'Smule'
  | 'Chess'
  | 'BGG'
  | 'Others'

const socialMediaIcons: Record<SocialMediaOption, any> = {
  Facebook: FacebookIcon,
  Twitter: TwitterIcon,
  Instagram: InstagramIcon,
  Youtube: YouTubeIcon,
  SoundCloud: SoundCloudIcon,
  Pinterest: PinterestIcon,
  TripAdvisor: TripAdvisorIcon,
  'Ultimate Guitar': UltimateGuitarIcon,
  Strava: StravaIcon,
  DeviantArts: DeviantArtIcon,
  Behance: BehanceIcon,
  GoodReads: GoodreadsIcon,
  Smule: SmuleIcon,
  Chess: ChessIcon,
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
  TripAdvisor: 'https://tripadvisor.com/profile/',
  'Ultimate Guitar': 'https://ultimate-guitar.com/u/',
  Strava: 'https://strava.com/athletes/',
  DeviantArts: 'https://deviantart.com/',
  Behance: 'https://behance.net/',
  GoodReads: 'https://goodreads.com/',
  Smule: 'https://smule.com/',
  Chess: 'https://chess.com/member/',
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
    if (user.social_media_urls?.facebook_url) {
      arr.push({
        socialMedia: 'Facebook',
        url: user.social_media_urls?.facebook_url,
      })
    }
    if (user.social_media_urls?.instagram_url) {
      arr.push({
        socialMedia: 'Instagram',
        url: user.instagram_url,
      })
    }
    if (user.social_media_urls?.twitter_url) {
      arr.push({
        socialMedia: 'Twitter',
        url: user.social_media_urls?.twitter_url,
      })
    }
    if (user.social_media_urls?.youtube_url) {
      arr.push({
        socialMedia: 'Youtube',
        url: user.social_media_urls?.youtube_url,
      })
    }
    if (user.social_media_urls?.soundcloud_url) {
      arr.push({
        socialMedia: 'SoundCloud',
        url: user.social_media_urls?.soundcloud_url,
      })
    }
    if (user.social_media_urls?.pinterest_url) {
      arr.push({
        socialMedia: 'Pinterest',
        url: user.social_media_urls?.pinterest_url,
      })
    }
    if (user.social_media_urls?.tripadvisor_url) {
      arr.push({
        socialMedia: 'TripAdvisor',
        url: user.social_media_urls?.tripadvisor_url,
      })
    }
    if (user.social_media_urls?.ultimate_guitar_url) {
      arr.push({
        socialMedia: 'Ultimate Guitar',
        url: user.social_media_urls?.ultimate_guitar_url,
      })
    }
    if (user.social_media_urls?.strava_url) {
      arr.push({
        socialMedia: 'Strava',
        url: user.social_media_urls?.strava_url,
      })
    }
    if (user.social_media_urls?.deviantarts_url) {
      arr.push({
        socialMedia: 'DeviantArts',
        url: user.social_media_urls?.deviantarts_url,
      })
    }
    if (user.social_media_urls?.behance_url) {
      arr.push({
        socialMedia: 'Behance',
        url: user.social_media_urls?.behance_url,
      })
    }
    if (user.social_media_urls?.goodreads_url) {
      arr.push({
        socialMedia: 'GoodReads',
        url: user.social_media_urls?.goodreads_url,
      })
    }
    if (user.social_media_urls?.smule_url) {
      arr.push({
        socialMedia: 'Smule',
        url: user.social_media_urls?.smule_url,
      })
    }
    if (user.social_media_urls?.chess_url) {
      arr.push({
        socialMedia: 'Chess',
        url: user.social_media_urls?.chess_url,
      })
    }
    if (user.social_media_urls?.bgg_url) {
      arr.push({
        socialMedia: 'BGG',
        url: user.social_media_urls?.bgg_url,
      })
    }
    if (user.social_media_urls?.Others_url) {
      arr.push({
        socialMedia: 'Others',
        url: user.social_media_urls?.Others_url,
      })
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
    let reqBody = {
      social_media_urls: {
        facebook_url: getValue('Facebook'),
        instagram_url: getValue('Instagram'),
        twitter_url: getValue('Twitter'),
        youtube_url: getValue('Youtube'),
        soundcloud_url: getValue('SoundCloud'),
        pinterest_url: getValue('Pinterest'),
        tripadvisor_url: getValue('TripAdvisor'),
        ultimate_guitar_url: getValue('Ultimate Guitar'),
        strava_url: getValue('Strava'),
        deviantarts_url: getValue('DeviantArts'),
        behance_url: getValue('Behance'),
        goodreads_url: getValue('GoodReads'),
        smule_url: getValue('Smule'),
        chess_url: getValue('Chess'),
        bgg_url: getValue('BGG'),
        Others_url: getValue('Others'),
      },
    }
    // console.log('re', reqBody)
    const { err, res } = await updateMyProfileDetail(reqBody)

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

  console.log('i', initialData)
  console.log('m', mediaData)
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
