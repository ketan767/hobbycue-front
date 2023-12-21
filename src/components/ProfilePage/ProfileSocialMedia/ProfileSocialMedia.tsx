import React, { useState } from 'react'
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
}

const ProfileSocialMediaSide = ({ data }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const [displayData, setDisplayData] = useState(false)
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

  const dispatch = useDispatch()
  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'social-media-edit', closable: true }))
        }
        setDisplayData={setDisplayData}
      >
        <h4 className={styles['heading']}>Social Media</h4>
        <ul
          className={`${styles['contact-wrapper']} ${
            displayData && styles['display-mobile-flex']
          }`}
        >
          {data?.social_media_urls && (
            <>
              {renderSocialLink(
                data.social_media_urls.facebook_url,
                FacebookIcon,
                'Facebook',
              )}
              {renderSocialLink(
                data.social_media_urls.twitter_url,
                TwitterIcon,
                'Twitter',
              )}
              {renderSocialLink(
                data.social_media_urls.instagram_url,
                InstagramIcon,
                'Instagram',
              )}
              {renderSocialLink(
                data.social_media_urls.behance_url,
                BehanceIcon,
                'Behance',
              )}
              {renderSocialLink(
                data.social_media_urls.bgg_url,
                BGGIcon,
                'BoardGameGeek',
              )}
              {renderSocialLink(
                data.social_media_urls.chess_url,
                ChessIcon,
                'Chess',
              )}
              {renderSocialLink(
                data.social_media_urls.deviantarts_url,
                DeviantArtIcon,
                'DeviantArt',
              )}
              {renderSocialLink(
                data.social_media_urls.goodreads_url,
                GoodreadsIcon,
                'Goodreads',
              )}
              {renderSocialLink(
                data.social_media_urls.pinterest_url,
                PinterestIcon,
                'Pinterest',
              )}
              {renderSocialLink(
                data.social_media_urls.smule_url,
                SmuleIcon,
                'Smule',
              )}
              {renderSocialLink(
                data.social_media_urls.soundcloud_url,
                SoundCloudIcon,
                'SoundCloud',
              )}
              {renderSocialLink(
                data.social_media_urls.strava_url,
                StravaIcon,
                'Strava',
              )}
              {renderSocialLink(
                data.social_media_urls.tripadvisor_url,
                TripAdvisorIcon,
                'TripAdvisor',
              )}
              {renderSocialLink(
                data.social_media_urls.ultimate_guitar_url,
                UltimateGuitarIcon,
                'Ultimate Guitar',
              )}
              {renderSocialLink(
                data.social_media_urls.youtube_url,
                YouTubeIcon,
                'YouTube',
              )}
              {renderSocialLink(
                data.social_media_urls.Others_url,
                OthersIcon,
                extractDomainName(data.social_media_urls.Others_url),
              )}
            </>
          )}
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileSocialMediaSide
