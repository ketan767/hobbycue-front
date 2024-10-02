import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Tooltip from '@/components/Tooltip/ToolTip'
import Image from 'next/image'
import { updateSocialMediaOpenStates } from '@/redux/slices/site'

type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
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

const ProfileSocialMediaSide = ({ data, expandData }: Props) => {
  const { profileLayoutMode, socialMediaStates } = useSelector(
    (state: RootState) => state.site,
  )
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const [displayData, setDisplayData] = useState(false)
  const dispatch = useDispatch()
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

  useEffect(() => {
    if (
      socialMediaStates &&
      typeof socialMediaStates[data?._id] === 'boolean'
    ) {
      setDisplayData(socialMediaStates[data?._id])
    } else if (data._id) {
      dispatch(updateSocialMediaOpenStates({ [data._id]: displayData }))
    }
  }, [data._id, socialMediaStates])

  useEffect(() => {
    if (expandData !== undefined) setDisplayData(expandData)
  }, [expandData])

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

  return (
    <>
      {(profileLayoutMode === 'edit' || data?.social_media_urls) && (
        <PageContentBox
          showEditButton={profileLayoutMode === 'edit'}
          onEditBtnClick={() =>
            dispatch(openModal({ type: 'social-media-edit', closable: true }))
          }
          setDisplayData={(arg0: boolean) => {
            setDisplayData((prev) => {
              dispatch(updateSocialMediaOpenStates({ [data._id]: !prev }))
              return !prev
            })
          }}
          expandData={displayData}
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
                      socialMediaIcon = socialMediaIcons['Ultimate Guitar']
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
                })}
              </>
            )}
          </ul>
        </PageContentBox>
      )}
    </>
  )
}

export default ProfileSocialMediaSide
