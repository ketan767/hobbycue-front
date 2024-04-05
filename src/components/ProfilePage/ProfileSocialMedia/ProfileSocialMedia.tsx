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
import UltimateGuitarIcon from '@/assets/svg/Ultimate-Guitar.svg'
import YouTubeIcon from '@/assets/svg/Youtube.svg'
import OthersIcon from '@/assets/svg/other.svg'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
}

const ProfileSocialMediaSide = ({ data, expandData }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
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
          {data?.social_media_urls && (
            <>
              {Object.entries(data.social_media_urls).map(([key, url]) => {
                let socialMediaName = ''
                let socialMediaIcon = null

                switch (true) {
                  case key.startsWith('facebook_url'):
                    socialMediaName = 'Facebook'
                    socialMediaIcon = FacebookIcon
                    break
                  case key.startsWith('twitter_url'):
                    socialMediaName = 'Twitter'
                    socialMediaIcon = TwitterIcon
                    break
                  case key.startsWith('instagram_url'):
                    socialMediaName = 'Instagram'
                    socialMediaIcon = InstagramIcon
                    break
                  case key.startsWith('behance_url'):
                    socialMediaName = 'Behance'
                    socialMediaIcon = BehanceIcon
                    break
                  case key.startsWith('bgg_url'):
                    socialMediaName = 'BoardGameGeek'
                    socialMediaIcon = BGGIcon
                    break
                  case key.startsWith('chess_url'):
                    socialMediaName = 'Chess'
                    socialMediaIcon = ChessIcon
                    break
                  case key.startsWith('deviantarts_url'):
                    socialMediaName = 'DeviantArt'
                    socialMediaIcon = DeviantArtIcon
                    break
                  case key.startsWith('goodreads_url'):
                    socialMediaName = 'Goodreads'
                    socialMediaIcon = GoodreadsIcon
                    break
                  case key.startsWith('pinterest_url'):
                    socialMediaName = 'Pinterest'
                    socialMediaIcon = PinterestIcon
                    break
                  case key.startsWith('smule_url'):
                    socialMediaName = 'Smule'
                    socialMediaIcon = SmuleIcon
                    break
                  case key.startsWith('soundcloud_url'):
                    socialMediaName = 'SoundCloud'
                    socialMediaIcon = SoundCloudIcon
                    break
                  case key.startsWith('strava_url'):
                    socialMediaName = 'Strava'
                    socialMediaIcon = StravaIcon
                    break
                  case key.startsWith('tripadvisor_url'):
                    socialMediaName = 'TripAdvisor'
                    socialMediaIcon = TripAdvisorIcon
                    break
                  case key.startsWith('ultimate_guitar_url'):
                    socialMediaName = 'Ultimate Guitar'
                    socialMediaIcon = UltimateGuitarIcon
                    break
                  case key.startsWith('youtube_url'):
                    socialMediaName = 'YouTube'
                    socialMediaIcon = YouTubeIcon
                    break
                  case key.startsWith('Others_url'):
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
