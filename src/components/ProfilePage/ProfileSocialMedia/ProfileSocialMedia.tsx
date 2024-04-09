import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Tooltip from '@/components/Tooltip/ToolTip'
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
import TelegramIcon from '@/assets/svg/Telegram.svg'
import MediumIcon from '@/assets/svg/MediumWeb.svg'
import UltimateGuitarIcon from '@/assets/svg/Ultimate-Guitar.svg'
import YouTubeIcon from '@/assets/svg/Youtube.svg'
import OthersIcon from '@/assets/svg/other.svg'
import Image from 'next/image'

type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
}

const ProfileSocialMediaSide = ({ data, expandData }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [displayData, setDisplayData] = useState(false)
  const dispatch = useDispatch()
  function renderSocialLink(url: any, iconSrc: any, altText: any) {
    if (!url) return null
    return (
      <Tooltip title={altText}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Image src={iconSrc} alt={altText} />
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

  useEffect(() => {
    if (expandData !== undefined) setDisplayData(expandData)
  }, [expandData])

  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'social-media-edit', closable: true }))
        }
        setDisplayData={setDisplayData}
        expandData={expandData}
      >
        <h4 className={styles['heading']}>Social Media</h4>
        <ul
          className={`${styles['contact-wrapper']} ${
            displayData && styles['display-mobile-flex']
          }`}
        >
          {(data?.social_media_urls && isLoggedIn) &&  (
            <>
              {Object.entries(data.social_media_urls).map(([key, url]) => {
                let socialMediaName = ''
                let socialMediaIcon = null

                switch (true) {
                  case key.startsWith('facebook'):
                    socialMediaName = 'Facebook'
                    socialMediaIcon = FacebookIcon
                    break
                  case key.startsWith('twitter'):
                    socialMediaName = 'Twitter'
                    socialMediaIcon = TwitterIcon
                    break
                  case key.startsWith('instagram'):
                    socialMediaName = 'Instagram'
                    socialMediaIcon = InstagramIcon
                    break
                  case key.startsWith('behance'):
                    socialMediaName = 'Behance'
                    socialMediaIcon = BehanceIcon
                    break
                  case key.startsWith('bgg'):
                    socialMediaName = 'BoardGameGeek'
                    socialMediaIcon = BGGIcon
                    break
                  case key.startsWith('chess'):
                    socialMediaName = 'Chess'
                    socialMediaIcon = ChessIcon
                    break
                  case key.startsWith('deviantarts'):
                    socialMediaName = 'DeviantArt'
                    socialMediaIcon = DeviantArtIcon
                    break
                  case key.startsWith('goodreads'):
                    socialMediaName = 'Goodreads'
                    socialMediaIcon = GoodreadsIcon
                    break
                  case key.startsWith('pinterest'):
                    socialMediaName = 'Pinterest'
                    socialMediaIcon = PinterestIcon
                    break
                  case key.startsWith('smule'):
                    socialMediaName = 'Smule'
                    socialMediaIcon = SmuleIcon
                    break
                  case key.startsWith('soundcloud'):
                    socialMediaName = 'SoundCloud'
                    socialMediaIcon = SoundCloudIcon
                    break
                  case key.startsWith('strava'):
                    socialMediaName = 'Strava'
                    socialMediaIcon = StravaIcon
                    break
                  case key.startsWith('tripadvisor'):
                    socialMediaName = 'TripAdvisor'
                    socialMediaIcon = TripAdvisorIcon
                    break
                  case key.startsWith('telegram'):
                    socialMediaName = 'Telegram'
                    socialMediaIcon = TelegramIcon
                    break
                  case key.startsWith('medium'):
                    socialMediaName = 'Medium'
                    socialMediaIcon = MediumIcon
                    break
                  case key.startsWith('ultimate_guitar'):
                    socialMediaName = 'Ultimate Guitar'
                    socialMediaIcon = UltimateGuitarIcon
                    break
                  case key.startsWith('youtube'):
                    socialMediaName = 'YouTube'
                    socialMediaIcon = YouTubeIcon
                    break
                  case key.startsWith('others'):
                    socialMediaName = extractDomainName(url)
                    socialMediaIcon = OthersIcon
                    break
                  // Add cases for other social media URLs as needed
                  default:
                    break
                }

                if (socialMediaIcon && socialMediaName) {
                  return renderSocialLink(url, socialMediaIcon, socialMediaName)
                }

                return null // If no matching social media key is found, return null
              })}
            </>
          )}
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileSocialMediaSide
