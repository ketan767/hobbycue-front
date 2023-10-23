import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { CircularProgress, FormControl, MenuItem, Select } from '@mui/material'
import DeleteIcon from '@/assets/svg/trash-icon.svg'
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
import FacebookIcon from '@/assets/svg/Facebook.svg'
import TwitterIcon from '@/assets/svg/Twitter.svg'
import InstagramIcon from '@/assets/svg/Instagram.svg'
import BehanceIcon from '@/assets/svg/Behance.svg'
import BGGIcon from '@/assets/svg/BGG.svg'
import ChessIcon from '@/assets/svg/Chess.com.svg'
import DeviantArtIcon from '@/assets/svg/DeviantArt.svg'
import GoodreadsIcon from '@/assets/svg/GoodReads.svg'
import PinterestIcon from '@/assets/svg/Pinterest.svg'
import SmuleIcon from '@/assets/svg/Smule.svg'
import SoundCloudIcon from '@/assets/svg/Soundcloud.svg'
import StravaIcon from '@/assets/svg/Strava.svg'
import TripAdvisorIcon from '@/assets/svg/Tripadvisor.svg'
import UltimateGuitarIcon from '@/assets/svg/Ultimate-Guitar.svg'
import YouTubeIcon from '@/assets/svg/Youtube.svg'
import OthersIcon from '@/assets/svg/other.svg'

type Props = {
  data?: ProfilePageData['pageData']
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
  'Ultimate Guitar': 'ultimate-guitar.com/u/',
  Strava: 'https://strava.com/athletes/',
  DeviantArts: 'https://deviantart.com/',
  Behance: 'https://behance.net/',
  GoodReads: 'https://goodreads.com/',
  Smule: 'https://smule.com/',
  Chess: 'https://chess.com/member/',
  BGG: 'https://boardgamegeek.com/user/',
  Others: 'https://',
}

const ListingSocialMediaEditModal = ({ data }: Props) => {
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  useEffect(() => {
    let arr = []
    const socialMediaUrls = listingModalData.social_media_urls
    if (socialMediaUrls && socialMediaUrls.facebook_url) {
      arr.push({
        socialMedia: 'Facebook',
        url: socialMediaUrls && socialMediaUrls.facebook_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.instagram_url) {
      arr.push({
        socialMedia: 'Instagram',
        url: socialMediaUrls && socialMediaUrls.instagram_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.twitter_url) {
      arr.push({
        socialMedia: 'Twitter',
        url: socialMediaUrls && socialMediaUrls.twitter_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.youtube_url) {
      arr.push({
        socialMedia: 'Youtube',
        url: socialMediaUrls && socialMediaUrls.youtube_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.soundcloud_url) {
      arr.push({
        socialMedia: 'SoundCloud',
        url: socialMediaUrls && socialMediaUrls.soundcloud_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.pinterest_url) {
      arr.push({
        socialMedia: 'Pinterest',
        url: socialMediaUrls && socialMediaUrls.pinterest_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.tripadvisor_url) {
      arr.push({
        socialMedia: 'TripAdvisor',
        url: socialMediaUrls && socialMediaUrls.tripadvisor_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.ultimate_guitar_url) {
      arr.push({
        socialMedia: 'Ultimate Guitar',
        url: socialMediaUrls && socialMediaUrls.ultimate_guitar_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.strava_url) {
      arr.push({
        socialMedia: 'Strava',
        url: socialMediaUrls && socialMediaUrls.strava_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.deviantarts_url) {
      arr.push({
        socialMedia: 'DeviantArts',
        url: socialMediaUrls && socialMediaUrls.deviantarts_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.behance_url) {
      arr.push({
        socialMedia: 'Behance',
        url: socialMediaUrls && socialMediaUrls.behance_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.goodreads_url) {
      arr.push({
        socialMedia: 'GoodReads',
        url: socialMediaUrls && socialMediaUrls.goodreads_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.smule_url) {
      arr.push({
        socialMedia: 'Smule',
        url: socialMediaUrls && socialMediaUrls.smule_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.chess_url) {
      arr.push({
        socialMedia: 'Chess',
        url: socialMediaUrls && socialMediaUrls.chess_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.bgg_url) {
      arr.push({
        socialMedia: 'BGG',
        url: socialMediaUrls && socialMediaUrls.bgg_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.Others_url) {
      arr.push({
        socialMedia: 'Others',
        url: socialMediaUrls && socialMediaUrls.Others_url,
      })
    }
    if (arr.length > 0) {
      setMediaData(arr)
    }
  }, [listingModalData])

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

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    let reqBody: any = {
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
    options.forEach((socialMedia) => {
      const key = socialMedia.toLowerCase() + '_url'
      reqBody[key] = getValue(socialMedia)
    })

    // console.log('re', reqBody)
    const { err, res } = await updateListing(listingModalData._id, reqBody)

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

  return (
    <div className={styles['modal-wrapper']}>
      {/* Modal Header */}
      <header className={styles['header']}>
        <h4 className={styles['heading']}>{'Social Media'}</h4>
      </header>

      <hr />

      <section className={styles['body']}>
        <div className={styles['body-header']} onClick={addSocialMedia}>
          <Image
            src={AddIcon}
            alt="add"
            width={12}
            height={12}
            className={styles.deleteIcon}
          />
          Add new
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
                        <p style={{ marginLeft: '8px' }}>{option}</p>
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
      </footer>
    </div>
  )
}

export default ListingSocialMediaEditModal
